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

```jsonc
mcp__brainjar__persona_show({ slug: "reviewer" })
mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "review" },
  task:   "Review src/sync.ts"
})
```

The difference matters most for orchestration. The `compose` tool returns a structured prompt that feeds directly into the Agent tool for subagent dispatch — no shell capture, no string wrangling. See [Subagent Orchestration](/guides/subagents/).

## Setup

Register brainjar as an MCP server:

```bash
brainjar mcp install
```

This registers brainjar in the active platform's MCP config. Default scope is `user` (global across every project). Pass `--scope project` to commit a per-repo registration to `.mcp.json`, or `--scope local` for a per-checkout registration that is not shared with collaborators.

```bash
brainjar mcp install --scope user      # Default — global across every project
brainjar mcp install --scope project   # Committed per-repo registration (.mcp.json)
brainjar mcp install --scope local     # Per-checkout, not shared with collaborators
```

The active platform adapter (Claude, Codex, …) decides where the registration is written. Switch platforms by switching contexts.

After registration, restart your agent session. The brainjar tools will appear automatically. See the [CLI reference](/reference/cli/#mcp) for the full `mcp install / remove / status` surface.

## What's exposed

Every operation meaningful to an agent is available as an MCP tool. The main categories:

| Tool | Description |
|------|-------------|
| `soul_save`, `soul_show`, `soul_list`, `soul_delete` | Manage souls |
| `persona_save`, `persona_show`, `persona_list`, `persona_delete` | Manage personas |
| `rule_save`, `rule_show`, `rule_list`, `rule_delete` | Manage rules |
| `procedure_save`, `procedure_show`, `procedure_list`, `procedure_delete` | Manage procedures |
| `skill_save`, `skill_show`, `skill_list`, `skill_delete`, `skill_attach`, `skill_detach` | Manage skills |
| `brain_save`, `brain_show`, `brain_list`, `brain_delete` | Manage brains |
| `compose` | Assemble a subagent prompt from a brain or ad-hoc layers |
| `status` | Inspect active soul, persona, procedure, rules, skills, and scope |
| `state_get`, `state_set`, `state_delete` | Manage workspace and project state |
| `version_list`, `version_show` | Browse prior versions of souls, personas, rules, procedures, skills |
| `guide_list`, `guide_show` | Browse operational guides shipped with brainjar |
| `workspace_create`, `workspace_list`, `workspace_get_by_name`, `workspace_rename`, `workspace_delete` | Manage workspaces |
| `apikey_create`, `apikey_list`, `apikey_revoke` | Manage API keys |
| `admin_export`, `admin_import` | Round-trip a workspace as a JSON pack |

The MCP surface is similar to but not identical to the [CLI reference](/reference/cli/). The MCP server exposes only what's meaningful to an agent.

## Compose and orchestration

The `compose` tool is the bridge between brainjar and multi-agent workflows. It takes a `source` object that selects how the stack is resolved (saved brain, persona plus inferred soul, or active state) and returns the assembled prompt with token estimates and warnings:

```jsonc
result = mcp__brainjar__compose({
  source: { kind: "brain", brain_slug: "reviewer" },
  task:   "Review the auth changes in src/auth/"
})
```

The returned `prompt` field is ready to pass to the Agent tool:

```
Agent(prompt=result.prompt, description="Review auth changes")
```

For parallel work, add worktree isolation so agents don't conflict on files:

```
Agent(prompt=result.prompt, description="Implement auth module", isolation="worktree")
```

This is how coordinator personas (like a CTO or tech lead) orchestrate specialist teams — composing the right brain for each subtask and dispatching agents with full context. See [Orchestration Patterns](/guides/orchestration-patterns/) for detailed workflows.

## MCP vs CLI vs shell

brainjar offers three ways for agents to interact:

| Method | Best for |
|--------|----------|
| **MCP server** | Primary path. Native tool calls, structured responses, orchestration via compose. |
| **CLI** | Scripting, CI pipelines, manual use in terminal. Agents can shell out but it's less ergonomic. |
| **`brainjar shell`** | Spawn an agent with a composed prompt; no MCP needed. Useful for one-shot subagent runs from a terminal or another agent. |

Use MCP as the default. Fall back to CLI for automation outside agent sessions. Reach for `brainjar shell` when you want to spawn an agent with a specific brain without registering MCP.

## Next steps

- [Subagent Orchestration](/guides/subagents/) — how compose + Agent tool works
- [Orchestration Patterns](/guides/orchestration-patterns/) — multi-agent workflow patterns
- [Authoring with AI](/guides/authoring-with-ai/) — use your agent to create souls, personas, and rules
