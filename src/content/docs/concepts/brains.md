---
title: Brains
description: Save and recall complete agent configurations in one shot.
---

A brain is a named bundle of soul + persona + rules + an optional procedure, plus an optional preferred model identifier. Instead of switching four things separately, save the bundle once and realize it whenever you need it.

## Saving a brain

Name the slugs directly. You don't need to mutate workspace state first:

```bash
brainjar brain save review \
  --soul craftsman \
  --persona reviewer \
  --procedure delivery \
  --rule boundaries \
  --rule security
```

`brain save` is an upsert. The referenced soul, persona, rule, and procedure slugs must already exist in the workspace. `--procedure` is optional; omit it to bind the brain to no procedure. Pass `--soul ""` or `--persona ""` to leave either side unset.

## Using a brain

Brains are realized in three ways.

**Loaded into workspace state** — flip every layer at once:

```bash
brainjar brain use review
brainjar sync
```

`brain use <slug>` writes the brain's soul, persona, procedure, and rules into the workspace state in one shot, replacing whatever was there at the workspace layer. The brain on disk is unchanged — `brain use` mutates state, not the brain. Run `brain use` again with a different slug to switch.

**As a composed prompt** — for MCP clients and orchestrators that need the prompt as text:

```bash
brainjar compose review --task "Review the changes in src/sync"
```

`compose` prints the assembled prompt (soul + persona + procedure + rules + task) to stdout. Use this from an orchestrator that hands the prompt to a subagent.

**As an interactive shell** — for hands-on use without touching state:

```bash
brainjar shell --brain review
brainjar shell --brain review -- --model opus
```

`shell` composes the prompt in memory and spawns the agent (Claude Code, Codex, …) with it as the appended system prompt. Nothing is written to disk, so multiple terminals with different brains never collide. Anything after `--` is forwarded verbatim to the agent binary.

## Managing brains

```bash
brainjar brain list           # See available brains
brainjar brain show review    # Inspect a brain's bundle
brainjar brain delete review  # Permanently delete the bundle
```

`brain delete` removes the saved bundle only. It does not clear workspace state — to undo a `brain use`, run another `brain use` or set the layers individually with `soul use` / `persona use` / `procedure use` / `rule add`.

See full flag and subcommand details in the [CLI reference for `brain`](/reference/cli/#brain), [`compose`](/reference/cli/#compose), and [`shell`](/reference/cli/#shell).

## Brain vs. individual layers

| Approach | When to use |
|----------|-------------|
| **Brain** | Repeatable workflow you do often (code review, design, debugging) |
| **Individual layers** | Exploratory work, one-off overrides, or changing one thing |

## Brains and compose

Brains are the primary input to `compose`, which assembles a full prompt for subagent dispatch. From an MCP client:

```
mcp__brainjar__compose(brain="review", task="Review the changes in src/sync.ts")
```

This returns the complete prompt (soul + persona + procedure + rules + task) ready to pass to Claude Code's Agent tool. See [Subagent Orchestration](/guides/subagents/) for compose basics and [Orchestration Patterns](/guides/orchestration-patterns/) for multi-agent workflow patterns.
