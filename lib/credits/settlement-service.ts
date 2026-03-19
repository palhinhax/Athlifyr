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

  // Find all venues with PENDING ledger entries (normal case) plus venues whose
  // entries are stuck in PROCESSING (crash-recovery: process died between Phase 1
  // and Phase 3 of a previous run).
  const venuesWithPending = await prisma.venueLedgerEntry.groupBy({
    by: ["venueId"],
    where: { status: { in: ["PENDING", "PROCESSING"] } },
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

  if (existing?.status === "COMPLETED") {
    console.log(
      `Settlement ${existing.id} already completed for venue ${venueId}`
    );
    return;
  }

  // Phase 1: Create/mark batch + mark entries as PROCESSING in a short transaction.
  // Committing before the Stripe call prevents holding DB locks during the network
  // request and ensures entries cannot be double-settled by a concurrent run.
  const batch = await prisma.$transaction(async (tx) => {
    const b = existing
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

    if (b.retryCount > SETTLEMENT_MAX_RETRIES) {
      await tx.venueSettlementBatch.update({
        where: { id: b.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          failureReason: "Max retries exceeded",
        },
      });
      throw new Error("Max settlement retries exceeded");
    }

    // Mark PENDING entries as PROCESSING so concurrent runs skip them
    await tx.venueLedgerEntry.updateMany({
      where: { venueId, status: "PENDING" },
      data: { status: "PROCESSING" },
    });

    return b;
  });

  // Phase 2: Execute Stripe transfer outside any DB transaction.
  // Using the batch ID as idempotency key means a Stripe-succeeded / DB-failed
  // scenario is safely recovered on the next retry (Stripe returns the same
  // transfer object).
  let stripeTransferId: string;
  try {
    const transfer = await stripe.transfers.create(
      {
        amount: totalAmountCents,
        currency: "eur",
        destination: venue.stripeAccountId,
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
    stripeTransferId = transfer.id;
  } catch (stripeError) {
    // Phase 3 (failure): revert entries to PENDING and mark batch FAILED so
    // the next scheduled run or manual retry can pick them up again.
    const errorMessage =
      stripeError instanceof Error
        ? stripeError.message
        : "Stripe transfer failed";

    await prisma.$transaction(async (tx) => {
      await tx.venueLedgerEntry.updateMany({
        where: { venueId, status: "PROCESSING" },
        data: { status: "PENDING" },
      });
      await tx.venueSettlementBatch.update({
        where: { id: batch.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          failureReason: errorMessage,
        },
      });
    });

    throw stripeError;
  }

  // Phase 3 (success): mark entries SETTLED and batch COMPLETED in a second
  // short transaction.  If this commit fails the batch stays PROCESSING;
  // the next retry reuses the same Stripe idempotency key and will complete
  // Phase 3 successfully without issuing a duplicate transfer.
  try {
    await prisma.$transaction(async (tx) => {
      await tx.venueLedgerEntry.updateMany({
        where: { venueId, status: "PROCESSING" },
        data: {
          status: "SETTLED",
          settlementBatchId: batch.id,
        },
      });
      await tx.venueSettlementBatch.update({
        where: { id: batch.id },
        data: {
          status: "COMPLETED",
          stripeTransferId,
          processedAt: new Date(),
        },
      });
    });
  } catch (dbError) {
    // Stripe transfer succeeded but the DB commit failed.  The batch and
    // entries remain in PROCESSING state.  The next scheduled run or a manual
    // retry will call Stripe with the same idempotency key (returning the
    // existing transfer) and reattempt this commit.  Log the partial failure
    // so on-call engineers can monitor and intervene if retries keep failing.
    console.error(
      `Settlement Phase 3 DB commit failed for venue ${venueId} (batch ${batch.id}, stripeTransferId ${stripeTransferId}). ` +
        `Stripe transfer succeeded but ledger is still PROCESSING. Will self-heal on next retry.`,
      dbError
    );
    throw dbError;
  }
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
