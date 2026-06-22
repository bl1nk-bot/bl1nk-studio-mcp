#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code on the web environment
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# ── Node version check ──────────────────────────────────────────────────────
NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo "0")
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "[session-start] ERROR: Node >=22 required (found $NODE_MAJOR)" >&2
  exit 1
fi

# ── pnpm bootstrap ──────────────────────────────────────────────────────────
# Use corepack so the exact version in packageManager field is respected
if ! corepack enable pnpm >/dev/null 2>&1; then
  echo "[session-start] WARN: corepack enable failed; trying fallback installer" >&2
fi

if ! corepack prepare pnpm@11.8.0 --activate >/dev/null 2>&1 \
  && ! npm install -g pnpm@11.8.0 >/dev/null 2>&1; then
  echo "[session-start] ERROR: unable to bootstrap pnpm@11.8.0 via corepack or npm" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[session-start] ERROR: pnpm is not available after bootstrap" >&2
  exit 1
fi

# ── Install workspace dependencies ──────────────────────────────────────────
# --prefer-offline avoids redundant network requests on cached layers
pnpm install --prefer-offline --frozen-lockfile 2>/dev/null \
  || pnpm install --prefer-offline  # fallback if lockfile is slightly out of sync

# ── Persist useful env vars for the session ────────────────────────────────
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$PWD/node_modules/.bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

echo "[session-start] Setup complete."
