# SCHEMA_DRAFT.md — มหาพิมพ์เขียวข้อมูลแบบแตกกิ่ง (Comprehensive Branching Schema)

> **Architect's Command:** "ห้ามลบของเดิม ให้แตกกิ่งเพิ่มให้ครอบคลุม"
> **Hand's Commitment:** รวมศูนย์ข้อมูลเดิม + กิ่งก้านใหม่ (Power, Logic, Aesthetic)

---

## 🌳 Level 0: The Root (Project & Specs)
| Entity | Fields | Description |
| :--- | :--- | :--- |
| **Project** | `id`, `name`, `status`, `createdAt`, `updatedAt` | รากฐานของโปรเจกต์ |
| **Spec** | `projectId`, `actRule` (25-50-25), `pacingTarget`, `strictness` | พิมพ์เขียวควบคุมกฎ |

---

## 🌿 Level 1: Narrative & Aesthetic Branch (กิ่งแก่นเรื่อง)
| Entity | Fields | Description |
| :--- | :--- | :--- |
| **Theme** | `coreTheme`, `motifs[]`, `symbolism[]` | แก่นเรื่องและสัญลักษณ์ |
| **Style** | `tone`, `voice`, `pacingPreference` | โทนและสำนวน |
| **Outline** | `logline`, `premise`, `majorBeats[]` | โครงเรื่องระดับสูง |

---

## 🎭 Level 2: Entity & Power Branch (กิ่งตัวละครและพลัง)
| Entity | Fields | Description |
| :--- | :--- | :--- |
| **Character**| `id`, `name`, `role`, `archetype`, `traits[]`, `motivations[]`, `fears[]`, `secretsOrLies[]`, `tags[]` | ข้อมูลตัวละคร (คืนค่าเดิมมาครบ) |
| **Arc** | `start`, `midpoint`, `end`, `transformation`, `emotionalJourney[]` | พัฒนาการตัวละคร (คืนค่าเดิมมาครบ) |
| **Power** | `system`, `ability`, `mechanics`, `cost`, `limits` | ระบบพลัง (กิ่งใหม่) |
| **Relation** | `sourceId`, `targetId`, `type`, `strength`, `tension` | ความสัมพันธ์ |

---

## ⏱️ Level 3: Structural Backbone (กิ่งกาลเวลา)
| Entity | Fields | Description |
| :--- | :--- | :--- |
| **Timeline** | `era`, `absoluteTime`, `relativeOrder` | เส้นเวลาใหญ่ |
| **PlotPoint**| `id`, `act`, `type`, `goal` | จุดหักเห |
| **Event** | `id`, `label`, `description`, `act`, `importance`, `characterIds[]`, `conflictIds[]`, `emotionalTone`, `consequence` | เหตุการณ์ (คืนค่าเดิมมาครบ) |
| **Scene** | `id`, `eventId`, `location`, `beats[]`, `isFlashback` | หน่วยย่อย |

---

## 🧠 Level 4: Logic & Causality (กิ่งตรรกะ)
| Entity | Fields | Description |
| :--- | :--- | :--- |
| **Cause** | `triggerId`, `effectId`, `logicType`, `isInevitable` | เหตุและผล (Causality Chain) |
| **Plot** | `threadId`, `priority`, `status` (Open/Resolved) | การติดตามปมเรื่อง |

---

## 🛠️ ยุทธศาสตร์การซ่อม (No-Deletion Strategy)
1. **กู้คืน Zod:** ผมจะแก้ `schemas.ts` ให้มี Field เดิมครบถ้วน + เพิ่ม Field ใหม่
2. **กู้คืน Types:** `types.ts` จะต้องพ่น Interface ที่มี Property เดิมครบ เพื่อให้เทสที่ "คืนชีพ" มาแล้วไม่พัง
3. **Refactor Analyzer:** ปรับให้ใส่ค่า Default ให้ครบทุกกิ่ง ไม่ปล่อยให้ว่างจน Error

Architect ครับ ร่างนี้คือการ **"รวมพลัง"** ระหว่างของเดิมที่คุณกู้มา กับของใหม่ที่ต้องแตกกิ่งเพิ่ม... แบบนี้ "ถูกทาง" สำหรับคุณหรือยังครับ?
