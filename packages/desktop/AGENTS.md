# AGENTS.md — desktop Package

## Purpose
- Desktop app (React + Tauri 2)

## Key Learnings
- Uses Vite for frontend build and Tauri for native shell
- `@tauri-apps/plugin-shell` required for native commands
- Depends on `@bl1nk/core` via workspace protocol (`workspace:*`)
- test uses vitest run; playwright available

## Commands
- `pnpm run dev` — Vite dev server
- `pnpm run build` — Vite build
- `pnpm run tauri:dev` — Tauri desktop app with hot reload
- `pnpm run tauri:build` — Build native binaries
- `pnpm run test` — Vitest
