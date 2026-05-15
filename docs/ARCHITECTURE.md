# Project Architecture & Dataflow

> System architecture and dataflow diagrams
> Last updated: 2026-05-15

## Layer Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONSUMERS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Desktop App │  │ GitHub Sync  │  │   AI Agents (MCP)    │  │
│  │ (Tauri+React)│  │  (Webhook)   │  │ (Claude, Qwen, etc)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MCP SERVER (bl1nk)                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   TOOL REGISTRATION                       │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ GRANULAR_TOOLS  │  │  BL1NK_VISUAL_TOOLS (legacy) │   │   │
│  │  │   (11 tools)    │  │       (4 tools)              │   │   │
│  │  └────────┬────────┘  └──────────────┬───────────────┘   │   │
│  │           │                          │                    │   │
│  │  ┌────────▼──────────────────────────▼───────────────┐   │   │
│  │  │              Schemas (Zod)                         │   │   │
│  │  └──────────────────────┬───────────────────────────┘   │   │
│  └─────────────────────────┼───────────────────────────────┘   │
│                            │                                   │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                   EXECUTORS                              │   │
│  │  ┌────────────────────────┐  ┌──────────────────────┐   │   │
│  │  │  executeGranularTool   │  │  executeStoryTool    │   │   │
│  │  └───────────┬────────────┘  └──────────┬───────────┘   │   │
│  └──────────────┼──────────────────────────┼───────────────┘   │
│                 │                          │                   │
└─────────────────┼──────────────────────────┼───────────────────┘
                  │                          │
                  ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CORE LOGIC                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  analyzer.ts │  │ validators.ts│  │   exa-search.ts      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
└─────────┼─────────────────┼─────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPORTERS                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ mermaid.ts   │  │  canvas.ts   │  │   dashboard.ts       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Agent Skills Architecture

Skills are modular capabilities that extend agent functionality. They are centralized in the root `skills/` directory.

### Three Levels of Skill Loading

1.  **Level 1: Metadata (Always loaded)**: YAML frontmatter in `SKILL.md` (Name, Description).
2.  **Level 2: Instructions (Triggered)**: Procedural knowledge and workflows in `SKILL.md`.
3.  **Level 3: Resources (As needed)**: Scripts, templates, and reference materials.

| Level | When Loaded | Token Cost | Content |
| :--- | :--- | :--- | :--- |
| **1: Metadata** | At startup | ~100 tokens | YAML frontmatter |
| **2: Instructions** | On trigger | < 5k tokens | SKILL.md body |
| **3: Resources** | As needed | Unlimited | Bundled files/scripts |

## Data Contract

### Core Types

```typescript
interface StoryGraph {
  meta: {
    title: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    genre?: string;
  };
  characters: Character[];
  conflicts: Conflict[];
  events: EventNode[];
  relationships: Relationship[];
  tags: string[];
}
```

## Integration Points

- **Desktop App**: Consumes `StoryGraph` JSON for visualization. API Client logic is implemented in Rust (Tauri).
- **GitHub Sync**: Synchronizes exported markdown/CSV files to Notion via webhooks.
- **AI Agents**: Interact with 16 MCP tools (11 granular, 4 legacy, 1 standalone).
