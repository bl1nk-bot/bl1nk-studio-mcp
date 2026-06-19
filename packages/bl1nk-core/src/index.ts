import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { analyzeStory } from "./analyzer.js";
import { validateStoryStructure } from "./validators.js";
import { extractCharacters } from "./skills/character-analysis/index.js";
import { extractConflicts } from "./skills/conflict-detection/index.js";
import { buildRelationshipGraph } from "./skills/relationship-graph/index.js";
import { toMermaid } from "./exporters/mermaid.js";
import { toCanvasJSON } from "./exporters/canvas.js";
import { toDashboard, toMcpUiDashboard } from "./exporters/dashboard.js";
import { toMarkdown } from "./exporters/markdown.js";
import { searchStoryReferences, formatSearchResults } from "./exa-search.js";
import {
	formatToolError,
	ExaError,
	retryWithBackoff,
	handleRateLimitError,
} from "./utils/error-handler.js";
import {
	BL1NK_VISUAL_TOOLS,
	GRANULAR_TOOLS,
	executeStoryTool,
	executeGranularTool,
} from "./tools/index.js";
import { Schemas } from "./schemas.js";

// ============================================================================
// Schema Definitions (Consolidated with .describe() for AI optimization)
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
});

const StoryGraphSchema = z.object({
	metadata: z.object({
		title: z.string(),
		author: z.string().optional(),
		genre: z.string(),
		tone: z.string(),
	}),
	characters: z.array(CharacterSchema),
	conflicts: z.array(ConflictSchema),
	events: z.array(EventNodeSchema),
	world: z.object({
		locations: z.array(z.string()),
		lorePoints: z.array(z.string()),
	}),
});

// ============================================================================
// MCP Server Initialization
// ============================================================================

const server = new McpServer({
	name: "bl1nk-visual-mcp",
	version: "3.0.0",
});

const ToolSchemas = {
	analyze_story: z.object({
		text: z.string().describe("The raw story text or chapter to analyze"),
		focus: z
			.enum(["characters", "conflicts", "plot", "world", "all"])
			.default("all")
			.describe("Specific narrative aspect to prioritize during analysis"),
	}),
	export_mermaid: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object received from analyze_story"),
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
// Tool Registration with Per-Tool Error Handling (Fixed 4 Critical Bugs)
// ============================================================================

for (const tool of GRANULAR_TOOLS) {
	server.tool(
		tool.name,
		ToolSchemas[tool.name as keyof typeof ToolSchemas] as any,
		async (args) => {
			try {
				// Fix: Handle character name deduplication and Act Distribution act proportion (25-50-25)
				// The logic is moved inside the tool executors to ensure stability
				const result = await executeGranularTool(tool.name, args);
				return {
					content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
				};
			} catch (error) {
				return formatToolError(error);
			}
		},
	);
}

// Start the server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("bl1nk-visual-mcp server running on stdio");
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});

export { CharacterSchema, ConflictSchema, EventNodeSchema, StoryGraphSchema };
