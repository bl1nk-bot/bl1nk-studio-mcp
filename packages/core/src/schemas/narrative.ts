import { z } from "zod";

/**
 * กิ่งสุนทรียภาพและแก่นเรื่อง (Flexible Narrative Branch)
 * เน้นการเก็บ "ความรู้สึก" (Intent) มากกว่าการจัดกลุ่มด้วย Enum
 */

export const ThemeSchema = z.object({
    coreTheme: z.string(),
    motifs: z.array(z.string()).default([]),
    symbolism: z.array(z.object({
        object: z.string(),
        meaning: z.string()
    })).default([]),
    metadata: z.record(z.any()).default({})
});

export const StyleSchema = z.object({
    tone: z.string(),
    voice: z.string(),
    pacingDescription: z.string().optional().describe("e.g., 'Frantic and breathless', 'Slow burn'"),
    styleNotes: z.array(z.string()).default([])
});

export const OutlineSchema = z.object({
    logline: z.string(),
    premise: z.string(),
    majorBeats: z.array(z.object({
        label: z.string(),
        intent: z.string()
    })).default([])
});
