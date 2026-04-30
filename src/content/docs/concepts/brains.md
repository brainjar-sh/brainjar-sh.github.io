---
title: Brains
description: Save and recall complete agent configurations in one shot.
---

A brain is a named bundle of soul + persona + rules + an optional procedure + optional skills, plus an optional preferred model identifier. Instead of switching five things separately, save the bundle once and realize it whenever you need it.

## Saving a brain

Name the slugs directly. You don't need to mutate workspace state first:

```bash
brainjar brain save review \
  --soul craftsman \
  --persona reviewer \
  --procedure delivery \
  --rule boundaries \
  --rule security \
  --skill review-checklist
```

`brain save` is an upsert. The referenced soul, persona, rule, procedure, and skill slugs must already exist in the workspace. `--procedure` and `--skill` are optional; omit them to bind the brain to no procedure or skills. Pass `--soul ""` or `--persona ""` to leave either side unset.

## Using a brain

Brains are realized in three ways.

**Loaded into workspace state** — flip every layer at once:

```bash
brainjar brain use review
brainjar sync
```

`brain use <slug>` writes the brain's soul, persona, procedure, rules, and skills into the workspace state in one shot, replacing whatever was there at the workspace layer. The brain on disk is unchanged — `brain use` mutates state, not the brain. Run `brain use` again with a different slug to switch.

**As a composed prompt** — for MCP clients and orchestrators that need the prompt as text:

```bash
brainjar compose review --task "Review the changes in src/sync"
```

`compose` prints the assembled prompt (soul + persona + procedure + rules + task) to stdout and lists resolved skills in the JSON output. Use this from an orchestrator that hands the prompt to a subagent.

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

`brain delete` removes the saved bundle only. It does not clear workspace state — to undo a `brain use`, run another `brain use` or set the layers individually with `soul use` / `persona use` / `procedure use` / `rule add` / `skill use`.

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

This returns the complete prompt (soul + persona + procedure + rules + task), resolved skills, and platform metadata ready to pass to Claude Code's Agent tool. See [Subagent Orchestration](/guides/subagents/) for compose basics and [Orchestration Patterns](/guides/orchestration-patterns/) for multi-agent workflow patterns.
