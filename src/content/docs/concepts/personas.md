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

This creates a persona on the server with a structured template — sections for **direct mode**, **subagent mode**, and **always** behaviors. Fill it in yourself or let your AI agent handle it (see [Authoring with AI](/guides/authoring-with-ai/)).

You can also bundle rules at creation time:

```bash
brainjar persona create planner --description "Design and planning sessions" --rules boundaries,security
```

Here's what a filled-in persona looks like:

```markdown
# Planner

You are a technical planner. Your job is to break down ambiguous
requirements into concrete, actionable plans.

## Direct mode
1. Clarify the goal
2. Identify constraints
3. Propose options with tradeoffs
4. Produce a plan document

## Subagent mode
- Accept the task as given — don't re-negotiate scope
- Return a structured plan document

## Always
- Be explicit about assumptions
- Flag ambiguity rather than guessing
```

## Bundled rules

Rules bundled at creation time (via `--rules`) automatically activate when the persona is active. They merge with any explicitly activated rules — deduplication is automatic.

## Activating a persona

```bash
brainjar persona use planner            # Workspace scope
brainjar persona use planner --project  # This project only
```

## Managing personas

```bash
brainjar persona list                    # See available personas
brainjar persona show                    # View the active persona
brainjar persona show reviewer           # View a specific persona
brainjar persona history reviewer        # List version history
brainjar persona show reviewer --rev 2   # View a previous version
brainjar persona revert reviewer --to 2  # Restore a previous version
brainjar persona drop reviewer           # Deactivate a persona
brainjar persona delete reviewer         # Permanently delete a persona
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
