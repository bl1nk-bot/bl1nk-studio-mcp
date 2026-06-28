---
type: scene
id: {{id}}
title: {{title}}
chapter: {{chapter}}
act: {{act}}
sceneNumber: {{sceneNumber}}
location: {{location}}
characters: [{% for char in characters %}"{{char}}"{% if not loop.last %}, {% endif %}{% endfor %}]
tags: [{% for tag in tags %}"{{tag}}"{% if not loop.last %}, {% endif %}{% endfor %}]
---

# {{title}}

## Location

[[locations/{{location}}]]

## Characters Present

{% for char in characters %}

- [[characters/{{char}}]]
{% endfor %}

## Summary

{{summary}}

## Key Events

{% for event in keyEvents %}

- {{event}}
{% endfor %}

## Emotional Arc

{{emotionalArc}}

## Conflict

{{conflict}}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->