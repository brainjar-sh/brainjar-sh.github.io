---
title: Subagent Orchestration
description: Dispatch subagents with full brain context using compose.
---

Personas can spawn other personas as subagents. The `compose` command assembles the full prompt — soul + persona + rules + task — in a single call.

## How compose works

```bash
# From a saved brain
brainjar compose review --task "Review the changes in src/sync.ts"

# Ad-hoc — no saved brain needed
brainjar compose --persona reviewer --task "Review the changes in src/sync.ts"
```

The output is a complete prompt string ready to pass to a subagent via your agent framework's spawn mechanism.

## Orchestration pattern

A lead persona (like a tech-lead or CTO) can orchestrate a full workflow:

1. **Design** — spawn an `architect` subagent to analyze and produce a design doc
2. **Approve** — present the design to the user for approval
3. **Build** — implement directly or dispatch `builder` subagents for parallel work
4. **Verify** — spawn `reviewer` and `documenter` subagents in parallel

Each subagent gets the full brain context. The lead persona coordinates.

## Example: code review flow

```bash
# The lead persona's CLAUDE.md includes instructions to:
# 1. Compose the reviewer prompt
brainjar compose --persona reviewer --task "Review changes in src/sync.ts against docs/design-sync.md"

# 2. Spawn it as a subagent (via Agent tool in Claude Code)
# 3. Read the review results
# 4. Fix issues if needed
# 5. Spawn a documenter to update docs
brainjar compose --persona documenter --task "Update docs to reflect changes in src/sync.ts"
```

## Granular access

For more control, retrieve individual layers:

```bash
brainjar persona show reviewer    # Get just the persona content
brainjar rules show security      # Get just a rule's content
brainjar soul show                # Get the active soul
```

## Going deeper

For advanced multi-agent patterns — parallel dispatch, sequential pipelines, coordinator phases, and specialist teams — see [Orchestration Patterns](/guides/orchestration-patterns/).
