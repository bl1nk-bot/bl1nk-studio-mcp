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

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ZodRawShape } from "zod";
import { z } from "zod";
import { buildInitialGraph } from "./analyzer.js";
import { formatSearchResults, searchStoryReferences } from "./exa-search.js";
import { toCanvasJSON } from "./exporters/canvas.js";
import { toDashboard, toMcpUiDashboard } from "./exporters/dashboard.js";
import { toMarkdown } from "./exporters/markdown.js";
import { toMermaid } from "./exporters/mermaid.js";
import {
	BL1NK_VISUAL_TOOLS,
	GRANULAR_TOOLS,
	executeGranularTool,
	executeStoryTool,
} from "./tools/index.js";
import { searchEntriesTool } from "./tools/search-entries.js";
import { formatToolError } from "./utils/error-handler.js";
import { validateGraph } from "./validators.js";

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

// ============================================================================
// Schema Definitions
// ============================================================================

const CharacterSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: z.string(),
	traits: z.array(z.string()),
	arc: z.object({
		start: z.string(),
		midpoint: z.string(),
		end: z.string(),
		transformation: z.string(),
		emotionalJourney: z.array(z.string()),
	}),
	relationships: z.array(z.string()),
	motivations: z.array(z.string()),
	fears: z.array(z.string()),
	secretsOrLies: z.array(z.string()),
	actAppearances: z.array(z.number()),
});

const ConflictSchema = z.object({
	id: z.string(),
	type: z.string(),
	description: z.string(),
	relatedCharacters: z.array(z.string()),
	rootCause: z.string(),
	escalations: z.array(
		z.object({
			stage: z.number(),
			description: z.string(),
			intensity: z.number(),
			affectedCharacters: z.array(z.string()),
		}),
	),
	resolution: z.string(),
	actIntroduced: z.number(),
});

const EventNodeSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string(),
	act: z.number(),
	importance: z.string(),
	sequenceInAct: z.number(),
	location: z.string().optional(),
	characters: z.array(z.string()),
	conflicts: z.array(z.string()),
	emotionalTone: z.string(),
	consequence: z.string(),
});

const RelationshipSchema = z.object({
	from: z.string(),
	to: z.string(),
	type: z.string(),
	strength: z.number(),
	description: z.string().optional(),
});

const StoryGraphSchema = z.object({
	meta: z.object({
		title: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		version: z.string(),
		genre: z.string().optional(),
	}),
	characters: z.array(CharacterSchema),
	conflicts: z.array(ConflictSchema),
	events: z.array(EventNodeSchema),
	relationships: z.array(RelationshipSchema),
	tags: z.array(z.string()),
});

// ============================================================================
// Tool Schemas (11 granular tools - source of truth)
// ============================================================================

export const Schemas = {
	analyze_story: z.object({
		text: z.string().describe("Story text to analyze"),
		depth: z
			.enum(["basic", "detailed", "deep"])
			.default("detailed")
			.describe("Analysis depth: basic (fast), detailed (standard), or deep (full)"),
		includeMetadata: z
			.boolean()
			.default(true)
			.describe("Include metadata such as genre, createdAt, and version in the output"),
	}),
	export_mermaid: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z
			.boolean()
			.default(true)
			.describe("Include title and metadata header in the generated Mermaid diagram"),
		style: z
			.enum(["default", "dark", "minimal"])
			.default("default")
			.describe("Visual style for the Mermaid diagram"),
	}),
	export_canvas: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z
			.boolean()
			.default(true)
			.describe("Include metadata properties in the Canvas JSON output"),
		autoLayout: z
			.boolean()
			.default(true)
			.describe("Automatically compute node positions; set false to preserve manual layout"),
	}),
	export_dashboard: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z
			.boolean()
			.default(true)
			.describe("Include character and event counts, density metrics, and timing data"),
		includeRecommendations: z
			.boolean()
			.default(true)
			.describe("Include automated story improvement suggestions in the dashboard"),
	}),
	export_markdown: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z
			.boolean()
			.default(true)
			.describe("Include YAML frontmatter metadata block in Markdown output"),
		includeAnalysis: z
			.boolean()
			.default(true)
			.describe("Include narrative structure analysis section in Markdown output"),
	}),
	validate_story_structure: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		strict: z
			.boolean()
			.default(false)
			.describe("Treat all structural rules as errors (fail closed) instead of warnings"),
		includeRecommendations: z
			.boolean()
			.default(true)
			.describe("Include actionable improvement suggestions with each validation finding"),
	}),
	extract_characters: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		detailed: z
			.boolean()
			.default(true)
			.describe("Include full character arc, motivations, and relationship data in the output"),
	}),
	extract_conflicts: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeEscalation: z
			.boolean()
			.default(true)
			.describe("Include conflict escalation stages and intensity breakdown in the output"),
	}),
	build_relationship_graph: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z
			.boolean()
			.default(true)
			.describe("Include node/edge counts, density metrics, and hub/isolate analysis"),
	}),
	export_mcp_ui_dashboard: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z
			.boolean()
			.default(true)
			.describe("Include character and event counts, density metrics, and timing data"),
		includeRecommendations: z
			.boolean()
			.default(true)
			.describe("Include automated story improvement suggestions in the MCP-UI dashboard"),
	}),
	exa_search_story: z.object({
		query: z.string().describe("Search query for story research"),
		category: z
			.enum([
				"writing_techniques",
				"character_archetypes",
				"story_tropes",
				"narrative_structure",
				"genre_conventions",
				"conflict_types",
				"general",
			])
			.default("general")
			.describe("Category for better results"),
		numResults: z
			.number()
			.int()
			.min(1)
			.max(10)
			.default(5)
			.describe("Number of results (1-10)"),
	}),
};

// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new McpServer({
	name: "bl1nk-visual-mcp",
	version: "3.0.0",
});

let toolsRegistered = false;

function isAlreadyRegisteredError(error: unknown): boolean {
	return (
		error instanceof Error && /already\s+registered/i.test(error.message)
	);
}

function registerTools() {
	if (toolsRegistered) return;

	// Register 11 granular tools (source of truth) — per-tool try/catch so one
	// failure cannot short-circuit the remaining registrations.
	for (const tool of GRANULAR_TOOLS) {
		try {
			const schema = Schemas[tool.name as keyof typeof Schemas];
			if (!schema) {
				console.error(`Warning: No schema found for tool "${tool.name}"`);
				continue;
			}
			server.tool(
				tool.name,
				tool.description,
				schema.shape as ZodRawShape,
				async (args: Record<string, unknown>) =>
					executeGranularTool(tool.name, args),
			);
		} catch (error) {
			if (isAlreadyRegisteredError(error)) {
				// Tool already registered from a previous run — skip without failing
				continue;
			}
			throw error;
		}
	}

	// Register 4 legacy tools (backward compatibility) — same per-tool isolation
	for (const tool of BL1NK_VISUAL_TOOLS) {
		try {
			server.tool(
				tool.name,
				tool.description,
				{} as ZodRawShape,
				async (args: Record<string, unknown>) =>
					executeStoryTool(tool.name, args),
			);
		} catch (error) {
			if (isAlreadyRegisteredError(error)) {
				continue;
			}
			throw error;
		}
	}

	// Register search_entries tool (has its own schema in the tool definition)
	try {
		server.tool(
			searchEntriesTool.name,
			searchEntriesTool.description,
			searchEntriesTool.inputSchema.shape as ZodRawShape,
			async (args: Record<string, unknown>) =>
				searchEntriesTool.execute(
					args as Parameters<typeof searchEntriesTool.execute>[0],
				),
		);
	} catch (error) {
		if (isAlreadyRegisteredError(error)) {
			// Already registered — safe to ignore
		} else {
			throw error;
		}
	}

	toolsRegistered = true;
}

// Initial registration
registerTools();

const REGISTERED_TOOL_NAMES = [
	...GRANULAR_TOOLS.map((t) => t.name),
	...BL1NK_VISUAL_TOOLS.map((t) => t.name),
	searchEntriesTool.name,
];

async function startServer() {
	try {
		const transport = new StdioServerTransport();
		await server.connect(transport);
		// count search_entries (1) next to GRANULAR + LEGACY so future tool additions are visible
		const SEARCH_ENTRIES_TOOL_COUNT = 1;
		const totalTools =
			GRANULAR_TOOLS.length +
			BL1NK_VISUAL_TOOLS.length +
			SEARCH_ENTRIES_TOOL_COUNT;
		console.error(`bl1nk-visual-mcp Server started with ${totalTools} tools`);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Failed to start bl1nk-visual-mcp: ${message}`);
		process.exit(1);
	}
}

if (process.env.NODE_ENV !== "test") {
	startServer();
}

export default server;
