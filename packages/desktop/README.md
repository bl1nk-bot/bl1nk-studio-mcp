# @bl1nk/desktop

Desktop Application สำหรับ Visual Story Planner — สร้างด้วย React 19 + Tauri 2

## Features

- **Editor** — Character & scene management
- **Graph View** — Real-time Mermaid diagram ของโครงสร้างเรื่องราว
- **Timeline** — Chronological event tracking แยกตาม story acts
- **Insights** — Act distribution, health checks, structural validation

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Runtime:** Tauri 2 (Rust backend)
- **Language:** TypeScript 6
- **Testing:** Vitest + @testing-library/react

## Structure

```text
packages/desktop/
├── src/
│   ├── App.tsx              # Root component with view routing
│   ├── main.tsx             # Entry point
│   ├── components/          # UI components (StatCard, CharacterCard, etc.)
│   ├── features/            # Feature modules
│   ├── lib/                 # Utilities
│   └── test/                # Vitest tests
└── src-tauri/               # Rust backend (Tauri)
```

## Development

```bash
# Web dev server
pnpm --filter @bl1nk/desktop run dev

# Tauri desktop app
pnpm --filter @bl1nk/desktop run tauri:dev

# Tests
pnpm --filter @bl1nk/desktop run test

# Build web
pnpm --filter @bl1nk/desktop run build

# Build desktop binary
pnpm --filter @bl1nk/desktop run tauri:build
```

### Prerequisites

- Node.js 22+
- pnpm 11+
- Rust (สำหรับ Tauri — ดู [tauri.app](https://tauri.app/start/prerequisites/))
