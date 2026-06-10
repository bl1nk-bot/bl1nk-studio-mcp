---
type: location
id: {{id}}
name: {{name}}
type: {{locationType}}
region: {{region}}
significance: {{significance}}
tags: [{{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
---

# {{name}}

## Type
{{locationType}}

## Region
{{region}}

## Significance
{{significance}}

## Description
{{description}}

## Key Features
{{#each keyFeatures}}
- {{this}}
{{/each}}

## Associated Characters
{{#each associatedCharacters}}
- [[characters/{{this}}]]
{{/each}}

## Scenes Set Here
{{#each scenesSetHere}}
- [[scenes/{{this}}]]
{{/each}}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->