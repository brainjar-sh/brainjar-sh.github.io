---
title: Migrating from Monolithic Prompts
description: Decompose a large config file into composable brainjar layers.
---

This guide walks you through decomposing a single large config file into brainjar's composable layers: souls, personas, rules, and (optionally) procedures.

## Before you start

`brainjar sync` writes only inside the markers `<!-- brainjar:begin -->` and `<!-- brainjar:end -->` in your platform's config file. Everything outside the markers is left alone.

If you decide brainjar isn't for you, run:

```bash
brainjar reset --yes
```

That removes `brainjar.db` and `config.yaml` from the brainjar home. It does **not** restore your old `CLAUDE.md` — delete the brainjar-managed block by hand if you want it gone.

If you haven't installed brainjar yet, start with [Getting Started](/getting-started/).

This guide assumes you have a single large `CLAUDE.md` (or `AGENTS.md`) that you want to break apart. If you're starting fresh with no existing config, skip this guide and go straight to Getting Started.

## Anatomy of a monolithic prompt

Most large config files contain three kinds of content mixed together:

1. **Identity content** — tone, voice, character traits, communication style
2. **Workflow content** — what to do first, how to approach tasks, methodology
3. **Constraint content** — rules, guardrails, things to never do

Here's a typical example:

```markdown
# Agent Instructions

Be direct and concise. No filler.
Speak with conviction. Own your mistakes.
When you don't know something, say so plainly.

When given a task:
1. Read relevant files first
2. Plan before implementing
3. Write tests alongside code
4. Commit in small logical chunks

When reviewing code:
1. Check for correctness first, style second
2. Flag security issues as blockers
3. Suggest improvements, don't demand them

Never push to main without approval.
Never delete files without asking.
Always run tests before declaring done.
Don't add dependencies without confirming.
Keep secrets out of committed files.
```

Everything lives in one flat file. Identity, workflow, and constraints are interleaved. The goal: separate these into a soul, personas, and rules.

## Step 1: Extract the soul

Read through your file. Find everything about *who the agent is* — voice, character, standards. These are statements about identity, not about process.

From the example above, the identity content is:

```markdown
Be direct and concise. No filler.
Speak with conviction. Own your mistakes.
When you don't know something, say so plainly.
```

Write the identity content to a file, then create the soul from it:

```bash
brainjar soul create craftsman --file ./craftsman.md
# or pipe via stdin:
cat craftsman.md | brainjar soul create craftsman
```

A good soul is typically 10-30 lines. If you're writing more than that, some of it probably belongs in a persona or rule.

See [Souls](/concepts/souls/) for structure guidance, and the [`brainjar soul`](/reference/cli/#soul) reference.

## Step 2: Extract personas

Identify workflow instructions — the parts that describe *how to approach work*. You might have one workflow or several mixed together.

Common patterns that indicate multiple personas:

- "When reviewing code, do X. When building features, do Y." — that's two personas.
- "For design tasks, start with Z." — that's a third.
- Different task types with different step-by-step instructions.

From the example, there are two workflows. Write each workflow to a file and create a persona for it:

```bash
brainjar persona create engineer --file ./engineer.md
brainjar persona create reviewer --file ./reviewer.md
```

The engineer's content:

```markdown
When given a task:
1. Read relevant files first
2. Plan before implementing
3. Write tests alongside code
4. Commit in small logical chunks
```

The reviewer's content:

```markdown
When reviewing code:
1. Check for correctness first, style second
2. Flag security issues as blockers
3. Suggest improvements, don't demand them
```

See [Personas](/concepts/personas/) for more on persona structure, and the [`brainjar persona`](/reference/cli/#persona) reference.

## Step 3: Extract rules

Pull out every constraint, guardrail, and "never do X" statement. These are the hard boundaries on behavior.

Group related constraints into named rules. Write each rule's content to a file and create the rule from it:

```bash
brainjar rule create git-discipline --file ./git-discipline.md
brainjar rule create security --file ./security.md
```

From the example, `git-discipline` gets:

```markdown
Never push to main without approval.
Commit in small logical chunks.
```

And `security` gets:

```markdown
Never delete files without asking.
Don't add dependencies without confirming.
Keep secrets out of committed files.
Always run tests before declaring done.
```

One rule per concern. If a constraint doesn't fit an existing rule, create a new one. Don't force unrelated constraints into the same bucket.

See [Rules](/concepts/rules/) for more detail, and the [`brainjar rule`](/reference/cli/#rule) reference.

## Step 3.5 (optional): Extract a procedure

If your existing config bakes in a *step-by-step playbook* — phases, handoffs, ordered checkpoints — that runbook is a [procedure](/concepts/procedures/). Lift it out and create one:

```bash
brainjar procedure create delivery --file ./delivery.md
```

Procedures are most useful when the same playbook is reused by different personas. If the steps are tightly bound to one persona's identity, leave them inside the persona instead. Procedures are optional — many configs ship without one.

## Step 4: Bundle and activate

Some rules only matter for certain workflows. Bundle them with the persona at create time using the repeatable `--rule` flag:

```bash
brainjar persona create reviewer --file ./reviewer.md --rule security --rule boundaries
```

Rules that apply to **all** workflows — activate them at workspace scope:

```bash
brainjar rule add git-discipline
brainjar rule add security
```

Rules that apply to **specific** workflows — bundle them with the persona instead.

Snapshot your configurations as brains so you can switch between them. `brain save` accepts the slugs directly, so you don't have to mutate workspace state first:

```bash
brainjar brain save build --soul craftsman --persona engineer --rule git-discipline
brainjar brain save review --soul craftsman --persona reviewer --rule security --rule boundaries
```

Verify everything looks right:

```bash
brainjar status
```

See [Brains](/concepts/brains/) for more on saving and switching, and the [`brainjar brain`](/reference/cli/#brain) reference.

## What to keep outside brainjar

Content between `<!-- brainjar:begin -->` and `<!-- brainjar:end -->` is managed by brainjar. Everything outside those markers is yours.

Good candidates to keep outside brainjar:

- Project-specific context (file structure, dependencies, architecture notes)
- Temporary instructions ("for this sprint, focus on X")
- Anything that changes more often than your agent's behavior

brainjar manages *behavior*. Project context stays in your config file, outside the markers.

## Migration checklist

- Install brainjar and run `brainjar init`
- Read through your existing config — mark identity, workflow, and constraint sections
- Create soul with identity content
- Create persona(s) with role content
- Create rules with constraint content
- (Optional) Create a procedure with step-by-step playbook content
- Bundle persona-specific rules with their persona
- Save brains for each workflow
- Test each brain in a short session
- Export as a pack if sharing with teammates — `brainjar pack export -o myteam.json` produces a single JSON bundle. See [Packs](/guides/packs/) and the [`brainjar pack`](/reference/cli/#pack) reference.
