import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

/**
 * Omni-Critic Test Audit Script
 * Verifies consistency of test inputs, outputs, and templates.
 */

const projectRoot = process.cwd();
const testsDir = path.join(projectRoot, 'tests');
const templatesDir = path.join(projectRoot, 'packages/bl1nk-core/templates');

console.log('🔍 Running Omni-Critic Test Audit...');

let errors = 0;
let warnings = 0;

// 1. Check for Encoding Issues in filenames
console.log('\n--- Checking for Encoding Issues ---');
const allTestFiles = globSync('tests/**/*', { nodir: true });
for (const file of allTestFiles) {
    if (file.includes('α') || file.includes('Γ') || file.includes('τ')) {
        console.error(`[BLOCKER] Corrupted filename detected: ${file}`);
        errors++;
    }
}

// 2. Check for Unrendered Template Tags in test-output
console.log('\n--- Checking for Unrendered Template Tags ---');
const outputFiles = globSync('tests/test-output/**/*.md');
for (const file of outputFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('{{') || content.includes('{%')) {
        console.error(`[CRITICAL] Unrendered template tags found in: ${file}`);
        errors++;
    }
}

// 3. Check for Path Drift (bl1nk vs bl1nk-core)
console.log('\n--- Checking for Path Drift ---');
const testScripts = globSync('tests/**/*.js');
for (const script of testScripts) {
    const content = fs.readFileSync(script, 'utf8');
    if (content.includes('../packages/bl1nk/')) {
        console.error(`[MAJOR] Script refers to legacy path 'packages/bl1nk': ${script}`);
        errors++;
    }
}

// 4. Check Template Consistency (Nunjucks tags in Handlebars templates)
console.log('\n--- Checking Template Consistency ---');
const templates = globSync('packages/bl1nk-core/templates/**/*.md');
for (const template of templates) {
    const content = fs.readFileSync(template, 'utf8');
    if (content.includes('{%') && content.includes('{{')) {
        console.warn(`[WARNING] Mixed template engines detected in: ${template}`);
        warnings++;
    }
}

console.log('\n--- Audit Summary ---');
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
    console.error('\n❌ Audit FAILED. Please fix Blocker/Critical issues.');
    process.exit(1);
} else {
    console.log('\n✅ Audit PASSED.');
    process.exit(0);
}
