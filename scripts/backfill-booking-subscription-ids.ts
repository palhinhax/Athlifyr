/**
 * Backfill script: Assign subscriptionId to existing VenueBookings
 *
 * Legacy bookings were created before the subscriptionId field existed.
 * This script matches each unlinked booking to the correct subscription
 * based on: userId, venueId (including cross-venue plans), time window,
 * and plan capacity (maxTotalBookings).
 *
 * Usage: npx tsx scripts/backfill-booking-subscription-ids.ts [--dry-run]
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const isDryRun = process.argv.includes("--dry-run");

interface PlanPolicy {
  maxTotalBookings?: number;
}

async function main() {
  console.log(
    isDryRun ? "🔍 DRY RUN - no changes will be made\n" : "🚀 LIVE RUN\n"
  );

  // Find all bookings without a subscriptionId
  const unlinkedBookings = await prisma.venueBooking.findMany({
    where: {
      subscriptionId: null,
      status: { in: ["BOOKED", "ATTENDED"] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      userId: true,
      venueId: true,
      createdAt: true,
      status: true,
      session: {
        select: { id: true, startsAt: true },
      },
    },
  });

  console.log(`Found ${unlinkedBookings.length} unlinked bookings\n`);

  if (unlinkedBookings.length === 0) {
    console.log("✅ Nothing to backfill!");
    return;
  }

  // Get unique user IDs
  const userIds = [...new Set(unlinkedBookings.map((b) => b.userId))];
  console.log(`Across ${userIds.length} user(s)\n`);

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const userId of userIds) {
    const userBookings = unlinkedBookings.filter((b) => b.userId === userId);
    console.log(
      `\n👤 User ${userId} - ${userBookings.length} unlinked booking(s)`
    );

    // Get all subscriptions for this user (including completed/exhausted ones)
    const subscriptions = await prisma.venueSubscription.findMany({
      where: { userId: userId as string },
      include: {
        plan: {
          include: {
            includedVenues: {
              select: { venueId: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (subscriptions.length === 0) {
      console.log("  ⚠️  No subscriptions found, skipping");
      totalSkipped += userBookings.length;
      continue;
    }

    // Build a map of subscription -> covered venue IDs and capacity tracking
    const subMap = subscriptions.map((sub) => {
      const policy = (sub.plan.policy as PlanPolicy) || {};
      const coveredVenueIds = [
        sub.plan.venueId,
        ...sub.plan.includedVenues.map((iv: { venueId: string }) => iv.venueId),
      ];
      return {
        sub,
        coveredVenueIds,
        maxTotalBookings: policy.maxTotalBookings,
        assignedCount: 0, // Track how many bookings we assign to this sub
      };
    });

    // Count already-linked bookings per subscription
    for (const entry of subMap) {
      const existingCount = await prisma.venueBooking.count({
        where: {
          subscriptionId: entry.sub.id,
          status: { in: ["BOOKED", "ATTENDED"] },
        },
      });
      entry.assignedCount = existingCount;
    }

    // Process each booking chronologically
    for (const booking of userBookings) {
      // Find the best matching subscription for this booking
      // Priority: subscription that covers this venue, was active at booking time,
      // and has capacity remaining
      const candidates = subMap.filter((entry) => {
        const sub = entry.sub;

        // Must cover this venue
        if (!entry.coveredVenueIds.includes(booking.venueId)) return false;

        // Subscription must have been created before or at booking time
        if (sub.createdAt > booking.createdAt) return false;

        // If subscription has an end date, booking must be before it
        if (sub.endsAt && booking.createdAt > sub.endsAt) return false;

        // If subscription has a capacity limit, check if it's not full
        if (
          entry.maxTotalBookings &&
          entry.assignedCount >= entry.maxTotalBookings
        ) {
          return false;
        }

        return true;
      });

      if (candidates.length === 0) {
        console.log(
          `  ⚠️  Booking ${booking.id} (${booking.createdAt.toISOString()}) - no matching subscription found`
        );
        totalSkipped++;
        continue;
      }

      // Prefer subscriptions with maxTotalBookings (packs/drop-ins) over unlimited
      // Among packs, prefer the one with the most remaining capacity
      candidates.sort((a, b) => {
        // Subscriptions WITH a limit first (packs/drop-ins are more specific)
        const aHasLimit = a.maxTotalBookings ? 1 : 0;
        const bHasLimit = b.maxTotalBookings ? 1 : 0;
        if (aHasLimit !== bHasLimit) return bHasLimit - aHasLimit;

        // Among limited subs, prefer the one created first (FIFO)
        return a.sub.createdAt.getTime() - b.sub.createdAt.getTime();
      });

      const bestMatch = candidates[0];
      bestMatch.assignedCount++;

      console.log(
        `  ✅ Booking ${booking.id} (${booking.createdAt.toISOString()}) → Sub ${bestMatch.sub.id} (${bestMatch.sub.plan.name}, ${bestMatch.assignedCount}/${bestMatch.maxTotalBookings ?? "∞"})`
      );

      if (!isDryRun) {
        await prisma.venueBooking.update({
          where: { id: booking.id },
          data: { subscriptionId: bestMatch.sub.id },
        });
      }

      totalUpdated++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Updated: ${totalUpdated} bookings`);
  console.log(`⚠️  Skipped: ${totalSkipped} bookings`);
  if (isDryRun) {
    console.log(
      "\n🔍 This was a DRY RUN. Run without --dry-run to apply changes."
    );
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
