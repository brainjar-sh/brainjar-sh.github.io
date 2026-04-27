---
title: Getting Started
description: Install brainjar and set up your first agent configuration.
---

## Install

```bash
curl -fsSL https://get.brainjar.sh/brainjar/install.sh | sh
```

The script installs a single Go binary. Update later with `brainjar upgrade`.

## Initialize

```bash
brainjar init
```

This creates `~/.brainjar` with a SQLite database, the default workspace, and a starter API key. It does **not** seed soul, persona, or rule content, and it does **not** sync anything to your agent's config file.

To populate a fresh workspace, either author content yourself (see the [concepts pages](/concepts/overview/)) or import a starter bundle with [`brainjar pack import`](/guides/packs/).

## Verify

```bash
brainjar status
```

```
workspace: <uuid>
home:      ~/.brainjar

effective state
  soul:      (unset)
  persona:   (unset)
  procedure: (unset)
  rules:     (none)
```

For a one-line summary suitable for shell prompts:

```bash
brainjar status --short
```

```
soul=- persona=- procedure=- rules=0
```

## Your first switch

Once you have a persona saved, activate it and push the change into your agent's config:

```bash
brainjar persona use reviewer
brainjar sync
```

`persona use` updates workspace state. `brainjar sync` composes the effective prompt and writes it into the platform's managed section (e.g. `.claude/CLAUDE.md` for Claude Code). If you've installed the SessionStart hook (`brainjar hooks install`), sync runs automatically when your agent starts a new session.

## Run an agent without writing to disk

`brainjar shell` composes a prompt in memory and spawns Claude or Codex with it as the appended system prompt. Nothing is written to `CLAUDE.md`, so multiple terminals with different brains do not collide.

```bash
brainjar shell --persona reviewer --task "Audit src/auth"
brainjar shell --brain cto -- --model opus
```

Use `shell` for one-off agent runs, scoped audits, or experiments where you don't want to mutate workspace state.

## What happened

`brainjar sync` composed your active soul, persona, procedure, and rules into a single prompt and wrote it into your agent's config file between `<!-- brainjar:begin -->` / `<!-- brainjar:end -->` markers. Everything outside the markers is yours.

## Next steps

- Learn about the [core concepts](/concepts/overview/) — soul, persona, rules, procedure, brain
- [Register brainjar as an MCP server](/guides/mcp/) — give your agent native access to all brainjar tools
- [Migrate an existing config](/guides/migration/) into composable layers
- See the full [CLI reference](/reference/cli/)
- Browse [recipes](/guides/recipes/) for common workflows
