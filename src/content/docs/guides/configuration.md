---
title: Configuration
description: State cascade, environment variables, and backend configuration.
---

## State cascade

brainjar state merges in three tiers. Each tier overrides the previous:

```
workspace  →  project  →  env
```

### Workspace state

Stored on the server. Applies to all projects within the workspace.

```bash
brainjar persona use engineer        # Sets workspace persona
brainjar rules add security          # Adds to workspace rules
```

### Project state

Stored on the server at project scope. Overrides workspace for that project only.

```bash
brainjar persona use planner --project
brainjar rules add no-delete --project
```

Workspace settings still apply — project only overrides what you specify:

```
soul     craftsman (workspace)
persona  planner (project)
rules    boundaries (workspace), no-delete (+project)
```

### Environment variables

Override everything for a single session:

| Variable | Effect |
|----------|--------|
| `BRAINJAR_HOME` | Override `~/.brainjar/` location |
| `BRAINJAR_SOUL` | Override active soul |
| `BRAINJAR_PERSONA` | Override active persona |
| `BRAINJAR_RULES_ADD` | Comma-separated rules to add |
| `BRAINJAR_RULES_REMOVE` | Comma-separated rules to remove |

Set to empty string to explicitly unset (e.g., `BRAINJAR_SOUL=""` removes the soul for that session).

```bash
BRAINJAR_PERSONA=reviewer claude
```

## Config file

The CLI config lives at `~/.brainjar/config.yaml`:

```yaml
server:
  url: http://localhost:7742
  mode: local
  bin: ~/.brainjar/bin/brainjar-server
  pid_file: ~/.brainjar/server.pid
  log_file: ~/.brainjar/server.log
workspace: default
backend: claude
```

See [Architecture](/concepts/architecture/) for details on server modes.

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
