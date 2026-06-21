# Documentation Index

เอกสารทั้งหมดสำหรับโปรเจค bl1nk-visual-mcp

---

## เอกสารหลัก

| เอกสาร | คำอธิบาย |
|--------|----------|
| [`../README.md`](../README.md) | ภาพรวมโปรเจคและคำแนะนำการติดตั้ง |
| [`../AGENTS.md`](../AGENTS.md) | คำแนะนำสำหรับ AI agents |
| [`../CHANGELOG.md`](../CHANGELOG.md) | ประวัติการเปลี่ยนแปลง |
| [`../TODO.md`](../TODO.md) | แผนงานและงานที่ต้องทำ |

## เอกสารเฉพาะทาง

### AI Agent Architecture
- [`ARCHITECTURE.md`](ARCHITECTURE.md) - สถาปัตยกรรมระบบ, Dataflow และ Agent Skills Architecture
- [`prompt-assembly.md`](prompt-assembly.md) - แนวคิดและการนำระบบประกอบ prompt ไปใช้

### Project Documentation
- [`TOOL_MAPPING.md`](TOOL_MAPPING.md) - การ mapping ทุก tools (16 tools)
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - ประวัติโปรเจคและสถานะปัจจุบัน

### Component Documentation
- [`TAURI-APP.md`](TAURI-APP.md) - Desktop app (Tauri) role and setup
- [`GITHUB-SYNC.md`](GITHUB-SYNC.md) - GitHub webhook sync service
- [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md) - Vercel deployment guide

### Learning & References
- [`quick-start.md`](quick-start.md) - Quick start guide
- [`INSTRUCTIONS_TH.md`](INSTRUCTIONS_TH.md) - คำแนะนำการพัฒนา (ภาษาไทย)
- [`./reference/`](./reference/) - คลังข้อมูลอ้างอิงทางเทคนิค
  - [`mcp_best_practices.md`](./reference/mcp_best_practices.md)
  - [`quality_checklist.md`](./reference/quality_checklist.md)
  - [`evaluation.md`](./reference/evaluation.md)

## Development Structure

```
bl1nk-visual-mcp/
├── packages/                 # Source code
│   ├── core/          # MCP Server (16 tools)
│   ├── desktop/       # Tauri Desktop App
│   ├── ai-ide/              # Web IDE (Vite + React)
│   ├── ui/    # Unified React UI shell
│   ├── book/          # Next.js book publishing app
│   ├── sync/          # GitHub Sync Service
│   └── support-agent/       # Next.js support chat app
├── docs/                    # Central Documentation
├── templates/               # Handlebars/Nunjucks templates
├── commands/                # CLI commands
└── tests/                   # Integration tests
```
