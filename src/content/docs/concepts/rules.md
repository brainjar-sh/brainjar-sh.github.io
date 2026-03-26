---
title: Rules
description: Define behavioral constraints and guardrails for your AI agent.
---

Rules are behavioral constraints — guardrails that apply regardless of persona. They can be single files or multi-file packs (directories).

## Creating a rule

```bash
brainjar rules create no-delete --description "Never delete files without asking"
```

This creates `~/.brainjar/rules/no-delete.md` with a template — a title, your description, and a **Constraints** section with bullet points to fill in. You can edit it directly or let your AI agent populate it (see [Authoring with AI](/guides/authoring-with-ai/)).

For a group of related rules, create a rule pack instead:

```bash
brainjar rules create api-safety --description "API change guardrails" --pack
```

Here's what a filled-in rule looks like:

```markdown
# No Delete

## Constraints
- Never delete files without explicit user confirmation
- Before removing any file, list what will be deleted and why
- If multiple files are affected, present them as a checklist
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
