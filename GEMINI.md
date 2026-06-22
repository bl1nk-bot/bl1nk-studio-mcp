# GEMINI.md — ระบบควบคุมการปฏิบัติงาน (Operational Directives)

## 🛠️ ตำแหน่งและประเภทของเครื่องมือ (Tooling Hierarchy)

### 1. คำสั่ง (Commands - สั่งผ่าน CLI)
- **งานตรรกะโปรเจกต์ (Project Logic):** `commands/*.md`
- **งานจัดการระบบโปรเจกต์ (Project Management):** `.gemini/commands/*.md`
- **งานส่วนตัว/Global (User Global):** `~/.gemini/commands/*.md`
- **งานจากส่วนเสริม (Extensions):** ตามที่ระบุในโฟลเดอร์ extension นั้นๆ

### 2. ทักษะ (Skills - Agent เรียกใช้เอง)
- **ทักษะเฉพาะโปรเจกต์:** `.gemini/skills/*/SKILL.md` หรือ `.agents/skills/*/SKILL.md`
- **ทักษะส่วนตัว/Global:** `~/.gemini/skills/*/SKILL.md`
- **ทักษะจากส่วนเสริม:** `~/.gemini/extensions/[name]/skills/*/SKILL.md`

## 🚨 มาตรฐานการจดบันทึก (Directives Protocol)
1. **เปลี่ยนความรู้เป็นคำสั่ง:** เมื่อเรียนรู้อะไรใหม่ ให้จดเป็นขั้นตอน 1-2-3 ทันที
2. **ห้ามบันทึกความผิด:** ห้ามเขียนบรรยายความผิดพลาดหรือคำขอโทษลงในไฟล์ระบบ
3. **โครงสร้าง TODO:** หากไม่มีไฟล์ ให้สร้างใหม่โดยแบ่งเป็น `Metadata` -> `Active Tasks` -> `Completed History`
4. **การสะสาง (Cleanup):** คือการจัดระเบียบ Code/Type ให้ตรง `types.ts` ห้ามลบไฟล์ทิ้งเพื่อหนี Error

## 🔄 วงจรการทำงานมาตรฐาน (Mandatory Operational Cycle)
ทุกครั้งที่ทำงาน (Action) ต้องทำให้ครบวงจร "ห้ามจบงานกลางคัน" ดังนี้:

1.  **Prepare:** อ่าน `TODO.md` เพื่อดูเป้าหมาย และ `SPEC.md` เพื่อดูข้อบังคับ
2.  **Act (Code + Test):** เขียนโค้ดพร้อมกับ Unit Test เสมอ **ห้ามส่งงานที่ไม่มีเทส**
3.  **Verify:** รัน `npm run build` และ `npm test` เพื่อยืนยันว่าไม่มีอะไรพัง
4.  **Document:** หากมีการเปลี่ยน Logic หรือโครงสร้าง ต้องอัปเดต `AGENTS.md` และ `SPEC.md` ทันที
5.  **Finalize:** อัปเดต `TODO.md` (ย้ายงานเข้า Completed) และสรุป "หนี้ทางเทคนิค" ที่สร้างเพิ่ม (ถ้ามี)

**กฎเหล็ก:** การ "แฮก" เพื่อให้ Build ผ่านโดยไม่แก้ที่ต้นเหตุ ถือเป็นความล้มเหลวร้ายแรงในการปฏิบัติงาน (Operational Failure)

## 🛠️ ข้อบังคับเทคนิค (Technical Rules)
1. **Act Structure:** 25-50-25
2. **Naming Convention:** ยึดตาม `types.ts` (เช่น `meta`, `tags`) ห้ามเปลี่ยนเอง
3. **No Deletion:** ห้ามใช้ `rm` หรือลบบรรทัดในประวัติงาน
