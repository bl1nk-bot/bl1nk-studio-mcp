import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Handlebars from "handlebars";

// ============================================================================
// Configuration
// ============================================================================
const outputDir = "tests/test-output";
const storyFile = "tests/test-input/combined-story.md";

// Create output directories
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
if (!existsSync(join(outputDir, "characters"))) mkdirSync(join(outputDir, "characters"));
if (!existsSync(join(outputDir, "scenes"))) mkdirSync(join(outputDir, "scenes"));
if (!existsSync(join(outputDir, "locations"))) mkdirSync(join(outputDir, "locations"));

// ============================================================================
// Helper Functions
// ============================================================================
function slug(text) {
	if (!text) return "";
	const map = {
		"อิกนัส": "ignis",
		"เบลซ": "belz",
		"ลูฟัส": "lufus",
		"อีริก": "eric",
		"ซาเบล": "zabel",
		"โนเอล": "noel",
		"การ์ดภารกิจ": "quest-card",
		"เมืองไวท์ชาโดว์": "whiteshadow-city",
		"ทุ่งหญ้า": "grass-field",
		"กำแพงเมือง": "city-wall",
		"การ์ดภารกิจและการตัดสินใจ": "quest-card-and-decision",
		"คนแปลกหน้า": "stranger",
		"สงครามสัตว์อสูร 9": "war-of-monsters-9"
	};
	if (map[text]) return map[text];
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s\W_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

// ============================================================================
// Main Execution
// ============================================================================
console.log("🚀 Running search_entries tool...");

const storyText = readFileSync(storyFile, "utf-8");
const characters = searchCharacters(storyText);
const scenes = searchScenes(storyText);
const locations = searchLocations(storyText);

console.log(`\n📊 Extracted:
   - Characters: ${characters.length}
   - Scenes: ${scenes.length}
   - Locations: ${locations.length}\n`);

// Mock templates
const charTemplate = `---
type: character
id: {{id}}
name: {{canonicalName}}
---
# {{canonicalName}}
{{summary}}`;

const sceneTemplate = `---
type: scene
id: {{id}}
title: {{title}}
---
# {{title}}
{{summary}}`;

const locTemplate = `---
type: location
id: {{id}}
name: {{canonicalName}}
---
# {{canonicalName}}
{{content.description}}`;

const charTemplateFn = Handlebars.compile(charTemplate);
const sceneTemplateFn = Handlebars.compile(sceneTemplate);
const locationTemplateFn = Handlebars.compile(locTemplate);

// Character files
for (const char of characters) {
	const safeName = slug(char.name);
	const filename = join(outputDir, "characters", `${safeName}.md`);
	const templateData = {
		id: `char_${safeName}`,
		canonicalName: char.name,
		summary: `${char.name} appears in the story.`
	};
	writeFileSync(filename, charTemplateFn(templateData));
	console.log(`   ✅ characters/${safeName}.md`);
}

// Scene files
for (const scene of scenes) {
	const safeName = slug(scene.name);
	const filename = join(outputDir, "scenes", `${safeName}.md`);
	const templateData = {
		id: `scene_${safeName}`,
		title: scene.name,
		summary: `Scene: ${scene.name}`
	};
	writeFileSync(filename, sceneTemplateFn(templateData));
	console.log(`   ✅ scenes/${safeName}.md`);
}

// Location files
for (const loc of locations) {
	const safeName = slug(loc.name);
	const filename = join(outputDir, "locations", `${safeName}.md`);
	const templateData = {
		id: `loc_${safeName}`,
		canonicalName: loc.name,
		content: { description: `Location: ${loc.name}` }
	};
	writeFileSync(filename, locationTemplateFn(templateData));
	console.log(`   ✅ locations/${safeName}.md`);
}

// Index file
const indexContent = `# Story Index\n\nCharacters: ${characters.length}\nScenes: ${scenes.length}\nLocations: ${locations.length}`;
writeFileSync(join(outputDir, "index.md"), indexContent);
console.log("   ✅ index.md");

console.log("\n✅ Done! Files generated in tests/test-output/\n");

// ============================================================================
// Search Functions (Simplified for testing)
// ============================================================================
function searchCharacters(text) {
	const names = ["อิกนัส", "เบลซ", "ลูฟัส", "อีริก", "ซาเบล", "โนเอล", "การ์ดภารกิจ"];
	return names.filter(n => text.includes(n)).map(n => ({ name: n, aliases: [], mentions: [] }));
}

function searchScenes(text) {
	const scenes = ["การ์ดภารกิจและการตัดสินใจ", "คนแปลกหน้า", "สงครามสัตว์อสูร 9"];
	return scenes.filter(s => text.includes(s)).map(s => ({ name: s }));
}

function searchLocations(text) {
	const locs = ["เมืองไวท์ชาโดว์", "ทุ่งหญ้า", "กำแพงเมือง"];
	return locs.filter(l => text.includes(l)).map(l => ({ name: l, aliases: [] }));
}
