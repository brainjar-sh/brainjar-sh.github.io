---
title: Personas
description: Define how your AI agent works — role, workflow, and bundled rules.
---

A persona defines the agent's role and workflow. An engineer persona works differently than a reviewer or an architect. Switch personas based on what you're doing.

Think of it as the agent's **job description**.

## Creating a persona

```bash
brainjar persona create planner --description "Design and planning sessions"
```

This creates `~/.brainjar/personas/planner.md`. Edit it:

```markdown
---
rules:
  - default
  - security
---

# Planner

You are a technical planner. Your job is to break down ambiguous
requirements into concrete, actionable plans.

## How you work

1. Clarify the goal
2. Identify constraints
3. Propose options with tradeoffs
4. Produce a plan document
```

## Bundled rules

The `rules` frontmatter automatically activates those rules when the persona is active. They merge with any explicitly activated rules.

## Activating a persona

```bash
brainjar persona use planner          # Global
brainjar persona use planner --local  # This project only
```

## Managing personas

```bash
brainjar persona list            # See available personas
brainjar persona show            # View the active persona
brainjar persona show reviewer   # View a specific persona
brainjar persona drop reviewer   # Delete a persona
```

## Switching per task

```bash
brainjar persona use engineer   # Build session
brainjar persona use reviewer   # Review session
brainjar persona use planner    # Design session
```

Or scope it to a single shell session:

```bash
brainjar shell --persona reviewer
```
