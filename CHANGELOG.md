## 3.0.6 (2026-06-25)

- efea592 chore: sync pnpm-lock.yaml with package.json devDependency removal
- 501dfd6 fix: resolve markdownlint violations in status.md introduced by autofix
- 0849bde fix: apply CodeRabbit auto-fixes
- dce982d fix: apply Biome formatting to generated manifest JSON files
- 1b6db2a refactor: rename Track→Book in conductor commands, fix manifest generator, align SKILL.md format
- a018e10 docs: update root README and add per-package READMEs (#100)
- 49de74a build(deps): bump github/gh-aw-actions from 0.76.1 to 0.80.2 (#78)
- bd8ccc6 chore: delete empty packages, merge packages/ui into packages/desktop (#99)
- a788b63 fix: address review comments from PRs 90 & 91 + session-start hook (#92)
- 0148775 build(deps-dev): bump vite from 8.0.11 to 8.0.16 in /packages/ai-ide in the npm_and_yarn group across 1 directory (#76)
- b20cae6 fix: resolve TypeScript errors across core, sync, and ui packages
- 8e8366b refactor: normalize package names and folder structure
- cee7751 chore: cleanup duplicate support-agent and outdated docs
- 6f965c8 chore: update pnpm to v11.8.0 [size/XL]
- 89ada29 chore: sync restoration feature + cleanup files [size/XL]
- b39d788 Delete .replit
- e0ffb32 Install Vercel Speed Insights package (#72)
- 303f4db fix: deploy support-agent via project Root Directory instead of root vercel.ts
- 15bf3c00 feat: update Vercel config import and structure
- a3f933e feat: refactor import statement for defineConfig
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0] — 2026-04-03

### ✨ New Features

- **16 MCP Tools** — Unified tool system with 11 granular tools (recommended) + 4 legacy tools (backward compat) + 1 standalone
  - `analyze_story`, `export_mermaid`, `export_canvas`, `export_dashboard`, `export_markdown`, `export_mcp_ui_dashboard`
  - `validate_story_structure`, `extract_characters`, `extract_conflicts`, `build_relationship_graph`, `exa_search_story`
  - Legacy: `search_entries`, `validate_story`, `generate_artifacts`, `sync_github`
  - Standalone: `search_entries` (with Handlebars templates)
- **Granular Tool Executor** — New `executeGranularTool` function handles all 11 granular tools with proper error handling
- **Tool Registration Validation** — Automated tests ensure all tools have matching schemas and executors
- **Desktop App (Tauri)** — React + Vite + Tauri desktop application with StoryGraph visualization, character cards, timeline view, and validation panels
- **GitHub Sync Package** — Webhook handler for syncing exported files to Notion databases

### 🔧 Improvements

- **Tool Registration Fixed** — Rewrote registration logic to properly match schemas with executors (was causing `undefined.shape` errors)
- **Package Dependencies Linked** — Added `@bl1nk/core: workspace:*` to desktop and github-sync packages
- **Version Alignment** — All packages aligned to v3.0.0 (was inconsistent: 1.0.0, 3.0.0, 0.1.0)
- **Documentation Reorganized** — Moved all architecture docs to `docs/` directory for clarity
- **Extension Configs Updated** — `gemini-extension.json` and `qwen-extension.json` now list all 15 tools with correct MCP paths
- **TypeScript Config Fixed** — Updated `rootDir` and `include` paths to cover all source files

### 📚 Documentation

- **ARCHITECTURE.md** — Complete system architecture with layer diagrams, data contracts, dependency graphs, and integration points
- **TOOL_MAPPING.md** — Detailed mapping of all 16 tools (schema, executor, public API, input/output)
- **TAURI-APP.md** — Tauri app role, dependencies, and data flow documentation
- **GITHUB-SYNC.md** — GitHub sync role, webhook flow, and Notion integration
- **CRAFT-BLOG-CMS.md** — Orphaned package decision (recommend archive)
- **PROJECT_SUMMARY.md** — Complete project history (Phase 1: Conductor conversion + Phase 2: Architecture fixes)
- **Updated** — README.md, AGENTS.md, CLAUDE.md, GEMINI.md, QWEN.md all reflect current 16-tool system

### 🐛 Bug Fixes

- **Tool Name Mismatches** — Fixed `validate_story` (executor) vs `validate_story_structure` (schema) discrepancy
- **formatSearchResults Call** — Added missing `originalQuery` argument that caused TypeScript errors
- **Registration Loop** — Changed from iterating `BL1NK_VISUAL_TOOLS` (4 tools) to `GRANULAR_TOOLS` (11 tools) as source of truth

### 🔒 Security

- **Dependency Updates** — Updated path-to-regexp, picomatch, vite, hono, @hono/node-server, markdown-it, express-rate-limit, js-yaml to patched versions
- **ReDoS Fix** — Fixed Regular Expression Denial of Service vulnerability in analyzer

---

## [2.0.0] — 2026-03-15

### ✨ New Features

- **MCP-UI Dashboard Exporter** — New HTML dashboard format compatible with MCP-UI rendering
- **Story Visualization Components** — React components for Tauri app: StatCard, ActDistributionChart, StoryTimeline, CharacterCard, ConflictCard, HealthCheck, ValidationPanel, MermaidViewer
- **Conductor → bl1nk Workflow** — Converted setup.toml from Conductor dev workflow to bl1nk story writing workflow
- **Skills System** — 8 specialized analysis skills: story-analysis, structural-audit, conflict-detection, character-analysis, arc-optimization, character-voice, story-export, theme-extraction

### 🔧 Improvements

- **Performance Optimization** — Optimized character-to-event assignment in analyzer (reduced O(n×m) RegExp compilations)
- **StoryGraph Building** — Improved graph construction performance and fixed edge cases
- **Rebranding** — Complete phase 1 rebrand to bl1nk-visual-mcp
- **Shared TypeScript Types** — Added shared types for Tauri app integration

### 📚 Documentation

- **SPEC.md** — Project specification and requirements
- **TODO.md** — Comprehensive task tracking with phases
- **PR Template** — Standardized pull request template
- **Skill Documentation** — Versioned SKILL.md files for all analysis skills

### 🔒 Security

- **Dependency Updates** — Updated @google/genai, fs-extra, vitest, @modelcontextprotocol/sdk to latest versions

---

## [1.0.0] — 2026-03-01

### ✨ Initial Release

- **MCP Server** — Core server with story analysis, validation, and export tools
- **Exporters** — Mermaid diagram, Canvas JSON, HTML dashboard, Markdown document formats
- **Analyzer** — Story text parsing and StoryGraph builder
- **Validators** — 50+ structural validation rules for 3-act story structure
- **Exa Search** — External story research integration
- **CLI Commands** — story/analyze, story/audit, story/export, story/validate, story/refine
- **CI/CD** — GitHub Actions for testing, linting, formatting, and releases
