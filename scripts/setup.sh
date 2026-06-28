#!/bin/bash
set -eu

echo "=== Project Setup ==="

if [ -f package.json ]; then
    echo "Node.js project detected"
    if ! command -v pnpm >/dev/null 2>&1; then
        echo "pnpm not found. Please install pnpm first."
        exit 1
    fi
    pnpm install
fi

echo "=== Install hooks ==="
if [ -f scripts/pre-commit ]; then
    cp scripts/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "pre-commit hook installed"
fi

echo "=== Setup complete ==="
