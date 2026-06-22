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
	registerBl1nkTools(server, {
		enabledTools: config.enabledTools,
		exaApiKey: config.exaApiKey,
	});
}
