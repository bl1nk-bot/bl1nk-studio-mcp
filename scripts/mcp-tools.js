#!/usr/bin/env node

/**
 * scripts/mcp-tools.js
 *
 * List available MCP tools from manifest-source.json and/or built dist/index.js.
 *
 * Usage:
 *   node scripts/mcp-tools.js
 *   node scripts/mcp-tools.js --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function parseConfig(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) return null;
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function run() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');

  const manifest = parseConfig('manifest-source.json');
  const extensions = ['gemini-extension.json', 'qwen-extension.json']
    .map(parseConfig)
    .filter(Boolean);

  const items = [];

  if (manifest?.tools?.length) {
    for (const tool of manifest.tools) {
      items.push({
        source: 'manifest',
        name: tool.name,
        description: tool.description || null
      });
    }
  }

  for (const ext of extensions) {
    for (const tool of ext.tools || []) {
      items.push({
        source: path.basename(ext.contextFileName || ext.name || 'extension'),
        name: tool.name,
        description: tool.description || null
      });
    }
  }

  const unique = [];
  const seen = new Set();
  for (const tool of items) {
    const key = `${tool.source}:${tool.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(tool);
  }

  if (!unique.length) {
    console.error('No MCP tools found in manifest-source.json or extension manifests.');
    process.exit(1);
  }

  if (asJson) {
    console.log(JSON.stringify({ count: unique.length, tools: unique }, null, 2));
    return;
  }

  console.log(`MCP Tools (${unique.length})\n`);
  console.log(`Source           Name                       Description`);
  console.log(`------------------------------------------------------------------------`);
  for (const tool of unique) {
    const src = tool.source.padEnd(17);
    const name = tool.name.padEnd(26);
    const desc = tool.description || '-';
    console.log(`${src}${name}${desc}`);
  }
}

run();
