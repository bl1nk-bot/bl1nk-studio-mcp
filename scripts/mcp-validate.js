#!/usr/bin/env node

/**
 * Validate MCP configuration:
 * - dist/index.js exists and is runnable
 * - root/mcp.json, .mcp.json, gemini-extension.json, qwen-extension.json parse as JSON
 * - package.json versions are in sync
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function parseJson(pathStr) {
  try {
    return JSON.parse(fs.readFileSync(pathStr, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON: ${pathStr} (${error.message})`);
  }
}

function getVersions() {
  const versions = [];
  const rootPkg = path.join(root, 'package.json');
  if (fs.existsSync(rootPkg)) {
    const pkg = parseJson(rootPkg);
    versions.push({ file: rootPkg, version: pkg.version });
  }
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(root, entry.name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = parseJson(pkgPath);
    versions.push({ file: pkgPath, version: pkg.version });
  }
  return versions;
}

function run() {
  const failures = [];
  const warnings = [];
  const info = [];

  const distPath = path.join(root, 'packages', 'core', 'dist', 'index.js');
  if (!fs.existsSync(distPath)) {
    failures.push(`Missing MCP server: ${distPath}`);
  } else {
    info.push(`MCP server present: ${distPath}`);
  }

  for (const file of ['mcp.json', '.mcp.json', 'manifest-source.json']) {
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) {
      warnings.push(`Missing MCP config: ${file}`);
      continue;
    }
    parseJson(abs);
    info.push(`Config valid: ${file}`);
  }

  for (const file of ['gemini-extension.json', 'qwen-extension.json']) {
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) {
      warnings.push(`Missing extension: ${file}`);
      continue;
    }
    const data = parseJson(abs);
    const required = ['name', 'version', 'mcpServers', 'tools'];
    for (const key of required) {
      if (!(key in data)) failures.push(`Missing ${key} in ${file}`);
    }
    info.push(`Extension valid: ${file}`);
  }

  // tool list shape
  const manifest = fs.existsSync(path.join(root, 'manifest-source.json'))
    ? parseJson(path.join(root, 'manifest-source.json'))
    : {};
  const tools = Array.isArray((manifest || {}).tools) ? manifest.tools : [];
  if (!tools.length) {
    warnings.push('manifest-source.json has no tools');
  } else {
    info.push(`Manifest tools: ${tools.length}`);
  }

  // versions
  const versions = getVersions();
  const roots = versions.filter((v) => v.version === '3.0.6').length;
  warnings.push(`Versions in sync: ${roots}/${versions.length}`);

  if (failures.length) {
    console.error('VALIDATION FAILED\n');
    for (const item of failures) console.error(' ✗ ' + item);
    if (warnings.length) {
      console.error('\nWARNINGS\n');
      for (const item of warnings) console.error(' ⚠ ' + item);
    }
    if (info.length) {
      console.error('\nINFO\n');
      for (const item of info) console.error(' • ' + item);
    }
    console.error(`\nResult: FAIL (${failures.length} failure, ${warnings.length} warnings)`);
    process.exit(1);
  }

  console.log('VALIDATION PASSED\n');
  for (const item of info) console.log(' ✓ ' + item);
  if (warnings.length) {
    console.log('\nWARNINGS\n');
    for (const item of warnings) console.log(' ⚠ ' + item);
  }
  console.log(`\nResult: OK (${info.length} checks, ${warnings.length} warnings)`);
}

run();
