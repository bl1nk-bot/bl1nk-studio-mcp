#!/usr/bin/env node

/**
 * scripts/monorepo-audit.js
 *
 * Audit monorepo hygiene:
 * - List all package names/versions
 * - Identify packages referenced in pnpm-workspace.yaml
 * - Compare and highlight discrepancies
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function parseJson(file) {
  const abs = path.isAbsolute(file) ? file : path.join(root, file);
  if (!fs.existsSync(abs)) return null;
  const raw = fs.readFileSync(abs, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseWorkspaceYaml(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) return [];
  const raw = fs.readFileSync(abs, 'utf8');

  // Extract package globs safely without a full YAML parser.
  // We only need entries like: - 'packages/*'
  const globs = [];
  const lines = raw.split('\n');
  let inPackages = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (/^packages:\s*$/i.test(trimmed)) {
      inPackages = true;
      continue;
    }
    if (/^[a-z]+:/i.test(trimmed) && !inPackages) {
      inPackages = false;
    }
    if (!inPackages) continue;

    const m = trimmed.match(/^-+\s*(.+)$/);
    if (!m) continue;
    const value = m[1].trim().replace(/['"`]/g, '').trim();
    if (value) globs.push(value);
  }

  return globs;
}

function findWorkspacePackages(globs) {
  const results = new Set();
  for (const pattern of globs) {
    const cleaned = String(pattern).replace(/\/\*$/, '');
    const target = path.join(root, cleaned);
    if (!fs.existsSync(target)) continue;

    if (fs.statSync(target).isDirectory() && cleaned === 'packages') {
      // special case: packages/* means every subdir with package.json
      for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const pkg = path.join(target, entry.name, 'package.json');
        if (fs.existsSync(pkg)) results.add(path.join('packages', entry.name));
      }
      continue;
    }

    results.add(cleaned.replace(/\\/g, '/'));
  }
  return [...results];
}

function getPackageDetails(dir) {
  const pkgPath = path.join(root, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = parseJson(pkgPath);
  return {
    path: dir,
    name: pkg?.name,
    version: pkg?.version
  };
}

function run() {
  const workspaceGlobs = parseWorkspaceYaml('pnpm-workspace.yaml');
  const rootPkg = parseJson('package.json');

  const packageDirs = findWorkspacePackages(workspaceGlobs);
  const packages = packageDirs.map(getPackageDetails);

  const clean = packages.filter(Boolean);
  console.log(`Packages: ${clean.length}\n`);
  console.log(`Path                          Name                        Version`);
  console.log(`------------------------------------------------------------------------`);
  for (const pkg of clean) {
    const p = pkg.path.padEnd(30);
    const n = (pkg.name || '-').padEnd(27);
    console.log(`${p}${n}${pkg.version}`);
  }

  if (rootPkg?.name && !rootPkg.name.startsWith('@bl1nk/')) {
    console.warn(`Root package scope note: ${rootPkg.name}`);
  }
}

run();
