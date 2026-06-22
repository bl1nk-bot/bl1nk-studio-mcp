import { z } from "zod";
import { TimelineSchema } from "./backbone.js";
import { CharacterSchema, RelationshipSchema } from "./entities.js";
import { CausalitySchema, ConflictSchema, PlotThreadSchema } from "./logic.js";
import { OutlineSchema, StyleSchema, ThemeSchema } from "./narrative.js";
import { DraftSchema, ProjectSchema, SpecSchema } from "./project.js";

/**
 * Master StoryGraph Schema (The Trunk of the Tree)
 * เชื่อมต่อทุกกิ่งก้านเข้าด้วยกันอย่างเป็นระบบ
 */
export const MasterStoryGraphSchema = z.object({
	project: ProjectSchema,
	spec: SpecSchema.optional(),
	activeDraft: DraftSchema.optional(),

	// กิ่งหลัก (Branches)
	branches: z.object({
		narrative: z
			.object({
				theme: ThemeSchema,
				style: StyleSchema,
				outline: OutlineSchema,
			})
			.optional(),

		entities: z
			.object({
				characters: z.array(CharacterSchema).default([]),
				relationships: z.array(RelationshipSchema).default([]),
			})
			.default({ characters: [], relationships: [] }),

		timeline: TimelineSchema.default({ events: [], plotPoints: [] }),

		logic: z
			.object({
				causality: z.array(CausalitySchema).default([]),
				plots: z.array(PlotThreadSchema).default([]),
				conflicts: z.array(ConflictSchema).default([]),
			})
			.default({ causality: [], plots: [], conflicts: [] }),
	}),
});

export type MasterStoryGraph = z.infer<typeof MasterStoryGraphSchema>;
