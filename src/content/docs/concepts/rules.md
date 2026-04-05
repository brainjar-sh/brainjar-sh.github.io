---
title: Rules
description: Define behavioral constraints and guardrails for your AI agent.
---

Rules are behavioral constraints — guardrails that apply regardless of persona.

## Creating a rule

```bash
brainjar rules create no-delete --description "Never delete files without asking"
```

This creates a rule on the server with a template — a title, your description, and a **Constraints** section with bullet points to fill in. Let your AI agent populate it (see [Authoring with AI](/guides/authoring-with-ai/)).

Here's what a filled-in rule looks like:

```markdown
# No Delete

## Constraints
- Never delete files without explicit user confirmation
- Before removing any file, list what will be deleted and why
- If multiple files are affected, present them as a checklist
```

## Activating rules

```bash
brainjar rules add security              # Workspace scope
brainjar rules add no-delete --project   # This project only
brainjar rules drop security             # Deactivate
brainjar rules delete security           # Permanently delete
```

Rules bundled with a persona activate automatically — you don't need to add them manually.

## Managing rules

```bash
brainjar rules list                      # See all rules with status
brainjar rules show security             # View a rule's content
brainjar rules history security          # List version history
brainjar rules show security --rev 2     # View a previous version
brainjar rules revert security --to 2    # Restore a previous version
```

## Scope annotations

When you see scope labels in `status` and `rules list` output:

| Label | Meaning |
|-------|---------|
| `(workspace)` | Set at workspace scope on the server |
| `(project)` | Overridden at project scope |
| `(+project)` | Added by project override |
| `(-project)` | Removed by project override |
| `(env)` | Overridden by `BRAINJAR_*` env var |
| `(+env)` | Added by env var |
| `(-env)` | Removed by env var |
