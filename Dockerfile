FROM node:22-bookworm-slim AS deps
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-bookworm-slim AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL comes from Render service env (Aiven Postgres). Do not hardcode SQLite.
ENV AUTH_TRUST_HOST="true"
ENV AUTH_SECRET="build-only-secret"
ENV NEXT_TELEMETRY_DISABLED=1
RUN test -n "${DATABASE_URL:-}" || (echo "DATABASE_URL is required (set Aiven Postgres URI on Render)" && exit 1) \
 && case "$DATABASE_URL" in file:*) echo "DATABASE_URL must be Postgres, not SQLite file:" && exit 1 ;; esac \
 && npx prisma generate \
 && npx prisma db push \
 && npx tsx prisma/seed.ts \
 && npx next build --webpack

FROM node:22-bookworm-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV AUTH_TRUST_HOST="true"
ENV AUTH_URL="https://ali-portfolio-web.onrender.com"
ENV PORT=10000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/@cursor ./node_modules/@cursor
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
EXPOSE 10000
CMD ["/app/docker-entrypoint.sh"]
