# AGENTS.md — sync Package

## Purpose
- GitHub webhook → Notion sync pipeline

## Key Learnings
- Bundled with esbuild to single `dist/index.js`, not TypeScript emit
- Uses `gray-matter` for frontmatter parsing and `csv-parse` for bulk imports
- Depends on `@bl1nk/core` workspace package and external Notion/GitHub SDKs
- Entry point is `dist/index.js` (not `src/index.ts`) for runtime

## Commands
- `pnpm run build` — esbuild bundle to dist/index.js
- `pnpm run watch` — esbuild --watch
- `pnpm run start` — run dist/index.js with node
- `pnpm run typecheck` — tsc --noEmit
