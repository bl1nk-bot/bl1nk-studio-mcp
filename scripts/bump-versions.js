#!/usr/bin/env node

/**
 * scripts/bump-versions.js
 *
 * Usage:
 *   node scripts/bump-versions.js <version>
 * Example:
 *   node scripts/bump-versions.js 3.0.5
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findPackageJsons(root) {
  const results = [];
  const rootsToScan = [root, path.join(root, 'packages')];

  const check = (dir) => {
    const direct = path.join(dir, 'package.json');
    if (fs.existsSync(direct)) results.push(direct);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(dir, entry.name, 'package.json');
      if (fs.existsSync(pkgPath)) results.push(pkgPath);
    }
  };

  for (const dir of rootsToScan) {
    if (!fs.existsSync(dir)) continue;
    check(dir);
  }

  if (!results.length) results.push(path.join(root, 'package.json'));
  return results.sort();
}

function extractVersion(targetPath) {
  const raw = fs.readFileSync(targetPath, 'utf8');
  const parsed = JSON.parse(raw);
  return typeof parsed.version === 'string' ? parsed.version : null;
}

function saveVersion(targetPath, newVersion) {
  const raw = fs.readFileSync(targetPath, 'utf8');
  const parsed = JSON.parse(raw);
  parsed.version = newVersion;
  const updated = JSON.stringify(parsed, null, 2) + '\n';
  fs.writeFileSync(targetPath, updated, 'utf8');
}

function compareSemver(a, b) {
  const A = a.split('.').map(Number);
  const B = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (A[i] > B[i]) return 1;
    if (A[i] < B[i]) return -1;
  }
  return 0;
}

function getCommitMessages() {
  try {
    const output = execSync(
      'git log -n 20 --pretty=format:"%h %s" --no-merges',
      {
        cwd: path.resolve(__dirname, '..'),
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    ).trim();

    if (!output) return [];
    return output.split('\n').filter((line) => line.trim().length > 0);
  } catch {
    return [];
  }
}

function appendChangelog(root, version, messages) {
  if (!messages.length) return;

  const changelogPath = path.join(root, 'CHANGELOG.md');
  const date = new Date().toISOString().slice(0, 10);
  const header = `## ${version} (${date})\n\n`;

  const content = messages.map((msg) => `- ${msg}`).join('\n') + '\n';

  let existing = '';
  if (fs.existsSync(changelogPath)) {
    existing = fs.readFileSync(changelogPath, 'utf8');
  }

  const updated = header + content + (existing || '');
  fs.writeFileSync(changelogPath, updated, 'utf8');
}

function run(rawArgs) {
  const args = rawArgs.slice(2);
  const newVersion = args[0];

  if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error('Usage: node scripts/bump-versions.js <version>');
    console.error('Example: node scripts/bump-versions.js 3.0.5');
    process.exit(1);
  }

  const root = path.resolve(__dirname, '..');
  const packageJsons = findPackageJsons(root);

  const currentVersions = packageJsons.map((absolute) => extractVersion(absolute)).filter(Boolean);

  const lowerVersions = currentVersions.filter((current) => compareSemver(newVersion, current) < 0);
  if (lowerVersions.length) {
    console.error(`Version ${newVersion} is lower than current package versions:`);
    lowerVersions.forEach((version) => console.error(` - found ${version}`));
    console.error('Cannot downgrade versions.');
    process.exit(1);
  }

  for (const absolute of packageJsons) {
    saveVersion(absolute, newVersion);
    console.log(`updated ${path.relative(root, absolute)} -> ${newVersion}`);
  }

  const snapshotPath = path.join(root, '.bump-versions.json');
  fs.writeFileSync(
    snapshotPath,
    JSON.stringify({ current: newVersion }, null, 2) + '\n',
    'utf8'
  );

  const messages = getCommitMessages();
  if (messages.length) {
    appendChangelog(root, newVersion, messages);
    console.log(`Changelog updated (${messages.length} commits)`);
  }

  console.log('done ' + newVersion);
}

run(process.argv);
