const fs = require('fs');
const path = require('path');

console.log("🔍 Running Omni-Critic Test Audit (Restored)...");

// Basic checks for encoding and template tags
function checkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('{{') || content.includes('}}')) {
                console.warn(`⚠️ Warning: Unrendered tags in ${fullPath}`);
            }
            if (/[^\x00-\x7F]/.test(file)) {
                console.error(`❌ Error: Non-ASCII filename detected: ${file}`);
            }
        }
    });
}

checkDir('tests/test-output');
console.log("✅ Audit Finished.");
