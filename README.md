# bl1nk-studio-mcp

ระบบวิเคราะห์และจัดระเบียบเรื่องราว (Story Analysis & Organization System)

> **Version:** 3.0.0 | **Status:** Production Ready

---

## Packages

| Package | Path | Description |
|---------|------|-------------|
| [`@bl1nk/core`](packages/core/) | `packages/core/` | MCP Server — story analysis engine |
| [`@bl1nk/desktop`](packages/desktop/) | `packages/desktop/` | Desktop app (React + Tauri) |
| [`@bl1nk/ide`](packages/ide/) | `packages/ide/` | Web IDE for story writing |
| [`@bl1nk/book`](packages/book/) | `packages/book/` | Article workspace (Next.js + Craft API) |
| [`@bl1nk/support`](packages/support/) | `packages/support/` | Support agent (Next.js + Vercel AI SDK) |
| [`@bl1nk/sync`](packages/sync/) | `packages/sync/` | GitHub → Notion sync webhook |

---

## Development

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm -r run build

# Run tests across all packages
pnpm -r run test

# Lint and typecheck
pnpm run lint
pnpm -r run typecheck
```

---

## Project Structure

```
bl1nk-studio-mcp/
├── packages/
│   ├── core/        # MCP Server & Story Analysis Engine
│   ├── desktop/     # Desktop UI (Tauri 2 + React 19)
│   ├── ide/         # Web IDE (Vite + React 18)
│   ├── book/        # Article Workspace (Next.js + Craft API)
│   ├── support/     # Support Agent (Next.js + Vercel AI SDK)
│   └── sync/        # GitHub → Notion Sync Service
├── .claude/         # Claude Code hooks & settings
├── biome.json       # Linter & formatter config
├── pnpm-workspace.yaml
└── package.json     # Root workspace (v3.0.0)
```

---

## License

Apache-2.0 © 2026 bl1nk-studio-mcp
