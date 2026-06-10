# Technology Stack — bl1nk-visual-mcp

## Languages & Runtimes
- TypeScript 5.3+ (strict mode, ES2022 target, ESNext modules)
- Node.js (ESM — `"type": "module"` throughout)
- Rust (Tauri desktop backend via Cargo)

## Module System
- All packages use ES Modules (`"type": "module"`)
- Import paths use `.js` extensions even for `.ts` source files (Node ESM convention)
- `moduleResolution: "bundler"` in root tsconfig

## Build Tools
- esbuild — primary bundler for `packages/bl1nk/` (single-file bundle, `--packages=bundle`)
- `build.mjs` — custom Node.js build script for web template assets
- tsc — type checking only (`build:tsc` script), not used for emit in bl1nk package
- Vite — bundler for `packages/tauri-app/` (React frontend)

## Package Manager
- pnpm with workspaces (`pnpm-workspace.yaml`)
- Root `package.json` orchestrates with `pnpm -r run <script>`

## Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.27.1 | MCP server/tool protocol |
| `@google/genai` | ^1.41.0 | Gemini LLM for story analysis |
| `zod` | ^3.22.4 | Runtime schema validation |
| `fs-extra` | ^11.3.4 | Enhanced file system operations |
| `handlebars` | ^4.7.8 | Template rendering (bl1nk package) |
| `jose` | ^5.9.6 | JWT auth (bl1nk package) |
| `@upstash/ratelimit` | ^2.0.5 | Rate limiting (bl1nk package) |
| `@upstash/redis` | ^1.34.3 | Redis client for rate limiting |

## Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@biomejs/biome` | 1.9.4 | Linter + formatter (replaces ESLint/Prettier) |
| `vitest` | ^4.0.18 | Test runner |
| `esbuild` | ^0.27.5 | Bundler |
| `markdownlint-cli2` | ^0.21.0 | Markdown linting |
| `typescript` | ^5.3.3 | Type checking |

## Testing
- Vitest with `globals: true`, `environment: 'node'`
- Test files: `src/**/*.test.ts`, `tests/**/*.test.ts`, `packages/bl1nk/**/*.test.ts`
- Coverage: v8 provider, reporters: text + json + html
- Pre-test hook runs build (`"pretest": "npm run build"` in bl1nk package)

## Linting & Formatting
- Biome (`biome format --write .` / `biome check --apply .`) — single tool for both
- markdownlint-cli2 for `.md` files
- `.editorconfig` for editor-level consistency

## Deployment
- MCP server: `node dist/index.js` (esbuild bundle)
- API endpoint: Vercel (`vercel.json` present, `api/mcp.ts` as serverless function)
- Desktop: Tauri (`npm run tauri:dev` / `tauri build`)

## CI/CD (`.github/workflows/`)
- `build.yml` — build verification
- `test.yml` — run vitest
- `lint.yml` — biome + markdownlint
- `format.yml` — format check
- `release.yml` — release automation
- `tool-validation.yml` — MCP tool schema validation

## Environment Variables
```bash
# packages/bl1nk/.env
EXA_API_KEY=          # Exa AI search API key
GOOGLE_API_KEY=       # Gemini API key (for @google/genai)

# packages/github-sync/.env
GITHUB_WEBHOOK_SECRET=
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

## Key Commands
```bash
# Root (all packages)
pnpm install
pnpm run build
pnpm run test
pnpm run lint

# packages/bl1nk
npm run build        # esbuild bundle → dist/index.js
npm start            # build + run MCP server
npm run dev          # esbuild watch mode
npm test             # build + vitest run

# packages/tauri-app
npm run tauri:dev    # Vite + Tauri dev mode
```
