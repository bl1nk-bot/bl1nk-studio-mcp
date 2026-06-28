# Tool Mapping — bl1nk-visual-mcp

> Source of truth for the 16 MCP tools exposed by `@bl1nk/core`.
> Last updated: 2026-06-22

---

## Overview

The MCP server registers 16 tools across three categories:

- **11 Granular Tools** — source of truth, recommended for new clients
- **4 Legacy Tools** — backward compatibility wrappers
- **1 Standalone Tool** — `search_entries` with template support

---

## Granular Tools (11)

| Tool | Purpose | Input Highlights | Output |
|------|---------|------------------|--------|
| `analyze_story` | Parse story text into StoryGraph JSON | `text`: story content | `StoryGraph` |
| `validate_story_structure` | Validate StoryGraph against 3-act rules | `graph`: StoryGraph | `ValidationResult` |
| `extract_characters` | Extract character list from StoryGraph | `graph`: StoryGraph | character array |
| `extract_conflicts` | Extract conflict list from StoryGraph | `graph`: StoryGraph | conflict array |
| `build_relationship_graph` | Build character relationship graph | `graph`: StoryGraph | relationship array + stats |
| `export_mermaid` | Export StoryGraph as Mermaid diagram | `graph`: StoryGraph | Mermaid markdown |
| `export_canvas` | Export StoryGraph as Canvas JSON | `graph`: StoryGraph | Obsidian/React Flow JSON |
| `export_dashboard` | Export StoryGraph as HTML dashboard | `graph`: StoryGraph | HTML (Chart.js + Tailwind) |
| `export_mcp_ui_dashboard` | Export StoryGraph as MCP-UI dashboard | `graph`: StoryGraph | MCP-UI compatible HTML |
| `export_markdown` | Export StoryGraph as structured Markdown | `graph`: StoryGraph | Markdown document |
| `exa_search_story` | External story research via Exa AI | `query`: search string | search results |

---

## Legacy Tools (4)

| Tool | Purpose | Status |
|------|---------|--------|
| `search_entries` | Extract entities from raw story text | Deprecated, use granular tools |
| `validate_story` | Quick validation from text input | Deprecated, use `validate_story_structure` |
| `generate_artifacts` | Generate all formats at once | Deprecated, prefer granular exports |
| `sync_github` | Push files to GitHub | Not implemented |

---

## Registration Flow

1. `packages/core/src/tools/server.ts` creates an `McpServer`
2. `registerBl1nkTools` loops `GRANULAR_TOOLS` and binds Zod schemas + executors
3. Legacy `BL1NK_VISUAL_TOOLS` are registered with empty schemas for compat
4. `search_entries` is registered as a standalone tool with its own schema
5. Consumers connect via stdio or SSE transport

---

## Consumer Mapping

| Consumer | Tools Used | Notes |
|----------|------------|-------|
| AI Agents (Claude, Qwen, etc.) | All granular tools | Primary API surface |
| `desktop` | `analyze_story`, exports, validation | Tauri + React UI |
| `ai-ide` | `analyze_story`, note/task integration | Vite + React IDE |
| `ui` | dashboard, editor, graph exports | Shared React shell |
| `sync` | — | GitHub webhook → Notion sync |
