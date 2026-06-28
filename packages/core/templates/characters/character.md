---
type: character
id: {{id}}
canonicalName: {{canonicalName}}
aliases:
{{#each aliases}}
  - name: {{name}}
    usedBy: [{{#each usedBy}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
    context: {{context}}
{{/each}}
tags: [{{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
status: {{status}}
---

# {{canonicalName}}

## Name Variations
{{#each aliases}}
- **{{name}}** — used by {{usedBy}} ({{context}})
{{/each}}

## Mentions
{{#each mentions}}
- **Chapter {{chapter}}**: "{{name}}"{{#if speaker}} ({{speaker}}){{/if}}
{{/each}}

## Relationships
{{#each relationships}}
- [[characters/{{target}}]] — {{type}}
{{/each}}

## Summary
{{summary}}

## Essence
{{essence}}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->