---
title: Identity
description: Manage who the agent acts as — credentials, git config, and secret access.
---

An identity defines *who* the agent acts as in the real world — name, email, and access to credentials. While a soul shapes the agent's voice, an identity shapes its signature.

Only one identity is active at a time.

## Creating an identity

```bash
brainjar identity create work --name "John Doe" --email john@example.com --engine bitwarden
```

This creates `~/.brainjar/identities/work.yaml`:

```yaml
name: John Doe
email: john@example.com
engine: bitwarden
```

The `--engine` flag sets which credential backend to use for secret retrieval. Currently supports `bitwarden` (the default).

## Activating an identity

```bash
brainjar identity use work
```

This sets the active identity globally. Use `--local` to scope it to a project.

## Credential access

Identities integrate with a credential engine (e.g. Bitwarden) so the agent can retrieve secrets without them being hardcoded or stored in plaintext.

```bash
brainjar identity unlock          # Store the session token
brainjar identity get "API Key"   # Retrieve a credential by name
brainjar identity lock            # End the session
```

The session token is held in memory — `lock` clears it. The agent never sees your vault password, only individual credentials you authorize via `get`.

## Managing identities

```bash
brainjar identity list            # See available identities
brainjar identity show            # View the active identity
brainjar identity status          # Check if the credential session is active
brainjar identity drop            # Deactivate the current identity
```

## Identity vs. soul

| Layer | Defines | Example |
|-------|---------|---------|
| **Soul** | How the agent *sounds* — voice, character | Direct, rigorous, no filler |
| **Identity** | Who the agent *is* — name, email, credentials | Jane Doe, jane@company.com |

A soul is about personality. An identity is about authentication and attribution.

## When to use multiple identities

- **Personal vs. work** — different git config, different credential vaults
- **Per-client** — consultants acting under different organizations
- **CI environments** — service identities with scoped access
