import { z } from "zod";

export const ProjectSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	status: z.enum(["active", "archived", "draft", "stabilizing"]),
	createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export const SpecSchema = z.object({
    projectId: z.string().uuid(),
    actRule: z.string().default("25-50-25"),
    pacingTarget: z.enum(["slow", "balanced", "fast"]).default("balanced"),
    strictness: z.number().min(0).max(1).default(0.5),
    constraints: z.array(z.string()).default([]),
    aiDirectives: z.array(z.string()).default([])
});

export const DraftSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    version: z.string(),
    rawText: z.string(),
    wordCount: z.number(),
    syncStatus: z.enum(["synced", "pending", "conflict"]),
    lastSync: z.string().datetime()
});
