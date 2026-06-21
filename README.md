# bl1nk-visual-mcp Monorepo

ระบบวิเคราะห์และจัดระเบียบเรื่องราว (Story Analysis & Organization System)

> **Version:** 3.0.0 | **Status:** Production Ready

---

## 📦 Packages

### 1. **@bl1nk/core** (\`packages/core/\`)

Core MCP Server สำหรับวิเคราะห์ story text และสร้าง StoryGraph JSON

**Tools (16 total):**

#### Granular Tools (11 tools — recommended)

| Category | Tool | Description |
|----------|------|-------------|
| Analysis | \`analyze_story\` | Parse story text → StoryGraph JSON |
| Export | \`export_mermaid\` | Mermaid diagram markdown |
| Export | \`export_canvas\` | Canvas JSON (Obsidian/React Flow) |
| Export | \`export_dashboard\` | HTML dashboard (Chart.js + Tailwind) |
| Export | \`export_markdown\` | Structured Markdown document |
| Export | \`export_mcp_ui_dashboard\` | MCP-UI compatible HTML dashboard |
| Validation | \`validate_story_structure\` | 3-act structure validation |
| Extract | \`extract_characters\` | Character data from StoryGraph |
| Extract | \`extract_conflicts\` | Conflict data from StoryGraph |
| Extract | \`build_relationship_graph\` | Relationship graph |
| Search | \`exa_search_story\` | External story research (Exa AI) |

#### Legacy & Standalone Tools (5 tools)

| Tool | Description |
|------|-------------|
| \`search_entries\` | Extract entities from story text (Standalone/Legacy) |
| \`validate_story\` | Quick validation from text input (Legacy) |
| \`generate_artifacts\` | Generate ALL formats at once (Legacy) |
| \`sync_github\` | Push files to GitHub (Not implemented) |

**Usage:**
\`\`\`bash
cd packages/core
npm run build
npm run start
\`\`\`

### 2. **desktop** (\`packages/desktop/\`)

Desktop Application (React + Tauri) สำหรับดูและจัดการ story entities

**Features:**

- StoryGraph visualization (Mermaid)
- Character & Conflict management
- Timeline view
- Insights dashboard (Act distribution, Health checks)

**Usage:**
\`\`\`bash
cd packages/desktop
npm run tauri:dev
\`\`\`

### 3. **ai-ide** (\`packages/ide/\`)

Web IDE สำหรับ story writing และ analysis (Vite + React)

**Features:**

- Editor พร้อม real-time visualization
- Canvas view
- Markdown preview
- Task tracking

**Usage:**

\`\`\`bash
cd packages/ide
npm run dev
\`\`\`

### 4. **@bl1nk/sync** (\`packages/sync/\`)

GitHub App สำหรับ sync markdown/CSV files ไป Notion อัตโนมัติ
**Usage:**
\`\`\`bash
cd packages/sync
npm run build
npm run start
\`\`\`

---

## 🚀 Development

### Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### Build All

\`\`\`bash
pnpm run build
\`\`\`

### Test All

\`\`\`bash
pnpm run test
\`\`\`

---

## 📁 Project Structure

\`\`\`
visual-story-extension/
├── packages/
│   ├── core/               # Core MCP Server & Story Analysis
│   ├── desktop/            # Desktop UI (Tauri + React)
│   ├── ai-ide/                   # Web IDE (Vite + React)
│   ├── ui/         # Unified React UI shell
│   ├── book/               # Book publishing platform
│   ├── sync/               # GitHub → Notion sync
│   └── support-agent/            # Support chat app
│
├── docs/                         # Documentation
├── AGENTS.md                     # Centralized AI Agent reference
├── TODO.md                       # Project roadmap
├── SPEC.md                       # UI Layer Specification
└── package.json                  # Root package (v3.0.0)
\`\`\`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | **[Main]** Core reference for all AI agents |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & dataflow |
| [docs/TOOL_MAPPING.md](docs/TOOL_MAPPING.md) | Detailed tool parameters & outputs |
| [SPEC.md](SPEC.md) | UI implementation details |
| [TODO.md](TODO.md) | Current tasks & priorities |

---

## ⚖️ License

Apache-2.0 © 2026 bl1nk-visual-mcp
