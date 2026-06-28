# AGENTS.md — bl1nk-visual-mcp

This is the consolidated reference for all AI agents (Gemini, Qwen, Claude, and others). It contains the core project information, commands, structure, and coding guidelines.

---

## 🏗️ Project Overview

**bl1nk-visual-mcp** is a production-ready **MCP server** for structured story analysis, planning, and optimization. It converts natural-language story text into structured **StoryGraph JSON** and provides 16 tools for visualization and analysis.

### Core Mission

- Convert narrative input into structured StoryGraph JSON
- Validate story structure using three-act framework
- Provide actionable recommendations for improvement
- Export in multiple formats (Mermaid, Canvas, Dashboard, Markdown, JSON)

---

## 🚀 Building and Running

### Quick Commands

\`\`\`bash
npm run build          # esbuild → dist/index.js
npm run build:tsc      # Type-check only (no emit)
npm run dev            # Watch-mode rebuild
npm run start          # Run bundled server
npm test               # Run all vitest tests
npm run test -- -t "test name"  # Single test
npm run check          # Biome lint + format (auto-fix)
\`\`\`

### Hidden Build Commands

- \`node scripts/build.js build\` - Build with proper status reporting
- \`node scripts/build.js check\` - Quality checks with logging
- Build must run from \`packages/core/\` directory

---

## 📂 Project Structure

\`\`\`
packages/core/    # Core MCP Server & Story Analysis
  src/
    index.ts            # MCP server entry, tool registration, Zod schemas
    tools/              # Tool definitions & executors
    exporters/          # Output formatters (mermaid, canvas, dashboard, markdown)
    analyzer.ts         # Story text → StoryGraph builder
    validators.ts       # Structural validation logic
    types.ts            # TypeScript interfaces (StoryGraph, Character, etc.)
  tests/                # Integration tests
packages/sync/    # GitHub webhook → Notion sync
packages/desktop/ # Desktop app (React + Tauri)
packages/ide/     # Web IDE (Vite + React)
packages/ui/      # Unified React UI shell
packages/book/    # Book publishing platform (development)
packages/support/ # Support chat app (Next.js)
\`\`\`

---

## 🛠️ MCP Tool System (16 Tools)

### Granular Tools (11 — source of truth)

| Tool | Purpose |
|------|---------|
| \`analyze_story\` | Parse story text → StoryGraph |
| \`export_mermaid\` | Generate Mermaid diagram |
| \`export_canvas\` | Generate Canvas JSON |
| \`export_dashboard\` | Generate HTML dashboard |
| \`export_markdown\` | Generate Markdown document |
| \`export_mcp_ui_dashboard\` | Generate MCP-UI dashboard |
| \`validate_story_structure\` | Validate structure (50+ rules) |
| \`extract_characters\` | Extract character info |
| \`extract_conflicts\` | Extract conflict info |
| \`build_relationship_graph\` | Build relationship graph |
| \`exa_search_story\` | External story research |

### Legacy & Standalone Tools

| Tool | Purpose |
|------|---------|
| \`search_entries\` | Entity extraction with templates |
| \`validate_story\` | Quick validation from text |
| \`generate_artifacts\` | All formats at once |
| \`sync_github\` | Push to GitHub (not implemented) |

---

## 📋 Code Style & Standards

- **ESM imports**: Use `.js` extension: `import { x } from './module.js'`
- **Type-only imports**: `import type { x } from './types.js'`
- **Formatting**: Biome handles everything — run `npm run check`
- **TypeScript**: `strict: true`, no `any`, prefer `unknown`
- **Naming**: camelCase variables, PascalCase types, UPPER_SNAKE constants
- **Error handling**: `unknown` + `instanceof Error`, never swallow exceptions
- **Zod schemas**: Use `.describe()` on input fields, `.default()` for optional

## 🔧 Monorepo Tooling Learnings

- `pnpm-workspace.yaml` is YAML, not JSON — scripts must parse it with line-by-line regex or a YAML parser, never `JSON.parse`
- `.mcp.json` and `mcp.json` use different variable conventions (`${extensionRoot}` vs `${extensionPath}`); normalize before comparison or tool generation
- `manifest-source.json` + `gemini-extension.json` + `qwen-extension.json` define the canonical tool list; they intentionally overlap, so listing scripts must deduplicate by `source:name`
- Root `package.json` name `bl1nk-visual-mcp-monorepo` is intentionally unscoped; scripts checking for `@bl1nk/*` scope should warn, not fail
- `findPackageJsons()` must gracefully handle directories without `package.json` rather than crashing on undefined version fields
- `packages/ui` was an empty directory with no `package.json`; orphan package dirs should be surfaced as warnings or cleaned up, not silently included in version audits

---

## 🧠 Operational Guidelines (MANDATORY)

1. **อ่าน TODO.md ก่อนเริ่มทำงานทุกครั้ง** — `TODO.md` คือ source of truth สำหรับงานทั้งหมด
2. **อัปเดต TODO.md ทุกครั้งที่จบงาน** — เปลี่ยน `[ ]` → `[x]` หรือ `[~]` ตามสถานะ
3. **[CRITICAL SAFEGUARD]**
   - **DO NOT** assume "clear" or "sort" means "delete". "Clear" = "Finalize and Organize".
   - **DO NOT** use destructive commands (`git branch -D`, `rm -rf`, etc.) without per-item confirmation.
   - **MUST** list all items and ask for confirmation "one by one" before taking action.
4. **AI Memory Management**: AI has no persistent memory - context is the brain.

5. **Prevent Recurrence**: Record all errors, solutions, and learnings in this file or siblings.
6. **No Long-Term Memory**: All decisions based on documented learnings, not implicit knowledge.

---

## 🔗 Related Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/TOOL_MAPPING.md](docs/TOOL_MAPPING.md) - Complete tool mapping
- [TODO.md](TODO.md) - Current tasks and project status
