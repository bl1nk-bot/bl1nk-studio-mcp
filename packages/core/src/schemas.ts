/**
 * @deprecated Use modular schemas in ./schemas/ instead.
 * This file is now a bridge to maintain backward compatibility.
 */
import { z } from "zod";

export * from "./schemas/backbone.js";
export * from "./schemas/entities.js";
export * from "./schemas/logic.js";
export * from "./schemas/master.js";
export * from "./schemas/narrative.js";
export * from "./schemas/project.js";

/**
 * Tool input schemas (minimal placeholders).
 * Each granular tool validates its own args internally.
 */
export const Schemas = {
	analyze_story: z.object({ text: z.string() }),
	export_mermaid: z.object({ graph: z.any() }),
	export_canvas: z.object({ graph: z.any() }),
	export_dashboard: z.object({ graph: z.any() }),
	export_markdown: z.object({ graph: z.any() }),
	export_mcp_ui_dashboard: z.object({ graph: z.any() }),
	validate_story_structure: z.object({ graph: z.any() }),
	extract_characters: z.object({ graph: z.any() }),
	extract_conflicts: z.object({ graph: z.any() }),
	build_relationship_graph: z.object({ graph: z.any() }),
	exa_search_story: z.object({ query: z.string() }),
};
