# DRAFT_STRUCTURE.md — พิมพ์เขียวการจัดระเบียบโครงสร้างใหม่

## 🎯 เป้าหมาย: ลดความบวม (Lean & Scalable)

เราจะไม่เขียน Type ซ้ำซาก และจะไม่ส่ง Argument เกินความจำเป็น ทุกอย่างต้องคุยผ่าน "ภาษาเดียวกัน"

---

## 1. 💎 Single Source of Truth (Types)

ทุกไฟล์ใน `core` ต้องใช้ Type จาก `src/types.ts` เท่านั้น **ห้ามประกาศ Type เองในไฟล์ย่อย**

### Core Graph Data

- `StoryGraph`: ข้อมูลดิบที่ได้จากการ Analyze
- `ValidationResult`: ผลการตรวจ (ห้ามส่งแค่ Array ของ Error)

---

## 2. 🔌 ฟังก์ชันมาตรฐาน (Interface Contract)

ลดความบวมด้วยการส่งแค่ "ก้อนข้อมูลหลัก"

| ฟังก์ชัน | รับ (Input) | ส่งออก (Output) | หน้าที่ |
| :--- | :--- | :--- | :--- |
| `analyzeStory` | `string` (text) | `StoryGraph` | แปลงภาษาคนเป็น JSON |
| `validateGraph` | `StoryGraph` | `ValidationResult` | ตรวจโครงสร้าง 3-Act |
| `toDashboard` | `StoryGraph`, `Result` | `string` (html) | วาดหน้าจอ Dashboard |

**กฎใหม่:** ห้ามส่ง options ยิบย่อย (เช่น strict, includeMetadata) เข้าไปในฟังก์ชันระดับล่าง ให้หุ้มด้วย `Options` object ก้อนเดียวถ้าจำเป็นจริง ๆ

---

## 3. 🧹 แผนผังการตัดส่วนเกิน (Cleanup Map)

- **`validators.ts`**: ตัดพารามิเตอร์ `strict` ออก (ย้ายไปเช็กใน Logic ภายในแทนถ้าต้องการ)
- **`server.ts`**: เลิกใช้ `as any` และ `{}` ว่างๆ ต้องดึงจาก `Schemas` 100%
- **`tests/`**: ลบไฟล์เทสที่ "ซ้ำซาก" หรือ "ล้าสมัย" (เช่น Legacy tools) เพื่อลดภาระการ build

---

## 4. 🔄 วงจรการอัปเดต (Update Cycle)

หากมีการแก้ไขโครงสร้าง:

1. แก้ที่ `DRAFT_STRUCTURE.md` (ร่าง)
2. แก้ที่ `types.ts` (Type)
3. แก้ที่โค้ดจริง (Implementation)
4. อัปเดตเทส (Test)

---
คุณ (Architect) เห็นด้วยกับ Draft นี้ไหมครับ? ถ้าเห็นด้วย ผมจะยึดเป็นคัมภีร์ในการทำงานต่อทันทีครับ
