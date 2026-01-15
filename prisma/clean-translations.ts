/**
 * Delete all non-Portuguese translations to start fresh
 * Run: npx tsx prisma/clean-translations.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up bad translations...\n");

  // Delete all translations except Portuguese
  const result = await prisma.eventTranslation.deleteMany({
    where: {
      language: {
        not: "pt",
      },
    },
  });

  console.log(`✅ Deleted ${result.count} non-Portuguese translations`);
  console.log("Ready for new high-quality translations!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
