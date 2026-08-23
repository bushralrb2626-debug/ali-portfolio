import { PrismaClient } from "@prisma/client";
import { adsPortfolioSections } from "./ads-content";

const prisma = new PrismaClient();

async function main() {
  await prisma.section.deleteMany();
  await prisma.section.createMany({ data: adsPortfolioSections });
  console.log(`Reseeded ${adsPortfolioSections.length} ads portfolio sections.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
