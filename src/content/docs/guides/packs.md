---
title: Packs
description: Export and share brain configurations as portable bundles.
---

Packs are self-contained, shareable bundles of a brain and all its layers. Export a brain as a pack directory, hand it to a teammate, and they import it in one command.

## What's in a pack

A pack is a directory with a `pack.yaml` manifest and the content files. No tarballs, no magic — just files you can inspect with `ls` and `cat`.

```
review/
  pack.yaml
  souls/
    craftsman.md
  personas/
    reviewer.md
  rules/
    boundaries.md
    task-completion.md
    security.md
  brains/
    review.yaml
```

## Exporting

```bash
brainjar pack export review                        # Creates ./review/
brainjar pack export review --out /tmp             # Creates /tmp/review/
brainjar pack export review --name my-review       # Override pack name
brainjar pack export review --version 1.0.0        # Set version (default: 0.1.0)
brainjar pack export review --author frank         # Set author field
```

## Importing

```bash
brainjar pack import ./review                      # Import into server
brainjar pack import ./review --activate           # Activate the brain after import
```
