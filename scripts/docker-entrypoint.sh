#!/bin/sh
set -eu
mkdir -p /app/.runtime

# Never echo secret values — only presence/length.
if [ -n "${CURSOR_API_KEY:-}" ]; then
  printf '%s' "$CURSOR_API_KEY" > /app/.runtime/cursor_api_key
  chmod 600 /app/.runtime/cursor_api_key
  echo "entrypoint: CURSOR_API_KEY present (len=${#CURSOR_API_KEY})"
else
  rm -f /app/.runtime/cursor_api_key
  echo "entrypoint: CURSOR_API_KEY missing from container env"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "entrypoint: DATABASE_URL missing — set Aiven Postgres URI on Render Environment"
  exit 1
fi

case "$DATABASE_URL" in
  file:*)
    echo "entrypoint: DATABASE_URL must be Postgres, not SQLite file:"
    exit 1
    ;;
  mysql:*)
    echo "entrypoint: DATABASE_URL must be Postgres (got mysql:)"
    exit 1
    ;;
esac

echo "entrypoint: DATABASE_URL present (len=${#DATABASE_URL})"
echo "entrypoint: prisma db push…"
# Use isolated CLI install (/opt/prisma-cli) — standalone image lacks prisma transitive deps.
node /opt/prisma-cli/node_modules/prisma/build/index.js db push --schema=/app/prisma/schema.prisma
echo "entrypoint: seed…"
node /app/scripts/seed-runtime.mjs

exec node server.js
