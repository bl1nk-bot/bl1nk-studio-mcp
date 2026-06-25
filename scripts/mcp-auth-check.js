#!/usr/bin/env node

/**
 * scripts/mcp-auth-check.js
 *
 * Check MCP auth config in Gemini/Qwen extension manifests.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function parseJson(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) return null;
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function run() {
  const failures = [];
  const info = [];

  for (const file of ['gemini-extension.json', 'qwen-extension.json']) {
    const data = parseJson(file);
    if (!data) {
      failures.push(`Missing: ${file}`);
      continue;
    }

    const servers = data.mcpServers || {};
    const names = Object.keys(servers);
    if (!names.length) {
      failures.push(`${file}: no mcpServers configured`);
      continue;
    }

    for (const name of names) {
      const server = servers[name];
      if (!server?.command) {
        failures.push(`${file}: ${name} missing command`);
      }
      if (!server?.args?.length) {
        failures.push(`${file}: ${name} missing args`);
      }
      if (!server?.cwd) {
        failures.push(`${file}: ${name} missing cwd`);
      }
      info.push(`${file}: ${name} config looks present`);
    }
  }

  if (failures.length) {
    console.error('MCP AUTH CHECK FAILED\n');
    for (const item of failures) console.error(' ✗ ' + item);
    if (info.length) {
      console.log('\nINFO\n');
      for (const item of info) console.log(' • ' + item);
    }
    process.exit(1);
  }

  console.log('MCP AUTH CHECK PASSED\n');
  for (const item of info) console.log(' ✓ ' + item);
}

run();
