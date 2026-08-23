FROM node:20-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
ENV DATABASE_URL="file:./dev.db"
ENV AUTH_TRUST_HOST="true"
ENV NODE_ENV="production"
RUN npx prisma generate && npx prisma db push && npx tsx prisma/reseed-ads.ts && npx next build --webpack
ENV PORT=10000
EXPOSE 10000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "10000"]
