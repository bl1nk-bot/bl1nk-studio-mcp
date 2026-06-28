# @bl1nk/ide

Web IDE สำหรับ story writing และ visualization — สร้างด้วย React + Vite

## Features

- **Editor** — Markdown editor พร้อม syntax support และ EmojiPicker
- **Canvas View** — Visual canvas สำหรับ story mapping
- **Markdown Preview** — Live preview ของ Markdown content
- **Task Tracker** — Integrated todo management
- **Notes** — Note-taking พร้อม label system

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Markdown:** marked
- **Runtime:** Tauri 2 (optional desktop mode)
- **Language:** TypeScript 5
- **Testing:** Vitest + @testing-library/react

## Structure

```text
packages/ide/
├── src/
│   ├── App.tsx              # Root component
│   ├── components/          # UI components
│   │   ├── Editor.tsx       # Markdown editor
│   │   ├── CanvasView.tsx   # Visual canvas
│   │   ├── MarkdownPreview.tsx
│   │   ├── TaskTracker.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ViewSwitcher.tsx
│   │   └── EmojiPicker.tsx
│   ├── store/               # State management
│   │   ├── notes.ts         # Notes store
│   │   └── labels.ts        # Labels store
│   └── lib/                 # Utilities
```

## Development

```bash
# Web dev server (port 5000)
pnpm --filter @bl1nk/ide run dev

# Tauri desktop mode
pnpm --filter @bl1nk/ide run tauri:dev

# Tests
pnpm --filter @bl1nk/ide run test

# Build
pnpm --filter @bl1nk/ide run build
```
