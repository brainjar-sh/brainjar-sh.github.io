---
title: Personas
description: Define how your AI agent works — role, workflow, and bundled rules.
---

A persona defines the agent's role and workflow. An engineer persona works differently than a reviewer or an architect. Switch personas based on what you're doing.

Think of it as the agent's **job description**.

## Creating a persona

```bash
cat planner.md | brainjar persona create planner
# or
brainjar persona create planner --file ./planner.md
```

`create` is an upsert — it stores whatever content you hand it (stdin, `--content`, or `--file`, in that precedence order). The CLI does not ship a template. A common shape is a short opener followed by sections for direct mode, subagent mode, and always-on behaviors, but the structure is up to you (or your agent — see [Authoring with AI](/guides/authoring-with-ai/)).

You can also bundle rules at creation time. The flag is `--rule` and is repeatable:

```bash
brainjar persona create planner \
  --file ./planner.md \
  --rule boundaries \
  --rule security
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

Rules bundled at creation time (via `--rule`, repeatable) automatically activate when the persona is active. They merge with any explicitly activated rules — deduplication is automatic.

## Activating a persona

```bash
brainjar persona use planner
```

`persona use` writes to the **workspace** state override. Project scope is auto-resolved from the basename of the nearest `.git` root (must be a valid slug — lowercase, hyphen-separated). Commands that accept a `--project <slug>` flag (`status`, `sync`, etc.) take that as an override; `persona use` itself does not take `--project`.

After switching, run `brainjar sync` (or rely on the SessionStart hook) to push the change into the platform's managed CLAUDE.md block.

## Managing personas

```bash
brainjar persona list                    # See available personas
brainjar persona show                    # View the active persona
brainjar persona show reviewer           # View a specific persona
brainjar versions persona reviewer       # List version history
brainjar versions persona reviewer 2     # Print version 2's content to stdout
brainjar persona drop reviewer           # Deactivate (clear the active-persona override)
brainjar persona delete reviewer         # Permanently delete a persona
```

There is no revert subcommand. To restore an old version, capture its content with `brainjar versions persona reviewer <n>` and pipe it back into `brainjar persona create reviewer`.

See full flag and subcommand details in the [CLI reference for `persona`](/reference/cli/#persona) and [`versions`](/reference/cli/#versions).

## Switching per task

```bash
brainjar persona use engineer   # Build session
brainjar persona use reviewer   # Review session
brainjar persona use planner    # Design session
```

Or scope it to a single shell session — composed in memory, no disk write:

```bash
brainjar shell --persona reviewer --task "Audit src/auth"
```
