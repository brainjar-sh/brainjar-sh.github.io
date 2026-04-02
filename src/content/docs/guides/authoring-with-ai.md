---
title: Authoring with AI
description: Use your AI agent to help you create souls, personas, and rules.
---

You don't have to write souls, personas, and rules from scratch. Every `create` command generates a **template** with structured sections — your agent sees the template and fills it in based on your description.

If you already have a large config file, see [Migrating from Monolithic Prompts](/guides/migration/) for a step-by-step decomposition guide. This page covers creating new content from scratch.

## How templates work

When you run a create command, brainjar generates a template on the server with section headers that guide the content:

- **Soul template:** title + space for voice, character, and standards
- **Persona template:** YAML frontmatter for bundled rules + sections for direct mode, subagent mode, and baseline behaviors
- **Rule template:** title + description placeholder + constraints section

The workflow is create → show → update:

1. `create` stores a template on the server
2. `show` reads it back so the agent can see the structure
3. `update` writes the populated content back (reads from stdin)

```bash
# 1. Create — generates template on server
brainjar soul create pragmatist --description "Direct and pragmatic"

# 2. Show — agent reads the template to see the structure
brainjar soul show pragmatist

# 3. Update — agent writes the filled-in content back
cat <<'EOF' | brainjar soul update pragmatist
# Pragmatist

Direct and pragmatic.

## Voice
- Plain language. No jargon unless the audience expects it.
- Say what you mean in the fewest words that are still clear.

## Character
- Ship over perfection. Done is better than perfect.
- Skeptical of abstractions. Prove it works first.

## Standards
- If it's not tested, it's not done.
- Simplest solution that solves the problem.
EOF
```

You can also let agents discover brainjar's full CLI via `brainjar --llms` or by registering it as an MCP server with `brainjar mcp add`.

## Creating a soul

Tell your agent what you want:

```
Create a brainjar soul called "pragmatist" that's direct, avoids jargon,
and values shipping over perfection.
```

The agent runs `create`, reads the template with `show`, fills in the sections, and writes it back with `update`. The template's section headers (Voice, Character, Standards) guide what the agent writes.

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
Bundle the "boundaries" and "testing" rules.
```

The agent runs `create` with `--rules boundaries,testing`, reads the template with `show`, and writes the filled-in content with `update`. The template includes section headers for **direct mode**, **subagent mode**, and **always** — which guide the agent's output.

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

The agent creates the rule, reads the template with `show`, and writes the constraints with `update`. The template includes a **Constraints** section with bullet points to populate.

### Tips for good rules

- One rule, one concern. Don't cram multiple unrelated constraints into one file.
- Be specific enough that the agent can follow it unambiguously.
- If you have several related rules, create them as separate rules with clear names.

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

The agent reads the current content with `show`, modifies it, and writes it back with `update`. Run `brainjar sync` (or let hooks handle it) and the changes take effect immediately.

## Building a team of agents

Once you have several personas, you can build them into a specialist team for multi-agent workflows:

```
Create brains for each workflow:
- "build" brain: craftsman soul, engineer persona, git-discipline + security rules
- "review" brain: craftsman soul, reviewer persona, security + boundaries rules
- "design" brain: craftsman soul, architect persona, boundaries rules
```

The agent saves each brain. Then your lead persona can dispatch specialists via `compose`:

```bash
brainjar compose design --task "Analyze the auth requirements in src/auth/"
brainjar compose build --task "Implement the design in docs/design-auth.md"
brainjar compose review --task "Review the auth changes against the design doc"
```

See [Orchestration Patterns](/guides/orchestration-patterns/) for more multi-agent workflows.

## Sharing what you built

Export your setup as a pack so others can use it:

```bash
brainjar pack export bug-hunt --author yourname --version 1.0.0
```

See [Packs](/guides/packs/) for details on sharing and importing.
