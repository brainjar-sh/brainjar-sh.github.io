---
title: Authoring with AI
description: Use your AI agent to help you create souls, personas, and rules.
---

You don't have to write souls, personas, and rules from scratch. Every `create` command generates a **template** with structured sections — your agent sees the template and fills it in based on your description.

## How templates work

When you run a create command, brainjar generates a markdown file with section headers that guide the content:

- **Soul template:** title + space for voice, character, and standards
- **Persona template:** YAML frontmatter for bundled rules + sections for direct mode, subagent mode, and baseline behaviors
- **Rule template:** title + description placeholder + constraints section

Your agent reads these templates and populates them. You describe what you want in natural language, the agent runs the CLI command, then edits the generated file.

## Creating a soul

```
Create a brainjar soul called "pragmatist" that's direct, avoids jargon,
and values shipping over perfection.
```

The agent runs `brainjar soul create pragmatist --description "Direct and pragmatic"`, then fills in the generated template at `~/.brainjar/souls/pragmatist.md`.

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

## Creating a persona

```
Create a brainjar persona called "debugger". It should:
- Start by reproducing the bug with a failing test
- Identify the root cause before proposing fixes
- Never change more than necessary
Bundle the "default" and "testing" rules.
```

The agent runs the create command with `--rules default,testing`. The generated template includes:

```yaml
---
rules:
  - default
  - testing
---
```

Plus section headers for **direct mode**, **subagent mode**, and **always** — which the agent fills in based on your description.

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

## Creating rules

```
Create a brainjar rule called "no-delete" that prevents the agent
from deleting any file without explicit user confirmation. It should
list what will be deleted and why before asking.
```

The generated template includes a **Constraints** section with bullet points for the agent to populate.

### Tips for good rules

- One rule, one concern. Don't cram multiple unrelated constraints into one file.
- Be specific enough that the agent can follow it unambiguously.
- If you have several related rules, ask for a rule pack: `brainjar rules create api-safety --pack`.

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

Export your setup as a pack so others can use it:

```bash
brainjar pack export bug-hunt --author yourname --version 1.0.0
```

See [Packs](/guides/packs/) for details on sharing and importing.
