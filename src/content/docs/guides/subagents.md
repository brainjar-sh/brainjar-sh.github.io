---
title: Subagent Orchestration
description: Dispatch subagents with full brain context using compose.
---

Personas can spawn other personas as subagents. The `compose` tool assembles the full prompt — soul + persona + procedure + rules + task — and resolves skills in a single call. Pass the result to Claude Code's Agent tool to spawn the subagent.

## How compose works

brainjar exposes `compose` as both an MCP tool and a CLI command. When orchestrating from within Claude Code, use the MCP tool directly — never shell out to the CLI.

**MCP tool (primary path — used inside Claude Code):**

The MCP `compose` tool takes a `source` object that selects how the stack is resolved (a saved brain, a persona plus inferred soul, or the active state) plus an optional `task`:

```jsonc
mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "review" },
  task:   "Review the changes in src/sync.ts"
})
```

```jsonc
// Ad-hoc — no saved brain needed
mcp__brainjar__compose({
  source: { kind: "persona", persona_slug: "reviewer", rule_slugs: ["security"] },
  task:   "Review the changes in src/sync.ts"
})
```

The tool returns a `prompt` field with the assembled text, resolved skills, plus token estimates and warnings. Feed `prompt` to the Agent tool to spawn the subagent:

```
Agent(prompt=<compose result>.prompt, description="Review sync changes")
```

**CLI (for scripting or manual use):**

```bash
brainjar compose review --task "Review the changes in src/sync.ts"

# Ad-hoc — no saved brain needed
brainjar compose --persona reviewer --task "Review the changes in src/sync.ts"
```

## Orchestration pattern

A lead persona (like a CTO) orchestrates a full workflow through defined phases:

1. **Design** — compose an `architect` subagent to analyze and produce a design doc
2. **Approve** — present the design to the user for approval
3. **Build** — implement directly or dispatch `builder` subagents for parallel work
4. **Verify** — compose `reviewer` and `documenter` subagents in parallel

Each subagent gets the full brain context. The lead persona coordinates, integrates results, and makes decisions between phases.

### Dispatch decisions

The lead persona decides whether to implement directly or dispatch:

- **Implement yourself** when: few files, single concern, linear dependency chain, or integration glue that requires full context.
- **Dispatch subagents** when: many files, multiple independent workstreams, mechanical/repetitive changes, or parallelizable packages with clear boundaries.

### Worktree isolation

When dispatching multiple agents that write to files, use worktree isolation to prevent conflicts:

```
Agent(
  prompt=<compose result>,
  description="Implement auth module",
  isolation="worktree"
)
```

Each agent gets its own copy of the repo. After all agents finish, the coordinator merges results and resolves any integration issues.

## Example: code review flow

The lead persona's instructions include workflow phases. Here's how a review flow works in practice:

```jsonc
// 1. Compose the reviewer prompt
result = mcp__brainjar__compose({
  source: { kind: "persona", persona_slug: "reviewer" },
  task:   "Review changes in src/sync.ts against docs/design-sync.md"
})

// 2. Spawn it as a subagent via Agent tool
Agent(prompt=result.prompt, description="Review sync changes")

// 3. Read the review results
// 4. Fix issues if needed

// 5. Compose and spawn a documenter
result = mcp__brainjar__compose({
  source: { kind: "persona", persona_slug: "documenter" },
  task:   "Update docs to reflect changes in src/sync.ts"
})
Agent(prompt=result.prompt, description="Update sync docs")
```

Steps 1–2 and 5 happen via MCP tool calls inside Claude Code. The lead persona reads each subagent's output and decides the next step.

## Granular access

For more control, retrieve individual layers:

```bash
brainjar persona show reviewer    # Get just the persona content
brainjar rule show security       # Get just a rule's content
brainjar soul show                # Get the active soul
```

## Going deeper

For advanced multi-agent patterns — parallel dispatch, sequential pipelines, coordinator phases, and specialist teams — see [Orchestration Patterns](/guides/orchestration-patterns/).
