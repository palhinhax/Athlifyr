import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SETTLEMENT_MAX_RETRIES } from "./constants";

/**
 * Get pending settlement amount for a venue.
 */
export async function getVenuePendingBalance(venueId: string): Promise<{
  pendingAmountCents: number;
  pendingEntriesCount: number;
}> {
  const result = await prisma.venueLedgerEntry.aggregate({
    where: {
      venueId,
      status: "PENDING",
    },
    _sum: { amountCents: true },
    _count: { id: true },
  });

  return {
    pendingAmountCents: result._sum.amountCents ?? 0,
    pendingEntriesCount: result._count.id,
  };
}

/**
 * Get settlement history for a venue.
 */
export async function getVenueSettlementHistory(
  venueId: string,
  params: { cursor?: string; limit?: number }
) {
  const limit = Math.min(params.limit ?? 20, 50);

  const batches = await prisma.venueSettlementBatch.findMany({
    where: { venueId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(params.cursor && {
      cursor: { id: params.cursor },
      skip: 1,
    }),
    select: {
      id: true,
      totalAmountCents: true,
      currency: true,
      status: true,
      entriesCount: true,
      stripeTransferId: true,
      periodStart: true,
      periodEnd: true,
      processedAt: true,
      failedAt: true,
      failureReason: true,
      retryCount: true,
      createdAt: true,
    },
  });

  const hasMore = batches.length > limit;
  const items = hasMore ? batches.slice(0, limit) : batches;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor, hasMore };
}

/**
 * Execute weekly settlement for all eligible venues.
 * This is the main cron job entry point.
 */
export async function executeWeeklySettlement(): Promise<{
  processedVenues: number;
  totalTransferred: number;
  errors: Array<{ venueId: string; error: string }>;
}> {
  const now = new Date();
  const periodEnd = now;
  const periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  // Find all venues with pending ledger entries
  const venuesWithPending = await prisma.venueLedgerEntry.groupBy({
    by: ["venueId"],
    where: { status: "PENDING" },
    _sum: { amountCents: true },
    _count: { id: true },
  });

  const errors: Array<{ venueId: string; error: string }> = [];
  let processedVenues = 0;
  let totalTransferred = 0;

  for (const venueGroup of venuesWithPending) {
    const totalCents = venueGroup._sum.amountCents ?? 0;
    if (totalCents <= 0) continue;

    try {
      await settleVenue({
        venueId: venueGroup.venueId,
        totalAmountCents: totalCents,
        entriesCount: venueGroup._count.id,
        periodStart,
        periodEnd,
      });
      processedVenues++;
      totalTransferred += totalCents;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push({ venueId: venueGroup.venueId, error: message });
      console.error(
        `Settlement failed for venue ${venueGroup.venueId}:`,
        message
      );
    }
  }

  console.log(
    `Weekly settlement complete: ${processedVenues} venues, ${totalTransferred} cents transferred, ${errors.length} errors`
  );

  return { processedVenues, totalTransferred, errors };
}

/**
 * Settle a single venue — creates batch, transfers via Stripe, marks entries as settled.
 */
async function settleVenue(params: {
  venueId: string;
  totalAmountCents: number;
  entriesCount: number;
  periodStart: Date;
  periodEnd: Date;
}): Promise<void> {
  const { venueId, totalAmountCents, entriesCount, periodStart, periodEnd } =
    params;

  // Fetch venue to check Stripe Connect status
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: {
      id: true,
      name: true,
      stripeAccountId: true,
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
    },
  });

  if (!venue) {
    throw new Error(`Venue ${venueId} not found`);
  }

  if (!venue.stripeAccountId || !venue.stripePayoutsEnabled) {
    throw new Error(
      `Venue ${venue.name} does not have active Stripe Connect. Settlement deferred.`
    );
  }

  const idempotencyKey = `settlement_${venueId}_${periodStart.toISOString()}_${periodEnd.toISOString()}`;

  // Check for existing settlement with same idempotency key
  const existing = await prisma.venueSettlementBatch.findUnique({
    where: { idempotencyKey },
  });

  if (existing && existing.status === "COMPLETED") {
    console.log(
      `Settlement ${existing.id} already completed for venue ${venueId}`
    );
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create or get settlement batch
    const batch = existing
      ? await tx.venueSettlementBatch.update({
          where: { id: existing.id },
          data: {
            status: "PROCESSING",
            retryCount: { increment: 1 },
          },
        })
      : await tx.venueSettlementBatch.create({
          data: {
            venueId,
            totalAmountCents,
            entriesCount,
            status: "PROCESSING",
            periodStart,
            periodEnd,
            idempotencyKey,
          },
        });

    if (batch.retryCount > SETTLEMENT_MAX_RETRIES) {
      await tx.venueSettlementBatch.update({
        where: { id: batch.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          failureReason: "Max retries exceeded",
        },
      });
      throw new Error("Max settlement retries exceeded");
    }

    try {
      // Execute Stripe Transfer to connected account
      const transfer = await stripe.transfers.create(
        {
          amount: totalAmountCents,
          currency: "eur",
          destination: venue.stripeAccountId!,
          description: `Athlifyr Credits settlement: ${venue.name} (${periodStart.toISOString().split("T")[0]} → ${periodEnd.toISOString().split("T")[0]})`,
          metadata: {
            type: "credit_settlement",
            venueId,
            batchId: batch.id,
            periodStart: periodStart.toISOString(),
            periodEnd: periodEnd.toISOString(),
          },
        },
        { idempotencyKey: `stripe_transfer_${batch.id}` }
      );

      // Mark all pending entries as settled
      await tx.venueLedgerEntry.updateMany({
        where: {
          venueId,
          status: "PENDING",
        },
        data: {
          status: "SETTLED",
          settlementBatchId: batch.id,
        },
      });

      // Mark batch as completed
      await tx.venueSettlementBatch.update({
        where: { id: batch.id },
        data: {
          status: "COMPLETED",
          stripeTransferId: transfer.id,
          processedAt: new Date(),
        },
      });
    } catch (stripeError) {
      const errorMessage =
        stripeError instanceof Error
          ? stripeError.message
          : "Stripe transfer failed";

      await tx.venueSettlementBatch.update({
        where: { id: batch.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          failureReason: errorMessage,
        },
      });

      throw stripeError;
    }
  });
}

/**
 * Retry a failed settlement batch.
 */
export async function retrySettlement(batchId: string): Promise<void> {
  const batch = await prisma.venueSettlementBatch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    throw new Error("Settlement batch not found");
  }

  if (batch.status !== "FAILED") {
    throw new Error("Can only retry failed settlements");
  }

  const pendingBalance = await getVenuePendingBalance(batch.venueId);

  await settleVenue({
    venueId: batch.venueId,
    totalAmountCents: pendingBalance.pendingAmountCents,
    entriesCount: pendingBalance.pendingEntriesCount,
    periodStart: batch.periodStart,
    periodEnd: new Date(),
  });
}

/**
 * Manually settle a single venue (admin action).
 * Settles all pending ledger entries for this venue now.
 */
export async function settleVenueManually(venueId: string): Promise<void> {
  const pending = await getVenuePendingBalance(venueId);

  if (pending.pendingAmountCents <= 0) {
    throw new Error("No pending balance to settle");
  }

  const now = new Date();
  // Find the earliest pending entry to determine period start
  const earliest = await prisma.venueLedgerEntry.findFirst({
    where: { venueId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  await settleVenue({
    venueId,
    totalAmountCents: pending.pendingAmountCents,
    entriesCount: pending.pendingEntriesCount,
    periodStart: earliest?.createdAt ?? now,
    periodEnd: now,
  });
}
