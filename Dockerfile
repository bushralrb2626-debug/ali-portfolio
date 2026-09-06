FROM node:22-bookworm-slim AS deps
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --ignore-scripts \
 && npx prisma generate

FROM node:22-bookworm-slim AS builder
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Placeholder only for prisma generate / Next compile — real Aiven URL at container start.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?sslmode=disable"
ENV AUTH_TRUST_HOST="true"
ENV AUTH_SECRET="build-only-secret"
ENV AUTH_URL="http://localhost:3000"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
# seed-data.json is committed (scripts/write-seed-data.ts) — no tsx inline at build
RUN npx next build --webpack

FROM node:22-bookworm-slim AS runner
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV AUTH_TRUST_HOST="true"
ENV AUTH_URL="https://ali-portfolio-web.onrender.com"
ENV PORT=10000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/@cursor ./node_modules/@cursor
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/scripts/seed-runtime.mjs ./scripts/seed-runtime.mjs
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
EXPOSE 10000
CMD ["/app/docker-entrypoint.sh"]
