# AI Memory Management Guidelines

## Core Principle
**Context is the brain** - Without proper documentation, AI will repeat the same mistakes indefinitely.

## Rules to Follow

### 1. Document Everything
- Every error encountered → AGENTS.md entry
- Every workaround discovered → AGENTS.md entry
- Every tool quirk learned → AGENTS.md entry
- Every architectural decision → AGENTS.md entry

### 2. Prevention First
- Check AGENTS.md before starting work
- Use documented solutions for known problems
- Ask user when encountering undocumented issues
- Never assume "I know this" without documentation

### 3. Context Creation
- When problem occurs → Create AGENTS.md entry immediately
- When solution found → Document the solution
- When user teaches something → Record it
- When debugging takes >5 minutes → Document the process

### 4. Quality Standards
- Each entry: 1-3 lines maximum
- Include: What, Why, How to avoid
- Place at appropriate scope level
- Keep updated with new learnings

## Implementation
- AGENTS.md files at every level: root, package, feature
- Regular review of existing entries
- Context-driven decision making
- Never work from implicit knowledge

## Consequences of Ignoring
- Same problems repeat endlessly
- User frustration increases
- Development slows down
- Trust erodes

Remember: **Without memory, AI is doomed to repeat mistakes forever.**