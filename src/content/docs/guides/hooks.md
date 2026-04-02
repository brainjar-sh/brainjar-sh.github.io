---
title: Hooks
description: Automatic config sync via Claude Code's hook system.
---

brainjar integrates with Claude Code's hook system for automatic context injection. When hooks are installed, brainjar syncs your config on every session start — no manual `brainjar sync` needed.

## Installing hooks

```bash
brainjar hooks install           # Writes to ~/.claude/settings.json
brainjar hooks install --local   # This project only
```

## How it works

The hook runs `brainjar sync --quiet` on Claude Code's `SessionStart` event. This means:

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
brainjar sync --quiet    # No output on success
```
