import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBl1nkTools } from "./server.js";

export interface McpRequestConfig {
	exaApiKey?: string;
	enabledTools?: string[];
	debug: boolean;
	userProvidedApiKey: boolean;
}

export function initializeMcpServer(
	server: McpServer,
	config: McpRequestConfig,
): void {
	if (config.exaApiKey) {
		process.env.EXA_API_KEY = config.exaApiKey;
	}

	registerBl1nkTools(server, { enabledTools: config.enabledTools });
}

