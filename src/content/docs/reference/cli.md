---
title: CLI Reference
description: Complete reference for all brainjar commands.
---

## Global options

All commands support `--help` for usage information.

| Flag | Description |
|------|-------------|
| `--format <toon\|json\|yaml\|md\|jsonl>` | Output format |
| `--filter-output <keys>` | Filter output by key paths (e.g. `foo,bar.baz,a[0,3]`) |
| `--verbose` | Show full output envelope |
| `--token-count` | Print token count of output instead of output |
| `--token-limit <n>` | Limit output to n tokens |
| `--token-offset <n>` | Skip first n tokens of output |
| `--schema` | Show JSON Schema for command |
| `--llms`, `--llms-full` | Print LLM-readable manifest |
| `--mcp` | Start as MCP stdio server |
| `--version` | Show version |

---

## init

Initialize brainjar: config, server, and optional seed content.

```bash
brainjar init [--default] [--backend claude|codex]
```

| Flag | Description |
|------|-------------|
| `--default` | Seed starter soul, personas, and rules |
| `--backend` | Agent backend to target (default: `claude`) |

---

## status

Show active brain configuration.

```bash
brainjar status [--sync] [--workspace] [--project] [--short]
```

| Flag | Description |
|------|-------------|
| `--sync` | Regenerate config file from active layers |
| `--workspace` | Show only workspace state |
| `--project` | Show only project overrides |
| `--short` | One-line output: `soul \| persona` |

---

## sync

Regenerate config file from active layers.

```bash
brainjar sync [--quiet]
```

| Flag | Description |
|------|-------------|
| `--quiet` | Suppress output (useful in hooks) |

---

## compose

Assemble a full subagent prompt from a brain or ad-hoc layers.

```bash
brainjar compose <brain> [--task <text>]
brainjar compose --persona <name> [--task <text>]
```

| Flag | Description |
|------|-------------|
| `--persona` | Ad-hoc persona name (fallback when no brain is saved) |
| `--task` | Task description to append to the prompt |

The `brain` argument is the primary path — it resolves soul, persona, and rules from the brain file. Use `--persona` as a fallback when no brain is saved.

---

## soul

Manage souls — the agent's personality and values.

### soul create

Create a new soul.

```bash
brainjar soul create <name> [--description <text>]
```

| Flag | Description |
|------|-------------|
| `--description` | One-line description of the soul |

### soul list

List available souls.

```bash
brainjar soul list
```

### soul show

Show a soul by name, or the active soul if no name given.

```bash
brainjar soul show [name] [--project] [--short]
```

| Flag | Description |
|------|-------------|
| `--project` | Show project soul override (if any) |
| `--short` | Print only the active soul name |

### soul update

Update a soul's content. Reads new content from stdin.

```bash
cat content.md | brainjar soul update <name>
```

### soul use

Activate a soul.

```bash
brainjar soul use <name> [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Write to project scope instead of workspace |

### soul drop

Deactivate the current soul.

```bash
brainjar soul drop [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Remove project soul override or deactivate workspace soul |

---

## persona

Manage personas — role behavior and workflow for the agent.

### persona create

Create a new persona.

```bash
brainjar persona create <name> [--description <text>] [--rules <list>]
```

| Flag | Description |
|------|-------------|
| `--description` | One-line description of the persona |
| `--rules` | Rules to bundle with this persona |

### persona list

List available personas.

```bash
brainjar persona list
```

### persona show

Show a persona by name, or the active persona if no name given.

```bash
brainjar persona show [name] [--project] [--short]
```

| Flag | Description |
|------|-------------|
| `--project` | Show project persona override (if any) |
| `--short` | Print only the active persona name |

### persona update

Update a persona's content. Reads new content from stdin. Optionally update bundled rules.

```bash
cat content.md | brainjar persona update <name> [--rules <list>]
```

| Flag | Description |
|------|-------------|
| `--rules` | Update bundled rules |

### persona use

Activate a persona.

```bash
brainjar persona use <name> [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Write to project scope instead of workspace |

### persona drop

Deactivate the current persona.

```bash
brainjar persona drop [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Remove project persona override or deactivate workspace persona |

---

## rules

Manage rules — behavioral constraints for the agent.

### rules create

Create a new rule.

```bash
brainjar rules create <name> [--description <text>]
```

| Flag | Description |
|------|-------------|
| `--description` | One-line description of the rule |

### rules list

List available and active rules.

```bash
brainjar rules list [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Show project rules delta only |

### rules show

Show the content of a rule by name.

```bash
brainjar rules show <name>
```

### rules update

Update a rule's content. Reads new content from stdin.

```bash
cat content.md | brainjar rules update <name>
```

### rules add

Activate a rule or rule pack.

```bash
brainjar rules add <name> [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Add rule as a project override |

### rules remove

Deactivate a rule.

```bash
brainjar rules remove <name> [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Remove rule as a project override |

---

## brain

Manage brains — full-stack configuration snapshots (soul + persona + rules).

### brain save

Snapshot current effective state as a named brain.

```bash
brainjar brain save <name> [--overwrite]
```

| Flag | Description |
|------|-------------|
| `--overwrite` | Overwrite existing brain |

### brain list

List available brains.

```bash
brainjar brain list
```

### brain show

Show a brain configuration.

```bash
brainjar brain show <name>
```

### brain use

Activate a brain — sets soul, persona, and rules in one shot.

```bash
brainjar brain use <name> [--project]
```

| Flag | Description |
|------|-------------|
| `--project` | Apply brain at project scope |

### brain drop

Delete a brain.

```bash
brainjar brain drop <name>
```

---

## pack

Export and import brainjar packs — self-contained shareable bundles.

### pack export

Export a brain as a shareable pack directory.

```bash
brainjar pack export <brain> [--out <dir>] [--name <name>] [--version <ver>] [--author <name>]
```

| Flag | Description |
|------|-------------|
| `--out` | Parent directory for the exported pack (default: cwd) |
| `--name` | Override pack name (and output directory name) |
| `--version` | Semver version string (default: `0.1.0`) |
| `--author` | Author field in manifest |

### pack import

Import a pack directory into the server.

```bash
brainjar pack import <path> [--activate]
```

| Flag | Description |
|------|-------------|
| `--activate` | Activate the brain after successful import |

---

## hooks

Manage Claude Code hooks for brainjar.

### hooks install

Register brainjar hooks in Claude Code settings.

```bash
brainjar hooks install [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Target project-local `.claude/settings.json` |

### hooks remove

Remove brainjar hooks from Claude Code settings.

```bash
brainjar hooks remove [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Target project-local `.claude/settings.json` |

### hooks status

Show brainjar hook installation status.

```bash
brainjar hooks status [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Target project-local `.claude/settings.json` |

---

## shell

Spawn a subshell with session-scoped state overrides.

```bash
brainjar shell [--brain <name>] [--soul <name>] [--persona <name>] [--rules-add <names>] [--rules-remove <names>]
```

| Flag | Description |
|------|-------------|
| `--brain` | Brain name — sets soul, persona, and rules from brain file |
| `--soul` | Soul override for this session |
| `--persona` | Persona override for this session |
| `--rules-add` | Comma-separated rules to add |
| `--rules-remove` | Comma-separated rules to remove |

---

## reset

Remove brainjar-managed config from agent backend and restore backup.

```bash
brainjar reset [--backend claude|codex]
```

| Flag | Description |
|------|-------------|
| `--backend` | Agent backend to reset (default: `claude`) |

---

## server

Manage the brainjar server.

### server status

Show server status.

```bash
brainjar server status
```

### server start

Start the local server daemon.

```bash
brainjar server start
```

### server stop

Stop the local server daemon.

```bash
brainjar server stop
```

### server logs

Show server logs.

```bash
brainjar server logs [--lines <n>] [--follow]
```

| Flag | Description |
|------|-------------|
| `--lines` | Number of lines to show (default: 50) |
| `--follow` | Follow log output |

### server local

Switch to managed local server. Creates or switches to the `local` context.

```bash
brainjar server local
```

### server remote

Switch to a remote server. Creates a context for the URL if one doesn't exist.

```bash
brainjar server remote <url>
```

---

## upgrade

Upgrade brainjar CLI and server to latest versions.

```bash
brainjar upgrade                    # upgrade both
brainjar upgrade --cli-only         # upgrade CLI only
brainjar upgrade --server-only      # upgrade server only
```

| Flag | Description |
|------|-------------|
| `--cli-only` | Only upgrade the CLI |
| `--server-only` | Only upgrade the server binary |

The server upgrade always targets the local binary, regardless of which context is active.

---

## context

Manage server contexts — named server profiles for switching between local, staging, production, and team servers.

### context list

List all contexts. The active context is marked.

```bash
brainjar context list
```

### context add

Add a remote context. Validates the server is reachable before adding.

```bash
brainjar context add <name> <url> [--workspace <name>]
```

| Flag | Description |
|------|-------------|
| `--workspace` | Workspace name (default: `default`) |

### context remove

Remove a context. Cannot remove `local` or the active context.

```bash
brainjar context remove <name>
```

### context use

Switch active context. Syncs configuration from the new server.

```bash
brainjar context use <name>
```

### context show

Show context details. Defaults to the active context.

```bash
brainjar context show [name]
```

### context rename

Rename a context. Cannot rename `local`.

```bash
brainjar context rename <old> <new>
```

---

## migrate

Import file-based content into the server.

```bash
brainjar migrate [--dry-run] [--skip-backup]
```

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview what would be imported without making changes |
| `--skip-backup` | Skip renaming source directories to `.bak` |

---

## Integrations

### completions

Generate shell completion script.

```bash
brainjar completions <bash|fish|nushell|zsh>
```

Setup examples:

```bash
eval "$(brainjar completions bash)"    # add to ~/.bashrc
eval "$(brainjar completions zsh)"     # add to ~/.zshrc
brainjar completions fish | source     # add to ~/.config/fish/config.fish
```

### mcp add

Register brainjar as an MCP server for your agent.

```bash
brainjar mcp add [--agent <name>] [--command <cmd>] [--no-global]
```

| Flag | Description |
|------|-------------|
| `--agent` | Target a specific agent (e.g. `claude-code`, `cursor`) |
| `--command`, `-c` | Override the command agents will run |
| `--no-global` | Install to project instead of globally |

### skills add

Sync brainjar skill files to your agent.

```bash
brainjar skills add [--depth <n>] [--no-global]
```

| Flag | Description |
|------|-------------|
| `--depth` | Grouping depth for skill files (default: 1) |
| `--no-global` | Install to project instead of globally |
