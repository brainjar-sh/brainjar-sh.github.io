#!/usr/bin/env bash
# Sourced by demo/quickstart.tape during VHS recording.
#
# - Moves into a clean cwd so `brainjar status` doesn't warn about an invalid
#   project slug (the repo dir contains a `.`).
# - Points BRAINJAR_HOME at a throwaway dir so the demo never touches real state.
# - Points INSTALL_DIR at a throwaway dir so the curl-piped installer doesn't
#   need sudo and doesn't overwrite the host brainjar binary.
# - Wraps `brainjar init` so only the first line of its output is shown — the
#   real init still runs, but the API-key printout is suppressed for the demo.
# - Sets a prompt with a leading newline for visual breathing room.

mkdir -p /tmp/brainjar-demo
cd /tmp/brainjar-demo

export BRAINJAR_HOME=$(mktemp -d -t brainjar-demo-XXXX)
export INSTALL_DIR=$(mktemp -d -t brainjar-demo-bin-XXXX)

brainjar() {
  case "$1" in
    init) command brainjar "$@" 2>&1 | head -1 ;;
    *)    command brainjar "$@" ;;
  esac
}

export PS1=$'\n> '
