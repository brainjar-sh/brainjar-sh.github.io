---
title: Hooks
description: Automatic config sync via Claude Code's hook system.
---

brainjar integrates with Claude Code's hook system for automatic context injection. When hooks are installed, brainjar syncs your config on every session start — no manual `brainjar sync` needed.

See [CLI reference](/reference/cli/#hooks) for full flag details.

## Installing hooks

```bash
brainjar hooks install                  # Default scope: project (shared with collaborators)
brainjar hooks install --scope local    # Per-checkout, not shared
brainjar hooks install --scope user     # Global across every project
```

The default `project` scope writes the hook into the repo's shared settings so every collaborator picks it up on clone. Use `local` for a per-checkout override that stays out of version control, or `user` for a personal global default.

## How it works

The hook runs `brainjar sync` on Claude Code's `SessionStart` event. This means:

1. You change a soul, persona, or rule
2. Next time Claude Code starts a session, the hook fires
3. Your `CLAUDE.md` is updated with the latest config
4. The agent picks up the new behavior

No manual sync step needed.

## Managing hooks

```bash
brainjar hooks status    # Check if hooks are installed
brainjar hooks remove    # Remove hooks from settings
```

## Manual sync

If you're not using hooks, sync manually after making changes:

```bash
brainjar sync
```
