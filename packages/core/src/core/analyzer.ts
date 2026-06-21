import type { StoryGraph, Character, EventNode } from "../types.js";

/**
 * Builds an initial MasterStoryGraph structure.
 */
export function buildInitialGraph(title: string = "New Story"): StoryGraph {
    const projectId = crypto.randomUUID();
    const now = new Date().toISOString();
    
	return {
		project: {
			id: projectId,
			name: title,
			status: "active",
			createdAt: now,
			updatedAt: now
		},
		branches: {
			narrative: {
				theme: { coreTheme: "Universal Truth", motifs: [], symbolism: [] },
				style: { tone: "Neutral", voice: "Omniscient", complexity: "standard" },
				outline: { logline: "", premise: "", majorBeats: [] }
			},
			entities: {
				characters: [],
				relationships: []
			},
			timeline: {
				events: [],
				plotPoints: []
			},
			logic: {
				causality: [],
				plots: [],
				conflicts: []
			}
		}
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

	// Fill entities branch
	graph.branches.entities.characters = extracted.characters.map((name, i) => ({
		id: `char_${i}`,
		name,
		role: "supporting",
		traits: [],
		arc: { 
			start: "Normal life", 
			midpoint: "Change", 
			end: "New state", 
			transformation: "Growth",
			emotionalJourney: [] 
		},
		motivations: [],
		fears: [],
		secretsOrLies: [],
		powers: [],
		tags: []
	}));

	// Fill timeline branch
	graph.branches.timeline.events = extracted.events.map((event) => ({
		id: `event_${event.index}`,
		label: event.name,
		description: `Auto-generated description`,
		act: 1,
		importance: "rising",
		sequenceInAct: event.index + 1,
		characterIds: [],
		conflictIds: [],
		emotionalTone: "neutral"
	}));

	return graph;
}

export const buildInitialStoryGraph = buildInitialGraph;
