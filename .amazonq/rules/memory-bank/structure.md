# Project Structure — bl1nk-visual-mcp

## Root Layout

```
visual-story-extension/
├── src/                    # Root-level source (shared types, analyzers, validators)
│   ├── analyzer.ts         # Story text → StoryGraph core logic
│   ├── types.ts            # Shared TypeScript interfaces (StoryGraph, Character, etc.)
│   ├── validators.ts       # 3-act structure validation logic
│   └── exporters/          # Root-level exporter variants (dashboard, mcp-ui-dashboard)
├── api/
│   └── mcp.ts              # Vercel HTTP endpoint wrapping MCP tools
├── tests/                  # Integration tests + test fixtures
│   ├── test-input/         # Sample story markdown files (Thai fiction chapters)
│   ├── test-output/        # Expected output: characters/, locations/, scenes/
│   ├── index.test.ts       # Main integration test suite
│   └── exporters.test.ts   # Exporter-specific tests
├── packages/               # Monorepo sub-packages
│   ├── bl1nk/              # Core MCP server (@bl1nk/core)
│   ├── github-sync/        # GitHub → Notion sync service
│   ├── desktop/          # Desktop UI (React + Tauri)
│   └── craft-blog-cms/     # ⚠️ Orphaned Next.js CMS
├── docs/                   # Architecture, tool mapping, project history docs
├── commands/               # CLI command definitions (.toml + .md)
├── skills/                 # AI skill definitions (SKILL.md files)
├── agents/                 # Agent persona definitions
├── scripts/                # Build/validation scripts
└── templates/              # Workflow templates
```

## Core Package: `packages/core/`

```
packages/core/
├── src/index.ts            # MCP server entry point — registers all tools
├── tools/
│   ├── index.ts            # GRANULAR_TOOLS + BL1NK_VISUAL_TOOLS exports (source of truth)
│   ├── execute.ts          # executeGranularTool / executeStoryTool dispatchers
│   ├── search-entries.ts   # searchEntriesTool (legacy)
│   ├── generate-artifacts.ts # generateArtifactsTool (legacy)
│   └── validate-story-structure.ts
├── exporters/
│   ├── mermaid.ts          # → Mermaid diagram markdown
│   ├── canvas.ts           # → Obsidian/React Flow Canvas JSON
│   ├── dashboard.ts        # → HTML dashboard (Chart.js + Tailwind)
│   ├── markdown.ts         # → Structured Markdown
│   ├── mcp-ui-dashboard.ts # → MCP-UI compatible HTML
│   └── json.ts             # → Raw JSON export
├── analyzer.ts             # Story text → StoryGraph (LLM-backed)
├── validators.ts           # Structural validation rules
├── types.ts                # TypeScript interfaces
├── exa-search.ts           # Exa AI external search integration
├── mcp-handler.ts          # MCP request/response handler
├── server.ts               # HTTP server wrapper
├── plugin.ts               # Plugin registration
├── notebook/               # Notebook executor (Jupyter-style)
├── utils/
│   ├── auth.ts             # JWT/auth utilities (jose + Upstash)
│   ├── csv-generator.ts    # CSV output helper
│   └── error-handler.ts    # Centralized error handling
└── known/
    └── entities.json       # Known entity reference data
```

## Key Architectural Patterns

### Data Flow

```
Story Text Input
    ↓
analyzer.ts (LLM via @google/genai)
    ↓
StoryGraph JSON (types.ts)
    ↓
validators.ts ──→ Validation Report
    ↓
exporters/* ──→ Mermaid / Canvas / HTML / Markdown / JSON
```

### Tool Registration Pattern

- `GRANULAR_TOOLS` array in `tools/index.ts` = source of truth for 11 active tools
- `BL1NK_VISUAL_TOOLS` array = 4 legacy tools kept for backward compatibility
- `executeGranularTool()` dispatches by tool name to specific exporter/analyzer functions
- MCP server in `src/index.ts` registers both arrays at startup

### Dual Source Structure

Root `src/` mirrors `packages/core/` for some files — root versions appear to be the canonical/shared source while `packages/core/` contains the deployed package versions.

### API Layer

`api/mcp.ts` wraps the same tool logic as an HTTP endpoint deployable to Vercel, enabling web access without an MCP client.

## Sub-Package Relationships

- `packages/core/` — standalone, no dependency on other packages
- `packages/sync/` — standalone webhook service
- `packages/desktop/` — desktop UI, may consume StoryGraph JSON from bl1nk
- `packages/craft-blog-cms/` — isolated, no integration with other packages
