import { copyFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

/** Serverless hosts are read-only except /tmp. Render Docker can write prisma/dev.db. */
function useTmpSqliteCopy() {
  return Boolean(
    process.env.K_SERVICE ||
      process.env.FUNCTION_TARGET ||
      process.env.FIREBASE_CONFIG ||
      process.env.VERCEL,
  );
}

if (useTmpSqliteCopy()) {
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
  process.env.DATABASE_URL = `file:${dest}`;
}

const dbUrl = process.env.DATABASE_URL;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined,
  );

globalForPrisma.prisma = prisma;
