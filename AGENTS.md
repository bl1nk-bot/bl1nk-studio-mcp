# AGENTS.md — bl1nk-visual-mcp

## 🔄 Command Workflows

### Workflow 1: Analyze New Story
1. User provides story text
2. Use `analyze_story` tool with appropriate depth
3. Validate resulting graph
4. Report findings and recommendations
5. Offer export options

### Workflow 2: Validate Existing Story
1. User provides story graph
2. Use `validate_story_structure` tool
3. Report all issues with suggestions
4. Offer refinement options
5. Suggest specific improvements

### Workflow 3: Export Story
1. Confirm story is valid (run validation if needed)
2. Determine export format based on user need:
   - **Mermaid:** Diagram/visualization
   - **Canvas:** Interactive editing
   - **Dashboard:** Comprehensive analysis
   - **Markdown:** Document/report
   - **JSON:** Raw data
3. Use appropriate export tool
4. Present formatted output
5. Offer alternative formats

### Workflow 4: Audit & Optimize
1. Perform structural audit
2. Analyze character development
3. Detect conflict patterns
4. Optimize pacing and arcs
5. Provide comprehensive recommendations

---

## 📊 Output & Skill Preferences

### Default Behavior
- **Prefer Canvas JSON** for interactive visualization
- **Use Mermaid** only when user specifically requests diagrams
- **Include metadata and statistics** by default
- **Provide recommendations** unless explicitly declined

### Format Selection Guide
| User Need | Format |
|-----------|--------|
| Quick visualization | Mermaid |
| Interactive editing | Canvas |
| Full analysis | Dashboard |
| Documentation | Markdown |
| API integration | JSON |

### Skill Activation
- **Structural Audit Skill:** Triggers on "audit story", "check structure". Performs 3-Act validation, Arc validation, Pacing analysis.
- **Character Analysis Skill:** Triggers on "analyze characters", "character development". Performs Arc analysis, Motivation analysis, Relationship mapping.
- **Conflict Detection Skill:** Triggers on "analyze conflicts", "conflict detection". Performs Escalation analysis, Impact assessment.

---

## 📝 Response Guidelines

### When Analyzing
- Be thorough but concise
- Highlight both strengths and weaknesses
- Provide specific, actionable suggestions
- Use clear examples from the story

### When Validating
- Report all issues with clear severity
- Explain why each issue matters
- Suggest specific fixes
- Prioritize critical issues first

### When Exporting
- Confirm format and options before proceeding
- Provide clean, well-formatted output
- Include relevant metadata
- Offer alternative formats

---

## 🏗️ Project Structure

```
packages/bl1nk-core/       # Core MCP Server & Story Analysis
  src/
    index.ts               # MCP server entry
    tools/                 # Tool definitions & executors
    exporters/             # Output formatters
    analyzer.ts            # Story text → StoryGraph
    validators.ts          # Structural validation
    types.ts               # TypeScript interfaces
  templates/               # Handlebars templates
packages/bl1nk-unified-ui/  # Unified UI (React 19 + Tauri 2)
  src/                     # React source
  src-tauri/               # Rust backend
packages/bl1nk-sync/       # GitHub → Notion sync
```

## 🛠️ Tool System

### Granular Tools (11 tools)
| Tool | Description |
|------|-------------|
| `analyze_story` | Parse story text → StoryGraph |
| `export_mermaid` | Mermaid diagram markdown |
| `export_canvas` | Canvas JSON |
| `export_dashboard` | HTML dashboard |
| `export_markdown` | Structured Markdown |
| `validate_story_structure` | 3-act structure validation |
| `extract_characters` | Character data extraction |
| `extract_conflicts` | Conflict data extraction |
| `build_relationship_graph` | Relationship mapping |
| `export_mcp_ui_dashboard` | MCP-UI dashboard |
| `exa_search_story` | External research (Exa AI) |

### Standalone Tool
- `search_entries`: Full entity extraction with Handlebars templates.

---

## 💻 Operations

| Command | Description |
|---------|-------------|
| `npm run build` | Bundle core server |
| `npm run dev` | Watch-mode core development |
| `pnpm -r run test` | Run all tests in workspace |
| `pnpm --filter @bl1nk/unified-ui run tauri:dev` | Run Unified UI in Desktop mode |
| `npm run test:audit` | Run Omni-Critic consistency check |

---

## 📚 Operational Guidelines
- Report problems to user immediately.
- Use `ask_user` for confirmations.
- All decisions based on documented learnings in `SPEC.md` and `AGENTS.md`.
- **Zero Warnings** policy for Rust and TypeScript code.
