---
title: Getting Started
description: Install brainjar and set up your first agent configuration.
---

## Install

```bash
bun install -g @brainjar/cli
```

Or with npm:

```bash
npm install -g @brainjar/cli
```

## Initialize

```bash
brainjar init --default
```

This creates your config, downloads the brainjar server, starts it, and seeds starter content:

- **Soul:** `craftsman` — direct, rigorous, craft-oriented voice
- **Personas:** `engineer` (activated), `planner`, `reviewer` — three workflows out of the box
- **Rules:** `boundaries`, `context-recovery`, `task-completion`, `git-discipline`, `security`

It also syncs everything into your `CLAUDE.md` (or `AGENTS.md` for Codex).

## Verify

```bash
brainjar status
```

```
soul     craftsman
persona  engineer
rules    boundaries, context-recovery, task-completion, git-discipline, security
```

## Your first switch

Try changing the persona for a different workflow:

```bash
brainjar persona use reviewer
brainjar status --sync
```

Now your agent behaves as a code reviewer instead of an engineer — same soul, same rules, different workflow.

## What happened

brainjar fetched your active layers from the server, merged them, and inlined them into your agent's config file between `<!-- brainjar:start -->` / `<!-- brainjar:end -->` markers. Everything outside the markers is yours.

## Next steps

- Learn about the [core concepts](/concepts/overview/) — soul, persona, rules, brain
- [Migrate an existing config](/guides/migration/) into composable layers
- See the full [CLI reference](/reference/cli/)
- Browse [recipes](/guides/recipes/) for common workflows
