# TOOL_DESIGN.md — พิมพ์เขียวเครื่องมือวิเคราะห์แบบแตกกิ่ง (Story Branching Tools)

> **Goal:** ทำให้ระบบ "แตกกิ่ง" ได้ตามจินตนาการของ Architect โดยใช้กฎจาก SPEC.md

---

## 🛠️ 1. เครื่องมือหลัก (The Master Tools)

### `analyze_story`
*   **Purpose:** รับเนื้อหาดิบแล้วแตกกิ่งเป็น StoryGraph ก้อนแรก
*   **Input:** 
    *   `text` (string): เนื้อหา
    *   `depth` (enum): basic | deep (ถ้า deep จะแตกกิ่งถึงระดับ Scene/Beat)
*   **Expected Output:** `StoryGraph` ที่มี:
    *   `characters`: รายชื่อตัวละครเบื้องต้น
    *   `timeline`: ลำดับกาลเวลาใหญ่
    *   `actStructure`: การแบ่ง 25-50-25

### `expand_plot_branch`
*   **Purpose:** เจาะลึกกิ่งก้านเฉพาะจุด เช่น ขยายกิ่งความขัดแย้ง หรือขยายกิ่งตัวละคร
*   **Input:**
    *   `graph` (StoryGraph): กราฟปัจจุบัน
    *   `targetId` (string): ID ของกิ่งที่ต้องการขยาย (เช่น Event ID)
    *   `branchType` (enum): `SCENE` | `LOGIC` | `POWER`
*   **Expected Output:** `StoryGraph` ที่มีกิ่งใหม่ถูกเติมเข้าไป (Normalized)

---

## 📦 2. มาตรฐานผลลัพธ์ (Output Standards)

เพื่อไม่ให้ "บวม" ทุก Tool ต้องส่งออกในรูปแบบเดียวกัน:
```json
{
  "meta": { "projectId": "...", "version": "3.0.0" },
  "entities": {
    "characters": [],
    "events": [],
    "logic": { "causality": [], "plots": [] },
    "aesthetic": { "theme": {}, "style": {} }
  }
}
```

---

## ✅ 3. กฎการตรวจสอบ (Quality Gates - จาก SPEC.md)
1. **Act Consistency:** ผลรวมเหตุการณ์ในแต่ละองก์ต้องตรงตาม % ที่กำหนด
2. **Causality Check:** ทุกกิ่งใหม่ที่งอกออกมา ต้องมี `triggerId` เชื่อมกับกิ่งเดิม
3. **Power Check:** ถ้าเป็นกิ่ง Fantasy ต้องตรวจ `dangerLevel` (1-10)

---
Architect ครับ การแยก Design ออกมาเป็น **`TOOL_DESIGN.md`** แบบนี้ "ถูกใจ" คุณมากกว่าการที่ผมไปมั่วซั่วใน `SPEC.md` ไหมครับ? 
ถ้าโอเค ผมจะขยับไปขั้นตอน **TDD** (เขียน Test Case) ต่อทันทีครับ
