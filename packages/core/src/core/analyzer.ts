import type { Character, Conflict, EventNode, StoryGraph } from "../types.js";
import { extractStoryEntities, STORY_PATTERNS } from "./parser.js";

// Fixed act boundary indices (4-5-N distribution)
const ACT2_START = 4;
const ACT3_START = 9;

const VALID_ROLES = new Set([
	"protagonist",
	"antagonist",
	"mentor",
	"supporting",
	"minor",
]);

function normalizeRole(raw: string | undefined): Character["role"] {
	const lower = (raw ?? "").toLowerCase();
	return (VALID_ROLES.has(lower) ? lower : "supporting") as Character["role"];
}

function detectImportance(label: string): string {
	const lower = label.toLowerCase();
	if (/\bfinal\b|\bclimax\b|\bshowdown\b/.test(lower)) return "climax";
	if (/\bmidpoint\b/.test(lower)) return "midpoint";
	if (/\bembraces?\b|\bresolution\b|\bepilogue\b|\baftermath\b/.test(lower))
		return "resolution";
	return "rising";
}

/**
 * Parses structured story text into a StoryGraph.
 *
 * Supported directives: Title, Character, Event, Conflict (see parser.ts).
 * Act assignment: first 4 events → Act 1, next 5 → Act 2, rest → Act 3.
 */
export function buildInitialGraph(text: string = ""): StoryGraph {
	const now = new Date().toISOString();
	const entities = extractStoryEntities(text);

	const characters: Character[] = entities.characters.map((c, i) => ({
		id: `char_${i}`,
		name: c.name,
		role: normalizeRole(c.role),
		traits: [],
		arc: {
			start: "Unknown",
			midpoint: "Conflict",
			end: "Resolution",
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

	// Pre-build name→id lookup (lowercase for case-insensitive matching)
	const charById = new Map<string, string>(
		characters.map((c) => [c.name.toLowerCase(), c.id]),
	);

	// Track sequenceInAct per act number
	const actSeq: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

	const events: EventNode[] = entities.events.map((e, i) => {
		const act = i < ACT2_START ? 1 : i < ACT3_START ? 2 : 3;
		actSeq[act] = (actSeq[act] ?? 0) + 1;

		const characterIds: string[] = [];
		for (const [lowerName, id] of charById) {
			if (e.name.toLowerCase().includes(lowerName)) characterIds.push(id);
		}

		return {
			id: `event_${i}`,
			label: e.name,
			description: e.name,
			act,
			importance: detectImportance(e.name),
			sequenceInAct: actSeq[act],
			characterIds,
			conflictIds: [],
			emotionalTone: "neutral",
		};
	});

	const conflicts: Conflict[] = entities.conflicts.map((c, i) => ({
		id: `conflict_${i}`,
		type: "external" as const,
		description: c.name,
		relatedCharacters: [],
		rootCause: "",
		escalations: [],
		actIntroduced: 1,
	}));

	// Extract theme tags from event text using central pattern map
	const allEventText = entities.events.map((e) => e.name).join(" ");
	const tags: string[] = Object.entries(STORY_PATTERNS.THEMES)
		.filter(([, pattern]) => pattern.test(allEventText))
		.map(([theme]) => theme);

	return {
		meta: {
			title: entities.title || "Untitled Story",
			createdAt: now,
			updatedAt: now,
			version: "1.0.0",
		},
		characters,
		events,
		conflicts,
		relationships: [],
		tags,
	};
}

/** Async wrapper — delegates to buildInitialGraph for simple text analysis. */
export async function analyzeStory(text: string): Promise<StoryGraph> {
	return buildInitialGraph(text);
}

export const buildInitialStoryGraph = buildInitialGraph;
