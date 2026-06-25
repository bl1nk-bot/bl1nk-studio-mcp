# @bl1nk/core

MCP Server สำหรับวิเคราะห์ story text และสร้าง StoryGraph JSON

## Overview

`@bl1nk/core` เป็น [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server ที่ให้ AI tools สำหรับ parse, validate, และ export โครงสร้างเรื่องราว รองรับ 16 tools ครอบคลุมตั้งแต่การวิเคราะห์ไปจนถึงการ export ในหลายรูปแบบ

## Tools

### Granular Tools (แนะนำ)

| Tool | Description |
|------|-------------|
| `analyze_story` | Parse story text → StoryGraph JSON |
| `export_mermaid` | Export Mermaid diagram markdown |
| `export_canvas` | Export Canvas JSON (Obsidian / React Flow) |
| `export_dashboard` | Export HTML dashboard (Chart.js + Tailwind) |
| `export_markdown` | Export structured Markdown document |
| `export_mcp_ui_dashboard` | Export MCP-UI compatible HTML dashboard |
| `validate_story_structure` | Validate 3-act structure |
| `extract_characters` | Extract character data from StoryGraph |
| `extract_conflicts` | Extract conflict data from StoryGraph |
| `build_relationship_graph` | Build character relationship graph |
| `exa_search_story` | External story research via Exa AI |

### Legacy Tools

| Tool | Description |
|------|-------------|
| `search_entries` | Extract entities from story text |
| `validate_story` | Quick validation from raw text |
| `generate_artifacts` | Generate all export formats at once |

## Tech Stack

- **Runtime:** Node.js 22+
- **Build:** esbuild (ESM bundle)
- **Language:** TypeScript 6
- **Auth:** JOSE (JWT), Upstash Redis (rate limiting)
- **Templates:** Handlebars, Nunjucks

## Usage

```bash
# Build
pnpm --filter @bl1nk/core run build

# Start MCP server
pnpm --filter @bl1nk/core run start

# Development (watch mode)
pnpm --filter @bl1nk/core run dev

# Tests
pnpm --filter @bl1nk/core run test
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `EXA_API_KEY` | Exa AI API key (for `exa_search_story`) |
