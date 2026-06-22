# AGENTS.md — core Package

## Build Notes
- Build from `packages/core/` directory, not root
- `node scripts/build.js build` provides better error reporting than npm scripts

## Template System

### Path Resolution
- Templates resolved at runtime using `process.cwd()`, not bundled `__dirname`
- Check `templates/` (root), `packages/core/templates/` (fallback)

### Config-Based Templates
- Templates configured in `bl1nk-config.json` (root)
- Structure: `human/` (Markdown) + `machine/` (JSON)
- Legacy fallback if config missing

### Template Syntax
- Uses Handlebars engine but with Jinja-like syntax
- Loop: `{% for item in items %}` not `{{#each items}}`
- Conditional: `{% if condition %}` not `{{#if condition}}`
- Filters: `{{value|filter}}` (limited in Handlebars)

## Operational Guidelines

### Error Reporting
- Always report problems to user immediately when encountered
- Use `question` tool when tools/environment cause failures or uncertainties
- Never work silently - keep user informed of progress and issues

### Build System
- When build tools fail silently, create scripts with explicit logging
- Report dependency issues (Biome not installed, npm not found) immediately
- Change working directory explicitly before running package-specific commands

### AI Memory Management
- **No Long-Term Memory**: AI has no persistent memory - context is the brain
- **Document Problems**: Record all errors, solutions, and learnings in AGENTS.md files
- **Prevent Recurrence**: Create context and solutions for problems to prevent repetition
- **Context-Driven**: All decisions based on documented learnings, not implicit knowledge