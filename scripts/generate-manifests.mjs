#!/usr/bin/env node
/**
 * Generate all agent manifests from manifest-source.json
 *
 * Usage: node scripts/generate-manifests.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// Constants
const SERVER_NAME = "bl1nkVisualServer";
const INDENT = "\t";

// Read source of truth
const source = JSON.parse(
	readFileSync(join(root, "manifest-source.json"), "utf8"),
);

const entryPoint = source.mcpServer.entryPoint.replace(/\//g, "${/}");

// Helper function to reduce repetition
function writeManifest(filePath, manifest, description) {
	writeFileSync(filePath, JSON.stringify(manifest, null, INDENT) + "\n");
	console.log(`✅ ${description}`);
}

// Shared MCP server configuration factory
function createMcpServerConfig(pathVariable = "${extensionPath}") {
	return {
		[SERVER_NAME]: {
			command: source.mcpServer.command,
			args: [`${pathVariable}${/}${entryPoint}`],
			cwd: pathVariable,
		},
	};
}

// 1. Qwen Extension Manifest
const qwenManifest = {
	name: source.name,
	version: source.version,
	contextFileName: source.contextFiles.qwen,
	commands: "commands",
	skills: "skills",
	settings: source.settings,
	mcpServers: createMcpServerConfig("${extensionPath}"),
	tools: source.tools,
};

writeManifest(
	join(root, "qwen-extension.json"),
	qwenManifest,
	"qwen-extension.json",
);

// 2. Gemini Extension Manifest
const geminiManifest = {
	name: source.name,
	version: source.version,
	contextFileName: source.contextFiles.gemini,
	settings: source.settings,
	mcpServers: createMcpServerConfig("${extensionPath}"),
	tools: source.tools,
};

writeManifest(
	join(root, "gemini-extension.json"),
	geminiManifest,
	"gemini-extension.json",
);

// 3. Claude Plugin Manifest
mkdirSync(join(root, ".claude-plugin"), { recursive: true });

const claudeManifest = {
	name: source.name,
	description: source.description,
	version: source.version,
	author: source.author,
};

writeManifest(
	join(root, ".claude-plugin", "plugin.json"),
	claudeManifest,
	".claude-plugin/plugin.json",
);

// 4. Claude .mcp.json
const claudeMcp = createMcpServerConfig("${extensionRoot}");

writeManifest(join(root, ".mcp.json"), claudeMcp, ".mcp.json");

// 5. Kilo Code config
mkdirSync(join(root, ".kilo"), { recursive: true });

const kiloConfig = {
	agent: {
		"story-analyzer": {
			description:
				"Analyzes story structure using bl1nk MCP tools — validates 3-act structure, tracks character arcs, maps conflicts, and generates visual diagrams.",
			mode: "subagent",
		},
		"story-validator": {
			description:
				"Validates story structure against industry standards — checks act distribution, midpoint, climax, pacing, and character development.",
			mode: "subagent",
		},
		"story-exporter": {
			description:
				"Exports StoryGraph to multiple formats — Mermaid diagrams, Canvas JSON, HTML dashboards, Markdown documents, and CSV data.",
			mode: "subagent",
		},
	},
};

writeManifest(join(root, ".kilo/kilo.jsonc"), kiloConfig, "kilo.jsonc");

// Summary
console.log(
	`\n📋 Generated ${Object.keys(source.tools).length} tools across all manifests`,
);
console.log(`📦 MCP server: ${source.mcpServer.entryPoint}`);
console.log("🔗 All manifests generated from manifest-source.json");
