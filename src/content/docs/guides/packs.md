---
title: Packs
description: Export and import a workspace as a single JSON bundle.
---

A pack is a single JSON document containing every soul, persona, rule, brain, and the active state for one workspace. It round-trips through `pack export` and `pack import`.

See [CLI reference](/reference/cli/#pack) for the full flag list.

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
