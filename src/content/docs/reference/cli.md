---
title: CLI Reference
description: Complete reference for all brainjar commands.
---

## Global options

All commands support `--help` for usage information.

## init

Initialize brainjar with starter content.

```bash
brainjar init [--default] [--obsidian] [--backend claude|codex]
```

| Flag | Description |
|------|-------------|
| `--default` | Include starter soul, persona, and rules |
| `--obsidian` | Add Obsidian vault configuration |
| `--backend` | Target agent backend (`claude` or `codex`) |

## status

Show active configuration.

```bash
brainjar status [--sync] [--global|--local] [--short]
```

| Flag | Description |
|------|-------------|
| `--sync` | Sync config after showing status |
| `--global` | Show only global state |
| `--local` | Show only local state |
| `--short` | One-liner output (useful in scripts) |

## sync

Sync active layers into agent config file.

```bash
brainjar sync [--quiet]
```

## compose

Assemble a full subagent prompt from a brain or ad-hoc layers.

```bash
brainjar compose <brain> [--task <text>]
brainjar compose --persona <name> [--task <text>]
```

## soul

Manage souls — the agent's voice and character.

```bash
brainjar soul create <name> --description <text>
brainjar soul list
brainjar soul show [name] [--short]
brainjar soul use <name>
brainjar soul drop <name>
```

## persona

Manage personas — the agent's role and workflow.

```bash
brainjar persona create <name> --description <text>
brainjar persona list
brainjar persona show [name] [--short]
brainjar persona use <name> [--local]
brainjar persona drop <name>
```

## rules

Manage rules — behavioral constraints and guardrails.

```bash
brainjar rules create <name> --description <text>
brainjar rules list
brainjar rules show <name>
brainjar rules add <name> [--local]
brainjar rules remove <name>
```

## brain

Manage brains — saved configuration snapshots.

```bash
brainjar brain save <name>
brainjar brain use <name>
brainjar brain list
brainjar brain show <name>
brainjar brain drop <name>
```

## identity

Manage identities — credential engine integration.

```bash
brainjar identity create <name>
brainjar identity list
brainjar identity show [name]
brainjar identity use <name>
brainjar identity drop <name>
brainjar identity unlock
brainjar identity get <key>
brainjar identity status
brainjar identity lock
```

## pack

Export and import shareable brain bundles.

```bash
brainjar pack export <brain> [--out <dir>] [--name <name>] [--version <ver>] [--author <name>]
brainjar pack import <dir> [--force] [--merge] [--activate]
```

## hooks

Manage Claude Code hook integration.

```bash
brainjar hooks install [--local]
brainjar hooks remove
brainjar hooks status
```

## shell

Launch a subshell with brainjar environment variables set.

```bash
brainjar shell [--brain <name>] [--soul <name>] [--persona <name>] [--identity <name>] [--rules-add <names>] [--rules-remove <names>]
```

## reset

Remove brainjar-managed config and restore backup.

```bash
brainjar reset [--backend claude|codex]
```
