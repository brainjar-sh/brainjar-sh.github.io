---
title: Platforms
description: How brainjar integrates with Claude Code, Cursor, and Codex — config paths, hook surface, MCP registration, and per-platform quirks.
---

A platform adapter teaches brainjar where the agent's config lives, where to install hooks, and how to register the MCP server. The active context binds to one platform; switch contexts to switch platforms. brainjar ships three production adapters: **Claude Code**, **Cursor**, and **Codex**. There is no generic adapter — every platform has its own concrete adapter because every platform's config surface is different.

This page is a per-platform reference. For the underlying state and context model, see [Configuration](/guides/configuration/). For the commands themselves, see the [`platform`](/reference/cli/#platform), [`hooks`](/reference/cli/#hooks), and [`mcp`](/reference/cli/#mcp) reference.

## Compatibility matrix

```bash
brainjar platform list
```

```
name      active  sync  hooks  mcp   spawn  scopes
claude    *       yes   yes    yes   yes    project, local, user
codex             yes   yes    yes   yes    project, user
cursor            yes   yes    yes   no     project, user
```

| Capability                       | Claude Code                                 | Cursor                                  | Codex                                                          |
| -------------------------------- | ------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Sync target                      | `.claude/CLAUDE.md` (managed section)       | `.cursor/rules/brainjar.mdc` (full file) | `AGENTS.md` at repo root (managed section)                     |
| Sync scope                       | project                                     | project                                 | project                                                        |
| Hook event                       | `UserPromptSubmit`                          | `beforeSubmitPrompt`                    | `UserPromptSubmit`                                             |
| Hook scopes                      | project, local, user                        | project, user                           | project, user                                                  |
| MCP scopes                       | project, local, user                        | project, user                           | **user only**                                                  |
| `brainjar shell` (spawn)         | yes — `--append-system-prompt`              | no                                      | yes — `--system-prompt`                                        |
| Skill emit (`SKILL.md`)          | yes                                         | no                                      | no                                                             |
| Bundled model catalog            | 4 (Opus 4.7 / 4.6, Sonnet 4.6, Haiku 4.5)   | empty (UI-bound)                        | 1 (`gpt-5`)                                                    |

`brainjar sync` and `brainjar hooks install` both default to `project` scope, except where the platform doesn't support it. `brainjar mcp install` defaults to `user`. See [MCP Integration](/guides/mcp/) and [Hooks](/guides/hooks/) for the command surface.

## Scopes

Three scope levels show up across the matrix above:

| Scope     | Audience                                                       | Where it lands                                                       |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| `project` | Everyone who clones the repo. Committed to VCS.                | `<project>/.claude/`, `<project>/.cursor/`, `<project>/AGENTS.md`, etc. |
| `local`   | Just this checkout on this machine. Not shared via VCS.        | `<project>/.claude/settings.local.json`, `~/.claude.json` per-project bucket. **Claude Code only.** |
| `user`    | Every project on this machine. Personal global default.        | `~/.claude/`, `~/.cursor/`, `~/.codex/`.                              |

Use `project` for team-shared defaults that should travel with the repo. Use `local` for personal overrides on a single checkout. Use `user` for cross-project preferences.

## Claude Code

Adapter slug: `claude`. The default platform on a fresh `brainjar init`.

### Sync target

```
<project>/.claude/CLAUDE.md
```

brainjar writes only inside a managed section bounded by markers:

```
<!-- brainjar:begin -->
... composed prompt ...
<!-- brainjar:end -->
```

Anything outside the markers is yours and is preserved byte-for-byte across re-syncs. If `CLAUDE.md` doesn't exist yet, brainjar creates it with just the managed section. Sync requires a project root — there is no user-scope sync for Claude Code (the global `~/.claude/CLAUDE.md` file is not managed by brainjar).

### Hooks

Event: `UserPromptSubmit`. Fires once per user turn (not per tool call), runs `brainjar sync`.

| Scope     | Settings file                                |
| --------- | -------------------------------------------- |
| `project` | `<project>/.claude/settings.json`            |
| `local`   | `<project>/.claude/settings.local.json` *(gitignored — keep out of VCS)* |
| `user`    | `~/.claude/settings.json`                    |

The hook entry is written under `hooks.UserPromptSubmit[].hooks[]` in the matcher-block format Claude Code expects:

```json
{
  "type": "command",
  "command": "brainjar sync"
}
```

### MCP registration

| Scope     | Config file                                                         |
| --------- | ------------------------------------------------------------------- |
| `project` | `<project>/.mcp.json` *(committed; teammates pick up the registration on clone)* |
| `local`   | `~/.claude.json` under `projects.<projectRoot>.mcpServers`           |
| `user`    | `~/.claude.json` under top-level `mcpServers`                        |

Entry shape (Claude Desktop compatible):

```json
{
  "mcpServers": {
    "brainjar": {
      "command": "brainjar",
      "args": ["mcp"]
    }
  }
}
```

If `BRAINJAR_HOME` is set when you run `brainjar mcp install`, the registration carries it through as `["--home", "<path>", "mcp"]` so the agent reads from the same store as your CLI.

### `brainjar shell`

Supported. The composed prompt is appended via Claude Code's `--append-system-prompt` flag, which adds to the built-in system prompt rather than replacing it.

## Cursor

Adapter slug: `cursor`. Targets Cursor 1.7+ (October 2025 hook surface).

### Sync target

```
<project>/.cursor/rules/brainjar.mdc
```

Unlike Claude and Codex, brainjar **owns the entire `brainjar.mdc` file** — both the YAML frontmatter and the rule body. The frontmatter sets `alwaysApply: true` so the rule fires on every prompt:

```yaml
---
description: brainjar-managed prompt
alwaysApply: true
---

<!-- brainjar:begin -->
... composed prompt ...
<!-- brainjar:end -->
```

Don't hand-edit `brainjar.mdc`. Add other Cursor rules as separate `.mdc` files alongside it.

User-scope sync is **not supported** — Cursor's User Rules are UI-only and don't have a documented filesystem path. Set the prompt per-project.

### Hooks

Event: `beforeSubmitPrompt` (camelCase, Cursor's hook serde). Runs `brainjar sync` before each prompt is submitted.

| Scope     | Hook file                                  |
| --------- | ------------------------------------------ |
| `project` | `<project>/.cursor/hooks.json`             |
| `user`    | `~/.cursor/hooks.json`                     |

No `local` scope — that's a Claude Code feature. The hook file uses Cursor's flat-array schema with a top-level version key:

```json
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      { "command": "brainjar sync", "timeout": 30 }
    ]
  }
}
```

### MCP registration

| Scope     | Config file                                |
| --------- | ------------------------------------------ |
| `project` | `<project>/.cursor/mcp.json`               |
| `user`    | `~/.cursor/mcp.json`                       |

Entry shape is Claude Desktop compatible (same as Claude Code):

```json
{
  "mcpServers": {
    "brainjar": {
      "command": "brainjar",
      "args": ["mcp"]
    }
  }
}
```

### `brainjar shell`

**Not supported.** Cursor has no documented mechanism to inject a per-invocation system prompt via the CLI; `brainjar shell` returns `ErrUnsupportedByPlatform`. Use `brainjar sync` to write the prompt into `brainjar.mdc`, then start Cursor normally.

## Codex

Adapter slug: `codex`. Targets the OpenAI Codex CLI (Rust). Verified against `openai/codex` v0.122.0.

### Sync target

```
<project>/AGENTS.md
```

Lives at the repo root, not inside a `.codex/` directory. brainjar writes only inside the `<!-- brainjar:begin --> / <!-- brainjar:end -->` managed section; user content above and below is preserved.

**Size warning.** Codex enforces a 32 KiB budget on `AGENTS.md`. If `brainjar sync` produces a final file exceeding that, brainjar prints a warning to stderr but still writes the file. Trim the active brain (drop rules, condense the soul) if you hit it.

User-scope sync is not supported.

### Hooks

Event: `UserPromptSubmit` (PascalCase per Codex's serde).

| Scope     | Hook config                                                    |
| --------- | -------------------------------------------------------------- |
| `project` | `<project>/.codex/hooks.json`                                  |
| `user`    | `$CODEX_HOME/config.toml` *(defaults to `~/.codex/config.toml`)* |

**Codex hooks are gated behind a feature flag.** Codex ignores `hooks.json` entirely unless this is set in the matching `config.toml`:

```toml
[features]
codex_hooks = true
```

`brainjar hooks install` sets the flag automatically. `brainjar hooks remove` clears the hook entry but **does not clear the flag** — leaving the flag on is harmless and means the next `hooks install` doesn't have to flip it again. If you want the flag gone, edit `config.toml` by hand.

Hook entry shape:

```json
{
  "type": "command",
  "command": "brainjar sync",
  "timeout": 30
}
```

### MCP registration

**User scope only.** Codex doesn't support project- or local-scoped MCP registrations — every MCP server is registered globally per machine.

```
$CODEX_HOME/config.toml
```

Entry shape (TOML, not JSON):

```toml
[mcp_servers.brainjar]
command = "brainjar"
args = ["mcp"]
enabled = true
```

`brainjar mcp install --scope project` and `--scope local` both error on Codex. Use `--scope user` (the default).

### `brainjar shell`

Supported. The composed prompt is passed via Codex's `--system-prompt` flag.

## Switching platforms

The active platform comes from the active context. To change it, switch contexts — there is no `--platform` flag on `init`, `sync`, or `reset`:

```bash
brainjar context add codex --platform codex --workspace <uuid>
brainjar context use codex
```

Inspect the current context and platform with `brainjar status` or `brainjar context list`. See [Configuration → Platforms](/guides/configuration/#platforms) and the [`context`](/reference/cli/#context) reference.

## Cross-platform invariants

A few things hold for every adapter:

- **Managed-section markers are identical** across platforms: `<!-- brainjar:begin -->` and `<!-- brainjar:end -->`. User content outside the markers is always preserved.
- **The hook command is always `brainjar sync`.** Hooks fire on whatever the platform's user-prompt event is named, but the action is identical.
- **The MCP server name is always `brainjar`** and the binary invoked is `brainjar` on PATH. If you set `BRAINJAR_HOME` at install time, the registration includes `--home <path>` so the agent uses the same store as your CLI.
- **`brainjar reset --yes`** removes the brainjar database and config. It does **not** touch the platform's files (`CLAUDE.md`, `brainjar.mdc`, `AGENTS.md`, hooks, MCP registrations) — remove those by hand if you want them gone, or leave them and run `brainjar init` again to repopulate.

See also: [Configuration](/guides/configuration/), [MCP Integration](/guides/mcp/), [Hooks](/guides/hooks/).
