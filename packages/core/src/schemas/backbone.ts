import { z } from "zod";

/**
 * กิ่งโครงสร้างและกาลเวลา (Flexible Backbone)
 * ไม่บังคับจำนวนองก์ ไม่ตีกรอบความสำคัญแบบ Enum
 */

export const EventNodeSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().default(""),
    act: z.number().describe("Sequential act number (1, 2, 3, or more)"),
    importance: z.string().describe("User-defined importance or type"),
    sequenceInAct: z.number(),
    location: z.string().optional(),
    characterIds: z.array(z.string()).default([]),
    conflictIds: z.array(z.string()).default([]),
    emotionalTone: z.string().default("neutral"),
    metadata: z.record(z.string(), z.any()).optional() // รองรับการขยายกิ่งแบบอิสระ
});

export const PlotPointSchema = z.object({
    id: z.string(),
    type: z.string(), // "Inciting Incident", "Midpoint", "Point of No Return"
    goal: z.string(),
    eventIds: z.array(z.string()).default([]),
    act: z.number().optional()
});

export const TimelineSchema = z.object({
    era: z.string().optional(),
    events: z.array(EventNodeSchema).default([]),
    plotPoints: z.array(PlotPointSchema).default([])
});
