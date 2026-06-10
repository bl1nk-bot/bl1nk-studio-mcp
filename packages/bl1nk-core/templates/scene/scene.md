---
type: scene
id: {{id}}
title: {{title}}
chapter: {{chapter}}
act: {{act}}
sceneNumber: {{sceneNumber}}
location: {{location}}
characters: [{% for character in characters %}"{{character}}"{% if not loop.last %}, {% endif %}{% endfor %}]
tags: [{% for tag in tags %}"{{tag}}"{% if not loop.last %}, {% endif %}{% endfor %}]
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