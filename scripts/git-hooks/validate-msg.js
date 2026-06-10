import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const msgFile = process.argv[2];
if (!msgFile) {
  console.error('No commit message file provided.');
  process.exit(1);
}

const originalMsg = readFileSync(msgFile, 'utf8').trim();
const markers = ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'ci', 'perf', 'build'];
const markerRegex = new RegExp(`^(${markers.join('|')})(\\(.*\\))?!?:\\s.+`, 'i');

// 1. Check for Marker
if (!markerRegex.test(originalMsg)) {
  console.error('\x1b[31mError:\x1b[0m Commit message must follow Conventional Commits format.');
  console.error('\x1b[33mExample:\x1b[0m feat: add new feature');
  console.error('\x1b[33mAllowed markers:\x1b[0m ' + markers.join(', '));
  process.exit(1);
}

// 2. Calculate Size and Add Label
function getChangeSize() {
  try {
    const diff = execSync('git diff --cached --shortstat').toString().trim();
    if (!diff) return 'XS';
    const insertions = parseInt(diff.match(/(\d+) insertion/)?.[1] || '0');
    const deletions = parseInt(diff.match(/(\d+) deletion/)?.[1] || '0');
    const totalLines = insertions + deletions;

    if (totalLines < 10) return 'XS';
    if (totalLines < 50) return 'S';
    if (totalLines < 200) return 'M';
    if (totalLines < 500) return 'L';
    return 'XL';
  } catch (error) {
    return 'UNKNOWN';
  }
}

const size = getChangeSize();
const label = `[size/${size}]`;

// Check if label already exists to avoid duplication
if (!originalMsg.includes('[size/')) {
  const newMsg = `${originalMsg} ${label}`;
  writeFileSync(msgFile, newMsg, 'utf8');
  console.log(`\x1b[32mSuccess:\x1b[0m Added size label ${label} to commit message.`);
}

process.exit(0);
