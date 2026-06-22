import type { StoryGraph, Character, EventNode } from "../types.js";

/**
 * Builds an initial flat StoryGraph structure.
 */
export function buildInitialGraph(title: string = "New Story"): StoryGraph {
	const now = new Date().toISOString();

	return {
		meta: {
			title,
			createdAt: now,
			updatedAt: now,
			version: "1.0.0",
		},
		characters: [],
		events: [],
		conflicts: [],
		relationships: [],
		tags: [],
	};
}

/**
 * Analyzes story text and builds a structured StoryGraph.
 */
export async function analyzeStory(text: string): Promise<StoryGraph> {
	const graph = buildInitialGraph();

	// Mock extraction
	const extracted = {
		characters: ["Ignis", "Belz"],
		events: [{ name: "The Beginning", index: 0 }],
	};

	graph.characters = extracted.characters.map((name, i) => ({
		id: `char_${i}`,
		name,
		role: "supporting",
		traits: [],
		arc: {
			start: "Normal life",
			midpoint: "Change",
			end: "New state",
			transformation: "Growth",
			emotionalJourney: [],
		},
		motivations: [],
		fears: [],
		secretsOrLies: [],
		powers: [],
		actAppearances: [],
		tags: [],
	}));

	graph.events = extracted.events.map((event) => ({
		id: `event_${event.index}`,
		label: event.name,
		description: "Auto-generated description",
		act: 1,
		importance: "rising",
		sequenceInAct: event.index + 1,
		characterIds: [],
		conflictIds: [],
		emotionalTone: "neutral",
	}));

	return graph;
}

export const buildInitialStoryGraph = buildInitialGraph;
