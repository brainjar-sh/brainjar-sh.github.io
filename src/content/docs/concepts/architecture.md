---
title: Architecture
description: How the CLI and server work together
---

brainjar is a client-server system. The **CLI** is a thin client that manages your agent configuration. The **server** stores all content and state.

## Components

### CLI (`@brainjar/cli`)

The command-line tool you interact with. It handles:

- Creating and managing souls, personas, rules, and brains
- Composing prompts for subagent orchestration
- Syncing active configuration into your agent's config file (`CLAUDE.md` or `AGENTS.md`)
- Downloading and managing the server binary

The CLI makes HTTP requests to the server for every operation. It stores almost nothing locally — just a small config file at `~/.brainjar/config.yaml`.

### Server (`brainjar-server`)

A Go binary that provides the REST API and stores all content. It runs in one of two modes:

| Mode | Description |
|------|-------------|
| **Local** | Managed by the CLI. Auto-downloaded, auto-started, uses embedded Postgres. Zero config. |
| **Remote** | You run the server yourself (Docker, bare metal, cloud). CLI connects to it by URL. |

Local mode is the default. When you run `brainjar init`, the CLI downloads the server binary from `get.brainjar.sh`, starts it in the background, and creates your workspace. You don't need to think about the server — it just works.

You can also install the server binary manually:

```bash
curl -fsSL https://get.brainjar.sh/install.sh | sh
```

## Local files

The only thing stored locally:

```
~/.brainjar/
  config.yaml           # server contexts, backend
  bin/brainjar-server   # server binary (local mode only)
  pg-data/              # embedded Postgres data (persists across upgrades)
  server.pid            # process ID (local mode only)
  server.log            # server logs (local mode only)
  server-version        # installed version tracker
```

All content (souls, personas, rules, brains) and state (what's active) lives on the server.

## Config file

`~/.brainjar/config.yaml` uses named contexts to manage multiple servers:

```yaml
version: 2
current_context: local
contexts:
  local:
    url: http://localhost:7742
    mode: local
    bin: ~/.brainjar/bin/brainjar-server
    pid_file: ~/.brainjar/server.pid
    log_file: ~/.brainjar/server.log
    workspace: default
  staging:
    url: https://staging.brainjar.example.com
    mode: remote
    workspace: default
backend: claude
```

The `local` context is always present. Each context has its own URL, mode, and workspace. Switch between them with `brainjar context use <name>`.

## Server modes

### Local mode (default)

```bash
brainjar init --default
```

The CLI:
1. Creates the config file at `~/.brainjar/config.yaml`
2. Downloads the server binary from `get.brainjar.sh`
3. Starts it in the background with embedded Postgres
4. Creates the `default` workspace
5. Seeds starter content (if `--default` is passed)
6. Writes `CLAUDE.md` with the active configuration

Manage the local server with:

```bash
brainjar server status    # check health, PID, mode, server version
brainjar server logs      # view server logs
brainjar server stop      # stop the daemon
brainjar server start     # start the daemon
```

### Remote mode

Add a remote server as a named context:

```bash
brainjar context add staging https://brainjar.example.com
brainjar context use staging
```

This is useful for teams sharing a single server, or for running the server in Docker with an external Postgres:

```bash
docker run -d \
  -e BRAINJAR_POSTGRES_HOST=your-postgres-host \
  -e BRAINJAR_POSTGRES_PORT=5432 \
  -e BRAINJAR_POSTGRES_USERNAME=brainjar \
  -e BRAINJAR_POSTGRES_PASSWORD=brainjar \
  -e BRAINJAR_POSTGRES_DATABASE=brainjar \
  -p 7742:7742 \
  ghcr.io/brainjar-sh/server:latest
```

The Docker image has `BRAINJAR_POSTGRES_EMBEDDED=false` baked in — you only need to provide the connection details.

Switch back to local:

```bash
brainjar context use local
```

### Managing contexts

```bash
brainjar context list               # list all contexts
brainjar context add prod <url>     # add a remote context
brainjar context use staging        # switch active context
brainjar context show               # show active context details
brainjar context rename old new     # rename a context
brainjar context remove staging     # remove a context
```

## Workspaces

A workspace is an isolated namespace for all your content. By default, `brainjar init` creates a workspace called `default`. All content operations happen within your active workspace.

## How sync works

When you change the active soul, persona, or rules, the CLI fetches the composed configuration from the server and writes it to your agent's config file:

- **Claude Code**: `~/.claude/CLAUDE.md` (global) or `.claude/CLAUDE.md` (project)
- **Codex**: `~/.codex/AGENTS.md` (global) or `.codex/AGENTS.md` (project)

Sync runs automatically after any state-changing command (`use`, `drop`, `add`, `remove`). You can also trigger it manually:

```bash
brainjar sync
```

## Upgrading

Upgrade both CLI and server in one command:

```bash
brainjar upgrade
```

Or upgrade selectively:

```bash
brainjar upgrade --cli-only       # just the CLI
brainjar upgrade --server-only    # just the server binary
```

The server upgrade always targets the local binary, regardless of which context is active.

## Version compatibility

The CLI checks the server version on connect. If the server is too old for the CLI, you'll get a clear error:

```
Server v0.1.4 is incompatible with this CLI (requires >= 0.2.1).
Run `brainjar upgrade` to update both CLI and server.
```

Check the current server version with `brainjar server status`.
