import { z } from "zod";

export const CausalitySchema = z.object({
    id: z.string().uuid().default(() => crypto.randomUUID()),
    triggerId: z.string(),
    effectId: z.string(),
    logicType: z.string(),
    isInevitable: z.boolean().default(true)
});

export const PlotThreadSchema = z.object({
    id: z.string(),
    title: z.string(),
    priority: z.enum(["main", "sub", "minor"]).default("sub"),
    status: z.enum(["open", "resolved", "abandoned"]),
    relatedEventIds: z.array(z.string()).default([])
});

export const ConflictSchema = z.object({
    id: z.string(),
    type: z.enum(["internal", "external"]),
    description: z.string(),
    relatedCharacters: z.array(z.string()),
    rootCause: z.string(),
    escalations: z.array(z.object({
        stage: z.number(),
        description: z.string(),
        intensity: z.number(),
        affectedCharacters: z.array(z.string())
    })).default([]),
    resolution: z.string().optional(),
    actIntroduced: z.number().min(1).max(3)
});
