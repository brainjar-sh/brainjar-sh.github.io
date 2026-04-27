---
title: Rules
description: Define behavioral constraints and guardrails for your AI agent.
---

Rules are behavioral constraints — guardrails that apply regardless of persona.

## Creating a rule

```bash
cat no-delete.md | brainjar rule create no-delete
# or
brainjar rule create no-delete --file ./no-delete.md
```

`create` is an upsert — it stores whatever content you hand it (stdin, `--content`, or `--file`, in that precedence order). There is no scaffolded template; let your AI agent populate the file (see [Authoring with AI](/guides/authoring-with-ai/)).

Here's what a filled-in rule looks like:

```markdown
# No Delete

## Constraints
- Never delete files without explicit user confirmation
- Before removing any file, list what will be deleted and why
- If multiple files are affected, present them as a checklist
```

## Activating rules

```bash
brainjar rule add security        # Add to the active state
brainjar rule remove security     # Remove from the active state
brainjar rule delete security     # Permanently delete the rule
```

`rule add` and `rule remove` write to the **workspace** state override. They do not take `--project`, and `cd`-ing into a repo does not change that — these CLI commands always target workspace state. Project-scoped rule overrides can only be set via the `state_set` MCP tool with a `project` field, typically from inside an agent session. See [Configuration → State cascade](/guides/configuration/#state-cascade).

Rules bundled with a persona activate automatically — you don't need to add them manually.

## Managing rules

```bash
brainjar rule list                       # See all rules with status
brainjar rule show security              # View a rule's content
brainjar versions rule security          # List version history
brainjar versions rule security 2        # Print version 2's content to stdout
```

There is no revert subcommand. To restore an old version, capture its content with `brainjar versions rule security <n>` and pipe it back into `brainjar rule create security`.

See full flag and subcommand details in the [CLI reference for `rule`](/reference/cli/#rule) and [`versions`](/reference/cli/#versions).

## Scope annotations

When you see scope labels in `status` and `rule list` output:

| Label | Meaning |
|-------|---------|
| `(workspace)` | Set at workspace scope |
| `(project)` | Overridden at project scope |
| `(+project)` | Added by project override |
| `(-project)` | Removed by project override |
