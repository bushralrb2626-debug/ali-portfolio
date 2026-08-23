import { PrismaClient } from "@prisma/client";
import { adsPortfolioSections } from "./ads-content";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.section.count();
  if (count > 0) {
    console.log(`Seed skipped (${count} sections already exist). Use npm run db:reseed to replace.`);
    return;
  }

  await prisma.section.createMany({ data: adsPortfolioSections });
  console.log("Seeded ads portfolio sections.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
