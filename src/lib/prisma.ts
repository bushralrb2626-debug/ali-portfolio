import { copyFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

/**
 * One SQLite file for reads and writes.
 * On Render/Vercel the image/seed copy is read-only or reset per deploy,
 * so we copy once into /tmp (writable) and point Prisma there explicitly.
 */
function resolveSqliteUrl() {
  const hosted = Boolean(
    process.env.RENDER ||
      process.env.K_SERVICE ||
      process.env.FUNCTION_TARGET ||
      process.env.FIREBASE_CONFIG ||
      process.env.VERCEL,
  );
  if (!hosted) {
    return process.env.DATABASE_URL ?? "file:./dev.db";
  }

  const dest = "/tmp/ali-portfolio.db";
  if (!existsSync(dest)) {
    for (const src of [
      join(process.cwd(), "prisma", "dev.db"),
      join(process.cwd(), "dev.db"),
    ]) {
      if (existsSync(/* turbopackIgnore: true */ src)) {
        copyFileSync(/* turbopackIgnore: true */ src, dest);
        break;
      }
    }
  }
  return `file:${dest}`;
}

const dbUrl = resolveSqliteUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

globalForPrisma.prisma = prisma;
