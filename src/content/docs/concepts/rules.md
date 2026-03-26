---
title: Rules
description: Define behavioral constraints and guardrails for your AI agent.
---

Rules are behavioral constraints — guardrails that apply regardless of persona. They can be single files or multi-file packs (directories).

## Creating a rule

```bash
brainjar rules create no-delete --description "Never delete files without asking"
```

This creates `~/.brainjar/rules/no-delete.md`. Edit it:

```markdown
# No Delete

Never delete files without explicit user confirmation.
Before removing any file, list what will be deleted and why.
```

## Rule packs

A rule pack is a directory of related rules that activate together:

```
~/.brainjar/rules/
  default/              # A rule pack
    boundaries.md
    context-recovery.md
    task-completion.md
  security.md           # A single rule
  no-delete.md          # Another single rule
```

When you activate `default`, all files in the directory are included.

## Activating rules

```bash
brainjar rules add security            # Global
brainjar rules add no-delete --local   # This project only
brainjar rules remove security         # Deactivate
```

Rules from a persona's frontmatter activate automatically — you don't need to add them manually.

## Managing rules

```bash
brainjar rules list              # See all rules with status
brainjar rules show security     # View a rule's content
```

## Scope annotations

When you see scope labels in `status` and `rules list` output:

| Label | Meaning |
|-------|---------|
| `(global)` | Set in `~/.brainjar/state.yaml` |
| `(local)` | Overridden in `.brainjar/state.yaml` |
| `(+local)` | Added by local override |
| `(-local)` | Removed by local override |
| `(env)` | Overridden by `BRAINJAR_*` env var |
| `(+env)` | Added by env var |
| `(-env)` | Removed by env var |
