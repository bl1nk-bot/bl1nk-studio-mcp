# TOOL_MAPPING.md — bl1nk-visual-mcp

> Complete mapping of all 16 tools (11 granular + 4 legacy + 1 standalone)
> Last updated: 2026-05-14

---

## Granular Tools (11 tools — Source of Truth)

These tools are defined in \`Schemas\` and executed via \`executeGranularTool\`.

### 1. analyze_story

Parse story text into StoryGraph JSON.

- **Input**: \`text: string\`, \`depth?: 'basic' | 'detailed' | 'deep'\`, \`includeMetadata?: boolean\`
- **Output**: StoryGraph JSON object

### 2. export_mermaid

Export StoryGraph as Mermaid diagram markdown.

- **Input**: \`graph: StoryGraph\`, \`includeMetadata?: boolean\`, \`style?: 'default' | 'dark' | 'minimal'\`
- **Output**: Mermaid diagram string

### 3. export_canvas

Export StoryGraph as Canvas JSON (Obsidian/React Flow).

- **Input**: \`graph: StoryGraph\`, \`includeMetadata?: boolean\`, \`autoLayout?: boolean\`
- **Output**: Canvas JSON object

### 4. export_dashboard

Export StoryGraph as HTML dashboard (Chart.js + Tailwind).

- **Input**: \`graph: StoryGraph\`, \`includeStats?: boolean\`, \`includeRecommendations?: boolean\`
- **Output**: HTML string

### 5. export_markdown

Export StoryGraph as structured Markdown document.

- **Input**: \`graph: StoryGraph\`, \`includeMetadata?: boolean\`, \`includeAnalysis?: boolean\`
- **Output**: Markdown string (wrapped in artifact format)

### 6. validate_story_structure

Validate StoryGraph against 3-act structure rules (50+ rules).

- **Input**: \`graph: StoryGraph\`, \`strict?: boolean\`, \`includeRecommendations?: boolean\`
- **Output**: ValidationResult JSON

### 7. extract_characters

Extract character data from StoryGraph.

- **Input**: \`graph: StoryGraph\`, \`detailed?: boolean\`
- **Output**: Array of character objects

### 8. extract_conflicts

Extract conflict data from StoryGraph.

- **Input**: \`graph: StoryGraph\`, \`includeEscalation?: boolean\`
- **Output**: Array of conflict objects

### 9. build_relationship_graph

Build relationship graph from StoryGraph.

- **Input**: \`graph: StoryGraph\`, \`includeStats?: boolean\`
- **Output**: Relationship data

### 10. export_mcp_ui_dashboard

Export StoryGraph as MCP-UI compatible HTML dashboard (Modern theme).

- **Input**: \`graph: StoryGraph\`, \`includeStats?: boolean\`, \`includeRecommendations?: boolean\`
- **Output**: HTML string

### 11. exa_search_story

Search external references for story research using Exa AI.

- **Input**: \`query: string\`, \`category?: enum\`, \`numResults?: number\`
- **Output**: Formatted search results

---

## Legacy & Standalone Tools

### 12. search_entries (Standalone)

Search and extract ALL entities from story text using Handlebars templates.

- **Input**: \`text: string\`, \`chapterNumber?: number\`, \`extractOptions?: object\`

### 13. validate_story (Legacy)

Quick validation from text input.

- **Input**: \`text: string\`, \`strict?: boolean\`

### 14. generate_artifacts (Legacy)

Generate ALL artifacts automatically (mermaid, canvas, markdown, html, csv).

- **Input**: \`graph: StoryGraph\`

### 15. sync_github (Legacy)

Push generated files to GitHub repository.

- **Status**: Not implemented.

---

## Tool Registration Flow

1. Server starts (\`packages/bl1nk-core/src/index.ts\`)
2. Registers **11 Granular Tools** via \`GRANULAR_TOOLS\` loop.
3. Registers **4 Legacy Tools** via \`BL1NK_VISUAL_TOOLS\` loop.
4. Registers **Standalone \`search_entries\`** tool.
5. Ready for Stdio transport.
