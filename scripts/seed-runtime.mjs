#!/usr/bin/env node
/**
 * Runtime seed for Docker/Render — no secrets printed.
 * Skips if sections already exist.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.section.count();
  if (count > 0) {
    console.log(`entrypoint seed: skipped (${count} sections already exist)`);
    return;
  }
  const raw = readFileSync(join(root, "prisma", "seed-data.json"), "utf8");
  const data = JSON.parse(raw);
  await prisma.section.createMany({ data });
  console.log(`entrypoint seed: inserted ${data.length} sections`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error("entrypoint seed: failed", err instanceof Error ? err.message : err);
    await prisma.$disconnect();
    process.exit(1);
  });
