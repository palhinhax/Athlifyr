/**
 * Diagnostic script to investigate booking cancellation failures
 *
 * Usage:
 * npx tsx scripts/diagnose-booking-cancellation.ts <bookingId> [userId]
 *
 * Example:
 * npx tsx scripts/diagnose-booking-cancellation.ts cmlf55xzq0001qzfbzs68w8hz
 */

import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { differenceInHours } from "date-fns";

interface PlanPolicy {
  allowCancellation?: boolean;
  cancellationHours?: number;
}

async function diagnoseBookingCancellation(bookingId: string, userId?: string) {
  console.log("=".repeat(80));
  console.log("🔍 BOOKING CANCELLATION DIAGNOSTIC");
  console.log("=".repeat(80));
  console.log(`Booking ID: ${bookingId}`);
  console.log(`User ID: ${userId || "(not provided)"}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log("=".repeat(80));
  console.log();

  // 1. Get booking details
  console.log("📋 STEP 1: Fetching booking details...");
  const booking = await prisma.venueBooking.findUnique({
    where: { id: bookingId },
    include: {
      session: {
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!booking) {
    console.error("❌ BOOKING NOT FOUND");
    console.error(`Booking ID ${bookingId} does not exist in the database.`);
    return;
  }

  console.log("✅ Booking found:");
  console.log(`   - ID: ${booking.id}`);
  console.log(`   - Status: ${booking.status}`);
  console.log(`   - Created at: ${booking.createdAt.toISOString()}`);
  console.log(`   - Venue: ${booking.session.venue.name} (${booking.venueId})`);
  console.log(`   - Session starts: ${booking.session.startsAt.toISOString()}`);
  console.log(`   - Session ID: ${booking.sessionId}`);
  console.log(
    `   - User: ${booking.user?.name || "Guest"} (${booking.userId || "N/A"})`
  );
  console.log(`   - User email: ${booking.user?.email || "N/A"}`);
  console.log();

  // 2. Check ownership
  if (userId) {
    console.log("👤 STEP 2: Checking ownership...");
    if (booking.userId !== userId) {
      console.error("❌ OWNERSHIP MISMATCH");
      console.error(`   Booking belongs to: ${booking.userId}`);
      console.error(`   Requested by: ${userId}`);
      console.error("   ➡️  Error: NOT_BOOKING_OWNER");
      return;
    }
    console.log("✅ User is the booking owner");
    console.log();
  }

  // 3. Check booking status
  console.log("📊 STEP 3: Checking booking status...");
  if (booking.status === BookingStatus.CANCELLED) {
    console.error("❌ ALREADY CANCELLED");
    console.error("   ➡️  Error: ALREADY_CANCELLED");
    return;
  }
  if (booking.status === BookingStatus.ATTENDED) {
    console.error("❌ ALREADY ATTENDED");
    console.error("   ➡️  Error: ALREADY_ATTENDED");
    return;
  }
  console.log(`✅ Booking status is valid: ${booking.status}`);
  console.log();

  // 4. Check session timing
  console.log("⏰ STEP 4: Checking session timing...");
  const now = new Date();
  const sessionStart = booking.session.startsAt;
  const isInPast = sessionStart < now;
  const hoursUntilSession = differenceInHours(sessionStart, now);

  console.log(`   Current time: ${now.toISOString()}`);
  console.log(`   Session starts: ${sessionStart.toISOString()}`);
  console.log(`   Hours until session: ${hoursUntilSession}`);

  if (isInPast) {
    console.error("❌ SESSION ALREADY STARTED");
    console.error("   Session started in the past");
    console.error("   ➡️  Error: SESSION_ALREADY_STARTED");
    return;
  }
  console.log("✅ Session is in the future");
  console.log();

  // 5. Check subscription and plan policy
  console.log("🎫 STEP 5: Checking subscription and cancellation policy...");

  if (!booking.userId) {
    console.log("✅ Guest booking (no user ID)");
    console.log("   User can cancel freely (no plan restrictions)");
    console.log();
    console.log("=".repeat(80));
    console.log("✅ CANCELLATION SHOULD BE ALLOWED");
    console.log("=".repeat(80));
    return;
  }

  const subscription = await prisma.venueSubscription.findFirst({
    where: {
      venueId: booking.venueId,
      userId: booking.userId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
  });

  if (!subscription) {
    console.log("✅ No active subscription found");
    console.log("   User can cancel freely (no plan restrictions)");
    console.log();
    console.log("=".repeat(80));
    console.log("✅ CANCELLATION SHOULD BE ALLOWED");
    console.log("=".repeat(80));
    return;
  }

  console.log("📝 Active subscription found:");
  console.log(`   - Subscription ID: ${subscription.id}`);
  if (!subscription.plan) {
    console.log("⚠️ Plan data not loaded, cannot check policy");
    console.log();
    console.log("=".repeat(80));
    console.log("✅ CANCELLATION SHOULD BE ALLOWED (no plan to check)");
    console.log("=".repeat(80));
    return;
  }
  console.log(`   - Plan: ${subscription.plan.name} (${subscription.plan.id})`);
  console.log(`   - Status: ${subscription.status}`);
  console.log(`   - Starts: ${subscription.startsAt?.toISOString()}`);
  console.log(
    `   - Ends: ${subscription.endsAt?.toISOString() || "No end date"}`
  );
  console.log();

  const policy = (subscription.plan.policy as PlanPolicy) || {};

  console.log("📋 Plan cancellation policy:");
  console.log(
    `   - Allow cancellation: ${policy.allowCancellation ?? "not specified (default: allow)"}`
  );
  console.log(
    `   - Cancellation hours: ${policy.cancellationHours ?? "not specified (no deadline)"}`
  );
  console.log();

  // Check if cancellation is explicitly disabled
  if (policy.allowCancellation === false) {
    console.error("❌ PLAN DOES NOT ALLOW CANCELLATION");
    console.error(
      `   Plan "${subscription.plan.name}" has disabled cancellations`
    );
    console.error("   ➡️  Error: CANCELLATION_NOT_ALLOWED");
    return;
  }

  // Check cancellation deadline
  if (policy.cancellationHours && policy.cancellationHours > 0) {
    console.log(
      `⏳ Checking cancellation deadline (${policy.cancellationHours}h before session)...`
    );
    if (hoursUntilSession < policy.cancellationHours) {
      console.error("❌ CANCELLATION DEADLINE PASSED");
      console.error(`   Required: ${policy.cancellationHours} hours before`);
      console.error(`   Actual: ${hoursUntilSession} hours until session`);
      console.error(
        `   Deadline: ${policy.cancellationHours - hoursUntilSession} hours ago`
      );
      console.error("   ➡️  Error: CANCELLATION_DEADLINE_PASSED");
      return;
    }
    console.log(
      `✅ Within cancellation deadline (${hoursUntilSession}h > ${policy.cancellationHours}h)`
    );
  }

  console.log();
  console.log("=".repeat(80));
  console.log("✅ ALL VALIDATIONS PASSED - CANCELLATION SHOULD BE ALLOWED");
  console.log("=".repeat(80));
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Error: Missing booking ID");
  console.error();
  console.error("Usage:");
  console.error(
    "  npx tsx scripts/diagnose-booking-cancellation.ts <bookingId> [userId]"
  );
  console.error();
  console.error("Example:");
  console.error(
    "  npx tsx scripts/diagnose-booking-cancellation.ts cmlf55xzq0001qzfbzs68w8hz"
  );
  console.error(
    "  npx tsx scripts/diagnose-booking-cancellation.ts cmlf55xzq0001qzfbzs68w8hz user123"
  );
  process.exit(1);
}

const [bookingId, userId] = args;

diagnoseBookingCancellation(bookingId, userId)
  .then(() => {
    console.log();
    console.log("Diagnostic complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error();
    console.error("=".repeat(80));
    console.error("💥 DIAGNOSTIC ERROR");
    console.error("=".repeat(80));
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
