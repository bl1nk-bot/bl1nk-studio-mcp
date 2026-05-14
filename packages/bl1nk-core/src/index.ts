/**
 * @license
 * Copyright 2026 bl1nk-visual-mcp
 * SPDX-License-Identifier: Apache-2.0
 *
 * Visual Story Planner MCP Server
 *
 * Main entry point for running the MCP server via stdio.
 * For Vercel deployment, use api/mcp.ts instead.
 * For KiloCode plugin, use src/plugin.ts instead.
 */

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createBl1nkServer } from "./server.js";
import { BL1NK_VISUAL_TOOLS, GRANULAR_TOOLS } from "./tools/index.js";

// Re-export types and utilities for external use
export type {
	StoryGraph,
	Character,
	Conflict,
	EventNode,
	Relationship,
} from "./types.js";
export { buildInitialGraph } from "./analyzer.js";
export { validateGraph } from "./validators.js";
export { toMermaid } from "./exporters/mermaid.js";
export { toCanvasJSON } from "./exporters/canvas.js";
export { toDashboard, toMcpUiDashboard } from "./exporters/dashboard.js";
export { toMarkdown } from "./exporters/markdown.js";
export { searchStoryReferences, formatSearchResults } from "./exa-search.js";
export {
	formatToolError,
	ExaError,
	retryWithBackoff,
	handleRateLimitError,
} from "./utils/error-handler.js";
export {
	BL1NK_VISUAL_TOOLS,
	GRANULAR_TOOLS,
	executeStoryTool,
	executeGranularTool,
} from "./tools/index.js";
export { Schemas } from "./schemas.js";

const server = createBl1nkServer();

async function startServer() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		const totalTools = GRANULAR_TOOLS.length + BL1NK_VISUAL_TOOLS.length + 1;
		console.error(`bl1nk-visual-mcp Server started with ${totalTools} tools`);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Failed to start bl1nk-visual-mcp: ${message}`);
		process.exit(1);
	}
}

function isMainModule(): boolean {
	const current = resolve(fileURLToPath(import.meta.url));
	const entry = process.argv[1] ? resolve(process.argv[1]) : "";
	return Boolean(entry) && entry === current;
}

if (process.env.NODE_ENV !== "test" && isMainModule()) {
	startServer();
}

export default server;
