import { z } from "zod";

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

export const Schemas = {
	analyze_story: z.object({
		text: z.string().describe("Story text to analyze"),
		depth: z.enum(["basic", "detailed", "deep"]).default("detailed"),
		includeMetadata: z.boolean().default(true),
	}),
	export_mermaid: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z.boolean().default(true),
		style: z.enum(["default", "dark", "minimal"]).default("default"),
	}),
	export_canvas: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z.boolean().default(true),
		autoLayout: z.boolean().default(true),
	}),
	export_dashboard: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z.boolean().default(true),
		includeRecommendations: z.boolean().default(true),
	}),
	export_markdown: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeMetadata: z.boolean().default(true),
		includeAnalysis: z.boolean().default(true),
	}),
	validate_story_structure: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		strict: z.boolean().default(false),
		includeRecommendations: z.boolean().default(true),
	}),
	extract_characters: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		detailed: z.boolean().default(true),
	}),
	extract_conflicts: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeEscalation: z.boolean().default(true),
	}),
	build_relationship_graph: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z.boolean().default(true),
	}),
	export_mcp_ui_dashboard: z.object({
		graph: StoryGraphSchema.describe("StoryGraph object"),
		includeStats: z.boolean().default(true),
		includeRecommendations: z.boolean().default(true),
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

