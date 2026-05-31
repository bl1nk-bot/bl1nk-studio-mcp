import { z } from "zod";
import * as Master from "./schemas/master.js";

/**
 * @license bl1nk-visual-mcp
 * The Source of Truth (Inferred from Master Schema)
 */

export type StoryGraph = Master.MasterStoryGraph;

// --- Derived Entity Types ---
export type Project = z.infer<typeof import("./schemas/project.js").ProjectSchema>;
export type Character = z.infer<typeof import("./schemas/entities.js").CharacterSchema>;
export type EventNode = z.infer<typeof import("./schemas/backbone.js").EventNodeSchema>;
export type Causality = z.infer<typeof import("./schemas/logic.js").CausalitySchema>;
export type PlotThread = z.infer<typeof import("./schemas/logic.js").PlotThreadSchema>;
export type Conflict = z.infer<typeof import("./schemas/logic.js").ConflictSchema>;
export type Relationship = z.infer<typeof import("./schemas/entities.js").RelationshipSchema>;

// --- Narrative Branches ---
export type Theme = z.infer<typeof import("./schemas/narrative.js").ThemeSchema>;
export type Style = z.infer<typeof import("./schemas/narrative.js").StyleSchema>;
export type Outline = z.infer<typeof import("./schemas/narrative.js").OutlineSchema>;

// --- Missing Exports (ทำให้ตรงกัน) ---
export type StoryMeta = StoryGraph["project"];
export type CharacterArc = Character["arc"];
export type Power = z.infer<typeof import("./schemas/entities.js").PowerSchema>;
export type CharacterRole = Character["role"];
export type EventImportance = EventNode["importance"];

export interface ToolContentItem {
	type: "text" | "image" | "resource";
	text?: string;
	data?: string;
	mimeType?: string;
}

export interface ToolResult {
	content: ToolContentItem[];
	isError?: boolean;
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
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}

export interface CanvasEdge {
    id: string;
    fromNode: string;
    toNode: string;
    label?: string;
}
