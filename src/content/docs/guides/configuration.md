---
title: Configuration
description: State cascade, environment variables, and backend configuration.
---

## State cascade

brainjar state merges in three tiers. Each tier overrides the previous:

```
global  →  local  →  env
```

### Global state

Stored in `~/.brainjar/state.yaml`. Applies to all projects.

```bash
brainjar persona use engineer        # Sets global persona
brainjar rules add security          # Adds to global rules
```

### Local state

Stored in `.brainjar/state.yaml` in your project directory. Overrides global for that project only.

```bash
brainjar persona use planner --local
brainjar rules add no-delete --local
```

Global settings still apply — local only overrides what you specify:

```
soul     craftsman (global)
persona  planner (local)
rules    default (global), no-delete (+local)
```

### Environment variables

Override everything for a single session:

| Variable | Effect |
|----------|--------|
| `BRAINJAR_HOME` | Override `~/.brainjar/` location |
| `BRAINJAR_SOUL` | Override active soul |
| `BRAINJAR_PERSONA` | Override active persona |
| `BRAINJAR_IDENTITY` | Override active identity |
| `BRAINJAR_RULES_ADD` | Comma-separated rules to add |
| `BRAINJAR_RULES_REMOVE` | Comma-separated rules to remove |

Set to empty string to explicitly unset (e.g., `BRAINJAR_SOUL=""` removes the soul for that session).

```bash
BRAINJAR_PERSONA=reviewer claude
```

## Backends

brainjar supports multiple agent backends:

```bash
brainjar init --backend claude   # Default — writes ~/.claude/CLAUDE.md
brainjar init --backend codex    # Writes ~/.codex/AGENTS.md
```

Switch backends:

```bash
brainjar reset --backend codex
```

## Backup & restore

On first sync, brainjar backs up any existing config to `CLAUDE.md.pre-brainjar`. Running `brainjar reset` removes brainjar-managed config and restores the backup.

## Obsidian support

`~/.brainjar/` is a folder of markdown files — it's already almost an Obsidian vault.

```bash
brainjar init --obsidian
```

This adds `.obsidian/` config that hides private files from the file explorer and includes templates for creating new souls, personas, and rules from within Obsidian.
