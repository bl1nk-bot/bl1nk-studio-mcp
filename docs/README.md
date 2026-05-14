# Documentation Index

เอกสารทั้งหมดสำหรับโปรเจค bl1nk-visual-mcp

## 📚 เอกสารหลัก

| เอกสาร | คำอธิบาย |
|--------|----------|
| [`../README.md`](../README.md) | ภาพรวมโปรเจคและคำแนะนำการติดตั้ง |
| [`../AGENTS.md`](../AGENTS.md) | คำแนะนำสำหรับ AI agents |
| [`../CHANGELOG.md`](../CHANGELOG.md) | ประวัติการเปลี่ยนแปลง |
| [`../TODO.md`](../TODO.md) | แผนงานและงานที่ต้องทำ |

## 📖 เอกสารเฉพาะทาง

### 🤖 AI Agent Architecture
- **[Prompt Assembly](prompt-assembly.md)** - แนวคิดและการนำระบบประกอบ prompt ไปใช้ (ครบถ้วน)

### 📋 Project Documentation
- [`ARCHITECTURE.md`](ARCHITECTURE.md) - สถาปัตยกรรมระบบและ dataflow
- [`TOOL_MAPPING.md`](TOOL_MAPPING.md) - การ mapping ทุก tools (16 tools)
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - ประวัติโปรเจค (Phase 1 + 2)

### 🔧 Component Documentation
- [`TAURI-APP.md`](TAURI-APP.md) - Desktop app (Tauri) role and setup
- [`GITHUB-SYNC.md`](GITHUB-SYNC.md) - GitHub webhook sync service
- [`CRAFT-BLOG-CMS.md`](CRAFT-BLOG-CMS.md) - Orphaned CMS package

### 📚 Learning Resources
- [`INSTRUCTIONS_TH.md`](INSTRUCTIONS_TH.md) - คำแนะนำการพัฒนา (ภาษาไทย)
- [`kilo-cli-ref.md`](kilo-cli-ref.md) - Kilo CLI reference
- [`kilo-cli-use-mcp.md`](kilo-cli-use-mcp.md) - การใช้ Kilo กับ MCP
- [`quick-start.md`](quick-start.md) - Quick start guide

## 🏗️ Development

### Architecture
```
bl1nk-visual-mcp/
├── packages/                 # Source code
│   ├── bl1nk-core/          # MCP Server (16 tools)
│   ├── bl1nk-desktop/       # Tauri Desktop App
│   ├── bl1nk-ide/           # Next.js Web IDE
│   └── bl1nk-sync/          # GitHub Sync Service
├── docs/                     # Documentation
│   └── prompt-assembly/     # Prompt Assembly docs
├── commands/                 # Kilo CLI commands
├── agents/                   # Agent configurations
└── tests/                    # Integration tests
```

### Getting Started
1. อ่าน [`../README.md`](../README.md) สำหรับภาพรวมและการติดตั้ง
2. ดู [`prompt-assembly/`](./prompt-assembly/) สำหรับ AI agent architecture
3. อ่าน [`ARCHITECTURE.md`](./ARCHITECTURE.md) สำหรับ technical details

### Contributing
- ดู [`../AGENTS.md`](../AGENTS.md) สำหรับ coding guidelines
- อ่าน [`INSTRUCTIONS_TH.md`](./INSTRUCTIONS_TH.md) สำหรับ best practices
- เช็ค [`TODO.md`](../TODO.md) สำหรับ current tasks