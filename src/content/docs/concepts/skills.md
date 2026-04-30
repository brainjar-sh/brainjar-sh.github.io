---
title: Skills
description: On-demand capabilities loaded by the platform.
---

A skill is a Markdown document that the platform's runtime loads when your task matches its description or triggers. Skills don't enter the composed prompt — they live on disk and are loaded on-demand by the platform.

brainjar stores skills in the workspace and writes one `<slug>/SKILL.md` file per resolved skill when you run `brainjar sync`. This file goes to either the project scope (`<repo>/.claude/skills/<slug>/SKILL.md`) or user scope (`~/.claude/skills/<slug>/SKILL.md`), depending on the skill's `scope` setting.

## When to use skills

Skills are for capabilities that don't belong in the prompt itself:

- **Runbooks and workflows** — incident response, deployment checklists, code review procedures
- **Decision trees** — debugging flowcharts, triage logic, conditional playbooks
- **Glossaries and references** — domain jargon, internal APIs, tool documentation
- **Policies and guardrails** — security practices, compliance templates, approval workflows

A well-written skill is self-contained and contextual. The platform decides whether to load it based on your current task. A soul defines who you are; a skill defines what you can do when you need it.

## Scopes

Skills have two scopes: **project** and **user**.

| Scope | Where it lands | When to use |
|-------|----------------|------------|
| **Project** | `<repo>/.claude/skills/<slug>/SKILL.md` | Single project, specific workflow (code review for this codebase) |
| **User** | `~/.claude/skills/<slug>/SKILL.md` | Across all projects, personal system (your incident response playbook) |

When you run `brainjar sync`, both project and user skills are emitted. The platform loads whichever ones match your task.

## Creating and managing skills

Create a skill with a description that tells the platform when to load it. The body comes from `--content`, `--file`, or stdin (in that precedence):

```bash
brainjar skill create incident-response \
  --scope user \
  --description "Incident response workflow: detect, contain, resolve, document" \
  --file ./incident-response.md
```

Or pipe the body in:

```bash
cat ./incident-response.md | brainjar skill create incident-response \
  --scope user \
  --description "Incident response workflow: detect, contain, resolve, document"
```

Manage skills like any other layer:

```bash
brainjar skill list                    # See available skills
brainjar skill show incident-response  # Inspect a skill
brainjar skill delete incident-response # Remove it
```

## Attaching skills to brains

Bind a skill to a brain so it's always loaded with that configuration:

```bash
brainjar brain save review \
  --soul craftsman \
  --persona reviewer \
  --procedure code-review \
  --skill review-checklist \
  --skill code-quality-rubric
```

Or attach a skill to an existing brain:

```bash
brainjar skill attach review review-checklist
```

When you `brainjar brain use review`, the skills are loaded into workspace state. Run `brainjar sync` to emit them to disk.

## Activating skills

Use a skill directly without attaching it to a brain:

```bash
brainjar skill use incident-response
brainjar sync
```

This adds the skill to the workspace state. Check what's active:

```bash
brainjar status
```

Drop a skill from the workspace:

```bash
brainjar skill drop incident-response
brainjar sync
```

## Emitting skills

`brainjar sync` writes all active skills to disk. Force a rewrite if you edit a skill in the database:

```bash
brainjar skill emit
```

This regenerates all emitted `SKILL.md` files without changing the composed prompt.

## Skills vs. rules

Rules and skills both guide behavior, but serve different purposes:

| Layer | What it is | Where it lives | When to use |
|-------|-----------|-----------------|-----------|
| **Rule** | Behavioral constraint (must do, must not do) | In the composed prompt | Guardrails, policies, non-negotiable bounds |
| **Skill** | On-demand capability the platform loads | On disk as SKILL.md | Runbooks, workflows, decision trees, tools |

A rule says "you must follow this security policy." A skill says "here's your incident response playbook — use it when you need it." Rules are always active; skills are loaded contextually.

## Multi-platform behavior

Currently, skills are supported in Claude Code. When you `brainjar sync` on Codex or Cursor, the operation succeeds but warns that skills are unsupported and continues. This lets you maintain a single workspace that works across platforms — platforms just ignore what they don't support.

Future platforms may add skill support. The behavior remains: `brainjar sync` emits the files and the platform loads them if it knows how.

## See also

- [Brains](/concepts/brains/) — saved bundles of soul, persona, rules, procedure, and skills
- [Procedures](/concepts/procedures/) — step-by-step playbooks that belong in the prompt
- [Rules](/concepts/rules/) — behavioral constraints
