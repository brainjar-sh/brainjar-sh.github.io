---
title: Core Concepts
description: Understanding brainjar's composable layer system.
---

brainjar manages AI agent behavior through composable layers. Each layer is a markdown document held in your local SQLite store (or a `brainjar serve` instance). They compose together to form the agent's full behavior. For the full rationale behind this approach, see [Why Composable Prompts](/concepts/why-composable/).

## The layers

| Layer | Purpose | Changes how often |
|-------|---------|-------------------|
| [Soul](/concepts/souls/) | Who the agent is — voice, character | Rarely. You probably have 1–2. |
| [Persona](/concepts/personas/) | The role the agent plays | Per task or session |
| [Rules](/concepts/rules/) | What constraints apply — guardrails | Per project or persona |
| [Procedure](/concepts/procedures/) | The step-by-step playbook the agent follows | Per workflow (delivery, incident, migration) |
| [Skill](/concepts/skills/) | On-demand capabilities the platform loads — runbooks, tools, glossaries | Per task or contextual need |
| [Brain](/concepts/brains/) | Saved bundle of the five above | When you want a repeatable setup |

## How they compose

At sync time, brainjar merges the active soul, persona, procedure, and rules into a single config block. Rules come from two sources:

1. **Explicitly activated** via `brainjar rule add`
2. **Bundled with a persona** via its frontmatter

Both sources merge. Deduplication is automatic.

| Input | Source |
|-------|--------|
| Soul | Explicitly activated |
| Persona | Explicitly activated |
| Procedure | Explicitly activated (or bundled with a brain) |
| Rules | Explicitly activated **+** bundled in persona frontmatter |

## State cascade

State merges in two tiers. The project layer overrides the workspace layer:

```
workspace  →  project
```

| Tier | Storage | When to use |
|------|---------|-------------|
| **Workspace** | Default scope | Default behavior across all projects |
| **Project** | Per-project scope | Per-project overrides |

Project scope is auto-detected from the basename of the nearest `.git` root walking up from your working directory (must be a valid slug — lowercase, hyphen-separated). Pass `--project <slug>` to override or to force a specific project. If the basename isn't a valid slug, the CLI falls back to workspace scope and warns on stderr.

See [Configuration](/guides/configuration/) for details on each tier and the [`status`](/reference/cli/#status) and [`sync`](/reference/cli/#sync) commands.

## Architecture

The CLI talks to a local SQLite store under `~/.brainjar` by default. Add a remote context (`brainjar context add … --url …`) to point it at a `brainjar serve` instance instead. See [Architecture](/concepts/architecture/) for the components, files on disk, and how contexts and platforms fit together.
