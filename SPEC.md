---
title: SPEC - bl1nk-visual-mcp UI Layer
description: Specification for the UI layer and Core Principles of bl1nk-visual-mcp monorepo
status: active
last_updated: 2026-05-16
owner: dev-team
---

# SPEC.md — bl1nk-visual-mcp

## 1. Purpose

UI layer และกฎเกณฑ์หลักสำหรับ `bl1nk-visual-mcp` monorepo — รวมถึง:

- **core**: Node.js MCP Server สำหรับวิเคราะห์และจัดระเบียบเนื้อเรื่อง
- **ui**: Unified Desktop & Web UI (React 19 + Tauri 2) สำหรับเขียนและวิเคราะห์เรื่องราวแบบ Visual

ระบบนี้รับ **StoryGraph JSON** ที่ได้จาก MCP tools แล้วแสดงผลเป็น interactive dashboards, visual diagrams และเอกสารวิเคราะห์

---

## 2. Architecture

```
bl1nk-visual-mcp Monorepo
├── core/ (Node.js MCP Server)
│   └── tools: analyze_story, export_mermaid, validate_story_structure, ...
│        │
│        │  StoryGraph JSON / Mermaid string / HTML / Canvas JSON
│        ▼
└── ui/ (React 19 + Tauri 2)
    ├── React Frontend (TypeScript + Tailwind 4)
    ├── Tauri Backend (Rust)
    ├── Story Writer (Obsidian-style Markdown Editor)
    ├── Visual StoryGraph (Mermaid/Timeline)
    └── Dashboard & Insights (Structural Analysis)
```

---

## 3. Core Principles

### 3.1 Structured Analysis

ต้องแปลง Narrative input ให้เป็น structured **StoryGraph JSON** เสมอ โดยมี:

- การแยกองค์ประกอบเรื่องราวที่ชัดเจน (Characters, Conflicts, Events)
- ID ที่สอดคล้องกันสำหรับทุกองค์ประกอบ
- การติดตามความสัมพันธ์ระหว่างส่วนประกอบทั้งหมด

### 3.2 Three-Act Structure

บังคับใช้โครงสร้างเรื่อง 3 องก์:

- **Act 1 (Setup):** 25% ของเหตุการณ์ - แนะนำโลก, ตัวละคร, Inciting Incident
- **Act 2 (Confrontation):** 50% ของเหตุการณ์ - Rising action, Complications, Midpoint
- **Act 3 (Resolution):** 25% ของเหตุการณ์ - Climax, Resolution, Denouement

### 3.3 Character Development

ตัวละครทุกตัวต้องมี:

- Clear arc: จุดเริ่ม → Midpoint → จุดจบ → การเปลี่ยนแปลง (Transformation)
- แรงจูงใจ (Motivations), ความกลัว (Fears), และความลับ (Secrets) ที่ชัดเจน
- ความสัมพันธ์ที่พัฒนาไปตามเนื้อเรื่อง

### 3.4 Conflict Management

ความขัดแย้งต้องมี:

- หลายมิติ (Internal, External, Emotional, Philosophical, Relational)
- การไล่ระดับความรุนแรง (Escalation) ที่ชัดเจน (ระดับ 3→6→9)
- การคลี่คลายที่น่าพึงพอใจและเชื่อมโยงกับการพัฒนาตัวละคร

---

## 4. Validation Rules

### 4.1 Error Level (ต้องแก้ไข)

- ไม่มีชื่อเรื่อง (No story title)
- ไม่มีตัวละคร (No characters)
- ขาดองก์ใดองก์หนึ่ง (1, 2, หรือ 3)
- ไม่มีตัวละครเอก (No protagonist)
- ชื่อตัวละครว่างเปล่า
- การอ้างอิงตัวละครไม่ถูกต้อง
- คำอธิบายความขัดแย้งว่างเปล่า

### 4.2 Warning Level (ควรแก้ไข)

- ไม่มีเหตุการณ์จุดสุดยอด (No climax event)
- ไม่มีจุดกึ่งกลางเรื่อง (No midpoint event)
- ไม่มีความขัดแย้ง (No conflicts)
- เส้นทางตัวละคร (Character arcs) ไม่สมบูรณ์
- ตัวละครไม่ได้อยู่ในเหตุการณ์ใดเลย
- ไม่มีการคลี่คลายความขัดแย้ง
- การกระจายองก์ไม่สมดุล (Unbalanced act distribution)

### 4.3 Info Level (ข้อเสนอแนะ)

- จังหวะดำเนินเรื่องช้า (Slow pacing)
- จำนวนตัวละครน้อยเกินไป
- โครงสร้างเรื่องอ่อน (Weak structure)

---

## 5. Tech Stack

### core (MCP Server)

| Layer | Tech | Version |
|-------|------|---------|
| Runtime | Node.js | >=22 |
| Language | TypeScript | 6.x |
| Framework | MCP SDK | 1.29.x |

### ui (Unified UI)

| Layer | Tech | Version |
|-------|------|---------|
| Framework | React | 19.x |
| Language | TypeScript | 6.x |
| Desktop | Tauri | 2.x |
| Styling | Tailwind CSS | 4.x |
| Icons | lucide-react | 0.479.x |

---

## 6. Success Metrics

การวิเคราะห์เนื้อเรื่องที่สำเร็จต้องมี:

- ✅ ครบ 3 องก์ พร้อมการกระจายเหตุการณ์ที่สมดุล (25%-50%-25%)
- ✅ ตัวละครหลักทุกคนมี Arc ที่ชัดเจน
- ✅ ทุกความขัดแย้งมีการ Escalation และ Resolution
- ✅ จุดสุดยอด (Climax) วางอยู่ในตำแหน่งที่ส่งผลกระทบสูงสุด
- ✅ ไม่พบ Validation Errors (ยอมรับ Warnings ได้)
- ✅ ความสัมพันธ์ระหว่างองค์ประกอบสอดคล้องกันทั้งหมด

---

## 7. Importance / Role Color Map

| Value | Color (Tailwind) |
|-------|-----------------|
| `inciting` | purple / `bg-purple-100 text-purple-700` |
| `midpoint` | yellow / `bg-yellow-100 text-yellow-700` |
| `climax` | red / `bg-red-100 text-red-700` |
| `resolution` | green / `bg-green-100 text-green-700` |
| `protagonist` | indigo / `bg-indigo-100 text-indigo-700` |
| `antagonist` | rose / `bg-rose-100 text-rose-700` |
| `mentor` | amber / `bg-amber-100 text-amber-700` |
| `supporting` | slate / `bg-slate-100 text-slate-600` |
