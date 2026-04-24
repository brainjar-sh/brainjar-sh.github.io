#!/bin/bash
# Fetch the latest brainjar release tag at build time and write it into
# public/versions.json so the hero version bar stays current.
#
# brainjar is one Go binary that serves both CLI and server roles;
# both share the same version, which is the latest tag on R2.
set -e

TAG=$(curl -sfSL 'https://get.brainjar.sh/brainjar/latest' || echo "")
# Strip a leading 'v' for display — the version bar looks cleaner as
# "cli 0.4.1" than "cli v0.4.1".
VERSION="${TAG#v}"

echo "{\"cli\":\"${VERSION}\",\"server\":\"${VERSION}\"}" > public/versions.json
echo "Wrote public/versions.json: cli=${VERSION} server=${VERSION}"
