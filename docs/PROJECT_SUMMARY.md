# PROJECT_SUMMARY.md — bl1nk-visual-mcp

> Project history and high-level milestones
> Last updated: 2026-06-22

---

## Project History

### v3.0.0 (Current) — "Restoration Sync"

- Consolidated mobile-first-layout, Vercel config fixes, and restoration feature into `feature/restoration-sync`.
- pnpm upgraded to 11.8.0.
- Cleaned up duplicate/legacy branches and orphaned documentation.

### v3.0.0 — "Monorepo Consolidation"

- Migrated from separate repositories to a pnpm monorepo structure.
- Packages:
  - `core`: main MCP server (Node.js)
  - `desktop`: desktop client using Tauri 2.0 + React
  - `ai-ide`: web-based editor using Vite + React
  - `ui`: shared React UI shell
  - `book`: Next.js book publishing app
  - `sync`: GitHub to Notion synchronization tool
  - `support-agent`: Next.js support chat app
- 16 MCP tools (11 granular, 4 legacy, 1 standalone).
- Exa AI integration for external story research.
- Comprehensive 3-act structure validation (50+ rules).

### v2.0.0 — "Granular Tools & Better UX"

- Split monolithic tools into granular operations (`analyze_story`, `export_*`).
- Introduced Mermaid diagram shapes based on event importance.
- Added Canvas JSON export for Obsidian integration.

### v1.0.0 — "Initial Release"

- Basic story text analysis.
- Mermaid diagram generation.
- Three-act structure detection.

---

## Active Goals

1. Merge `feature/restoration-sync` into `main` (PR #90).
2. Resolve remaining GitHub security advisories.
3. Continue integration between MCP server and UI clients.

---

## Maintenance Status

| Package | Status |
|---------|--------|
| `@bl1nk/core` | Active |
| `desktop` | Active |
| `ai-ide` | Active |
| `ui` | Active |
| `book` | In development |
| `sync` | Active |
| `support-agent` | Active |
| `craft-blog-cms` | Removed / archived |
