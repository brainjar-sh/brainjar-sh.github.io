---
title: Configuration
description: State cascade, project scope, contexts, platforms, and config file.
---

brainjar's configuration surface is small on purpose. Effective state comes from a two-layer cascade. Where things live on disk is governed by `~/.brainjar`. The active platform and remote endpoint are bundled into a *context*. That's the whole picture.

## State cascade

State merges in two tiers. The lower tier overrides the higher one:

```
workspace  →  project
```

### Workspace state

The default everyone in the workspace sees. Set without any extra flags:

```bash
brainjar persona use engineer    # workspace persona
brainjar rule add security       # workspace rule
```

### Project state

A per-repo override that only applies inside one project. Workspace settings still flow through — project state only changes the layers you explicitly set.

```bash
cd my-project       # inside a git repo with a slug-shaped directory name
brainjar persona use planner       # project persona overrides workspace persona
brainjar rule add no-delete        # project rule adds on top of workspace rules
```

`brainjar status` annotates each line with the layer it came from:

```
soul     craftsman (workspace)
persona  planner (project)
rules    boundaries (workspace), no-delete (+project)
```

The `(+project)` annotation marks rules added at project scope; `(-project)` marks rules masked off for this project only.

See [`brainjar status`](/reference/cli/#status) and [`brainjar sync`](/reference/cli/#sync).

## Project scope resolution

Project scope is auto-resolved from the working directory. The lookup order:

1. **`--project <slug>` flag.** Always wins. Supported on commands that accept a project (e.g. `status`, `sync`).
2. **Nearest `.git` root basename.** The CLI walks up from cwd to the first `.git` directory and uses its parent's basename as the project slug — but only if the basename is a valid slug (lowercase, hyphen-separated, must start with a letter and end alphanumeric: `^[a-z]([a-z0-9-]*[a-z0-9])?$`).
3. **Fallback: workspace scope.** If the basename isn't a valid slug (contains dots, underscores, or capitals — for example `my.project` or `MyProject`), brainjar falls back to workspace scope and emits a warning on stderr.

There is no `.brainjar/` discovery directory and no session scope. State is always either workspace or project.

## Environment

The only supported environment variable is:

| Variable | Effect |
|----------|--------|
| `BRAINJAR_HOME` | Override the brainjar home directory (default `~/.brainjar`). Equivalent to passing `--home <path>` on every invocation. |

There are no env vars for activating a soul, persona, or rule. State is set with `soul use` / `persona use` / `rule add`, and applied to the agent via [`brainjar sync`](/reference/cli/#sync) or [`brainjar shell`](/reference/cli/#shell).

## Config file

`~/.brainjar/config.yaml` holds the active context pointer and the registered contexts:

```yaml
active_context: default
contexts:
    default:
        platform: claude
        workspace_id: 767a626d-b7a7-4406-997a-0ee27370acab
schema_version: 1
```

It is managed by [`brainjar context …`](/reference/cli/#context) and [`brainjar workspace switch`](/reference/cli/#workspace-switch). Don't edit it by hand — use the commands. Alongside it, `~/.brainjar/brainjar.db` is the SQLite database that stores souls, personas, rules, brains, state, and API keys.

## Platforms

A platform adapter knows where the agent's config lives, where to install hooks, and where to register MCP. The active context binds to one platform. The default is `claude`.

List the registered adapters:

```bash
brainjar platform list
```

```
name      active  sync  hooks  mcp   spawn  scopes
claude    *       yes   yes    yes   yes    project, local, user
codex             yes   yes    yes   yes    project, user
cursor            yes   yes    yes   no     project, user
```

Switch the active platform by switching contexts. There is no `--backend` or `--platform` flag on `init` or `reset`:

```bash
# Add a Codex context and use it
brainjar context add codex --platform codex --workspace <uuid>
brainjar context use codex
```

See [`brainjar platform`](/reference/cli/#platform) and [`brainjar context`](/reference/cli/#context).

## Backup & restore

`brainjar sync` writes only inside a managed section delimited by markers in your platform's config file:

```
<!-- brainjar:begin -->
… brainjar-managed content …
<!-- brainjar:end -->
```

Everything outside the markers is yours. Re-running `sync` rewrites only what's between the markers; user content above and below is preserved verbatim.

To pull brainjar out:

```bash
brainjar reset --yes
```

This removes `brainjar.db` and `config.yaml` from the brainjar home. Other files in the home (packs, exports) are left alone. `reset` does **not** touch the platform's config file — remove the brainjar-managed block from `CLAUDE.md` (or `AGENTS.md`) by hand if you want it gone.

See [`brainjar reset`](/reference/cli/#reset).

For decomposing an existing monolithic config into souls, personas, and rules, see [Migrating from Monolithic Prompts](/guides/migration/).
