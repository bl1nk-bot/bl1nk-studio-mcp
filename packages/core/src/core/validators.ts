import type { StoryGraph, ValidationResult, ValidationIssue, StoryAnalysis } from "../types.js";

/**
 * Validates the StoryGraph structure against the modular schema rules.
 */
export function validateStoryStructure(graph: StoryGraph): ValidationResult {
	const issues: ValidationIssue[] = [];
	const events = graph.branches.timeline.events;
	const characters = graph.branches.entities.characters;
    
	// 1. Basic Metadata Checks
	if (!graph.project.name) {
		issues.push({ severity: "error", code: "NO_TITLE", message: "Story has no title." });
	}

	// 2. Character Integrity
	if (characters.length === 0) {
		issues.push({ severity: "error", code: "NO_CHARACTERS", message: "Story has no characters." });
	}

	// 3. Act Balance (Rule 25-50-25)
	const totalEvents = events.length;
	const act1 = events.filter(e => e.act === 1).length;
	const act2 = events.filter(e => e.act === 2).length;
	const act3 = events.filter(e => e.act === 3).length;

	if (totalEvents > 0) {
		const act1Ratio = act1 / totalEvents;
		if (act1Ratio < 0.15 || act1Ratio > 0.35) {
			issues.push({ severity: "warning", code: "UNBALANCED_ACT_1", message: "Act 1 is unbalanced." });
		}
	}

	const analysis: StoryAnalysis = {
		actBalance: { act1, act2, act3, balance: 1.0 },
		characterCount: characters.length,
		conflictCount: graph.branches.logic.conflicts.length,
		eventCount: totalEvents,
		hasMidpoint: events.some(e => e.importance === "midpoint"),
		hasClimax: events.some(e => e.importance === "climax"),
		pacing: "balanced"
	};

	return {
		isValid: issues.filter(i => i.severity === "error").length === 0,
		issues,
		analysis,
		recommendations: []
	};
}
