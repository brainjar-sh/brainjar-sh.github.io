---
title: Packs
description: Export and import a workspace as a single JSON bundle.
---

A pack is a single JSON document containing every soul, persona, rule, procedure, and brain in a workspace, plus its active state. It round-trips through `pack export` and `pack import`.

See [CLI reference](/reference/cli/#pack) for the full flag list.

## What's in a pack

```jsonc
{
  "schema_version": 1,
  "souls":      { "<slug>": { "content": "…" } },
  "personas":   { "<slug>": { "content": "…", "bundled_rules": [ … ] } },
  "rules":      { "<slug>": { "entries": [ { "sort_key": 0, "content": "…" } ] } },
  "procedures": { "<slug>": { "content": "…" } },
  "brains":     { "<slug>": { "soul": "…", "persona": "…", "procedure": "…", "rules": [ … ], "model": "…" } },
  "state":      { "soul": "…", "persona": "…", "procedure": "…", "rules": [ … ] }
}
```

Workspace identifiers (UUIDs, API keys) are not included; the importer's workspace ID is preserved. Empty maps and arrays are emitted as `{}` / `[]`, not omitted.

## Exporting

```bash
brainjar pack export -o backup.json            # pretty-printed JSON
brainjar pack export --compact -o backup.json  # single-line JSON
brainjar pack export -o - | gzip > backup.json.gz
```

Default output is pretty-printed to stdout; pass `-o <path>` to write to a file, or `-o -` to keep stdout explicit.

## Importing

```bash
brainjar pack import -i backup.json
cat backup.json | brainjar pack import
```

Imports are additive — existing souls, personas, rules, and brains are upserted in place. Per-entity failures (e.g. dangling references) become warnings and do not abort the import. An unknown `schema_version` is a fatal `BAD_REQUEST`.
