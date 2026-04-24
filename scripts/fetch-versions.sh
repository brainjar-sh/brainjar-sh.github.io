#!/bin/bash
# Fetch the latest brainjar release tag at build time and write it into
# public/versions.json so the hero version bar stays current.
#
# brainjar is one Go binary — no CLI-vs-server split to version
# separately. One field, one tag.
set -e

TAG=$(curl -sfSL 'https://get.brainjar.sh/brainjar/latest' || echo "")
# Strip the leading 'v' — the version bar reads cleaner as "0.4.1"
# than "v0.4.1".
VERSION="${TAG#v}"

echo "{\"brainjar\":\"${VERSION}\"}" > public/versions.json
echo "Wrote public/versions.json: brainjar=${VERSION}"
