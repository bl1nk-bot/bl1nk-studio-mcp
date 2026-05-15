# PROJECT_SUMMARY.md — bl1nk-visual-mcp

> Project history and high-level milestones
> Last updated: 2026-05-14

---

## 📅 Project History

### v3.0.0 (Current) - "Monorepo Consolidation"

- **Migration**: Moved from separate repositories to a pnpm monorepo structure.
- **Packages**:
  - `bl1nk-core`: The main MCP server (Node.js).
  - `bl1nk-desktop`: Desktop client using Tauri 2.0 + React.
  - `bl1nk-ide`: Web-based editor using Vite + React 19.
  - `bl1nk-sync`: GitHub to Notion synchronization tool.
- **Major Features**:
  - 16 MCP tools (11 granular, 4 legacy, 1 standalone).
  - Multi-theme Dashboard (Classic & Modern).
  - Exa AI integration for external story research.
  - Comprehensive 3-act structure validation (50+ rules).

### v2.0.0 - "Granular Tools & Better UX"

- Split monolithic tools into granular operations (`analyze_story`, `export_*`).
- Introduced Mermaid diagram shapes based on event importance.
- Added Canvas JSON export for Obsidian integration.

### v1.0.0 - "Initial Release"

- Basic story text analysis.
- Mermaid diagram generation.
- Three-act structure detection.

---

## 🎯 Active Goals

1. **Stability**: Achieving zero warnings and resolving Vercel deployment issues.
2. **Integration**: Strengthening the connection between the MCP server and UI clients (Desktop/IDE).
3. **Capability**: Expanding the story analysis engine to handle deeper narrative patterns.

---

## 🛠️ Maintenance Status

- **@bl1nk-core**: Active
- **bl1nk-desktop**: Active
- **bl1nk-ide**: Active
- **bl1nk-sync**: Active
- **bl1nk-book**: In development
- **craft-blog-cms**: Orphaned/Legacy
