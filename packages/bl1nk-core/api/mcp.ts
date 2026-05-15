/**
 * @license
 * Copyright 2026 bl1nk-visual-mcp
 * SPDX-License-Identifier: Apache-2.0
 */

process.env.AGNOST_LOG_LEVEL = "error";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createMcpHandler } from "mcp-handler";
import { initializeMcpServer } from "../src/mcp-handler.js";
import { isJwtToken, verifyOAuthToken } from "../src/utils/auth.js";

let qpsLimiter: Ratelimit | null = null;
let dailyLimiter: Ratelimit | null = null;
let rateLimitersInitialized = false;
let redisClient: Redis | null = null;

function initializeRateLimiters(): boolean {
	if (rateLimitersInitialized) {
		return qpsLimiter !== null;
	}

	rateLimitersInitialized = true;

	const redisUrl =
		process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
	const redisToken =
		process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

	if (!redisUrl || !redisToken) {
		console.log(
			"[EXA-MCP] Rate limiting disabled: KV_REST_API_URL/UPSTASH_REDIS_REST_URL or KV_REST_API_TOKEN/UPSTASH_REDIS_REST_TOKEN not configured",
		);
		return false;
	}

	try {
		redisClient = new Redis({
			url: redisUrl,
			token: redisToken,
		});

		const qpsLimit = Number.parseInt(process.env.RATE_LIMIT_QPS || "2", 10);
		const dailyLimit = Number.parseInt(
			process.env.RATE_LIMIT_DAILY || "50",
			10,
		);

		qpsLimiter = new Ratelimit({
			redis: redisClient,
			limiter: Ratelimit.slidingWindow(qpsLimit, "1 s"),
			prefix: "exa-mcp:qps",
		});

		dailyLimiter = new Ratelimit({
			redis: redisClient,
			limiter: Ratelimit.fixedWindow(dailyLimit, "1 d"),
			prefix: "exa-mcp:daily",
		});

		console.log(
			`[EXA-MCP] Rate limiting enabled: ${qpsLimit} QPS, ${dailyLimit}/day`,
		);
		return true;
	} catch (error) {
		console.error("[EXA-MCP] Failed to initialize rate limiters:", error);
		return false;
	}
}

function getClientIp(request: Request): string {
	const cfConnectingIp = request.headers.get("cf-connecting-ip");
	const xRealIp = request.headers.get("x-real-ip");
	const xForwardedFor = request.headers.get("x-forwarded-for");
	const xForwardedForFirst = xForwardedFor?.split(",")[0]?.trim();

	return cfConnectingIp ?? xRealIp ?? xForwardedForFirst ?? "unknown";
}

const RATE_LIMIT_ERROR_MESSAGE = `You've hit Exa's free MCP rate limit. To continue using without limits, create your own Exa API key.

Fix: Create API key at https://dashboard.exa.ai/api-keys , then either:
- Set the header: Authorization: Bearer YOUR_EXA_API_KEY
- Or use the URL: https://mcp.exa.ai/mcp?exaApiKey=YOUR_EXA_API_KEY`;

function createRateLimitResponse(
	retryAfterSeconds: number,
	reset: number,
): Response {
	return new Response(
		JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: RATE_LIMIT_ERROR_MESSAGE,
			},
			id: null,
		}),
		{
			status: 429,
			headers: {
				"Content-Type": "application/json",
				"Retry-After": String(retryAfterSeconds),
				"X-RateLimit-Limit": "0",
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset": String(reset),
			},
		},
	);
}

function isRateLimitedMethod(body: string): boolean {
	try {
		const parsed = JSON.parse(body);
		return parsed.method === "tools/call";
	} catch {
		return false;
	}
}

const BYPASS_BUCKET_TTL_SECONDS = 7 * 24 * 60 * 60;

async function saveBypassRequestInfo(
	ip: string,
	userAgent: string,
	debug: boolean,
): Promise<void> {
	initializeRateLimiters();

	if (!redisClient) {
		if (debug) {
			console.log("[EXA-MCP] Cannot save bypass info: Redis not configured");
		}
		return;
	}

	try {
		const timestamp = Date.now();
		const date = new Date(timestamp);
		const minutes = date.getUTCMinutes();
		const bucket = Math.floor(minutes / 15) * 15;
		const bucketStr = `${date.toISOString().slice(0, 13)}:${String(bucket).padStart(2, "0")}`;
		const bucketKey = `exa-mcp:bypass:${bucketStr}`;
		const entry = JSON.stringify({ ip, userAgent, timestamp });

		await Promise.all([
			redisClient.zadd(bucketKey, { score: timestamp, member: entry }),
			redisClient.expire(bucketKey, BYPASS_BUCKET_TTL_SECONDS),
		]);

		if (debug) {
			console.log(`[EXA-MCP] Saved bypass request info for IP: ${ip}`);
		}
	} catch (error) {
		console.error("[EXA-MCP] Failed to save bypass request info:", error);
	}
}

async function checkRateLimits(
	ip: string,
	debug: boolean,
): Promise<Response | null> {
	if (!qpsLimiter || !dailyLimiter) {
		return null;
	}

	try {
		const qpsResult = await qpsLimiter.limit(ip);
		if (!qpsResult.success) {
			if (debug) {
				console.log(`[EXA-MCP] QPS rate limit exceeded for IP: ${ip}`);
			}
			const retryAfter = Math.ceil((qpsResult.reset - Date.now()) / 1000);
			return createRateLimitResponse(retryAfter, qpsResult.reset);
		}

		const dailyResult = await dailyLimiter.limit(ip);
		if (!dailyResult.success) {
			if (debug) {
				console.log(`[EXA-MCP] Daily rate limit exceeded for IP: ${ip}`);
			}
			const retryAfter = Math.ceil((dailyResult.reset - Date.now()) / 1000);
			return createRateLimitResponse(retryAfter, dailyResult.reset);
		}

		return null;
	} catch (error) {
		console.error("[EXA-MCP] Rate limit check failed:", error);
		return null;
	}
}

function getBearerToken(request: Request): string | undefined {
	const authHeader = request.headers.get("authorization");
	if (authHeader) {
		const match = authHeader.match(/^Bearer\s+(.+)$/i);
		if (match?.[1]) {
			return match[1];
		}
	}
	return undefined;
}

interface RequestConfig {
	exaApiKey?: string;
	enabledTools?: string[];
	debug: boolean;
	userProvidedApiKey: boolean;
	authMethod: "oauth" | "api_key" | "free_tier";
}

async function getConfigFromRequest(request: Request): Promise<RequestConfig> {
	let exaApiKey = process.env.EXA_API_KEY;
	let enabledTools: string[] | undefined;
	let debug = process.env.DEBUG === "true";
	let userProvidedApiKey = false;
	let authMethod: "oauth" | "api_key" | "free_tier" = "free_tier";

	const xApiKey = request.headers.get("x-api-key");
	if (xApiKey) {
		exaApiKey = xApiKey;
		userProvidedApiKey = true;
		authMethod = "api_key";
	}

	if (!xApiKey) {
		const bearerToken = getBearerToken(request);
		if (bearerToken) {
			if (isJwtToken(bearerToken)) {
				const claims = await verifyOAuthToken(bearerToken);
				if (claims) {
					exaApiKey = claims["exa:api_key_id"] as string | undefined;
					userProvidedApiKey = true;
					authMethod = "oauth";
				} else {
					console.error("[EXA-MCP] Invalid OAuth JWT token");
				}
			} else {
				exaApiKey = bearerToken;
				userProvidedApiKey = true;
				authMethod = "api_key";
			}
		}
	}

	try {
		const parsedUrl = new URL(request.url);
		const params = parsedUrl.searchParams;

		if (!xApiKey && !getBearerToken(request) && params.has("exaApiKey")) {
			const keyFromUrl = params.get("exaApiKey");
			if (keyFromUrl) {
				exaApiKey = keyFromUrl;
				userProvidedApiKey = true;
				authMethod = "api_key";
			}
		}

		if (params.has("tools")) {
			const toolsParam = params.get("tools");
			if (toolsParam) {
				enabledTools = toolsParam
					.split(",")
					.map((t) => t.trim())
					.filter((t) => t.length > 0);
			}
		}

		if (params.has("debug")) {
			debug = params.get("debug") === "true";
		}
	} catch (error) {
		if (debug) {
			console.error("Failed to parse request URL:", error);
		}
	}

	if (!enabledTools && process.env.ENABLED_TOOLS) {
		enabledTools = process.env.ENABLED_TOOLS.split(",")
			.map((t) => t.trim())
			.filter((t) => t.length > 0);
	}

	return { exaApiKey, enabledTools, debug, userProvidedApiKey, authMethod };
}

function createHandler(config: {
	exaApiKey?: string;
	enabledTools?: string[];
	debug: boolean;
	userProvidedApiKey: boolean;
}) {
	return createMcpHandler(
		(server: McpServer) => {
			initializeMcpServer(server, config);
		},
		{ name: "bl1nk-visual-mcp", version: "3.0.0" },
		{ basePath: "/api" },
	);
}

function hasAuth(request: Request): boolean {
	if (request.headers.get("x-api-key")) return true;
	if (getBearerToken(request)) return true;
	try {
		const url = new URL(request.url);
		if (url.searchParams.get("exaApiKey")) return true;
	} catch (error) {
		console.error("[EXA-MCP] hasAuth URL parse error:", error);
	}
	return false;
}

function create401Response(): Response {
	return new Response(
		JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: "Authentication required. Use OAuth or provide an API key.",
			},
			id: null,
		}),
		{
			status: 401,
			headers: {
				"WWW-Authenticate":
					'Bearer resource_metadata="https://mcp.exa.ai/.well-known/oauth-protected-resource"',
				"Content-Type": "application/json",
			},
		},
	);
}

async function handleRequest(
	request: Request,
	options?: { forceOAuth?: boolean },
): Promise<Response> {
	const debug = process.env.DEBUG === "true";

	const userAgent = request.headers.get("user-agent") || "";
	const bypassPrefix = process.env.RATE_LIMIT_BYPASS;
	const bypassApiKey = process.env.EXA_API_KEY_BYPASS;
	const bypassRateLimit =
		bypassPrefix && bypassApiKey && userAgent.startsWith(bypassPrefix);

	const oauthUserAgents =
		process.env.OAUTH_USER_AGENTS?.split(",")
			.map((s) => s.trim())
			.filter(Boolean) || [];
	const userAgentMatchesOAuth = oauthUserAgents.some((ua) =>
		userAgent.includes(ua),
	);

	const requireOAuth = options?.forceOAuth || userAgentMatchesOAuth;
	if (!bypassRateLimit && requireOAuth && !hasAuth(request)) {
		return create401Response();
	}

	const config = await getConfigFromRequest(request);

	if (config.debug) {
		console.log(`[EXA-MCP] Request URL: ${request.url}`);
		console.log(
			`[EXA-MCP] Enabled tools: ${config.enabledTools?.join(", ") || "default"}`,
		);
		console.log(`[EXA-MCP] Auth method: ${config.authMethod}`);
		console.log(
			`[EXA-MCP] API key provided: ${config.userProvidedApiKey ? "yes" : "no (using env var)"}`,
		);
	}

	if (bypassRateLimit) {
		config.exaApiKey = bypassApiKey;
		const clientIp = getClientIp(request);
		saveBypassRequestInfo(clientIp, userAgent, config.debug);
	}

	if (!config.userProvidedApiKey && request.method === "POST") {
		const clonedRequest = request.clone();
		const body = await clonedRequest.text();

		if (isRateLimitedMethod(body)) {
			initializeRateLimiters();

			const clientIp = getClientIp(request);

			if (config.debug) {
				console.log(`[EXA-MCP] Client IP: ${clientIp}, method: tools/call`);
			}

			const rateLimitResponse = await checkRateLimits(clientIp, config.debug);
			if (rateLimitResponse) {
				return rateLimitResponse;
			}
		} else if (config.debug) {
			console.log("[EXA-MCP] Skipping rate limit for non-tool-call method");
		}
	}

	const handler = createHandler(config);

	const url = new URL(request.url);
	let normalizedRequest = request;
	if (
		url.pathname === "/mcp" ||
		url.pathname === "/" ||
		url.pathname === "/mcp/oauth" ||
		url.pathname === "/mcp-oauth" ||
		url.pathname === "/api/mcp-oauth"
	) {
		url.pathname = "/api/mcp";
		normalizedRequest = new Request(url.toString(), request);
	}

	return handler(normalizedRequest);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as DELETE };

export { handleRequest };
