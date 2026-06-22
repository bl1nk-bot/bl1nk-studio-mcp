import type {
	StoryGraph,
	ValidationResult,
	ValidationIssue,
	StoryAnalysis,
} from "../types.js";

export interface ValidateOptions {
	strict?: boolean;
	includeRecommendations?: boolean;
}

/**
 * Validates a StoryGraph in a single pass over events.
 * Checks title, protagonist, act presence, climax, midpoint, and balance.
 */
export function validateStoryStructure(
	graph: StoryGraph,
	options: ValidateOptions = {},
): ValidationResult {
	const { strict = false, includeRecommendations = true } = options;
	const issues: ValidationIssue[] = [];
	const events = graph.events;
	const characters = graph.characters;

	// ── 1. Metadata ─────────────────────────────────────────────────────────
	if (!graph.meta.title?.trim()) {
		issues.push({ severity: "error", code: "MISSING_TITLE", message: "Story has no title." });
	}

	// ── 2. Characters ────────────────────────────────────────────────────────
	if (characters.length === 0) {
		issues.push({ severity: "error", code: "NO_CHARACTERS", message: "Story has no characters." });
	} else {
		if (!characters.some((c) => c.role === "protagonist")) {
			issues.push({ severity: "error", code: "NO_PROTAGONIST", message: "Story has no protagonist." });
		}
		if (strict) {
			for (const c of characters) {
				if (!c.motivations || c.motivations.length === 0) {
					issues.push({ severity: "error", code: "NO_MOTIVATION", message: `Character "${c.name}" has no motivations.` });
				}
				if (!c.arc?.transformation?.trim()) {
					issues.push({ severity: "warning", code: "NO_ARC", message: `Character "${c.name}" has no transformation arc.` });
				}
			}
		}
	}

	// ── 3. Single-pass event analysis ────────────────────────────────────────
	let act1 = 0, act2 = 0, act3 = 0;
	let hasClimax = false, hasMidpoint = false;
	let totalEvents = 0;

	for (const e of events) {
		totalEvents++;
		if (e.act === 1) act1++;
		else if (e.act === 2) act2++;
		else if (e.act === 3) act3++;
		if (e.importance === "climax") hasClimax = true;
		if (e.importance === "midpoint") hasMidpoint = true;
	}

	// ── 4. Act presence ──────────────────────────────────────────────────────
	if (act1 === 0) {
		issues.push({ severity: "error", code: "MISSING_ACT1", message: "No events in Act 1." });
	}
	if (act2 === 0) {
		issues.push({ severity: "error", code: "MISSING_ACT2", message: "No events in Act 2." });
	}
	if (act3 === 0) {
		issues.push({ severity: "error", code: "MISSING_ACT3", message: "No events in Act 3." });
	}

	// ── 5. Climax & midpoint ─────────────────────────────────────────────────
	if (!hasClimax) {
		issues.push({
			severity: "error",
			code: "MISSING_CLIMAX",
			message: "Story is missing a climax event.",
			suggestion: 'Add an event with importance "climax" in Act 3',
		});
	}
	if (!hasMidpoint) {
		issues.push({ severity: "warning", code: "NO_MIDPOINT", message: "Story is missing a midpoint event." });
	}

	// ── 6. Conflicts ─────────────────────────────────────────────────────────
	if (graph.conflicts.length === 0) {
		issues.push({ severity: "warning", code: "NO_CONFLICTS", message: "Story has no conflicts." });
	}

	// ── 7. Act balance (skip when fewer than 4 events or any act is missing) ─
	const actEventCount = act1 + act2 + act3;
	if (actEventCount >= 4 && act1 > 0 && act2 > 0 && act3 > 0) {
		const act1Ratio = act1 / actEventCount;
		const act2Ratio = act2 / actEventCount;
		const act3Ratio = act3 / actEventCount;
		const severity = strict ? "error" as const : "warning" as const;

		if (act1Ratio < 0.15 || act1Ratio > 0.35) {
			issues.push({ severity, code: "ACT1_IMBALANCE", message: `Act 1 is ${act1Ratio < 0.15 ? "too short" : "too long"} (${Math.round(act1Ratio * 100)}%, target 15-35%).` });
		}
		if (act2Ratio < 0.35 || act2Ratio > 0.65) {
			issues.push({ severity, code: "ACT2_IMBALANCE", message: `Act 2 is ${act2Ratio < 0.35 ? "too short" : "too long"} (${Math.round(act2Ratio * 100)}%, target 35-65%).` });
		}
		if (act3Ratio < 0.15 || act3Ratio > 0.35) {
			issues.push({ severity, code: "ACT3_IMBALANCE", message: `Act 3 is ${act3Ratio < 0.15 ? "too short" : "too long"} (${Math.round(act3Ratio * 100)}%, target 15-35%).` });
		}
	}

	// ── 8. Balance score: min/max per act (0 when any act is empty or no events) ──
	let balance = 0;
	if (act1 > 0 && act2 > 0 && act3 > 0) {
		balance = Math.min(act1, act2, act3) / Math.max(act1, act2, act3);
	}

	// ── 9. Pacing ─────────────────────────────────────────────────────────────
	const pacing: StoryAnalysis["pacing"] =
		totalEvents < 5 ? "slow" : totalEvents >= 15 ? "fast" : "balanced";

	// ── 10. Recommendations ───────────────────────────────────────────────────
	const recommendations: string[] = [];
	if (includeRecommendations) {
		if (!hasClimax) {
			recommendations.push("Define a clear Climax in Act 3 to resolve the main conflict");
		}
		if (!hasMidpoint) {
			recommendations.push("Add a midpoint event to strengthen Act 2.");
		}
		if (actEventCount > 0 && act2 / actEventCount < 0.35) {
			recommendations.push("Expand Act 2 to develop the rising action and character relationships");
		}
		if (graph.conflicts.length === 0) {
			recommendations.push("Consider adding subplots or internal conflicts to increase depth");
		}
		if (balance > 0 && balance < 0.6) {
			recommendations.push("Redistribute events across acts to approach the 25-50-25 structure.");
		}
	}

	const analysis: StoryAnalysis = {
		actBalance: { act1, act2, act3, balance },
		characterCount: characters.length,
		conflictCount: graph.conflicts.length,
		eventCount: totalEvents,
		hasMidpoint,
		hasClimax,
		pacing,
	};

	return {
		isValid: issues.filter((i) => i.severity === "error").length === 0,
		issues,
		analysis,
		recommendations,
	};
}

/** Alias for backward compatibility. */
export const validateGraph = validateStoryStructure;
