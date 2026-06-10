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
- **[Architecture](ARCHITECTURE.md)** - สถาปัตยกรรมระบบ, Dataflow และ Agent Skills Architecture

### 📋 Project Documentation
- [`TOOL_MAPPING.md`](TOOL_MAPPING.md) - การ mapping ทุก tools (16 tools)
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - ประวัติโปรเจค (Phase 1 + 2)

### 🔧 Component Documentation
- [`TAURI-APP.md`](TAURI-APP.md) - Desktop app (Tauri) role and setup
- [`GITHUB-SYNC.md`](GITHUB-SYNC.md) - GitHub webhook sync service
- [`CRAFT-BLOG-CMS.md`](CRAFT-BLOG-CMS.md) - Orphaned CMS package

### 📚 Learning & References
- [`quick-start.md`](quick-start.md) - Quick start guide
- [`INSTRUCTIONS_TH.md`](INSTRUCTIONS_TH.md) - คำแนะนำการพัฒนา (ภาษาไทย)
- **[Reference Gallery](./reference/)** - คลังข้อมูลอ้างอิงทางเทคนิค
    - [`mcp_best_practices.md`](./reference/mcp_best_practices.md) - แนวทางปฏิบัติที่ดีที่สุดสำหรับ MCP
    - [`quality_checklist.md`](./reference/quality_checklist.md) - รายการตรวจสอบคุณภาพงาน
    - [`evaluation.md`](./reference/evaluation.md) - เกณฑ์การประเมินผล

## 🏗️ Development Structure

```
bl1nk-visual-mcp/
├── packages/                 # Source code
│   ├── bl1nk-core/          # MCP Server (16 tools)
│   ├── bl1nk-desktop/       # Tauri Desktop App (Rust API)
│   ├── bl1nk-ide/           # Next.js Web IDE
│   └── bl1nk-sync/          # GitHub Sync Service
├── docs/                     # Central Documentation
│   └── reference/           # Technical references
├── skills/                   # Centralized AI Skills (Source of Truth)
├── commands/                 # CLI commands
└── tests/                    # Integration tests
```
