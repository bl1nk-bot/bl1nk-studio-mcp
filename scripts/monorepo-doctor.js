#!/usr/bin/env node

/**
 * scripts/monorepo-doctor.js
 *
 * Health checks for a pnpm monorepo:
 * - orphaned package folders (no package.json)
 * - package.json files outside packages/ (unexpected)
 * - package name / version drift across root + packages
 * - workspaces listed in pnpm-workspace.yaml but missing on disk
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
  if (!fs.existsSync(abs)) return null;
  const raw = fs.readFileSync(abs, 'utf8');
  const lines = raw.split('\n');
  const inPackages = [];
  let inPackagesSection = false;
  let inAllowBuildsSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('packages:')) {
      inPackagesSection = true;
      inAllowBuildsSection = false;
      continue;
    }
    if (trimmed.startsWith('allowBuilds:')) {
      inPackagesSection = false;
      inAllowBuildsSection = true;
      continue;
    }
    if (inPackagesSection && trimmed.startsWith('-')) {
      const value = trimmed.replace(/^- /, '').replace(/['"]/g, '').replace(/\/\*$/, '').trim();
      if (value) inPackages.push(value);
    }
    if (inAllowBuildsSection && !trimmed.startsWith(' ')) {
      inAllowBuildsSection = false;
    }
  }
  return inPackages;
}

function findPackageJsons(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(dir, entry.name, 'package.json');
    if (fs.existsSync(pkgPath)) results.push(pkgPath);
  }
  return results;
}

function run() {
  const notes = [];
  const warnings = [];
  const errors = [];

  // orphan package directories under packages/
  const packagesDir = path.join(root, 'packages');
  if (fs.existsSync(packagesDir)) {
    const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(packagesDir, entry.name, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        warnings.push({ type: 'missing-package-json', path: `packages/${entry.name}` });
      }
    }
  }

  // unexpected root package.jsons outside packages/
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(root, entry.name, 'package.json');
    if (pkgPath.startsWith(packagesDir)) continue;
    if (fs.existsSync(pkgPath)) {
      errors.push({ type: 'unexpected-package-json', path: path.relative(root, pkgPath) });
    }
  }

  // workspace drift
  const workspacePatterns = parseWorkspaceYaml('pnpm-workspace.yaml');
  const workspacePackages = [];
  for (const normalized of workspacePatterns) {
    const dir = path.join(root, normalized);
    if (!fs.existsSync(dir)) {
      warnings.push({ type: 'missing-workspace-package', path: normalized });
    }
    if (fs.existsSync(dir)) {
      workspacePackages.push(...findPackageJsons(dir));
    }
  }
  notes.push(`Workspace package.jsons referenced: ${workspacePackages.length}`);

  // version drift
  const allPackageJsons = findPackageJsons(packagesDir);
  if (allPackageJsons.length) {
    const versions = [];
    for (const file of allPackageJsons) {
      const pkg = parseJson(file);
      const v = pkg?.version;
      if (v) versions.push(v);
    }
    const groups = {};
    for (const version of versions) {
      groups[version] = (groups[version] || 0) + 1;
    }
    notes.push(`Package versions: ${JSON.stringify(groups)}`);
    if (Object.keys(groups).length > 1) {
      warnings.push({ type: 'version-drift', counts: groups });
    }
  }

  // root scope drift - warning only, not a failure
  const rootPkg = parseJson('package.json');
  if (rootPkg?.name && !rootPkg.name.startsWith('@bl1nk/')) {
    console.log(' • Root package scope note: ' + rootPkg.name);
  }
  notes.push(`Root package: ${rootPkg?.name}@${rootPkg?.version}`);

  if (!errors.length && !warnings.length) {
    console.log('MONOREPO OK\n');
    for (const note of notes) console.log(' • ' + note);
    process.exit(0);
  }

  console.log('MONOREPO ISSUES\n');
  for (const error of errors) console.error(' ✗ ' + error.type + ': ' + error.path);
  for (const warning of warnings) {
    const detail = warning.path || warning.counts || warning.name || '';
    console.error(' ⚠ ' + warning.type + (detail ? ': ' + detail : ''));
  }
  if (notes.length) {
    console.log('\nINFO\n');
    for (const note of notes) console.log(' • ' + note);
  }
  process.exit(1);
}

run();
