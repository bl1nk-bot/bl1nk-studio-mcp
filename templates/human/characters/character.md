---
type: character
id: {{id}}
canonicalName: {{canonicalName}}
aliases:
{% for alias in aliases %}
  - name: {{alias.name}}
    usedBy: [{% for user in alias.usedBy %}"{{user}}"{% if not loop.last %}, {% endif %}{% endfor %}]
    context: {{alias.context}}
{% endfor %}
tags: [{% for tag in tags %}"{{tag}}"{% if not loop.last %}, {% endif %}{% endfor %}]
status: {{status}}
---

# {{canonicalName}}

## Name Variations
{% for alias in aliases %}
- **{{alias.name}}** — used by {{alias.usedBy|join(', ')}} ({{alias.context}})
{% endfor %}

## Mentions
{% for mention in mentions %}
- **Chapter {{mention.chapter}}**: "{{mention.name}}"{% if mention.speaker %} ({{mention.speaker}}){% endif %}
{% endfor %}

## Relationships
{% for relationship in relationships %}
- [[characters/{{relationship.target}}]] — {{relationship.type}}
{% endfor %}

## Summary
{{summary}}

## Essence
{{essence}}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->