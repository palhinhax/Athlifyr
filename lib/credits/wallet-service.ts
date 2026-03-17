import { prisma } from "@/lib/prisma";
import type { CreditWallet, Prisma, PrismaClient } from "@prisma/client";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

type WalletResult = { transactionId: string; newBalanceCents: number };

async function checkIdempotency(
  txClient: PrismaTransactionClient,
  idempotencyKey: string | undefined
): Promise<WalletResult | null> {
  if (!idempotencyKey) return null;
  const existing = await txClient.creditTransaction.findUnique({
    where: { idempotencyKey },
  });
  if (existing) {
    return {
      transactionId: existing.id,
      newBalanceCents: existing.balanceAfterCents,
    };
  }
  return null;
}

function runInTransaction(
  execute: (txClient: PrismaTransactionClient) => Promise<WalletResult>,
  tx?: PrismaTransactionClient
): Promise<WalletResult> {
  if (tx) return execute(tx);
  return prisma.$transaction(execute);
}

/**
 * Get or create a credit wallet for a user.
 * Always returns a wallet - creates one with 0 balance if none exists.
 */
export async function getOrCreateWallet(
  userId: string,
  tx?: PrismaTransactionClient
): Promise<CreditWallet> {
  const client = tx || prisma;

  const existing = await client.creditWallet.findUnique({
    where: { userId },
  });

  if (existing) return existing;

  return client.creditWallet.create({
    data: { userId, balanceCents: 0 },
  });
}

/**
 * Get wallet balance in cents. Returns 0 if no wallet exists.
 */
export async function getWalletBalance(userId: string): Promise<number> {
  const wallet = await prisma.creditWallet.findUnique({
    where: { userId },
    select: { balanceCents: true },
  });
  return wallet?.balanceCents ?? 0;
}

/**
 * Get wallet with full stats.
 */
export async function getWalletWithStats(userId: string): Promise<{
  balanceCents: number;
  totalTopUpCents: number;
  totalSpentCents: number;
  totalRewardedCents: number;
}> {
  const wallet = await getOrCreateWallet(userId);
  return {
    balanceCents: wallet.balanceCents,
    totalTopUpCents: wallet.totalTopUpCents,
    totalSpentCents: wallet.totalSpentCents,
    totalRewardedCents: wallet.totalRewardedCents,
  };
}

/**
 * Credit funds to a user's wallet (atomic operation).
 * Used for top-ups, rewards, refunds, manual adjustments.
 */
export async function creditWallet(
  params: {
    userId: string;
    amountCents: number;
    type: "TOP_UP" | "REFUND" | "REWARD" | "MANUAL_ADJUSTMENT";
    source: string;
    description?: string;
    idempotencyKey?: string;
    // Top-up fields
    grossAmountCents?: number;
    platformFeeCents?: number;
    netCreditedCents?: number;
    stripePaymentIntentId?: string;
    stripeCheckoutSessionId?: string;
    // Reward fields
    rewardCampaignId?: string;
    challengeId?: string;
    giveawayId?: string;
    referralId?: string;
    // Refund fields
    refundedTransactionId?: string;
    // Admin fields
    adminUserId?: string;
    adminNote?: string;
    // Expiration
    expiresAt?: Date;
  },
  tx?: PrismaTransactionClient
): Promise<{ transactionId: string; newBalanceCents: number }> {
  if (params.amountCents <= 0) {
    throw new Error("Credit amount must be positive");
  }

  const execute = async (txClient: PrismaTransactionClient) => {
    const idempotent = await checkIdempotency(txClient, params.idempotencyKey);
    if (idempotent) return idempotent;

    // Ensure wallet exists before updating
    await getOrCreateWallet(params.userId, txClient);

    // Atomically increment balance using DB-level increment
    const updatedWallet = await txClient.creditWallet.update({
      where: { userId: params.userId },
      data: {
        balanceCents: { increment: params.amountCents },
        ...(params.type === "TOP_UP" && {
          totalTopUpCents: {
            increment: params.grossAmountCents ?? params.amountCents,
          },
        }),
        ...(params.type === "REWARD" && {
          totalRewardedCents: { increment: params.amountCents },
        }),
      },
    });

    // Create transaction record within the same DB transaction
    const transaction = await txClient.creditTransaction.create({
      data: {
        userId: params.userId,
        type: params.type,
        source: params.source as Prisma.CreditTransactionCreateInput["source"],
        amountCents: params.amountCents,
        balanceAfterCents: updatedWallet.balanceCents,
        description: params.description,
        grossAmountCents: params.grossAmountCents,
        platformFeeCents: params.platformFeeCents,
        netCreditedCents: params.netCreditedCents,
        stripePaymentIntentId: params.stripePaymentIntentId,
        stripeCheckoutSessionId: params.stripeCheckoutSessionId,
        rewardCampaignId: params.rewardCampaignId,
        challengeId: params.challengeId,
        giveawayId: params.giveawayId,
        referralId: params.referralId,
        refundedTransactionId: params.refundedTransactionId,
        adminUserId: params.adminUserId,
        adminNote: params.adminNote,
        expiresAt: params.expiresAt,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return {
      transactionId: transaction.id,
      newBalanceCents: updatedWallet.balanceCents,
    };
  };

  return runInTransaction(execute, tx);
}

/**
 * Debit funds from a user's wallet (atomic operation).
 * Used for purchases. Returns the transaction and validates sufficient balance.
 */
export async function debitWallet(
  params: {
    userId: string;
    amountCents: number;
    description?: string;
    venueId?: string;
    venueProductId?: string;
    venueProductPurchaseId?: string;
    idempotencyKey?: string;
  },
  tx?: PrismaTransactionClient
): Promise<{ transactionId: string; newBalanceCents: number }> {
  if (params.amountCents <= 0) {
    throw new Error("Debit amount must be positive");
  }

  const execute = async (txClient: PrismaTransactionClient) => {
    const idempotent = await checkIdempotency(txClient, params.idempotencyKey);
    if (idempotent) return idempotent;

    // Read current balance inside the transaction to check sufficiency
    const wallet = await getOrCreateWallet(params.userId, txClient);

    if (wallet.balanceCents < params.amountCents) {
      throw new InsufficientCreditsError(
        wallet.balanceCents,
        params.amountCents
      );
    }

    // Atomically decrement balance using DB-level decrement
    const updatedWallet = await txClient.creditWallet.update({
      where: { userId: params.userId },
      data: {
        balanceCents: { decrement: params.amountCents },
        totalSpentCents: { increment: params.amountCents },
      },
    });

    // Create transaction record within the same DB transaction
    const transaction = await txClient.creditTransaction.create({
      data: {
        userId: params.userId,
        type: "PURCHASE",
        source: "PURCHASE_CONSUMPTION",
        amountCents: -params.amountCents, // Negative for debits
        balanceAfterCents: updatedWallet.balanceCents,
        description: params.description,
        venueId: params.venueId,
        venueProductId: params.venueProductId,
        venueProductPurchaseId: params.venueProductPurchaseId,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return {
      transactionId: transaction.id,
      newBalanceCents: updatedWallet.balanceCents,
    };
  };

  return runInTransaction(execute, tx);
}

/**
 * Get transaction history for a user with pagination.
 */
export async function getTransactionHistory(
  userId: string,
  params: { cursor?: string; limit?: number; type?: string }
) {
  const limit = Math.min(params.limit ?? 20, 50);

  const transactions = await prisma.creditTransaction.findMany({
    where: {
      userId,
      ...(params.type && {
        type: params.type as Prisma.CreditTransactionCreateInput["type"],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(params.cursor && {
      cursor: { id: params.cursor },
      skip: 1,
    }),
    select: {
      id: true,
      type: true,
      source: true,
      amountCents: true,
      balanceAfterCents: true,
      description: true,
      grossAmountCents: true,
      platformFeeCents: true,
      netCreditedCents: true,
      venueId: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  const hasMore = transactions.length > limit;
  const items = hasMore ? transactions.slice(0, limit) : transactions;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor, hasMore };
}

/**
 * Custom error for insufficient credits
 */
export class InsufficientCreditsError extends Error {
  public currentBalanceCents: number;
  public requiredAmountCents: number;

  constructor(currentBalanceCents: number, requiredAmountCents: number) {
    super(
      `Insufficient credits: have ${currentBalanceCents} cents, need ${requiredAmountCents} cents`
    );
    this.name = "InsufficientCreditsError";
    this.currentBalanceCents = currentBalanceCents;
    this.requiredAmountCents = requiredAmountCents;
  }
}
