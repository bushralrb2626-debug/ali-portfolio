import { copyFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

function useEphemeralSqlite() {
  return Boolean(
    process.env.K_SERVICE ||
      process.env.FUNCTION_TARGET ||
      process.env.FIREBASE_CONFIG ||
      process.env.VERCEL ||
      process.env.RENDER,
  );
}

if (useEphemeralSqlite()) {
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
  process.env.DATABASE_URL = `file:${dest}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
