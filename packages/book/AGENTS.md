# AGENTS.md — book Package

## Purpose
- Book publishing platform (Next.js 16 + React 19 + Vercel)

## Key Learnings
- Uses `next dev -p 3000 -H 0.0.0.0` for local dev; production starts on port 5000
- `vercel.json` present at package level for deployment config
- Stack: Next.js App Router, Radix UI, Tailwind via `class-variance-authority`
- All package versions synced via root `scripts/bump-versions.js`

## Commands
- `pnpm run dev` — Next.js dev server on port 3000
- `pnpm run build` — Next.js build
- `pnpm run start` — Production on port 5000
- `pnpm run typecheck` — TypeScript noEmit
