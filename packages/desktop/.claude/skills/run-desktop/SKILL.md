---
name: run-desktop
description: Run, start, build, screenshot, or test the packages/desktop Vite+React app (Visual Story Planner web layer). Drives all 4 views (Editor, Graph, Timeline, Insights) headlessly with Playwright.
---

# Run desktop (packages/desktop)

The `packages/desktop` package is a Vite 8 + React 19 + Tailwind CSS 4 web app that serves as the UI layer for a Tauri 2 desktop app. The agent path drives it with Playwright Core against the Vite dev server — no Tauri binary needed to test the web layer.

The smoke driver is `.claude/skills/run-desktop/smoke.mjs`. It launches a headless Chromium, navigates all 4 views, takes screenshots, and exits 0 on success.

## Prerequisites

```bash
# xvfb-run (for headless display)
apt-get install -y xvfb

# playwright-core must be installed at monorepo root
pnpm add -w playwright-core
```

System Chromium path (already present in this container):

```
/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

If that path is missing, check: `find /opt -name chrome -type f 2>/dev/null | head -3`

## Build

```bash
# Install all workspace dependencies from repo root
pnpm install

# Optional: type-check
pnpm --filter @bl1nk/desktop run typecheck
```

## Run (agent path)

Start the Vite dev server in the background, then run the smoke driver from the **repo root** (required for Node to resolve `playwright-core`):

```bash
# 1. Start dev server (background)
cd /path/to/bl1nk-studio-mcp/packages/desktop
pnpm dev --port 5173 &
sleep 3

# 2. Run the smoke driver (from repo root)
cd /path/to/bl1nk-studio-mcp
xvfb-run --server-args="-screen 0 1280x800x24" \
  node packages/desktop/.claude/skills/run-desktop/smoke.mjs \
  --out=packages/desktop/.claude/skills/run-desktop
```

Screenshots land at:

- `.claude/skills/run-desktop/editor.png`
- `.claude/skills/run-desktop/graph.png`
- `.claude/skills/run-desktop/timeline.png`
- `.claude/skills/run-desktop/insights.png`

Expected output on success:
```
Title: Visual Story Planner
✓ editor → ...
✓ graph → ...
✓ timeline → ...
Insights heading: Insights
✓ insights → ...

✅ All 4 views verified
```

## Run (human path)

```bash
cd packages/desktop
pnpm dev
```

Opens `http://localhost:5173` in browser. Not useful headless.

To build the Tauri desktop binary (requires Rust + Tauri CLI):

```bash
cd packages/desktop
pnpm tauri build
```

## Test

```bash
# Type-check only (no unit tests exist yet)
pnpm --filter @bl1nk/desktop run typecheck
```

## Gotchas

- **`playwright-core` must resolve from the repo root**, not from `packages/desktop/`. Run `node` from the repo root or add `playwright-core` to `packages/desktop/package.json` devDependencies. `chromium-cli` is NOT available in this container.

- **`playwright install` may fail** — apt repo issues in the container. Don't run it. Use the pre-installed browser at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (hardcoded in `smoke.mjs`).

- **`packages/desktop/src/index.css` was missing** after the `packages/ui` → `packages/desktop` rename. `src/main.tsx` imports `"./index.css"` and Vite fails on startup without it. The file was recreated with `@import "tailwindcss"` and base body styles — if the app fails to start with a module-not-found on `index.css`, that file was lost again.

- **Tailwind CSS 4 is not processed** by the Vite dev server in headless smoke runs — screenshots show unstyled content (buttons run together as `EditorGraphTimelineInsights`). This is expected; the DOM structure and navigation are correct. Styling requires the PostCSS/Lightning CSS plugin configured for production builds.

- **`xvfb-run` is required** — running Chrome headless in this container without a virtual display fails with `--no-sandbox --disable-gpu`. The flags in `smoke.mjs` plus `xvfb-run` together work reliably.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Cannot find package 'playwright-core'` | Run `node` from repo root, not from `packages/desktop/` |
| `net::ERR_CONNECTION_REFUSED` | Dev server not started yet; `sleep 3` after `pnpm dev &` |
| `Timeout waiting for h1` | App not rendering — check browser console via `page.on('console', ...)` |
| `Cannot find module './index.css'` (Vite) | Recreate `packages/desktop/src/index.css` with `@import "tailwindcss"` |
| Chrome crash / SIGSEGV | Missing `xvfb-run`; add it before `node smoke.mjs` |
