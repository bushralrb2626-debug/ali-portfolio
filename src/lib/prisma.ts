import { PrismaClient } from "@prisma/client";

/**
 * Aiven PostgreSQL (use $50 trial on a Startup plan — not Free, which auto-powers off).
 * Set DATABASE_URL in .env / Render — do not use SQLite file URLs.
 */
function resolveDatabaseUrl() {
  const url = String(process.env.DATABASE_URL || "").trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Use Aiven PostgreSQL, e.g. postgres://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=require",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL still points at SQLite (file:…). Switch to Aiven PostgreSQL — see .env.example.",
    );
  }
  if (url.startsWith("mysql:")) {
    throw new Error(
      "DATABASE_URL is MySQL but this app expects PostgreSQL. Create an Aiven PostgreSQL service and update the URL.",
    );
  }
  return url;
}

const dbUrl = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

globalForPrisma.prisma = prisma;
