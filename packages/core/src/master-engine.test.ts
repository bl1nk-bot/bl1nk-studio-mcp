import { describe, expect, it } from "vitest";
// @ts-expect-error - เราจงใจให้มันพังก่อนเพราะยังไม่ได้สร้างไฟล์เหล่านี้ (TDD)
import { MasterStoryGraphSchema } from "./schemas/master.js";

describe("Grand Master Story Engine (TDD)", () => {
	it("should validate a complex branched story without losing old data", () => {
		const complexStory = {
			project: {
				id: "550e8400-e29b-41d4-a716-446655440000",
				name: "TDD Project",
				status: "active",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			meta: {
				projectId: "550e8400-e29b-41d4-a716-446655440000",
				title: "The Great Reconstruction",
				version: "3.0.0",
			},
			branches: {
				entities: {
					characters: [
						{
							id: "char_1",
							name: "Architect",
							role: "protagonist",
							traits: ["Strict", "Visionary"],
							arc: {
								start: "Frustrated",
								midpoint: "Designing",
								end: "Satisfied",
								transformation: "True Order",
								emotionalJourney: ["Anger", "Focus", "Victory"],
							},
							ghost: "The Great Deletion of 2026",
							powers: [
								{
									system: "Logic",
									ability: "Reality Check",
									mechanics: "Calls out AI BS",
									cost: "Patience",
									limits: "High",
								},
							],
						},
					],
				},
				timeline: {
					events: [
						{
							id: "e_1",
							label: "The TDD Mandate",
							act: 1,
							importance: "inciting",
							sequenceInAct: 1,
							characterIds: ["char_1"],
							emotionalTone: "tense",
						},
					],
				},
				logic: {
					causality: [
						{ triggerId: "e_1", effectId: "e_2", logicType: "Inevitability" },
					],
				},
			},
		};

		// 1. ตรวจสอบว่า Schema ใหม่รองรับข้อมูลชุดนี้ไหม
		const result = MasterStoryGraphSchema.safeParse(complexStory);

		if (!result.success) {
			console.log(
				"❌ ZOD ERROR DETAILS:",
				JSON.stringify(result.error.format(), null, 2),
			);
		}

		expect(result.success).toBe(true);
	});

	it("should enforce the 25-50-25 rule even in a complex branch", () => {
		// กฎ 3 องก์ห้ามหายไปไหน
	});
});
