import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";
import {
  TOPUP_FEE_PERCENTAGE,
  calculateTopUpFee,
  calculateNetCredits,
  MIN_TOPUP_AMOUNT_CENTS,
  MAX_TOPUP_AMOUNT_CENTS,
} from "./constants";
import { creditWallet } from "./wallet-service";
import { randomUUID } from "crypto";

/**
 * Create a Stripe PaymentIntent for a credit top-up.
 * The credits are NOT added yet — that happens via webhook after payment confirmation.
 */
export async function createTopUpPaymentIntent(params: {
  userId: string;
  amountCents: number;
}): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  topUpId: string;
  grossAmountCents: number;
  platformFeeCents: number;
  netCreditedCents: number;
}> {
  const { userId, amountCents } = params;

  if (amountCents < MIN_TOPUP_AMOUNT_CENTS) {
    throw new Error(`Minimum top-up amount is ${MIN_TOPUP_AMOUNT_CENTS} cents`);
  }
  if (amountCents > MAX_TOPUP_AMOUNT_CENTS) {
    throw new Error(`Maximum top-up amount is ${MAX_TOPUP_AMOUNT_CENTS} cents`);
  }

  const platformFeeCents = calculateTopUpFee(amountCents);
  const netCreditedCents = calculateNetCredits(amountCents);
  const stripeCustomerId = await getOrCreateStripeCustomer(userId);
  const idempotencyKey = `topup_${userId}_${amountCents}_${randomUUID()}`;

  // Create the top-up record first
  const topUp = await prisma.creditTopUp.create({
    data: {
      userId,
      grossAmountCents: amountCents,
      platformFeeCents,
      netCreditedCents,
      feePercentage: TOPUP_FEE_PERCENTAGE,
      status: "PENDING",
      stripeCustomerId,
      idempotencyKey,
    },
  });

  // Create Stripe PaymentIntent (platform payment, no connected account)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    customer: stripeCustomerId,
    metadata: {
      type: "credit_top_up",
      topUpId: topUp.id,
      userId,
      grossAmountCents: String(amountCents),
      platformFeeCents: String(platformFeeCents),
      netCreditedCents: String(netCreditedCents),
    },
    automatic_payment_methods: { enabled: true },
  });

  // Update top-up with Stripe reference
  await prisma.creditTopUp.update({
    where: { id: topUp.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    topUpId: topUp.id,
    grossAmountCents: amountCents,
    platformFeeCents,
    netCreditedCents,
  };
}

/**
 * Complete a top-up after Stripe payment confirmation (called from webhook).
 * Idempotent — safe to call multiple times.
 */
export async function completeTopUp(
  stripePaymentIntentId: string
): Promise<void> {
  const topUp = await prisma.creditTopUp.findUnique({
    where: { stripePaymentIntentId },
  });

  if (!topUp) {
    console.error(
      `Top-up not found for payment intent: ${stripePaymentIntentId}`
    );
    return;
  }

  if (topUp.status === "COMPLETED") {
    console.log(`Top-up ${topUp.id} already completed, skipping`);
    return;
  }

  const idempotencyKey = `topup_credit_${topUp.id}`;

  await prisma.$transaction(async (tx) => {
    // Credit the user's wallet
    await creditWallet(
      {
        userId: topUp.userId,
        amountCents: topUp.netCreditedCents,
        type: "TOP_UP",
        source: "STRIPE_TOP_UP",
        description: `Top-up: ${(topUp.grossAmountCents / 100).toFixed(2)}€ → ${(topUp.netCreditedCents / 100).toFixed(2)} credits`,
        grossAmountCents: topUp.grossAmountCents,
        platformFeeCents: topUp.platformFeeCents,
        netCreditedCents: topUp.netCreditedCents,
        stripePaymentIntentId,
        idempotencyKey,
      },
      tx
    );

    // Mark top-up as completed
    await tx.creditTopUp.update({
      where: { id: topUp.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  });

  console.log(
    `Top-up ${topUp.id} completed: ${topUp.netCreditedCents} cents credited to user ${topUp.userId}`
  );
}

/**
 * Mark a top-up as failed (called from webhook on payment failure).
 */
export async function failTopUp(
  stripePaymentIntentId: string,
  reason?: string
): Promise<void> {
  const topUp = await prisma.creditTopUp.findUnique({
    where: { stripePaymentIntentId },
  });

  if (!topUp || topUp.status === "COMPLETED" || topUp.status === "FAILED") {
    return;
  }

  await prisma.creditTopUp.update({
    where: { id: topUp.id },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      failureReason: reason,
    },
  });
}

/**
 * Cancel a pending top-up (called from webhook on payment cancellation).
 */
export async function cancelTopUp(
  stripePaymentIntentId: string
): Promise<void> {
  const topUp = await prisma.creditTopUp.findUnique({
    where: { stripePaymentIntentId },
  });

  if (!topUp || topUp.status !== "PENDING") {
    return;
  }

  await prisma.creditTopUp.update({
    where: { id: topUp.id },
    data: { status: "CANCELLED" },
  });
}

/**
 * Get top-up history for a user.
 */
export async function getTopUpHistory(
  userId: string,
  params: { cursor?: string; limit?: number }
) {
  const limit = Math.min(params.limit ?? 20, 50);

  const topUps = await prisma.creditTopUp.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(params.cursor && {
      cursor: { id: params.cursor },
      skip: 1,
    }),
    select: {
      id: true,
      grossAmountCents: true,
      platformFeeCents: true,
      netCreditedCents: true,
      feePercentage: true,
      currency: true,
      status: true,
      completedAt: true,
      createdAt: true,
    },
  });

  const hasMore = topUps.length > limit;
  const items = hasMore ? topUps.slice(0, limit) : topUps;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor, hasMore };
}
