---
title: Souls
description: Define who your AI agent is — voice, character, and standards.
---

A soul defines the agent's personality: tone, character, and standards. It's the constant across all tasks. You probably only have one or two.

Think of it as the agent's **voice**.

## Creating a soul

```bash
brainjar soul create mysoul --description "Direct and rigorous"
```

This creates a soul on the server with a starter template — a title and your description. You fill in the rest, or let your AI agent do it (see [Authoring with AI](/guides/authoring-with-ai/)).

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
brainjar soul list          # See available souls
brainjar soul show          # View the active soul
brainjar soul show mysoul   # View a specific soul
brainjar soul drop mysoul   # Deactivate a soul
brainjar soul delete mysoul # Permanently delete a soul
```

## When to use different souls

Most users have one soul. Consider a second when you want a fundamentally different voice — for example, a teaching-oriented soul for mentoring sessions versus a terse, action-oriented soul for production work.

Don't confuse soul with persona. The soul is *who* the agent is. The persona is *what job* it's doing.
