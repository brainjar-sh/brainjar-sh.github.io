#!/bin/bash
# Fetch latest CLI and server versions at build time
set -e

CLI=$(curl -sf 'https://registry.npmjs.org/@brainjar/cli/latest' | node -e "process.stdin.on('data',d=>process.stdout.write(JSON.parse(d).version))" 2>/dev/null || echo "")
SERVER=$(curl -sf 'https://get.brainjar.sh/brainjar-server/latest' 2>/dev/null || echo "")

echo "{\"cli\":\"${CLI}\",\"server\":\"${SERVER}\"}" > public/versions.json
echo "Wrote public/versions.json: cli=${CLI} server=${SERVER}"
