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

This creates `~/.brainjar/` with starter content:

- **Soul:** `craftsman` — direct, rigorous, craft-oriented voice
- **Persona:** `engineer` — software engineering workflow
- **Rules:** `default` — boundaries, context recovery, task completion

It also syncs everything into your `CLAUDE.md` (or `AGENTS.md` for Codex).

## Verify

```bash
brainjar status
```

```
soul     craftsman (global)
persona  engineer (global)
rules    default (global)
```

## Your first switch

Try changing the persona for a different workflow:

```bash
brainjar persona use reviewer
brainjar status --sync
```

Now your agent behaves as a code reviewer instead of an engineer — same soul, same rules, different workflow.

## What happened

brainjar read the markdown files in `~/.brainjar/`, merged the active layers, and inlined them into your agent's config file between `<!-- brainjar:start -->` / `<!-- brainjar:end -->` markers. Everything outside the markers is yours.

## Next steps

- Learn about the [core concepts](/concepts/overview/) — soul, persona, rules, brain
- See the full [CLI reference](/reference/cli/)
- Browse [recipes](/guides/recipes/) for common workflows
