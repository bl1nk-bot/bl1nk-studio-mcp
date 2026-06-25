# @bl1nk/sync

GitHub → Notion Sync Service — webhook server ที่ sync markdown/CSV files จาก GitHub ไป Notion อัตโนมัติ

## Overview

HTTP server ที่รับ GitHub push webhooks แล้ว sync ไฟล์ที่เปลี่ยนแปลงไปยัง Notion database โดยอัตโนมัติ รองรับไฟล์ Markdown (พร้อม frontmatter) และ CSV

## Tech Stack

- **Runtime:** Node.js 22+ (native HTTP server)
- **Build:** esbuild (ESM bundle)
- **Language:** TypeScript 6
- **Integrations:** Notion API, GitHub Webhooks, `@bl1nk/core`
- **Parsers:** gray-matter (Markdown frontmatter), csv-parse

## How It Works

1. GitHub ส่ง push webhook มาที่ server
2. Server verify HMAC signature ด้วย `GITHUB_WEBHOOK_SECRET`
3. Parse ไฟล์ที่เปลี่ยนแปลง (`.md` / `.csv`)
4. Upsert records เข้า Notion database

## Development

```bash
# Build
pnpm --filter @bl1nk/sync run build

# Start server
pnpm --filter @bl1nk/sync run start

# Dev (watch mode)
pnpm --filter @bl1nk/sync run dev

# Typecheck
pnpm --filter @bl1nk/sync run typecheck
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port ที่ server จะ listen (default: `3000`) |
| `GITHUB_WEBHOOK_SECRET` | Secret สำหรับ verify GitHub webhook signature |
| `NOTION_API_KEY` | Notion Integration token |
| `NOTION_DATABASE_ID` | ID ของ Notion database ปลายทาง |

## GitHub Webhook Setup

1. ไปที่ Settings → Webhooks ของ GitHub repository
2. Payload URL: `https://<your-domain>/`
3. Content type: `application/json`
4. Secret: ค่าเดียวกับ `GITHUB_WEBHOOK_SECRET`
5. Events: เลือก "Pushes"
