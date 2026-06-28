# AGENTS.md — ide Package

## Purpose
- Web IDE (Vite + React + Tauri 2)

## Key Learnings
- Uses its own Tauri bridge via `packages/desktop/src-tauri` style layout
- `packages/ide/src-tauri/src` contains Rust backend entrypoint
- Depends on `@bl1nk/core` workspace package for story analysis backend
- Build sequence: `tsc` then `vite build` (typecheck first)
- Includes playback/test harness for editor + components

## Commands
- `pnpm run dev` — Vite on port 5000, host 0.0.0.0
- `pnpm run build` — tsc + vite build
- `pnpm run preview` — preview production build
- `pnpm run tauri:dev` — desktop dev
- `pnpm run test` — vitest
