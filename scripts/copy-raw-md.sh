#!/bin/bash
# Copy raw markdown sources into dist/ so they're accessible at <url>.md
# e.g. brainjar.sh/getting-started.md serves the raw markdown

DOCS_DIR="src/content/docs"
DIST_DIR="dist"

find "$DOCS_DIR" -name '*.md' -o -name '*.mdx' | while read -r file; do
  # Strip the docs dir prefix: src/content/docs/getting-started.md -> getting-started.md
  rel="${file#$DOCS_DIR/}"

  # Strip any existing extension, then add .md
  # getting-started.md -> getting-started.md
  # index.mdx -> index.md
  rel="${rel%.mdx}"
  rel="${rel%.md}"
  rel="${rel}.md"

  mkdir -p "$DIST_DIR/$(dirname "$rel")"

  # Strip frontmatter and copy
  awk 'BEGIN{skip=0} /^---$/{skip++; next} skip<2{next} {print}' "$file" > "$DIST_DIR/$rel"
done
