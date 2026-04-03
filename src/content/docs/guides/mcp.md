---
title: MCP Integration
description: Register brainjar as an MCP server so your agent can manage configurations and orchestrate subagents natively.
---

## What MCP gives you

[MCP](https://modelcontextprotocol.io) (Model Context Protocol) lets your agent call brainjar operations as native tool calls. Instead of shelling out to the CLI and parsing stdout, the agent gets structured inputs and outputs — the same way it uses any other tool.

Without MCP, an agent managing brainjar has to:

```bash
# Shell out, capture output, parse it
brainjar persona show reviewer
brainjar compose review --task "Review src/sync.ts"
```

With MCP, the agent calls tools directly:

```
mcp__brainjar__persona_show(name="reviewer")
mcp__brainjar__compose(brain="review", task="Review src/sync.ts")
```

The difference matters most for orchestration. The `compose` tool returns a structured prompt that feeds directly into the Agent tool for subagent dispatch — no shell capture, no string wrangling. See [Subagent Orchestration](/guides/subagents/).

## Setup

Register brainjar as an MCP server:

```bash
brainjar mcp add
```

This auto-detects your agent (Claude Code, Cursor, etc.) and writes the MCP configuration globally. Options:

```bash
brainjar mcp add --agent cursor     # Target a specific agent
brainjar mcp add --no-global        # Project-local only
brainjar mcp add -c "npx brainjar"  # Override the command
```

After registration, restart your agent session. The brainjar tools will appear automatically.

## What's exposed

Every brainjar operation is available as an MCP tool. The main categories:

| Tool | Description |
|------|-------------|
| `soul_create`, `soul_show`, `soul_update`, `soul_use`, `soul_drop` | Manage souls |
| `persona_create`, `persona_show`, `persona_update`, `persona_use`, `persona_drop` | Manage personas |
| `rules_create`, `rules_show`, `rules_update`, `rules_add`, `rules_remove` | Manage rules |
| `brain_save`, `brain_show`, `brain_use`, `brain_drop` | Manage brains |
| `compose` | Assemble a subagent prompt from brain or ad-hoc layers |
| `status`, `sync` | Check and sync active configuration |
| `pack_export`, `pack_import` | Share configurations |

The full tool list matches the [CLI reference](/reference/cli/) — every command has an MCP equivalent.

## Compose and orchestration

The `compose` tool is the bridge between brainjar and multi-agent workflows. It assembles a full prompt (soul + persona + rules + task) and returns it as a structured response:

```
result = mcp__brainjar__compose(brain="reviewer", task="Review the auth changes in src/auth/")
```

The returned prompt is ready to pass to the Agent tool:

```
Agent(prompt=result.prompt, description="Review auth changes")
```

For parallel work, add worktree isolation so agents don't conflict on files:

```
Agent(prompt=result.prompt, description="Implement auth module", isolation="worktree")
```

This is how coordinator personas (like a CTO or tech lead) orchestrate specialist teams — composing the right brain for each subtask and dispatching agents with full context. See [Orchestration Patterns](/guides/orchestration-patterns/) for detailed workflows.

## MCP vs CLI vs skill files

brainjar offers three ways for agents to interact:

| Method | Best for |
|--------|----------|
| **MCP server** | Primary path. Native tool calls, structured responses, orchestration via compose. |
| **CLI** | Scripting, CI pipelines, manual use in terminal. Agents can shell out but it's less ergonomic. |
| **Skill files** | Slash-command shortcuts (e.g., `/brainjar status`). Complements MCP — doesn't replace it. |

Use MCP as the default. Fall back to CLI for automation outside agent sessions. Add skill files if you want slash-command convenience on top.

## Next steps

- [Subagent Orchestration](/guides/subagents/) — how compose + Agent tool works
- [Orchestration Patterns](/guides/orchestration-patterns/) — multi-agent workflow patterns
- [Authoring with AI](/guides/authoring-with-ai/) — use your agent to create souls, personas, and rules
