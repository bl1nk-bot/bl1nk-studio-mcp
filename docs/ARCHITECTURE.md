# Project Architecture & Dataflow

> System architecture and dataflow diagrams
> Last updated: 2026-05-14

---

## Layer Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONSUMERS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  desktop│  │  bl1nk-ide   │  │   AI Agents (MCP)    │  │
│  │   (Tauri)    │  │   (Web)      │  │  (Claude, Qwen, etc) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                MCP SERVER (core)                           │
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

## Agent Skills Architecture

Skills are modular capabilities that extend agent functionality. They are centralized in the root `skills/` directory.

### Three Levels of Skill Loading

1.  **Level 1: Metadata (Always loaded)**: YAML frontmatter in `SKILL.md` (Name, Description).
2.  **Level 2: Instructions (Triggered)**: Procedural knowledge and workflows in `SKILL.md`.
3.  **Level 3: Resources (As needed)**: Scripts, templates, and reference materials.

| Level | When Loaded | Token Cost | Content |
| :--- | :--- | :--- | :--- |
| **1: Metadata** | At startup | ~100 tokens | YAML frontmatter |
| **2: Instructions** | On trigger | < 5k tokens | SKILL.md body |
| **3: Resources** | As needed | Unlimited | Bundled files/scripts |

## Dependency Graph

```
bl1nk-visual-mcp-monorepo (root)
├── packages/core (v3.0.0)
│   ├── Core MCP server with story analysis and export tools
│   └── Shared logic for all consumers
│
├── packages/desktop
│   ├── Desktop UI for story visualization
│   └── React + Vite + Tauri 2.0
│
├── packages/ide
│   ├── Web IDE for story writing
│   └── Vite + React 19
│
└── packages/sync
    └── GitHub webhook → Notion sync
```

---

## Tool Registration Flow

1. **Server Start**: `packages/core/src/index.ts`
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
| `packages/core/src/index.ts` | Entry point & Tool registration |
| `packages/core/src/analyzer.ts` | Narrative parsing logic |
| `packages/core/src/validators.ts` | 3-act structure validation |
| `packages/core/src/exporters/` | Output formatters |
