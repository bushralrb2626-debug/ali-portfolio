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
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV AUTH_TRUST_HOST="true"
ENV AUTH_SECRET="build-only-secret"
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_DB_BOOTSTRAP=1
RUN DATABASE_URL="file:/app/prisma/dev.db" npx prisma generate \
 && DATABASE_URL="file:/app/prisma/dev.db" npx prisma db push \
 && DATABASE_URL="file:/app/prisma/dev.db" npx tsx prisma/reseed-ads.ts \
 && test -f /app/prisma/dev.db \
 && DATABASE_URL="file:/app/prisma/dev.db" npx next build --webpack

FROM node:22-bookworm-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV AUTH_TRUST_HOST="true"
ENV AUTH_URL="https://ali-portfolio-web.onrender.com"
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV PORT=10000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Cursor SDK (local agent) needs its package + platform binaries at runtime.
COPY --from=builder /app/node_modules/@cursor ./node_modules/@cursor
EXPOSE 10000
CMD ["node", "server.js"]
