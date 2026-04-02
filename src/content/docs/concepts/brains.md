---
title: Brains
description: Save and restore complete agent configurations in one shot.
---

A brain is a named snapshot of soul + persona + rules. Instead of switching three things separately, save your setup once and activate it in one command.

## Saving a brain

Set up the configuration you want, then snapshot it:

```bash
brainjar soul use craftsman
brainjar persona use reviewer
brainjar rules add boundaries
brainjar rules add security
brainjar brain save review
```

## Activating a brain

```bash
brainjar brain use review
```

This activates the soul, persona, and all rules from the snapshot in one shot.

## Managing brains

```bash
brainjar brain list          # See available brains
brainjar brain show review   # Inspect a brain's config
brainjar brain drop review   # Deactivate a brain (clears soul, persona, rules)
brainjar brain delete review # Permanently delete a brain
```

## Brain vs. individual layers

| Approach | When to use |
|----------|-------------|
| **Brain** | Repeatable workflow you do often (code review, design, debugging) |
| **Individual layers** | Exploratory work, one-off overrides, or changing one thing |

## Brains and compose

Brains are the primary input to `compose`, which assembles a full prompt for subagent dispatch:

```bash
brainjar compose review --task "Review the changes in src/sync.ts"
```

This outputs the complete prompt (soul + persona + rules + task) ready to pass to a subagent. See [Subagent Orchestration](/guides/subagents/) for compose basics and [Orchestration Patterns](/guides/orchestration-patterns/) for multi-agent workflow patterns.
