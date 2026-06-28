import type { z } from "zod";

/**
 * @license bl1nk-visual-mcp
 * Runtime StoryGraph types.
 *
 * StoryGraph is the flat runtime structure used by analyzers, validators,
 * exporters, and tests. The modular schemas in ./schemas/ describe the
 * canonical entity shapes.
 */

export interface StoryMeta {
	title: string;
	createdAt: string;
	updatedAt: string;
	version?: string;
	genre?: string;
}

export type Character = z.infer<
	typeof import("./schemas/entities.js").CharacterSchema
>;
export type Relationship = z.infer<
	typeof import("./schemas/entities.js").RelationshipSchema
>;
export type EventNode = z.infer<
	typeof import("./schemas/backbone.js").EventNodeSchema
>;
export type Conflict = z.infer<
	typeof import("./schemas/logic.js").ConflictSchema
>;
export type Causality = z.infer<
	typeof import("./schemas/logic.js").CausalitySchema
>;
export type PlotThread = z.infer<
	typeof import("./schemas/logic.js").PlotThreadSchema
>;
export type Theme = z.infer<
	typeof import("./schemas/narrative.js").ThemeSchema
>;
export type Style = z.infer<
	typeof import("./schemas/narrative.js").StyleSchema
>;
export type Outline = z.infer<
	typeof import("./schemas/narrative.js").OutlineSchema
>;

export interface StoryGraph {
	meta: StoryMeta;
	characters: Character[];
	events: EventNode[];
	conflicts: Conflict[];
	relationships: Relationship[];
	tags: string[];
	causality?: Causality[];
	plotThreads?: PlotThread[];
	style?: Style;
	theme?: Theme;
	outline?: Outline;
}

// --- Convenience aliases ---
export type Project = StoryMeta;
export type CharacterArc = Character["arc"];
export type Power = z.infer<typeof import("./schemas/entities.js").PowerSchema>;
export type CharacterRole = Character["role"];
export type EventImportance = EventNode["importance"];

export interface ToolContentItem {
	type: "text";
	text: string;
}

export interface ToolResult {
	content: ToolContentItem[];
	isError?: boolean;
	[key: string]: unknown;
}

export interface CharacterExtractionResult {
	count: number;
	characters: Character[] | Array<Pick<Character, "id" | "name" | "role">>;
}

export interface ConflictExtractionResult {
	count: number;
	conflicts: Conflict[];
}

export interface RelationshipGraphResult {
	count: number;
	relationships: Relationship[];
	stats?: { totalRelationships: number; totalCharacters: number };
}

export interface ValidationIssue {
	severity: "error" | "warning" | "info";
	code: string;
	message: string;
	suggestion?: string;
}

export interface StoryAnalysis {
	actBalance: { act1: number; act2: number; act3: number; balance: number };
	characterCount: number;
	conflictCount: number;
	eventCount: number;
	hasMidpoint: boolean;
	hasClimax: boolean;
	pacing: "slow" | "balanced" | "fast";
}

export interface ValidationResult {
	isValid: boolean;
	issues: ValidationIssue[];
	analysis: StoryAnalysis;
	recommendations: string[];
}

export interface CanvasNode {
	id: string;
	type: string;
	text?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	color?: string;
	data?: Record<string, unknown>;
	position?: { x: number; y: number };
	style?: Record<string, any>;
}

export interface CanvasEdge {
	id: string;
	fromNode?: string;
	toNode?: string;
	label?: string;
	source?: string;
	target?: string;
	animated?: boolean;
	type?: string;
	style?: Record<string, any>;
}
