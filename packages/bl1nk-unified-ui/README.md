# @bl1nk/unified-ui

The unified user interface for Visual Story Planner (VSP). This package combines the features of the former `bl1nk-desktop` and `bl1nk-ide` into a single, high-fidelity application.

## 🎯 Features

- **Dashboard**: High-level overview of story stats, act distribution, and health checks.
- **Writer (Editor)**: A lightweight, Obsidian-style Markdown editor with live preview and scene management.
- **Visualizations**: 
  - **Graph View**: Real-time Mermaid diagram rendering of story structure.
  - **Timeline**: Chronological event tracking grouped by story acts.
- **Task Tracking**: Integrated todo management that can sync with your manuscript notes.
- **Insights**: Detailed structural validation and character roster analysis.

## 🏗️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Runtime**: Tauri 2 (for Desktop support)
- **Language**: TypeScript 6

## 📁 Structure

- `src/components`: UI building blocks (Cards, Charts, Panels).
- `src/store`: State management (Notes, Tasks).
- `src/lib`: Utility functions and mock data.
- `src-tauri`: Rust backend for desktop integration.

## 🚀 Development

### Prerequisites
- Node.js 22+
- pnpm 10+
- Rust (for Tauri development)

### Start Development Server
```bash
# From the project root
pnpm --filter @bl1nk/unified-ui run dev

# For Tauri (Desktop) mode
pnpm --filter @bl1nk/unified-ui run tauri:dev
```

### Build
```bash
pnpm --filter @bl1nk/unified-ui run build
```

## 🎨 Theme
The UI uses a **Teal Metallic** theme with:
- `bg-base`: `#0a1114`
- `teal`: `#00bcd4`
- `border`: `rgba(0, 188, 212, 0.15)`
- Custom iOS-style glassmorphism and blurs.

---
*Part of the bl1nk-visual-mcp ecosystem.*
