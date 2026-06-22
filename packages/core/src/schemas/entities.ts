import { z } from "zod";

/** 
 * กิ่งตัวละครและพลัง (Entity & Power Branch)
 * รวมเอาของเดิม (Arc, EmotionalJourney) + ของใหม่ (Power, Ghost)
 */

export const PowerSchema = z.object({
    system: z.string().describe("Magic or ability system name"),
    ability: z.string(),
    mechanics: z.string(),
    cost: z.string(),
    limits: z.string(),
    dangerLevel: z.number().min(1).max(10).default(1)
});

export const CharacterArcSchema = z.object({
    start: z.string(),
    midpoint: z.string(),
    end: z.string(),
    transformation: z.string(),
    emotionalJourney: z.array(z.string()).default([]) // คืนชีพของเดิม 100%
});

export const CharacterSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(["protagonist", "antagonist", "mentor", "supporting", "minor"]),
    archetype: z.string().optional(),
    traits: z.array(z.string()).default([]),
    arc: CharacterArcSchema,
    motivations: z.array(z.string()).default([]),
    fears: z.array(z.string()).default([]),
    secretsOrLies: z.array(z.string()).default([]),
    powers: z.array(PowerSchema).default([]),
    ghost: z.string().optional().describe("Internal trauma"),
    wantVsNeed: z.string().optional(),
    actAppearances: z.array(z.number()).default([]),
    tags: z.array(z.string()).default([])
});

export const RelationshipSchema = z.object({
    from: z.string(),
    to: z.string(),
    type: z.string(),
    strength: z.number().min(0).max(10),
    tension: z.number().min(0).max(10).default(0)
});
