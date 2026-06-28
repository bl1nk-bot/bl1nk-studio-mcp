# PLAN.md — bl1nk-visual-mcp Roadmap

## 🎯 Vision

สร้างระบบช่วยวางแผนและวิเคราะห์นิยายที่สมบูรณ์ที่สุด โดยผสานพลังระหว่าง AI Analysis และ Interactive Visualization เพื่อให้ Human Architect (นักเขียน) ทำงานได้ง่ายขึ้น

---

## 🛠️ Phase 1: Stabilization & Unification (Current)

*Focus: ปรับปรุงโครงสร้างพื้นฐานให้แน่นหนาและเป็นหนึ่งเดียว*

- [x] **UI Unification**: รวม `desktop` และ `bl1nk-ide` เป็น `ui` (React 19 + Tauri 2)
- [x] **Omni-Critic Audit**: ระบบตรวจสอบคุณภาพโค้ดและเทสแบบอัตโนมัติ
- [x] **Dependency Cleanup**: ลบแพ็กเกจที่ไม่ได้ใช้งาน (Qwen, Legacy UI)
- [x] **Documentation Refresh**: ปรับปรุง `README`, `SPEC`, `AGENTS` ให้สอดคล้องกัน
- [ ] **Type Safety**: แก้ไข Type Errors ที่ค้างอยู่ใน `core` tests

---

## 🚀 Phase 2: Feature Integration

*Focus: เชื่อมโยงทุกส่วนของระบบให้ทำงานร่วมกันอย่างลื่นไหล*

- [ ] **Live Sync**: เชื่อมต่อ Editor ใน Unified UI กับ MCP Server โดยตรง
- [ ] **Real-time Graph**: เมื่อแก้ไขเนื้อเรื่องใน Editor กราฟ Mermaid จะอัปเดตทันที
- [ ] **Conflict Tracker**: เพิ่ม UI สำหรับการไล่ระดับความรุนแรง (Escalation) ของความขัดแย้ง
- [ ] **Character Forge**: ระบบช่วยสร้าง Arc ตัวละครผ่าน UI

---

## 🌐 Phase 3: External Connectivity

*Focus: ขยายขอบเขตการใช้งานไปยังแพลตฟอร์มภายนอก*

- [ ] **Notion Connector**: พัฒนา `sync` ให้สมบูรณ์เพื่อดัน StoryGraph เข้า Notion
- [ ] **Vercel Deployment**: ปล่อยระบบ Dashboard ออนไลน์สำหรับ Web Preview
- [ ] **Plugin System**: รองรับ Custom Handlebars Templates สำหรับผู้ใช้ทั่วไป

---

## ✅ Success Metrics (Success Targets)

- [ ] **Zero Warnings**: โค้ดทั้งหมดต้องไม่มี Lint/Compiler warnings
- [ ] **100% Test Pass**: ทุกการ Commit ต้องผ่าน `test:audit` และ `vitest`
- [ ] **High Fidelity**: UI ต้องตอบสนองเร็วและสวยงาม (Teal Metallic Theme)
