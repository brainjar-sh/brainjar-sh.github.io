---
title: Orchestration Patterns
description: Multi-agent workflow patterns using brainjar compose.
---

## Overview

This page covers patterns for structuring multi-agent workflows. All patterns use `compose` as the building block — the command that assembles a full prompt from soul, persona, rules, and task. See [Subagent Orchestration](/guides/subagents/) for compose basics and syntax.

## Sequential pipeline

One agent's output feeds the next. Each stage uses a different brain tuned to its role. The pipeline is linear — stage 2 cannot start until stage 1 finishes.

**Example: Design, Build, Review**

```bash
# Stage 1 — architect produces a design doc
brainjar compose architect --task "Design the caching layer for src/api/"

# Stage 2 — engineer implements the design
brainjar compose engineer --task "Implement the design in docs/design-cache.md"

# Stage 3 — reviewer validates the implementation
brainjar compose reviewer --task "Review the implementation against docs/design-cache.md"
```

Each stage writes its output to a known file path. The next stage references that path in its `--task` string. The architect writes `docs/design-cache.md`. The engineer reads it and writes code. The reviewer reads both.

You can extend the pipeline. A four-stage version might add a documenter at the end:

```bash
brainjar compose documenter --task "Update docs/ to reflect the caching changes in src/api/"
```

**When to use:** Tasks with clear phase dependencies where each phase needs different expertise. Design-then-build is the most common case.

**Tradeoff:** Slower than parallel, but each stage has full context from the previous. Failures are easy to diagnose — you know exactly which stage broke.

## Parallel dispatch

Multiple agents work on independent subtasks simultaneously. Each agent gets a separate work unit with no shared writes.

A coordinator breaks a feature into independent modules, then dispatches N agents in parallel. Each agent uses the same brain but gets a task-specific assignment.

```bash
brainjar compose engineer --task "Implement the auth module per docs/design.md#auth"
brainjar compose engineer --task "Implement the storage module per docs/design.md#storage"
brainjar compose engineer --task "Implement the API module per docs/design.md#api"
```

All three run at the same time. Each agent reads from the shared design doc but writes to its own directory. The key constraint: no two agents should write to the same file.

The coordinator is responsible for splitting the work. It reads the design doc, identifies independent units, and constructs the `--task` strings. When all agents finish, the coordinator integrates the results.

This also works for applying the same operation across multiple files — reformatting, migrating, or auditing in parallel.

**When to use:** Tasks that decompose into independent work units. Module-per-agent is the most natural split. File-per-agent works too when the operation is uniform.

**Tradeoff:** Requires clean task boundaries. Shared state between workers needs explicit coordination — if two agents modify the same file, you get a conflict. Plan the split carefully before dispatching.

## Coordinator with phases

A lead persona orchestrates a full workflow through defined phases. The coordinator is not just a router — it reads, thinks, and produces the plan that drives the remaining phases.

**The four phases:**

1. **Research** — spawn an architect to analyze the problem and produce findings
2. **Synthesis** — the coordinator consolidates findings into an actionable plan
3. **Implementation** — dispatch builders (parallel or sequential depending on task dependencies)
4. **Verification** — spawn a reviewer and documenter in parallel

The coordinator persona's instructions define these phases explicitly. Structure the relevant section of the persona like this:

```markdown
## Workflow

When given a feature request:
1. Compose an architect subagent to research the problem space.
   Write findings to docs/research-{feature}.md.
2. Read the research. Produce a design doc at docs/design-{feature}.md.
3. Break the design into implementation tasks.
   Compose engineer subagents for each task.
4. When implementation is complete, compose reviewer and documenter
   subagents in parallel.
```

The coordinator itself does phase 2 (synthesis). It delegates phases 1, 3, and 4 via compose calls. This separation keeps each agent focused on a single concern.

The compose calls for each phase look like:

```bash
# Phase 1 — research
brainjar compose architect --task "Analyze the authentication requirements in src/auth/"

# Phase 3 — implementation (after coordinator writes the plan)
brainjar compose engineer --task "Implement the auth changes per docs/design-auth.md"

# Phase 4 — verification (parallel)
brainjar compose reviewer --task "Review auth implementation against docs/design-auth.md"
brainjar compose documenter --task "Document the auth changes in docs/auth.md"
```

See [Personas](/concepts/personas/) for structuring coordinator personas.

## Specialist team

A persistent team of agents with fixed roles. The coordinator dispatches to known specialists by brain name.

**Setup:**

```bash
brainjar brain save architect
brainjar brain save engineer
brainjar brain save reviewer
brainjar brain save documenter
```

Each brain has its own soul, persona, and rules tuned to its role. The coordinator knows the team roster and picks the right specialist for each task:

```bash
# Coordinator dispatches based on the task type
brainjar compose architect --task "Analyze the performance bottleneck in src/sync/"
brainjar compose engineer --task "Implement the fix outlined in docs/design-perf.md"
brainjar compose reviewer --task "Review the perf changes in src/sync/"
brainjar compose documenter --task "Document the new caching behavior in docs/"
```

The team stays stable across projects. You define the brains once and reuse them. New projects inherit the same specialists — only the tasks change. Over time, you refine each specialist's persona and rules based on the quality of its output.

**When to use:** Large projects with recurring multi-step workflows where the same roles come up repeatedly. Also useful when multiple team members share a common agent roster.

## Passing context between agents

Agents communicate through files, not shared memory. There is no cross-agent state.

Write output to a known path (e.g., `docs/design.md`). Reference that path in the next agent's `--task` flag. The task string is the injection point for all inter-agent context.

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
