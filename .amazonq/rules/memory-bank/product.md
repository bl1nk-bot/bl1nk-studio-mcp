# Product Overview — bl1nk-visual-mcp

## Purpose
A monorepo providing an AI-powered story analysis and organization system. It parses narrative text into structured StoryGraph JSON, then exports that data into multiple formats (Mermaid diagrams, Canvas JSON, HTML dashboards, Markdown documents). Designed to help writers and editors visualize story structure, character relationships, and plot arcs.

## Core Value Proposition
- Convert raw story text → structured StoryGraph JSON via LLM analysis
- Export story data to 6+ formats for different workflows (Obsidian, React Flow, HTML, Markdown)
- Expose all functionality as MCP (Model Context Protocol) tools for AI assistant integration
- Validate story structure against 3-act narrative frameworks

## Key Features

### MCP Server (`packages/core/`)
- 16 MCP tools total: 11 granular + 4 legacy + 1 search
- `analyze_story` — core tool: text → StoryGraph JSON
- Export tools: `export_mermaid`, `export_canvas`, `export_dashboard`, `export_markdown`, `export_mcp_ui_dashboard`
- Validation: `validate_story_structure` (3-act structure check)
- Extraction: `extract_characters`, `extract_conflicts`, `build_relationship_graph`
- External research: `exa_search_story` (Exa AI integration)
- Legacy: `search_entries`, `validate_story`, `generate_artifacts`, `sync_github`

### API Layer (`api/mcp.ts`)
- Vercel-deployable HTTP endpoint wrapping MCP tools
- Enables web-based access to story analysis without MCP client

### Desktop App (`packages/desktop/`)
- React + Vite + Tauri desktop application
- StoryGraph visualization, character relationship graph, timeline view, Markdown preview

### GitHub Sync (`packages/sync/`)
- Webhook handler for GitHub push events
- Syncs Markdown/CSV files to Notion databases automatically

### Blog CMS (`packages/craft-blog-cms/`) — ⚠️ Orphaned
- Next.js blog/CMS with no integration to core architecture
- Candidate for archival or separate repo

## Target Users
- Fiction writers wanting structural analysis of their stories
- Editors reviewing narrative arc and character consistency
- AI assistant users integrating story tools via MCP protocol
- Developers building story-aware applications

## Use Cases
1. Paste story chapter → get character list, conflict map, scene breakdown
2. Validate story against 3-act structure rules
3. Export story graph to Obsidian Canvas for visual editing
4. Research similar stories via Exa AI search
5. Sync story files from GitHub to Notion for team collaboration
