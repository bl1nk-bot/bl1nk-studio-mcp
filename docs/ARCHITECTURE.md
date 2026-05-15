# ARCHITECTURE.md — bl1nk-visual-mcp

> System architecture and dataflow diagrams
> Last updated: 2026-05-14

---

## Layer Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONSUMERS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  bl1nk-desktop│  │  bl1nk-ide   │  │   AI Agents (MCP)    │  │
│  │   (Tauri)    │  │   (Web)      │  │  (Claude, Qwen, etc) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                MCP SERVER (bl1nk-core)                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   TOOL REGISTRATION                       │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ GRANULAR_TOOLS  │  │  BL1NK_VISUAL_TOOLS (legacy) │   │   │
│  │  │   (11 tools)    │  │       (4 tools)              │   │   │
│  │  └────────┬────────┘  └──────────────┬───────────────┘   │   │
│  │           │                          │                    │   │
│  │  ┌────────▼──────────────────────────▼───────────────┐   │   │
│  │  │              Schemas (Zod)                         │   │   │
│  │  └──────────────────────┬───────────────────────────┘   │   │
│  └─────────────────────────┼───────────────────────────────┘   │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CORE LOGIC & EXPORTERS                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  analyzer.ts │  │ validators.ts│  │      exporters/      │  │
│  │ (Parser)     │  │ (50+ rules)  │  │ (Mermaid, Canvas, ..)│  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dependency Graph

```
bl1nk-visual-mcp-monorepo (root)
├── packages/bl1nk-core (v3.0.0)
│   ├── Core MCP server with story analysis and export tools
│   └── Shared logic for all consumers
│
├── packages/bl1nk-desktop
│   ├── Desktop UI for story visualization
│   └── React + Vite + Tauri 2.0
│
├── packages/bl1nk-ide
│   ├── Web IDE for story writing
│   └── Vite + React 19
│
└── packages/bl1nk-sync
    └── GitHub webhook → Notion sync
```

---

## Tool Registration Flow

1. **Server Start**: `packages/bl1nk-core/src/index.ts`
2. **Register Granular**: Loops 11 tools with full Zod schemas.
3. **Register Legacy**: Loops 4 tools with empty schemas for backward compat.
4. **Register Standalone**: Adds `search_entries` with template support.
5. **Connect**: Stdio/SSE transport.

---

## Consumer Integration

### 1. AI Agents

Connect directly to the MCP server to analyze text, validate structure, and generate visualizations (Mermaid/Markdown) inline.

### 2. Desktop/IDE

Consume **StoryGraph JSON** output from the server to render interactive React components:

- **MermaidViewer**: Renders the diagram string.
- **ActDistributionChart**: Visualizes act balance.
- **ValidationPanel**: Shows structural issues.

---

## File Reference

| File | Purpose |
|------|---------|
| `packages/bl1nk-core/src/index.ts` | Entry point & Tool registration |
| `packages/bl1nk-core/src/analyzer.ts` | Narrative parsing logic |
| `packages/bl1nk-core/src/validators.ts` | 3-act structure validation |
| `packages/bl1nk-core/src/exporters/` | Output formatters |
