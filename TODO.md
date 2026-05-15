# TODO.md — bl1nk-visual-mcp Monorepo

> **Status:** Active development | **Last Updated:** 2026-05-14

---

## 🔴 Critical & High Priority

- [ ] \`type:feat\` \`label:high-priority\` Add startup validation for Exa API key in bl1nk-core
- [ ] \`type:fix\` \`label:high-priority\` Resolve Vercel deployment issues (failed recently)
- [ ] \`type:fix\` \`label:high-priority\` Address 17 actionable comments from CodeRabbit in closed PR #48 (refactoring into smaller PRs)

---

## 🟡 Core Development (VSP3)

- [ ] \`type:feat\` \`label:core\` Implement live MCP connection for bl1nk-desktop/bl1nk-ide
- [ ] \`type:feat\` \`label:core\` Add persistent storage for StoryGraph JSON
- [ ] \`type:fix\` \`label:core\` Standardize Node.js versions across all CI/CD pipelines (currently mixed 20/22/24)
- [ ] \`type:fix\` \`label:core\` Fix hardcoded act distribution in \`src/analyzer.ts\` (use 25-50-25 rule)

---

## 🟢 Maintenance & Improvements

- [ ] \`type:fix\` \`label:low-priority\` Archive or move \`packages/craft-blog-cms\` (Orphaned)
- [ ] \`type:feat\` \`label:low-priority\` Add XSS validation for Markdown exporter
- [ ] \`type:style\` \`label:low-priority\` Standardize Tailwind CSS versions across packages (mixed 3.4 and 4.0)

---

## ✅ Recently Completed

- [x] Consolidate agent documentation into \`AGENTS.md\` and symlink \`GEMINI.md\`, \`QWEN.md\`, \`CLAUDE.md\`
- [x] Update \`README.md\` and \`docs/TOOL_MAPPING.md\` to reflect actual state
- [x] Merged dependency update for \`postcss\` security fix
- [x] Cleared backlog of conflicting or problematic PRs
