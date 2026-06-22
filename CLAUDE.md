# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install
pnpm install

# Lint (Biome + markdownlint) — runs in CI
pnpm run lint
pnpm run lint:fix          # auto-fix both

# Typecheck all packages
pnpm -r run typecheck

# Tests
pnpm -r run test           # all packages
pnpm run test:audit        # checks templates in tests/test-output/ for unrendered {{}} tags

# Single package
pnpm --filter @bl1nk/core run build
pnpm --filter @bl1nk/core run test
pnpm --filter @bl1nk/core run typecheck

# Run a single test file (from package dir)
pnpm vitest run src/foo.test.ts

# Build all
pnpm -r run build

# MCP server helpers
pnpm run mcp:build         # esbuild bundle
pnpm run mcp:check         # validate output
```

## Architecture

pnpm monorepo (`packages/*`), all ESM (`"type": "module"`), TypeScript 6, Node ≥22.

### Packages

| Package | Tech | Role |
|---------|------|------|
| `@bl1nk/core` | esbuild, MCP SDK, Zod | MCP server — story analysis engine |
| `@bl1nk/desktop` | Vite 8, React 19, Tailwind 4, Tauri 2 | Desktop app web layer (4 views) |
| `@bl1nk/ide` | Vite, React 18 | Web IDE (notes, tasks, canvas, multi-view) |
| `@bl1nk/book` | Next.js, Craft API | Article workspace backed by Craft.do |
| `@bl1nk/support` | Next.js, Vercel AI SDK | Streaming chat support agent (edge runtime) |
| `@bl1nk/sync` | Node.js native HTTP | GitHub push webhook → Notion database sync |

### `@bl1nk/core` — MCP Story Engine

Central type is `StoryGraph` (defined in `src/types.ts`), built from modular Zod schemas:

```
src/schemas/
  entities.ts   → Character, Relationship
  backbone.ts   → EventNode
  logic.ts      → Conflict, Causality, PlotThread
  narrative.ts  → Theme, Style, Outline
```

Tools are split into **11 granular** (`GRANULAR_TOOLS` — source of truth) and **4 legacy** (`BL1NK_VISUAL_TOOLS` — kept for backward compat). Both sets are registered via `registerBl1nkTools(server, options?)` in `src/tools/server.ts`. Tool execution goes through `executeGranularTool` / `executeStoryTool` in `src/tools/execute.ts`. Exporters live in `src/exporters/` (mermaid, canvas, dashboard, markdown, csv).

### `@bl1nk/desktop`

Vite dev server drives the web layer (`pnpm dev` → `localhost:5173`). Tauri wraps it for desktop — Rust/Tauri toolchain only needed for `pnpm tauri build`. The smoke test driver lives at `.claude/skills/run-desktop/smoke.mjs` and requires `xvfb-run` + the pre-installed Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Run it from the repo root (not from the package dir) so `playwright-core` resolves.

### `@bl1nk/book`

Craft.do OAuth integration. `CraftAuthProvider` wraps the app; `CraftApp` renders content. The hooks in `src/lib/craft-api/hooks/` (`useInitialize`, `useDataSource`) manage Craft API state with intentional dependency list overrides (the `// eslint-disable-line react-hooks/exhaustive-deps` comments are deliberate).

### `@bl1nk/support`

Edge runtime Next.js API route (`/api/chat`). Uses Vercel AI SDK's `streamText`. `SandboxManager` and `McpOAuthService` are instantiated at module level (singleton). Agent modes (support/code/planner/debug) are switched at runtime via slash commands parsed by `cli-bridge.ts`.

### `@bl1nk/sync`

Single-file Node.js HTTP server (`src/index.ts`). Verifies HMAC-SHA256 GitHub webhook signatures before processing. Parses `.md` files with `gray-matter` and `.csv` files with `csv-parse`, then upserts to Notion via REST API.

## Linter & Formatter

Biome v2 (`biome.json`) — **tabs**, 80-char line width. All lint rules are `"warn"` level; format diffs are CI errors. Run `pnpm run lint:fix` before pushing to avoid format failures.

Key lint rules to know:

- Unused variables/functions → prefix with `_` (e.g. `_unused`)
- `parseInt` requires radix: `parseInt(x, 10)`
- String concatenation → template literals

markdownlint runs alongside Biome in `pnpm run lint`. Violations that will fail CI:

- MD032: blank lines required around lists
- MD060: fenced code blocks require a language tag (disabled in `packages/core` via `.markdownlint-cli2.jsonc`)

Per-package markdownlint config (`.markdownlint-cli2.jsonc`) does **not** inherit from the root `.markdownlint.json` — add overrides explicitly in each package file.

## CI

GitHub Actions runs: `lint` → `typecheck` → `test:audit` → `test`.

**Known permanent failure**: Vercel deployment always fails because the Vercel dashboard has `rootDirectory: packages/support-agent` (the old name). Must be fixed manually in the Vercel dashboard by changing it to `packages/support`.

## Vercel (packages/support)

Deployed as a Next.js edge app. Requires env vars: `OPENAI_API_KEY`, `KILO_API_KEY`, `CLIENT_ID`, `REDIRECT_URI`, `RESEND_API_KEY`, `SUPPORT_EMAIL`. See `packages/support/.env.example`.
