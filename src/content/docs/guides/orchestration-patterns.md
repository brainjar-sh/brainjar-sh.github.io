---
title: Orchestration Patterns
description: Multi-agent workflow patterns using brainjar compose.
---

## Overview

This page covers patterns for structuring multi-agent workflows. All patterns use `compose` as the building block — the MCP tool (and [CLI command](/reference/cli/#compose)) that assembles a full prompt from soul, persona, procedure, rules, and task. The assembled prompt is passed to Claude Code's Agent tool to spawn the subagent. See [Subagent Orchestration](/guides/subagents/) for compose basics.

## Sequential pipeline

One agent's output feeds the next. Each stage uses a different brain tuned to its role. The pipeline is linear — stage 2 cannot start until stage 1 finishes.

**Example: Design, Build, Review**

```jsonc
// Stage 1 — architect produces a design doc
result = mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "architect" },
  task:   "Design the caching layer for src/api/"
})
Agent(prompt=result.prompt, description="Design caching layer")

// Stage 2 — engineer implements the design
result = mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "engineer" },
  task:   "Implement the design in docs/design-cache.md"
})
Agent(prompt=result.prompt, description="Implement caching layer")

// Stage 3 — reviewer validates the implementation
result = mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "reviewer" },
  task:   "Review the implementation against docs/design-cache.md"
})
Agent(prompt=result.prompt, description="Review caching implementation")
```

Each stage writes its output to a known file path. The next stage references that path in its `task` string. The architect writes `docs/design-cache.md`. The engineer reads it and writes code. The reviewer reads both.

You can extend the pipeline. A four-stage version might add a documenter at the end:

```jsonc
result = mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "documenter" },
  task:   "Update docs/ to reflect the caching changes in src/api/"
})
Agent(prompt=result.prompt, description="Document caching changes")
```

**When to use:** Tasks with clear phase dependencies where each phase needs different expertise. Design-then-build is the most common case.

**Tradeoff:** Slower than parallel, but each stage has full context from the previous. Failures are easy to diagnose — you know exactly which stage broke.

## Parallel dispatch

Multiple agents work on independent subtasks simultaneously. Each agent gets a separate work unit with no shared writes.

A coordinator breaks a feature into independent modules, then dispatches N agents in parallel. Each agent uses the same brain but gets a task-specific assignment. Use **worktree isolation** so agents don't conflict on files:

```jsonc
// All three dispatched in the same message — they run concurrently
r1 = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "engineer" },
                              task:   "Implement the auth module per docs/design.md#auth" })
Agent(prompt=r1.prompt, description="Implement auth module", isolation="worktree")

r2 = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "engineer" },
                              task:   "Implement the storage module per docs/design.md#storage" })
Agent(prompt=r2.prompt, description="Implement storage module", isolation="worktree")

r3 = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "engineer" },
                              task:   "Implement the API module per docs/design.md#api" })
Agent(prompt=r3.prompt, description="Implement API module", isolation="worktree")
```

Each agent works in its own worktree — an isolated copy of the repo. When all agents finish, the coordinator merges results into the main branch and resolves any integration issues (import conflicts, API mismatches, etc.).

This also works for applying the same operation across multiple files — reformatting, migrating, or auditing in parallel.

**When to use:** Tasks that decompose into independent work units. Module-per-agent is the most natural split. File-per-agent works too when the operation is uniform.

**Tradeoff:** Requires clean task boundaries. The coordinator owns integration after agents complete — merging worktrees, resolving conflicts, and verifying the combined result builds and passes tests.

## Coordinator with phases

A lead persona orchestrates a full workflow through defined phases. The coordinator is not just a router — it reads, thinks, and produces the plan that drives the remaining phases.

**The four phases:**

1. **Design** — compose an architect to analyze the problem and produce a design doc
2. **Approve** — the coordinator summarizes findings and the user decides whether to proceed
3. **Build** — dispatch builders (parallel with worktree isolation, or sequential depending on task dependencies)
4. **Verify** — compose a reviewer and documenter in parallel

The coordinator persona's instructions define these phases explicitly. Structure the relevant section of the persona like this:

```markdown
## Workflow

When given a feature request:
1. Compose an architect subagent to research the problem space.
   Write findings to docs/research-{feature}.md.
2. Read the research. Produce a design doc at docs/design-{feature}.md.
   Present it to the user for approval.
3. Break the design into implementation tasks.
   Compose engineer subagents for each task (worktree isolation for parallel work).
4. Merge results. When implementation is complete, compose reviewer
   and documenter subagents in parallel.
```

The coordinator itself does phase 2 (synthesis and approval). It delegates phases 1, 3, and 4 via compose calls:

```jsonc
// Phase 1 — research
r = mcp__brainjar__compose({ source: { kind: "persona", persona_slug: "architect" },
                             task:   "Analyze the auth requirements in src/auth/" })
Agent(prompt=r.prompt, description="Research auth requirements")

// Phase 3 — implementation (after user approves the design)
r = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "builder" },
                             task:   "Implement the auth changes per docs/design-auth.md" })
Agent(prompt=r.prompt, description="Build auth module", isolation="worktree")

// Phase 4 — verification (both dispatched in the same message for parallel execution)
r = mcp__brainjar__compose({ source: { kind: "persona", persona_slug: "reviewer" },
                             task:   "Review auth implementation against docs/design-auth.md" })
Agent(prompt=r.prompt, description="Review auth changes")

r = mcp__brainjar__compose({ source: { kind: "persona", persona_slug: "documenter" },
                             task:   "Document the auth changes in docs/auth.md" })
Agent(prompt=r.prompt, description="Document auth changes")
```

See [Personas](/concepts/personas/) for structuring coordinator personas.

## Specialist team

A persistent team of agents with fixed roles. The coordinator dispatches to known specialists by brain name.

**Setup:** save one brain per specialist. `brain save` requires `--soul` and `--persona`; `--rule` and `--procedure` are optional and `--rule` is repeatable.

```bash
brainjar brain save architect  --soul craftsman --persona architect  --rule boundaries
brainjar brain save builder    --soul craftsman --persona engineer   --rule git-discipline --rule testing
brainjar brain save reviewer   --soul craftsman --persona reviewer   --rule security --rule boundaries
brainjar brain save documenter --soul craftsman --persona documenter
```

Each brain bundles its own soul, persona, rules, and (optionally) procedure tuned to its role. The coordinator knows the team roster and picks the right specialist for each task:

```jsonc
// Coordinator dispatches based on the task type
r = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "architect" },
                             task:   "Analyze the performance bottleneck in src/sync/" })
Agent(prompt=r.prompt, description="Analyze perf bottleneck")

r = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "builder" },
                             task:   "Implement the fix outlined in docs/design-perf.md" })
Agent(prompt=r.prompt, description="Implement perf fix", isolation="worktree")

r = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "reviewer" },
                             task:   "Review the perf changes in src/sync/" })
Agent(prompt=r.prompt, description="Review perf changes")

r = mcp__brainjar__compose({ source: { kind: "brain", brain_slug: "documenter" },
                             task:   "Document the new caching behavior in docs/" })
Agent(prompt=r.prompt, description="Document caching behavior")
```

The team stays stable across projects. You define the brains once and reuse them. New projects inherit the same specialists — only the tasks change. Over time, you refine each specialist's persona and rules based on the quality of its output.

**When to use:** Large projects with recurring multi-step workflows where the same roles come up repeatedly. Also useful when multiple team members share a common agent roster.

## Passing context between agents

Agents communicate through files, not shared memory. There is no cross-agent state.

Write output to a known path (e.g., `docs/design.md`). Reference that path in the next agent's `task` string. The task is the injection point for all inter-agent context.

Keep paths predictable and consistent so downstream agents can find upstream work without guessing. A convention like `docs/{stage}-{feature}.md` works well.

## Choosing a pattern

| Pattern | Complexity | Speed | Best for |
|---|---|---|---|
| Sequential pipeline | Low | Slow | Clear phase dependencies |
| Parallel dispatch | Medium | Fast | Independent subtasks |
| Coordinator with phases | High | Medium | Full project workflows |
| Specialist team | High | Medium | Recurring complex workflows |

Start with sequential pipelines. They are the simplest to reason about and debug. Move to parallel dispatch when you identify independent subtasks that don't share files. Use coordinator patterns when you need a single persona to own the end-to-end flow. Graduate to specialist teams when the same roles keep showing up across projects.

Most real workflows combine patterns. A coordinator might run a sequential pipeline for design and review, with parallel dispatch for implementation. Pick the pattern that matches the dependency structure of your task.
