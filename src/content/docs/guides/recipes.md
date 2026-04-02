---
title: Recipes
description: Common workflows and patterns for using brainjar.
---

## Code review session

Save a review brain once, activate it anytime:

```bash
# Set up the configuration
brainjar soul use craftsman
brainjar persona use reviewer
brainjar rules add boundaries
brainjar rules add security
brainjar brain save review

# Activate anytime
brainjar brain use review

# Or scope to a single session
brainjar shell --brain review
```

## CI pipeline — enforce rules without a persona

Use environment variables in CI to override behavior:

```bash
BRAINJAR_PERSONA=auditor \
BRAINJAR_RULES_ADD=security,compliance \
brainjar status --sync
```

## Project-specific persona

Override behavior for a specific project without affecting your global config:

```bash
cd my-project
brainjar persona use planner --project
brainjar rules add no-delete --project

brainjar status
# soul     craftsman (workspace)
# persona  planner (project)
# rules    boundaries (workspace), no-delete (+project)
```

## Scoped shell sessions

Temporarily switch context without changing any state files:

```bash
brainjar shell --persona reviewer --rules-add security
# Inside this shell, BRAINJAR_* env vars are set
# Exit the shell and everything reverts
```

## Team sharing with packs

Export your setup and share it with teammates:

```bash
# You
brainjar pack export review --author frank --version 1.0.0

# Teammate
brainjar pack import ./review --activate
```

## MCP server registration

Register brainjar as an MCP server so agents can discover and use all commands:

```bash
brainjar mcp add                         # Global, auto-detect agent
brainjar mcp add --agent cursor          # Target a specific agent
brainjar mcp add --no-global             # Project-local only
```

## Skill files

Sync brainjar skill files to your agent for slash-command integration:

```bash
brainjar skills add                      # Global install
brainjar skills add --no-global          # Project-local only
```

## Shell completions

Set up tab completion for brainjar commands:

```bash
eval "$(brainjar completions zsh)"       # Add to ~/.zshrc
eval "$(brainjar completions bash)"      # Add to ~/.bashrc
```

## Multiple backends

Work with both Claude Code and Codex:

```bash
brainjar init --backend claude    # Default
brainjar init --backend codex     # Also set up Codex
```
