# bl1nk-visual-mcp Monorepo

ระบบวิเคราะห์และจัดระเบียบเรื่องราว (Story Analysis & Organization System)

> **Version:** 3.0.0 | **Status:** Production Ready

---

## 📦 Packages

### 1. **@bl1nk-core/visual-mcp** (`packages/bl1nk-core/`)

Core MCP Server สำหรับวิเคราะห์ story text และสร้าง StoryGraph JSON

**Tools (16 total):**

#### Granular Tools (11 tools — recommended)

| Category | Tool | Description |
|----------|------|-------------|
| Analysis | `analyze_story` | Parse story text → StoryGraph JSON |
| Export | `export_mermaid` | Mermaid diagram markdown |
| Export | `export_canvas` | Canvas JSON (Obsidian/React Flow) |
| Export | `export_dashboard` | HTML dashboard (Chart.js + Tailwind) |
| Export | `export_markdown` | Structured Markdown document |
| Export | `export_mcp_ui_dashboard` | MCP-UI compatible HTML dashboard |
| Validation | `validate_story_structure` | 3-act structure validation |
| Extract | `extract_characters` | Character data from StoryGraph |
| Extract | `extract_conflicts` | Conflict data from StoryGraph |
| Extract | `build_relationship_graph` | Relationship graph |
| Search | `exa_search_story` | External story research (Exa AI) |

#### Legacy Tools (4 tools — backward compat)

| Tool | Description |
|------|-------------|
| `search_entries` | Extract entities from story text (with templates) |
| `validate_story` | Quick validation from text input |
| `generate_artifacts` | Generate ALL formats at once |
| `sync_github` | Push files to GitHub (not implemented) |

**Usage:**
```bash
cd packages/bl1nk-core
npm run build
npm run start
```

### 2. **@bl1nk/unified-ui** (`packages/bl1nk-unified-ui/`)

Unified Desktop & Web UI (React 19 + Tauri 2) สำหรับเขียนเรื่องราวและวิเคราะห์แบบ Visual

**Features:**
- **Writer (Editor):** Obsidian-style Markdown editor พร้อม live preview
- **Dashboard:** ดูภาพรวมตัวละคร, ความขัดแย้ง และสถิติ
- **Visualizations:** Graph View (Mermaid) และ Interactive Timeline
- **Task Tracker:** ระบบจัดการงานที่เชื่อมโยงกับเนื้อเรื่อง
- **Structural Insights:** ตรวจสอบโครงสร้าง 3-Act อัตโนมัติ

**Usage:**
```bash
cd packages/bl1nk-unified-ui
pnpm run dev         # Web mode
pnpm run tauri:dev   # Desktop mode
```

### 3. **@bl1nk/github-sync** (`packages/bl1nk-sync/`)

GitHub App สำหรับ sync markdown/CSV files ไป Notion อัตโนมัติ

**Features:**
- Webhook handler สำหรับ GitHub push events
- Markdown frontmatter parser
- CSV sync ไป Notion databases
- Relation builder

**Usage:**
```bash
cd packages/bl1nk-sync
npm run build
npm run start
```

### 4. **bl1nk-book** (`packages/bl1nk-book/`) — ⚠️ Development

Book publishing platform (under development)

### 5. **craft-blog-cms** (`packages/craft-blog-cms/`) — ⚠️ Orphaned

Next.js blog/CMS — ไม่มี integration กับ core architecture
**Recommendation:** Archive หรือแยกไป repo อื่น

---

## 🚀 Development

### Install Dependencies
```bash
pnpm install
```

### Build All
```bash
pnpm run build
```

### Test All
```bash
pnpm run test
```

### Develop Individual Package
```bash
cd packages/bl1nk-core
pnpm run dev  # watch mode

cd packages/bl1nk-unified-ui
pnpm run dev         # Web mode
pnpm run tauri:dev   # Desktop mode
```

---

## 📁 Project Structure

```
visual-story-extension/
├── packages/
│   ├── bl1nk-core/               # Core MCP Server & Story Analysis
│   │   ├── src/
│   │   │   ├── index.ts          # MCP server entry, tool registration
│   │   │   ├── tools/            # Tool definitions & executors
│   │   │   ├── exporters/        # Output formatters
│   │   │   └── types.ts          # TypeScript interfaces
│   │   ├── templates/            # Handlebars templates
│   │   └── package.json
│   │
│   ├── bl1nk-unified-ui/         # Unified UI (React 19 + Tauri 2)
│   │   ├── src/
│   │   │   ├── components/       # Dashboard & Editor components
│   │   │   └── store/            # State management
│   │   ├── src-tauri/            # Rust Desktop backend
│   │   └── package.json
│   │
│   ├── bl1nk-sync/               # GitHub → Notion sync
│   │   ├── src/
│   │   └── package.json
│   │
│   └── bl1nk-book/               # Book publishing platform (dev)
```
│
├── commands/                     # Kilo CLI commands (story analysis)
├── agents/                       # Agent configurations
├── tests/                        # Integration tests
├── docs/                         # Documentation (see 📚 Documentation section)
├── TODO.md                       # Project roadmap
├── AGENTS.md                     # Root agent instructions
├── GEMINI.md                     # Gemini AI context
├── CLAUDE.md                     # Claude Code context
├── QWEN.md                       # Qwen AI context
├── package.json                  # Root package (v3.0.0)
├── pnpm-workspace.yaml
└── vitest.config.ts
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture, dataflow diagrams, integration points |
| [`docs/TOOL_MAPPING.md`](docs/TOOL_MAPPING.md) | Complete mapping of all 16 tools (schema, executor, API) |
| [`docs/PROJECT_SUMMARY.md`](docs/PROJECT_SUMMARY.md) | Project history — Phase 1 (Conductor) + Phase 2 (Architecture) |
| [`docs/TAURI-APP.md`](docs/TAURI-APP.md) | Tauri app role and dependencies |
| [`docs/GITHUB-SYNC.md`](docs/GITHUB-SYNC.md) | GitHub sync role and data flow |
| [`docs/CRAFT-BLOG-CMS.md`](docs/CRAFT-BLOG-CMS.md) | Orphaned package decision |
| [`TODO.md`](TODO.md) | Project roadmap and task tracking |
| [`AGENTS.md`](AGENTS.md) | Root agent instructions, code style, commands |
| [`GEMINI.md`](GEMINI.md) | Gemini AI system context |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code project context |
| [`QWEN.md`](QWEN.md) | Qwen AI project context |
| [`packages/bl1nk-desktop/AGENTS.md`](packages/bl1nk-desktop/AGENTS.md) | Desktop app role and dependencies |
| [`packages/bl1nk-sync/AGENTS.md`](packages/bl1nk-sync/AGENTS.md) | GitHub sync role and data flow |
| [`packages/craft-blog-cms/AGENTS.md`](packages/craft-blog-cms/AGENTS.md) | Orphaned package decision |

---

## 🔧 Configuration

### MCP Client Config

```json
{
  "mcpServers": {
    "bl1nk-core": {
      "command": "node",
      "args": ["${workspaceFolder}/packages/bl1nk-core/dist/index.js"],
      "env": {
        "EXA_API_KEY": "${env:EXA_API_KEY}"
      }
    }
  }
}
```

### Environment Variables

**packages/bl1nk-core/.env:**
```bash
# EXA_API_KEY=your_exa_api_key
```

**packages/bl1nk-sync/.env:**
```bash
# GITHUB_WEBHOOK_SECRET=your_webhook_secret
# NOTION_API_KEY=your_notion_api_key
# NOTION_DATABASE_ID=your_notion_database_id
```

---

## 📝 License

Apache-2.0
