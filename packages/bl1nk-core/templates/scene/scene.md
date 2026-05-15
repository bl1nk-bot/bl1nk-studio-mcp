---
type: scene
id: {{id}}
title: {{title}}
chapter: {{chapter}}
act: {{act}}
sceneNumber: {{sceneNumber}}
location: {{location}}
characters: [{{#each characters}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
tags: [{{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
---

# {{title}}

## Location
[[locations/{{location}}]]

## Characters Present
{{#each characters}}
- [[characters/{{this}}]]
{{/each}}

## Summary
{{summary}}

## Key Events
{{#each keyEvents}}
- {{this}}
{{/each}}

## Emotional Arc
{{emotionalArc}}

## Conflict
{{conflict}}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->