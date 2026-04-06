---
title: Core Concepts
description: Understanding brainjar's composable layer system.
---

brainjar manages AI agent behavior through composable layers. Each layer is a markdown document stored on the brainjar server. They compose together to form the agent's full behavior. For the full rationale behind this approach, see [Why Composable Prompts](/concepts/why-composable/).

## The layers

| Layer | Purpose | Changes how often |
|-------|---------|-------------------|
| [Soul](/concepts/souls/) | Who the agent is — voice, character | Rarely. You probably have 1–2. |
| [Persona](/concepts/personas/) | How the agent works — role, workflow | Per task or session |
| [Rules](/concepts/rules/) | What constraints apply — guardrails | Per project or persona |
| [Brain](/concepts/brains/) | Saved snapshot of all three | When you want a repeatable setup |

## How they compose

At sync time, brainjar merges the active soul, persona, and rules into a single config block. Rules come from two sources:

1. **Explicitly activated** via `brainjar rules add`
2. **Bundled with a persona** via its frontmatter

Both sources merge. Deduplication is automatic.

| Input | Source |
|-------|--------|
| Soul | Explicitly activated |
| Persona | Explicitly activated |
| Rules | Explicitly activated **+** bundled in persona frontmatter |

## State cascade

State merges in three tiers. Each tier overrides the previous:

```
workspace  →  project  →  env
```

| Tier | Storage | When to use |
|------|---------|-------------|
| **Workspace** | Server (default scope) | Default behavior across all projects |
| **Project** | Server (per-project scope) | Per-project overrides |
| **Env** | `BRAINJAR_*` environment variables | Per-session or CI overrides |

Project scope is auto-detected when your working directory contains a `.brainjar/` directory. No `--project` flag needed.

See [Configuration](/guides/configuration/) for details on each tier.

## Architecture

All content (souls, personas, rules, brains) and state lives on the brainjar server. The CLI is a thin client that talks to the server via HTTP. See [Architecture](/concepts/architecture/) for details on the server, local files, and deployment modes.
