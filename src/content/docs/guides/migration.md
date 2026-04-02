---
title: Migrating from Monolithic Prompts
description: Decompose a large config file into composable brainjar layers.
---

This guide walks you through decomposing a single large config file into brainjar's composable layers: souls, personas, and rules.

## Before you start

brainjar backs up your existing config on first sync. The backup lives at `CLAUDE.md.pre-brainjar`. You can always restore it:

```bash
brainjar reset
```

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

Create a soul and put that content in it:

```bash
brainjar soul create craftsman --description "Direct and rigorous"
```

Edit the soul template to include the identity lines. A good soul is typically 10-30 lines. If you're writing more than that, some of it probably belongs in a persona or rule.

See [Souls](/concepts/souls/) for structure guidance.

## Step 2: Extract personas

Identify workflow instructions — the parts that describe *how to approach work*. You might have one workflow or several mixed together.

Common patterns that indicate multiple personas:

- "When reviewing code, do X. When building features, do Y." — that's two personas.
- "For design tasks, start with Z." — that's a third.
- Different task types with different step-by-step instructions.

From the example, there are two workflows. Create a persona for each:

```bash
brainjar persona create engineer --description "Feature implementation workflow"
brainjar persona create reviewer --description "Code review workflow"
```

Move the workflow content into the appropriate persona. The engineer gets:

```markdown
When given a task:
1. Read relevant files first
2. Plan before implementing
3. Write tests alongside code
4. Commit in small logical chunks
```

The reviewer gets:

```markdown
When reviewing code:
1. Check for correctness first, style second
2. Flag security issues as blockers
3. Suggest improvements, don't demand them
```

See [Personas](/concepts/personas/) for more on persona structure.

## Step 3: Extract rules

Pull out every constraint, guardrail, and "never do X" statement. These are the hard boundaries on behavior.

Group related constraints into named rules:

```bash
brainjar rules create git-discipline --description "Git workflow constraints"
brainjar rules create security --description "Security and permission guardrails"
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

See [Rules](/concepts/rules/) for more detail.

## Step 4: Bundle and activate

Some rules only matter for certain workflows. Bundle them with the persona:

```bash
brainjar persona create reviewer --description "Code review" --rules security,boundaries
```

Rules that apply to **all** workflows — activate them at workspace scope:

```bash
brainjar rules add git-discipline
brainjar rules add security
```

Rules that apply to **specific** workflows — bundle them with the persona instead.

Snapshot your configurations as brains so you can switch between them:

```bash
brainjar soul use craftsman
brainjar persona use engineer
brainjar rules add git-discipline
brainjar brain save build

brainjar persona use reviewer
brainjar brain save review
```

Verify everything looks right:

```bash
brainjar status
```

See [Brains](/concepts/brains/) for more on saving and switching.

## What to keep outside brainjar

Content between `<!-- brainjar:start -->` and `<!-- brainjar:end -->` is managed by brainjar. Everything outside those markers is yours.

Good candidates to keep outside brainjar:

- Project-specific context (file structure, dependencies, architecture notes)
- Temporary instructions ("for this sprint, focus on X")
- Anything that changes more often than your agent's behavior

brainjar manages *behavior*. Project context stays in your config file, outside the markers.

## Migration checklist

- Install brainjar and run `brainjar init`
- Read through your existing config — mark identity, workflow, and constraint sections
- Create soul with identity content
- Create persona(s) with workflow content
- Create rules with constraint content
- Bundle persona-specific rules with their persona
- Save brains for each workflow
- Test each brain in a short session
- Export as a pack if sharing with teammates — see [Packs](/guides/packs/)
