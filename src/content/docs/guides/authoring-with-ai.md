---
title: Authoring with AI
description: Use your AI agent to help you create souls, personas, and rules.
---

You don't have to write souls, personas, and rules from scratch. Your AI agent can help you create them — and it's often the fastest way to get a configuration that fits how you actually work.

## Creating a soul with your agent

Ask your agent to help define your voice. Be specific about what you want:

```
Create a brainjar soul called "pragmatist" that's direct, avoids jargon,
and values shipping over perfection. Run: brainjar soul create pragmatist
then edit the file.
```

The agent will run the CLI command and then edit `~/.brainjar/souls/pragmatist.md` with content based on your description.

### Tips for good souls

- Describe **how you want the agent to sound**, not what you want it to do (that's a persona).
- Include tone, character traits, and standards.
- Keep it short. A soul is a page, not a novel.

**Example prompt:**

```
I want a soul that sounds like a senior engineer who's been through
too many rewrites. Pragmatic, slightly skeptical of abstractions,
values simplicity. Speaks plainly. Create it as "veteran".
```

## Creating a persona with your agent

Personas define workflow. Tell your agent what role you need:

```
Create a brainjar persona called "debugger". It should:
- Start by reproducing the bug with a failing test
- Identify the root cause before proposing fixes
- Never change more than necessary
Bundle the "default" and "testing" rules.
```

The agent creates the file and includes the rules in the frontmatter:

```yaml
---
rules:
  - default
  - testing
---
```

### Tips for good personas

- Describe the **workflow step by step** — what does the agent do first, second, third?
- Mention what rules should be bundled.
- Be explicit about what the persona should **not** do.

**Example prompt:**

```
Create a persona called "api-designer" for designing REST APIs.
It should start by clarifying the resource model, then propose
endpoints with request/response examples, then flag consistency
issues. Bundle the "boundaries" rule. It should never write
implementation code — only specs.
```

## Creating rules with your agent

Rules are constraints. Tell the agent what behavior to enforce:

```
Create a brainjar rule called "no-delete" that prevents the agent
from deleting any file without explicit user confirmation. It should
list what will be deleted and why before asking.
```

### Tips for good rules

- One rule, one concern. Don't cram multiple unrelated constraints into one file.
- Be specific enough that the agent can follow it unambiguously.
- If you have several related rules, create a rule pack (directory).

**Example prompt:**

```
Create a rule called "api-safety" with these constraints:
- Never change a public API response shape without flagging it as breaking
- Always check for backwards compatibility
- Require a migration plan for breaking changes
```

## Creating a brain

Once your agent has created the layers you want, snapshot them:

```
Activate the "veteran" soul, "debugger" persona, and add the
"no-delete" rule. Then save it all as a brain called "bug-hunt".
```

The agent runs:

```bash
brainjar soul use veteran
brainjar persona use debugger
brainjar rules add no-delete
brainjar brain save bug-hunt
```

Now `brainjar brain use bug-hunt` restores the full setup in one command.

## Iterating

The best configurations come from iteration. Use your agent to refine:

```
The "debugger" persona is too aggressive about writing tests.
Update it to only write a reproduction test, not full coverage.
```

```
The "veteran" soul is too terse. Add a line about being generous
with explanations when the user asks "why".
```

The agent edits the markdown files directly. Run `brainjar sync` (or let hooks handle it) and the changes take effect immediately.

## Sharing what you built

Once you have a setup you like, export it as a pack so others can use it:

```bash
brainjar pack export bug-hunt --author yourname --version 1.0.0
```

See [Packs](/guides/packs/) for details on sharing and importing.
