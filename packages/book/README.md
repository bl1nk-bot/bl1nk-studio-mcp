# @bl1nk/book

Article Workspace — สร้างบน [Craft API](https://developer.craft.do) ด้วย Next.js

## Overview

Web application สำหรับ read และ manage articles จาก Craft workspace รองรับทั้ง demo mode (browser storage) และ live mode (Craft OAuth)

## Features

- **Demo mode** — ทดลองใช้งานได้ทันทีโดยไม่ต้อง login (ข้อมูลเก็บใน browser)
- **Craft Integration** — เชื่อมต่อ Craft workspace ผ่าน OAuth 2.0 + PKCE
- **Auto token refresh** — Refresh token อัตโนมัติโดยไม่ต้อง re-authenticate
- **Secure** — Access token เก็บใน memory only, refresh token เก็บใน HTTP-only cookie

## Tech Stack

- **Framework:** Next.js 16
- **Runtime:** React 19
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI, Lucide React, shadcn-style components
- **Language:** TypeScript 6
- **Analytics:** Vercel Speed Insights

## Development

```bash
# Install (จาก root)
pnpm install

# Dev server (port 3000)
pnpm --filter @bl1nk/book run dev

# Build
pnpm --filter @bl1nk/book run build

# Start production (port 5000)
pnpm --filter @bl1nk/book run start

# Typecheck
pnpm --filter @bl1nk/book run typecheck
```

## Setup

```bash
cp packages/book/.env.example packages/book/.env.local
```

| Variable | Description |
|----------|-------------|
| `CRAFT_CLIENT_ID` | Craft OAuth client ID |
| `CRAFT_CLIENT_SECRET` | Craft OAuth client secret |
| `CRAFT_REDIRECT_URI` | OAuth callback URL |

เปิด [http://localhost:3000](http://localhost:3000) — ใช้งาน demo mode ได้ทันทีโดยไม่ต้องตั้งค่า environment variables
