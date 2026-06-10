---
type: location
id: {{id}}
name: {{name}}
type: {{locationType}}
region: {{region}}
significance: {{significance}}
tags: [{% for tag in tags %}"{{tag}}"{% if not loop.last %}, {% endif %}{% endfor %}]
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
{% for feature in keyFeatures %}
- {{feature}}
{% endfor %}

## Associated Characters
{% for char in associatedCharacters %}
- [[characters/{{char}}]]
{% endfor %}

## Scenes Set Here
{% for scene in scenesSetHere %}
- [[scenes/{{scene}}]]
{% endfor %}

---

<!-- MACHINE_READABLE_BLOCK
{{jsonBlock}}
-->