import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { adsPortfolioSections } from "../prisma/ads-content";

const out = join(__dirname, "..", "prisma", "seed-data.json");
writeFileSync(out, JSON.stringify(adsPortfolioSections));
console.log(`Wrote ${adsPortfolioSections.length} sections → prisma/seed-data.json`);
