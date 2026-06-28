#!/usr/bin/env node

/**
 * scripts/knip.js
 *
 * Run Knip if available, otherwise report what would be checked.
 *
 * Usage:
 *   node scripts/knip.js
 *   node scripts/knip.js --production
 *   node scripts/knip.js --json
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function run() {
  const args = process.argv.slice(2);
  const production = args.includes('--production');
  const asJson = args.includes('--json');

  const binPath = path.join(root, 'node_modules', '.bin', 'knip');
  if (!fs.existsSync(binPath)) {
    const report = {
      available: false,
      suggestion: 'pnpm add -D knip',
      checks: [
        'unused files',
        'unused dependencies',
        'unused exports',
        'unused types/interfaces'
      ]
    };
    if (asJson) {
      console.log(JSON.stringify(report, null, 2));
      process.exit(0);
    }
    console.log('Knip not installed.');
    console.log('Suggestion: pnpm add -D knip');
    console.log('Would check: ' + report.checks.join(', '));
    process.exit(0);
  }

  const cmd = [binPath];
  if (production) cmd.push('--production');
  if (asJson) cmd.push('--json');

  try {
    const output = execSync(cmd.join(' '), { cwd: root, encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    process.exit(0);
  } catch (error) {
    console.error(error.stdout?.toString() || error.message);
    process.exit(error.status || 1);
  }
}

run();
