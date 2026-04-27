---
title: Recipes
description: Common workflows and patterns for using brainjar.
---

Each recipe links to the relevant [CLI reference](/reference/cli/) anchor for full flag details.

## Code review session

Save a review brain once, load or compose from it anytime. `brain save` takes the slugs directly — you do not have to mutate workspace state first. See [`brain`](/reference/cli/#brain), [`shell`](/reference/cli/#shell).

```bash
# Save the brain from existing slugs
brainjar brain save review \
  --soul craftsman \
  --persona reviewer \
  --rule boundaries \
  --rule security

# Load the brain wholesale into workspace state (sync to push to CLAUDE.md)
brainjar brain use review
brainjar sync

# Or compose the prompt for an MCP tool or orchestrator
brainjar compose review

# Or scope to a single agent run (in-memory, nothing on disk)
brainjar shell --brain review
```

## CI pipeline — bake config into the repo

There is no environment-variable override surface. The CI flow is: ship a workspace bundle in the repo, import it, optionally adjust the active state, then sync. See [`pack`](/reference/cli/#pack), [`sync`](/reference/cli/#sync).

```bash
# Import the committed pack into the CI workspace
brainjar pack import -i pack.json

# Optionally activate a specific persona / rule for this run
brainjar persona use auditor
brainjar rule add compliance

# Render the platform's managed config block
brainjar sync
```

## Project-specific overrides (agent-driven)

Project-scoped state is read by `status`, `sync`, and `compose` based on the basename of the nearest `.git` root, but **the CLI's `persona use` / `rule add` always write to workspace state**. To set a project-scoped override, call the `state_set` MCP tool with a `project` field — typically from inside an agent session pointed at the repo.

```jsonc
// MCP call from an agent working in my-project/
{
  "tool": "state_set",
  "input": {
    "project": "my-project",
    "persona_slug": "planner",
    "rules_to_add": ["no-delete"]
  }
}
```

`brainjar status` then shows both the resolved effective state and the raw layer chain (workspace + project), so you can see which scope contributed each entry. See [Configuration → State cascade](/guides/configuration/#state-cascade).

## Scoped shell sessions

Spawn an agent with a one-off composition — no workspace state is touched, nothing is written to disk. See [`shell`](/reference/cli/#shell).

```bash
brainjar shell --persona reviewer --rules security --task "Audit"
```

`--rules` takes a comma-separated list and is only valid with `--persona`. The agent inherits the current cwd and stdio; quitting the agent is the only "cleanup" — there's no shell session to exit.

## Strict-isolation runs (Claude only)

Skip Claude's ambient context — `CLAUDE.md` auto-discovery, hooks, LSP, plugin sync, and keychain — for a deterministic agent run. Requires `ANTHROPIC_API_KEY` (or an `apiKeyHelper`) since `--bare` disables keychain reads, which breaks Claude Max OAuth.

```bash
ANTHROPIC_API_KEY=sk-ant-... brainjar shell --bare --brain review --task "Audit src/auth/"
```

Use this for CI or any run where you want only the brainjar-composed prompt to drive the agent.

## Team sharing with packs

Export the workspace and share it with teammates. See [`pack`](/reference/cli/#pack).

```bash
# You
brainjar pack export -o review.json

# Teammate
brainjar pack import -i review.json
```

Imports are additive — existing entities are upserted, per-entity failures become warnings.

## MCP server registration

Register brainjar as an MCP server so agents can discover and use all commands. See [`mcp`](/reference/cli/#mcp).

```bash
brainjar mcp install                     # Default scope: user (global)
brainjar mcp install --scope project     # Committed per-repo (.mcp.json)
brainjar mcp install --scope local       # Per-checkout, not shared
```

The active platform adapter owns the actual file path; `--scope` selects which layer the registration is written to.

## Shell completions

Set up tab completion for brainjar commands. See [`completion`](/reference/cli/#completion).

```bash
brainjar completion zsh > "${fpath[1]}/_brainjar"   # zsh
brainjar completion bash | sudo tee /etc/bash_completion.d/brainjar > /dev/null
brainjar completion fish > ~/.config/fish/completions/brainjar.fish
```

## Multiple platforms via contexts

Switch between Claude Code, Codex, and other platforms by maintaining separate contexts. See [`context`](/reference/cli/#context).

```bash
brainjar context add codex --platform codex --workspace <workspace-uuid>
brainjar context use codex      # Flip the active platform target
brainjar sync                   # Render the platform's managed config
```

Each context binds a platform adapter to a workspace; switching contexts retargets every subsequent command.

## Upgrading the CLI

For installs done via `get.brainjar.sh` (Homebrew/apt/nix users should upgrade through their package manager). See [`upgrade`](/reference/cli/#upgrade).

```bash
brainjar upgrade --check    # Print current vs latest, do nothing
brainjar upgrade            # Verify cosign signature and atomically swap the binary
```
