# Template System Architecture

## Overview

The MCP server now supports a dual-template system with separate templates for human-readable and machine-readable output.

## Directory Structure

```
templates/
├── human/           # Human-readable templates (Markdown with frontmatter)
│   ├── characters/
│   │   └── character.md
│   ├── scenes/
│   │   └── scene.md
│   └── locations/
│       └── location.md
└── machine/         # Machine-readable templates (JSON)
    ├── characters/
    │   └── character.json
    ├── scenes/
    │   └── scene.json
    └── locations/
        └── location.json
```

## Template Types

### Human Templates (Markdown)
- Use Jinja2-like syntax with Handlebars engine
- Include frontmatter metadata (YAML)
- Human-readable content with formatting
- Embedded machine-readable JSON block

### Machine Templates (JSON)
- Pure JSON structure for programmatic processing
- Optimized for machine reading and validation
- Used for data interchange and API responses

## Syntax Comparison

| Feature | Jinja2 (Human Templates) | Handlebars (Legacy) |
|---------|------------------------|-------------------|
| Variables | `{{variable}}` | `{{variable}}` |
| Loops | `{% for item in items %}` | `{{#each items}}` |
| Conditions | `{% if condition %}` | `{{#if condition}}` |
| Filters | `{{value\|filter}}` | Helpers required |

## Usage

The system automatically detects which template structure to use:
1. Checks for `human/` directory first (preferred)
2. Falls back to legacy `characters/`, `scene/`, `world/` structure

## Migration

Existing projects can continue using legacy templates. New projects should use the human/machine structure for better separation of concerns.

## Benefits

- **Separation of Concerns**: Human and machine formats are clearly separated
- **Better Tooling**: JSON templates can be validated and processed independently
- **Future-Proof**: Easy to add new output formats (XML, YAML, etc.)
- **Jinja-like Syntax**: More familiar to Python developers and other template systems