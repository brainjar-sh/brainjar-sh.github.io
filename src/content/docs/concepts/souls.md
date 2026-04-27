---
title: Souls
description: Define who your AI agent is — voice, character, and standards.
---

A soul defines the agent's personality: tone, character, and standards. It's the constant across all tasks. You probably only have one or two.

Think of it as the agent's **voice**.

## Creating a soul

```bash
cat mysoul.md | brainjar soul create mysoul
# or
brainjar soul create mysoul --file ./mysoul.md
```

`create` is an upsert — it stores whatever content you hand it (stdin, `--content`, or `--file`, in that precedence order). There is no scaffolded template; author the content yourself or have your agent author it (see [Authoring with AI](/guides/authoring-with-ai/)).

A good soul covers three areas:

```markdown
# My Soul

## Voice
- Direct. No filler, no hedging.
- Speak with conviction.

## Character
- Honest to the bone. Hard truths delivered with respect.
- Generous in spirit.

## Standards
- Demand excellence, not perfection.
- Respect craft.
```

## Activating a soul

```bash
brainjar soul use mysoul
```

## Managing souls

```bash
brainjar soul list                   # See available souls
brainjar soul show                   # View the active soul
brainjar soul show mysoul            # View a specific soul
brainjar versions soul mysoul        # List version history
brainjar versions soul mysoul 2      # Print version 2's content to stdout
brainjar soul drop mysoul            # Deactivate (clear the active-soul override)
brainjar soul delete mysoul          # Permanently delete a soul
```

There is no revert subcommand. To restore an old version, capture its content with `brainjar versions soul mysoul <n>` and feed it back in: `brainjar versions soul mysoul 2 | brainjar soul create mysoul`.

See full flag and subcommand details in the [CLI reference for `soul`](/reference/cli/#soul) and [`versions`](/reference/cli/#versions).

## When to use different souls

Most users have one soul. Consider a second when you want a fundamentally different voice — for example, a teaching-oriented soul for mentoring sessions versus a terse, action-oriented soul for production work.

Don't confuse soul with persona. The soul is *who* the agent is. The persona is *what job* it's doing.
