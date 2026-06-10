// Script to check the size of staged changes
import { execSync } from 'node:child_process';

/**
 * Calculates the size of the staged changes in terms of lines added/deleted.
 * XS: < 10 lines
 * S: < 50 lines
 * M: < 200 lines
 * L: < 500 lines
 * XL: >= 500 lines
 */
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
console.log(size);
process.exit(0);
