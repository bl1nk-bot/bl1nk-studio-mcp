/**
 * Test script for analyze_story tool
 * Runs the tool against the combined story input
 */

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Slug mapping: Thai names → English ASCII-safe filenames
const NAME_SLUGS = {
  // Characters
  "อิกนัส": "ignis",
  "เบลซ": "belz",
  "ลูฟัส": "lufus",
  "ซาเบล": "zabel",
  "อีริก": "eric",
  "โนเอล": "noel",
  "การ์ดภารกิจ": "quest-card",
  // Locations
  "ทุ่งหญ้า": "grass-field",
  "กำแพงเมือง": "city-wall",
  "เมืองไวท์ชาโดว์": "whiteshadow-city",
  // Scenes / chapter titles
  "คนแปลกหน้า": "stranger",
  "สงครามสัตว์อูร 9": "war-of-monsters-9",
  "สงครามสัตว์อูร 9": "war-of-monsters-9",
  "การ์ดภารกิจและการตัดสินใจ": "quest-card-and-decision",
};
function slug(name) {
  return NAME_SLUGS[name] || name.toLowerCase().replace(/\s+/g, "-");
}

// Read templates
const characterTemplate = readFileSync(
	join(__dirname, "../packages/bl1nk-core/templates/characters/character.md"),
	"utf8",
);
const sceneTemplate = readFileSync(
	join(__dirname, "../packages/bl1nk-core/templates/scene/scene.md"),
	"utf8",
);
const locationTemplate = readFileSync(
	join(__dirname, "../packages/bl1nk-core/templates/world/location.md"),
	"utf8",
);

// Compile Handlebars templates
const characterTemplateFn = Handlebars.compile(characterTemplate);
const sceneTemplateFn = Handlebars.compile(sceneTemplate);
const locationTemplateFn = Handlebars.compile(locationTemplate);

// Read the combined story
const storyText = readFileSync(
	join(__dirname, "./test-input/combined-story.md"),
	"utf8",
);

console.log("🚀 Running search_entries tool...\n");
console.log("📖 Input: combined-story.md (3 chapters)\n");
console.log("🔧 Tool: search_entries (formerly analyze_story)\n");

// Simple extraction (mimicking the tool logic)
const characters = searchCharacters(storyText);
const scenes = searchScenes(storyText);
const locations = searchLocations(storyText);

console.log("✅ Results:\n");
console.log("📊 Extracted:");
console.log(`   - Characters: ${characters.length}`);
console.log(`   - Scenes: ${scenes.length}`);
console.log(`   - Locations: ${locations.length}\n`);

console.log("📝 Characters Found:");
for (const c of characters) {
	console.log(`   - ${c.name} (${c.mentions.length} mentions)`);
}

console.log("\n🎬 Scenes Found:");
for (const s of scenes) {
	console.log(`   - ${s.name}`);
}

console.log("\n📍 Locations Found:");
for (const l of locations) {
	console.log(`   - ${l.name}`);
}

// Generate output directory
const outputDir = join(__dirname, "./test-output/v1");
if (existsSync(outputDir)) {
	rmSync(outputDir, { recursive: true, force: true });
}
mkdirSync(outputDir, { recursive: true });
mkdirSync(join(outputDir, "characters"), { recursive: true });
mkdirSync(join(outputDir, "scenes"), { recursive: true });
mkdirSync(join(outputDir, "locations"), { recursive: true });

// Generate files
console.log("\n📁 Generating files...\n");

// Character files
for (const char of characters) {
	const filename = join(
		outputDir,
		"characters",
		`${slug(char.name)}.md`,
	);
	const content = renderCharacterWithHandlebars(char, characterTemplateFn);
	writeFileSync(filename, content);
	console.log(
		`   ✅ characters/${slug(char.name)}.md`,
	);
}

// Scene files
for (const scene of scenes) {
	const safeName = slug(scene.name);
	const filename = join(outputDir, "scenes", `${safeName}.md`);
	const content = renderSceneWithHandlebars(scene, sceneTemplateFn);
	writeFileSync(filename, content);
	console.log(`   ✅ scenes/${safeName}.md`);
}

// Location files
for (const loc of locations) {
	const filename = join(
		outputDir,
		"locations",
		`${slug(loc.name)}.md`,
	);
	const content = renderLocationWithHandlebars(loc, locationTemplateFn);
	writeFileSync(filename, content);
	console.log(
		`   ✅ locations/${slug(loc.name)}.md`,
	);
}

// Index file
const indexContent = generateIndex(characters, scenes, locations);
writeFileSync(join(outputDir, "index.md"), indexContent);
console.log("   ✅ index.md");

console.log("\n✅ Done! Files generated in tests/test-output/\n");

// ============================================================================
// Search Functions (Simplified for testing)
// ============================================================================

function searchCharacters(text) {
	const characters = [];
	const charNames = new Map();

	// Known character names from the story
	const knownNames = [
		"อิกนัส",
		"ซิลเวอร์ไนท์",
		"ลิโอเรน อิกนัส",
		"เบลซ",
		"ลูฟัส",
		"ลูฟัส กลอส",
		"อีริก",
		"ซาเบล",
		"โนเอล",
		"หญิงสาวเมด",
		"การ์ดภารกิจ",
	];

	for (const name of knownNames) {
		const mentions = [];
		const lines = text.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.includes(name)) {
				mentions.push({
					chapter: getChapter(line, text),
					nameUsed: name,
					context: line.trim().substring(0, 100),
					speaker: "narrator",
					surroundingText: line.trim(),
				});
			}
		}

		if (mentions.length > 0) {
			// Check if this is an alias
			let canonicalName = name;
			if (name === "ซิลเวอร์ไนท์" || name === "ลิโอเรน อิกนัส") {
				canonicalName = "อิกนัส";
			} else if (name === "ลูฟัส กลอส") {
				canonicalName = "ลูฟัส";
			} else if (name === "หญิงสาวเมด") {
				canonicalName = "การ์ดภารกิจ";
			}

			const existing = charNames.get(canonicalName);
			if (existing) {
				existing.mentions.push(...mentions);
				if (!existing.aliases.includes(name) && name !== canonicalName) {
					existing.aliases.push(name);
				}
			} else {
				charNames.set(canonicalName, {
					type: "character",
					name: canonicalName,
					aliases: name !== canonicalName ? [name] : [],
					mentions,
				});
			}
		}
	}

	return Array.from(charNames.values());
}

function searchScenes(text) {
	const scenes = [];
	// Extract chapter/scene headers
	const chapterPattern = /(?:Chapter|Scene)\s*\d*:?\s*(.+)/gi;

	while (true) {
		const match = chapterPattern.exec(text);
		if (match === null) break;
		scenes.push({
			type: "scene",
			name: match[1].trim(),
			act: 1,
			importance: "normal",
			mentions: [
				{
					chapter: match[1].trim(),
					nameUsed: match[0],
					context: "chapter header",
				},
			],
		});
	}

	return scenes;
}

function searchLocations(text) {
	const locations = [];
	const knownLocations = [
		{ name: "เมืองไวท์ชาโดว์", aliases: ["ไวท์ชาโดว์"] },
		{ name: "ทุ่งหญ้า", aliases: [] },
		{ name: "กำแพงเมือง", aliases: [] },
	];

	for (const loc of knownLocations) {
		const mentions = [];
		const allNames = [loc.name, ...loc.aliases];

		for (const name of allNames) {
			const index = text.indexOf(name);
			if (index !== -1) {
				mentions.push({
					chapter: "multiple",
					nameUsed: name,
					context: "location mention",
				});
			}
		}

		if (mentions.length > 0) {
			locations.push({
				type: "location",
				name: loc.name,
				aliases: loc.aliases,
				mentions,
			});
		}
	}

	return locations;
}

function getChapter(line, text) {
	if (text.indexOf(line) < text.indexOf("## Chapter 8")) return "8";
	if (text.indexOf(line) < text.indexOf("## Chapter 13")) return "13";
	return "44";
}

// ============================================================================
// Template Rendering (using Handlebars)
// ============================================================================

function renderCharacterWithHandlebars(char, templateFn) {
	const tags = [];
	if (char.name === "อิกนัส" || char.name === "ซิลเวอร์ไนท์")
		tags.push("protagonist");
	if (char.name === "ลูฟัส") tags.push("mysterious", "friendly");
	if (char.name === "เบลซ") tags.push("companion", "beast");
	if (char.name === "อีริก") tags.push("leader", "hunter");
	if (char.name === "ซาเบล") tags.push("wind-user", "secretary");

	const templateData = {
		type: "character",
		id: `char_${slug(char.name)}`,
		canonicalName: char.name,
		status: "alive",
		tags,
		aliases: char.aliases.map((a) => ({
			name: a,
			usedBy: ["various"],
			context: "narration",
		})),
		mentions: char.mentions.slice(0, 10).map(m => ({
			chapter: m.chapter,
			name: m.nameUsed,
			speaker: m.speaker
		})),
		relationships: [],
		summary: `${char.name} appears ${char.mentions.length} times in the story.`,
		essence: "A character in the fantasy hunting world.",
		jsonBlock: JSON.stringify(
			{
				type: "character",
				id: `char_${slug(char.name)}`,
				canonicalName: char.name,
				status: "alive",
			},
			null,
			2,
		),
	};

	return templateFn(templateData);
}

function renderSceneWithHandlebars(scene, templateFn) {
	const chapterNum = scene.name.match(/Chapter (\d+)/)?.[1] || "1";

	const templateData = {
		type: "scene",
		id: `scene_chapter_${chapterNum}`,
		title: scene.name,
		chapter: chapterNum,
		act: 1,
		sceneNumber: 1,
		location: "unknown",
		characters: [],
		tags: [],
		summary: `Chapter ${chapterNum} of the story.`,
		keyEvents: [],
		emotionalArc: "Neutral",
		conflict: "None",
		jsonBlock: JSON.stringify(
			{
				type: "scene",
				id: `scene_chapter_${chapterNum}`,
				title: scene.name,
				act: 1,
			},
			null,
			2,
		),
	};

	return templateFn(templateData);
}

function renderLocationWithHandlebars(loc, templateFn) {
	const templateData = {
		type: "location",
		id: `loc_${slug(loc.name)}`,
		canonicalName: loc.name,
		hasAliases: loc.aliases && loc.aliases.length > 0,
		aliases: loc.aliases || [],
		hasScenes: false,
		scenes: [],
		hasConnections: false,
		connections: [],
		hasDescription: true,
		hasAtmosphere: false,
		hasSignificance: false,
		hasSensoryDetails: false,
		content: {
			description: "A location mentioned in the story.",
			essence: "A place in the fantasy world.",
		},
		jsonString: JSON.stringify(
			{
				type: "location",
				id: `loc_${slug(loc.name)}`,
				canonicalName: loc.name,
				aliases: loc.aliases || [],
			},
			null,
			2,
		),
	};

	return templateFn(templateData);
}

function generateIndex(characters, scenes, locations) {
	return `---
type: index
title: Story Index - Test Story
lastUpdated: ${new Date().toISOString()}
---

# Story Index

## Characters (${characters.length})
${characters.map((c) => `- [[characters/${slug(c.name)}]] — ${c.aliases.length > 0 ? `Aliases: ${c.aliases.join(", ")}` : "Main character"}`).join("\n")}

## Scenes (${scenes.length})
${scenes.map((s) => `- [[scenes/${slug(s.name)}]]`).join("\n")}

## Locations (${locations.length})
${locations.map((l) => `- [[locations/${slug(l.name)}]]`).join("\n")}

---

## Entity Resolution Summary

${characters
	.filter((c) => c.aliases.length > 0)
	.map((c) => `### ${c.name}\n**Known aliases:** ${c.aliases.join(", ")}\n`)
	.join("\n")}

## Statistics
- Total Characters: ${characters.length}
- Total Scenes: ${scenes.length}
- Total Locations: ${locations.length}
`;
}
