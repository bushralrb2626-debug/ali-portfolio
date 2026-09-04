#!/bin/sh
set -eu
mkdir -p /app/.runtime
# Persist secrets the Node process should read at request time.
# (Never echo the secret value — only presence/length for Render logs.)
if [ -n "${CURSOR_API_KEY:-}" ]; then
  printf '%s' "$CURSOR_API_KEY" > /app/.runtime/cursor_api_key
  chmod 600 /app/.runtime/cursor_api_key
  echo "entrypoint: CURSOR_API_KEY present (len=${#CURSOR_API_KEY})"
else
  rm -f /app/.runtime/cursor_api_key
  echo "entrypoint: CURSOR_API_KEY missing from container env"
fi
exec node server.js
