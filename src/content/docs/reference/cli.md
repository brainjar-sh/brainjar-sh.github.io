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

Bootstrap `~/.brainjar/` directory structure.

```bash
brainjar init [--default] [--obsidian] [--backend claude|codex]
```

| Flag | Description |
|------|-------------|
| `--default` | Seed starter soul, personas, and rules |
| `--obsidian` | Set up `~/.brainjar/` as an Obsidian vault |
| `--backend` | Agent backend to target (default: `claude`) |

---

## status

Show active brain configuration.

```bash
brainjar status [--sync] [--global] [--local] [--short]
```

| Flag | Description |
|------|-------------|
| `--sync` | Regenerate config file after showing status |
| `--global` | Show only global state |
| `--local` | Show only local overrides |
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
brainjar soul show [name] [--local] [--short]
```

| Flag | Description |
|------|-------------|
| `--local` | Show local soul override (if any) |
| `--short` | Print only the active soul name |

### soul use

Activate a soul.

```bash
brainjar soul use <name> [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Write to local `.claude/CLAUDE.md` instead of global |

### soul drop

Deactivate the current soul.

```bash
brainjar soul drop [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Remove local soul override or deactivate global soul |

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
brainjar persona show [name] [--local] [--short]
```

| Flag | Description |
|------|-------------|
| `--local` | Show local persona override (if any) |
| `--short` | Print only the active persona name |

### persona use

Activate a persona.

```bash
brainjar persona use <name> [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Write to local `.claude/CLAUDE.md` instead of global |

### persona drop

Deactivate the current persona.

```bash
brainjar persona drop [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Remove local persona override or deactivate global persona |

---

## rules

Manage rules — behavioral constraints for the agent.

### rules create

Create a new rule.

```bash
brainjar rules create <name> [--description <text>] [--pack]
```

| Flag | Description |
|------|-------------|
| `--description` | One-line description of the rule |
| `--pack` | Create as a rule pack (directory of `.md` files) |

### rules list

List available and active rules.

```bash
brainjar rules list [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Show local rules delta only |

### rules show

Show the content of a rule by name.

```bash
brainjar rules show <name>
```

### rules add

Activate a rule or rule pack.

```bash
brainjar rules add <name> [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Add rule as a local override (delta, not snapshot) |

### rules remove

Deactivate a rule.

```bash
brainjar rules remove <name> [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Remove rule as a local override (delta, not snapshot) |

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
| `--overwrite` | Overwrite existing brain file |

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
brainjar brain use <name> [--local]
```

| Flag | Description |
|------|-------------|
| `--local` | Apply brain at project scope |

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

Import a pack directory into `~/.brainjar/`.

```bash
brainjar pack import <path> [--force] [--merge] [--activate]
```

| Flag | Description |
|------|-------------|
| `--force` | Overwrite existing files on conflict |
| `--merge` | Rename incoming files on conflict as `<name>-from-<packname>` |
| `--activate` | Activate the brain after successful import |

---

## hooks

Manage Claude Code hook integration.

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

Spawn a subshell with `BRAINJAR_*` environment variables set.

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
