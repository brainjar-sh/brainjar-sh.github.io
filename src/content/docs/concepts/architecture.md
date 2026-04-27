---
title: Architecture
description: How the brainjar binary, local storage, contexts, and platforms fit together
---

brainjar is a single Go binary with an embedded local backend. The CLI you run on the command line and the optional HTTP server (`brainjar serve`) are the **same binary**, talking to the **same SQLite database**. There is no separate server to install, no Postgres, no daemon to manage.

## Components

| Component | What it is | When you need it |
|-----------|-----------|-------------------|
| **CLI** (`brainjar`) | The command-line tool. Embeds the local backend, MCP server, HTTP server, and platform adapters. | Always — this is brainjar. |
| **`brainjar serve`** | The same binary running an HTTP server that exposes brainjar's API. | Only when you want a shared server other CLIs (yours, a teammate's, CI) can point at as a remote context. |

The default backend is local SQLite. Remote mode is opt-in.

## Local files

Everything brainjar persists lives under one directory:

```
~/.brainjar/
  brainjar.db        # SQLite database — souls, personas, rules, brains, state, API keys
  config.yaml        # active context + workspace pointer
```

Override the location with `--home <path>` or `$BRAINJAR_HOME`. That's the only environment variable in the supported surface.

`config.yaml` is what `brainjar init` writes (verbatim from a fresh init):

```yaml
active_context: default
contexts:
    default:
        platform: claude
        workspace_id: <uuid>
schema_version: 1
```

You should not edit it by hand. Manage it through `brainjar context …` and `brainjar workspace switch`.

## Contexts

A context binds a workspace to a platform and an optional remote endpoint. Every brainjar invocation routes through the active context.

| Type | What it is |
|------|-----------|
| **Local** (default) | Reads and writes `~/.brainjar/brainjar.db` directly. |
| **Remote** | Talks to a `brainjar serve` instance over HTTPS using a stored API key. |

```bash
brainjar context list                                          # list every context, mark the active one
brainjar context show                                          # full details for the active context
brainjar context add staging --url https://brainjar.example.com \
  --workspace <uuid> --platform claude --api-key-ref env:BRAINJAR_KEY
brainjar context use staging                                   # route subsequent commands through staging
brainjar context rename staging prod
brainjar context remove staging                                # refuses if it's the active one
```

`--platform` defaults to `claude`. `--workspace` is required (a UUID, not a name — get one from `brainjar workspace list`). See the [`context` reference](/reference/cli/#context).

## Platforms

A platform adapter knows where its agent reads its config, where to install hooks, and how to register MCP. The active context's platform decides where `brainjar sync` writes, which hook scopes are available, and which platform `brainjar shell` will spawn.

```bash
brainjar platform list
```

The current set:

| Platform | Sync | Hooks | MCP | Spawn | Scopes |
|----------|------|-------|-----|-------|--------|
| `claude` | yes | yes | yes | yes | project, local, user |
| `codex`  | yes | yes | yes | yes | project, user |
| `cursor` | yes | yes | yes | no  | project, user |

To switch platforms, switch contexts. There is no `--backend` flag on `init`. See the [`platform` reference](/reference/cli/#platform).

## Workspaces

A workspace is the isolation boundary for souls, personas, rules, and brains. `brainjar init` creates one called `default` and points the active context at it.

```bash
brainjar workspace list
brainjar workspace create scratch
brainjar workspace switch scratch     # rewrites config.workspace_id for the active context
brainjar workspace rename scratch playground
brainjar workspace delete playground  # refuses if it holds content unless --purge is set
```

See the [`workspace` reference](/reference/cli/#workspace).

## Sync

`brainjar sync` composes the effective prompt (active soul + persona + procedure + rules) and writes it into the platform's config file inside a managed section. Re-runs are idempotent. Content outside the managed section is left alone.

Project scope is auto-resolved from the basename of the nearest `.git` root walking up from cwd. Pass `--project <slug>` to override. See the [`sync` reference](/reference/cli/#sync).

## Upgrading

```bash
brainjar upgrade --check    # print current vs latest, install nothing
brainjar upgrade            # download, verify cosign signature, atomic swap
```

`brainjar upgrade` is only meaningful for installs done via `get.brainjar.sh`. If you installed through Homebrew, apt, or nix, upgrade through your package manager — the binary detects managed installs and warns. Check the running version with `brainjar --version`. See the [`upgrade` reference](/reference/cli/#upgrade).

## Remote mode (optional)

Run the server somewhere reachable, then register it as a context:

```bash
# on the server host
brainjar serve --host 0.0.0.0 --port 8080

# on the client
brainjar context add prod --url https://brainjar.example.com \
  --workspace <uuid> --api-key-ref env:BRAINJAR_KEY
brainjar context use prod
```

`brainjar serve` defaults to `127.0.0.1:8080`. It uses the same `LocalBackend` as the CLI, against the same SQLite database under `--home`. Issue API keys with `brainjar api-key create` on the server host and reference them from the client via `--api-key-ref`. See the [`serve` reference](/reference/cli/#serve) and the [`reset` reference](/reference/cli/#reset) for cleanup.
