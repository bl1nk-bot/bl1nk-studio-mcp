import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ZodRawShape } from "zod";
import { Schemas } from "./schemas.js";
import {
	BL1NK_VISUAL_TOOLS,
	GRANULAR_TOOLS,
	executeGranularTool,
	executeStoryTool,
} from "./tools/index.js";
import { searchEntriesTool } from "./tools/search-entries.js";

export function registerBl1nkTools(
	server: McpServer,
	options?: { enabledTools?: string[]; exaApiKey?: string },
): void {
	const enabled = options?.enabledTools !== undefined
		? new Set(options.enabledTools)
		: undefined;
	const apiKey = options?.exaApiKey;

	try {
		for (const tool of GRANULAR_TOOLS) {
			if (enabled && !enabled.has(tool.name)) continue;

			const schema = Schemas[tool.name as keyof typeof Schemas];
			if (!schema) continue;

			server.tool(
				tool.name,
				tool.description,
				schema.shape,
				async (args) =>
					executeGranularTool(tool.name, args as Record<string, unknown>, apiKey),
			);
		}

		for (const tool of BL1NK_VISUAL_TOOLS) {
			if (enabled && !enabled.has(tool.name)) continue;

			server.tool(
				tool.name,
				tool.description,
				{},
				async (args) =>
					executeStoryTool(tool.name, args as Record<string, unknown>, apiKey),
			);
		}

		if (!enabled || enabled.has(searchEntriesTool.name)) {
			server.tool(
				searchEntriesTool.name,
				searchEntriesTool.description,
				searchEntriesTool.inputSchema.shape,
				async (args) =>
					searchEntriesTool.execute(
						args as any,
					),
			);
		}
	} catch (error: unknown) {
		if (error instanceof Error && error.message.includes("already registered")) {
			return;
		}
		throw error;
	}
}

export function createBl1nkServer(options?: {
	enabledTools?: string[];
}): McpServer {
	const server = new McpServer({
		name: "bl1nk-visual-mcp",
		version: "3.0.0",
	});

	registerBl1nkTools(server, options);
	return server;
}

