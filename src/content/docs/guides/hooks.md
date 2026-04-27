---
title: Hooks
description: Automatic config sync via the platform's hook system.
---

brainjar integrates with the active platform's hook system for automatic context injection. When hooks are installed, brainjar syncs your config on every session start — no manual `brainjar sync` needed. Claude Code, Codex, and Cursor all expose a hook surface; the active context's platform decides where the hook is written.

See [CLI reference](/reference/cli/#hooks) for full flag details.

## Installing hooks

```bash
brainjar hooks install                  # Default scope: project (shared with collaborators)
brainjar hooks install --scope local    # Per-checkout, not shared
brainjar hooks install --scope user     # Global across every project
```

The default `project` scope writes the hook into the repo's shared settings (e.g. Claude Code's `.claude/settings.json`) so every collaborator picks it up on clone. Use `local` for a per-checkout override that stays out of version control (Claude Code: under `projects.<root>.hooks` in `~/.claude.json`), or `user` for a personal global default. Pass `--project <path>` to target a different repo root; ignored when `--scope=user`.

Scope availability varies by platform — `brainjar platform list` shows which scopes each adapter supports.

## How it works

The hook runs `brainjar sync` on the platform's session-start event. This means:

1. You change a soul, persona, procedure, or rule (or load a different brain)
2. Next time the agent starts a session, the hook fires
3. The platform's managed config block (e.g. `CLAUDE.md`, `AGENTS.md`) is rewritten with the latest composed prompt
4. The agent picks up the new behavior

No manual sync step needed. The hook is idempotent — it only rewrites the brainjar-managed section between the `<!-- brainjar:begin -->` / `<!-- brainjar:end -->` markers.

## Managing hooks

```bash
brainjar hooks status    # Show whether the hook is registered, and at which scope
brainjar hooks remove    # Remove the hook from settings
```

## Manual sync

If you're not using hooks, sync manually after making changes:

```bash
brainjar sync
```
