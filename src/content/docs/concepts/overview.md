---
title: Core Concepts
description: Understanding brainjar's composable layer system.
---

brainjar manages AI agent behavior through four composable layers. Each layer is a markdown file. They compose together to form the agent's full behavior.

## The four layers

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
global  →  local  →  env
```

| Tier | Storage | When to use |
|------|---------|-------------|
| **Global** | `~/.brainjar/state.yaml` | Default behavior across all projects |
| **Local** | `.brainjar/state.yaml` (in project) | Per-project overrides |
| **Env** | `BRAINJAR_*` environment variables | Per-session or CI overrides |

See [Configuration](/guides/configuration/) for details on each tier.

## File structure

```
~/.brainjar/
  souls/            # Voice and character
    craftsman.md
  personas/         # Role and workflow
    engineer.md
    reviewer.md
  rules/            # Constraints
    default/        # Rule packs (directories)
    security.md     # Single-file rules
  brains/           # Saved configurations
    review.yaml
  state.yaml        # Active selections
```

Every layer is a markdown file you can edit directly. Change a layer, run `brainjar sync`, and the agent's behavior updates.
