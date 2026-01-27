/**
 * Script to migrate existing trail performance entries from RUN to TRAIL type
 * Run with: npx ts-node scripts/migrate-trail-entries.ts
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Starting trail entries migration...\n");

  // Find all UserPerformanceEntry records with type RUN that are linked to trail events
  const runEntries = await prisma.userPerformanceEntry.findMany({
    where: {
      type: "RUN",
      resultId: { not: null },
    },
    include: {
      result: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              sportTypes: true,
            },
          },
        },
      },
    },
  });

  console.log(`Found ${runEntries.length} RUN entries with linked results\n`);

  let migratedCount = 0;

  for (const entry of runEntries) {
    const event = entry.result?.event;

    if (!event) {
      console.log(`⚠️ Entry ${entry.id} has no linked event, skipping`);
      continue;
    }

    // Check if the event is a trail event
    if (event.sportTypes.includes(SportType.TRAIL)) {
      console.log(
        `🔄 Migrating entry ${entry.id} (Event: ${event.title}) from RUN to TRAIL`
      );

      await prisma.userPerformanceEntry.update({
        where: { id: entry.id },
        data: { type: "TRAIL" },
      });

      migratedCount++;
    }
  }

  console.log(
    `\n✅ Migration complete! Migrated ${migratedCount} entries from RUN to TRAIL`
  );
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
