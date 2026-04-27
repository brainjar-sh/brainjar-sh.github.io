---
title: Authoring with AI
description: Use your AI agent to help you create souls, personas, rules, and procedures.
---

You don't have to write souls, personas, rules, or procedures from scratch. Tell your agent what you want, let it draft the content, and pipe the result into `brainjar … create`. brainjar persists whatever you hand it — markdown is conventional but not enforced.

If you already have a large config file, see [Migrating from Monolithic Prompts](/guides/migration/) for a step-by-step decomposition guide. This page covers creating new content from scratch.

See the CLI reference for [`soul`](/reference/cli/#soul), [`persona`](/reference/cli/#persona), [`rule`](/reference/cli/#rule), [`procedure`](/reference/cli/#procedure), and [`versions`](/reference/cli/#versions).

## How the workflow actually works

There is no scaffolded template. The agent decides the structure. brainjar's `create` commands upsert content from `--content`, `--file`, or stdin (precedence in that order). Re-running `create` with new content replaces the previous version — the old one is preserved in the version history (`brainjar versions <type> <slug>`).

The two-step flow:

1. The agent drafts the content (in a temp file or on stdout).
2. The agent runs `brainjar <type> create <slug> --file <path>` (or pipes via stdin).

If the agent is iterating on existing content, it reads the current version with `show` first, then re-runs `create` with the revised text.

```bash
# 1. Agent writes the draft
cat > /tmp/pragmatist.md <<'EOF'
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

# 2. Agent upserts via create (stdin also works)
brainjar soul create pragmatist --file /tmp/pragmatist.md
cat /tmp/pragmatist.md | brainjar soul create pragmatist
```

## Creating a soul

Tell your agent what you want:

```
Create a brainjar soul called "pragmatist" that's direct, avoids jargon,
and values shipping over perfection.
```

The agent drafts the content, then runs `brainjar soul create pragmatist --file <path>`. To refine later, the agent reads the existing content with `brainjar soul show pragmatist`, edits it, and re-runs `create` to upsert.

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

The agent drafts the persona content, then runs:

```bash
brainjar persona create debugger --file /tmp/debugger.md \
  --rule boundaries --rule testing
```

`--rule` is repeatable — pass it once per bundled rule. To revise, the agent reads with `show`, edits, and re-runs `create`.

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

The agent drafts the rule and runs `brainjar rule create no-delete --file <path>`. Same upsert semantics as souls and personas — re-running `create` replaces the content; old versions live in `brainjar versions rule no-delete`.

## Creating a procedure

A procedure is a step-by-step playbook — the *method* the agent follows. Lift one out when the same sequence of phases applies to multiple personas.

```
Create a brainjar procedure called "delivery" with phases:
- design (architect produces a design doc)
- approve (user signs off)
- build (engineer implements)
- verify (reviewer checks against the design)
Define inputs and outputs for each phase.
```

The agent drafts the playbook and runs `brainjar procedure create delivery --file <path>`. Bind it to a brain via `brainjar brain save … --procedure delivery`, or activate it directly in workspace state with `brainjar procedure use delivery`. See [Procedures](/concepts/procedures/) for guidance on when a procedure earns its keep vs. living inside a persona.

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

Once your agent has created the layers you want, bundle them into a brain. `brain save` takes the slugs directly — workspace state is not touched:

```bash
brainjar brain save bug-hunt \
  --soul veteran \
  --persona debugger \
  --rule no-delete
```

Add `--procedure <slug>` to bind a step-by-step playbook to the brain. Both `--soul` and `--persona` are required (pass `""` to leave either unset).

Now `brainjar brain use bug-hunt` loads all four layers into workspace state in one shot, `brainjar shell --brain bug-hunt` spawns an agent with the full setup without touching state, or `brainjar compose bug-hunt` prints the composed prompt for use elsewhere.

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

The agent reads the current content with `show`, modifies it, and re-runs `create` to upsert. Each re-create stores a new version — old content stays accessible via `brainjar versions <type> <slug> [n]`. Run `brainjar sync` (or let hooks handle it) and the changes take effect immediately.

## Building a team of agents

Once you have several personas, you can build them into a specialist team for multi-agent workflows:

```
Create brains for each workflow:
- "build" brain: craftsman soul, engineer persona, git-discipline + security rules
- "review" brain: craftsman soul, reviewer persona, security + boundaries rules
- "design" brain: craftsman soul, architect persona, boundaries rules
```

The agent saves each brain. Then the lead persona dispatches specialists via the `compose` MCP tool, passing each result to Claude Code's Agent tool:

```
prompt = mcp__brainjar__compose(brain="design", task="Analyze the auth requirements in src/auth/")
Agent(prompt=prompt, description="Analyze auth requirements")

prompt = mcp__brainjar__compose(brain="build", task="Implement the design in docs/design-auth.md")
Agent(prompt=prompt, description="Build auth module", isolation="worktree")

prompt = mcp__brainjar__compose(brain="review", task="Review the auth changes against the design doc")
Agent(prompt=prompt, description="Review auth changes")
```

See [Orchestration Patterns](/guides/orchestration-patterns/) for more multi-agent workflows.

## Sharing what you built

Export the whole workspace as a JSON bundle so others can import it:

```bash
brainjar pack export -o bug-hunt.json
```

Packs are workspace-scoped — every soul, persona, rule, procedure, and brain plus the active state ride along. See [Packs](/guides/packs/) for the import side.
