# AGENTS.md — support Package

## Purpose
- Support chat app (Next.js 15 + React 19 RC + AI SDK)

## Key Learnings
- Uses AI SDK (`@ai-sdk/openai`) with OpenAI backend for chat
- `crypto-js` used for auth/token handling
- Special note: React 19 RC build (`19.0.0-rc-65a56d0e-20241020`) — watch for breaking changes
- `vercel.json` present at package level
- All versions synced with root bump script

## Commands
- `pnpm run dev` — Next.js dev
- `pnpm run build` — Next.js build
- `pnpm run start` — Next.js start
- `pnpm run lint` — next lint
