import { prisma } from "@/lib/prisma";
import type { CreditWallet, Prisma, PrismaClient } from "@prisma/client";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

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

  // Idempotency check (outside transaction – early-return optimisation)
  if (params.idempotencyKey) {
    const readClient = tx || prisma;
    const existing = await readClient.creditTransaction.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) {
      return {
        transactionId: existing.id,
        newBalanceCents: existing.balanceAfterCents,
      };
    }
  }

  const execute = async (
    innerTx: PrismaTransactionClient
  ): Promise<{ transactionId: string; newBalanceCents: number }> => {
    await getOrCreateWallet(params.userId, innerTx);

    // Atomic increment – avoids read-modify-write race condition
    const updatedWallet = await innerTx.creditWallet.update({
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

    // Create ledger entry in the same transaction
    const transaction = await innerTx.creditTransaction.create({
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

  return tx ? execute(tx) : prisma.$transaction(execute);
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

  // Idempotency check (outside transaction – early-return optimisation)
  if (params.idempotencyKey) {
    const readClient = tx || prisma;
    const existing = await readClient.creditTransaction.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) {
      return {
        transactionId: existing.id,
        newBalanceCents: existing.balanceAfterCents,
      };
    }
  }

  const execute = async (
    innerTx: PrismaTransactionClient
  ): Promise<{ transactionId: string; newBalanceCents: number }> => {
    // Ensure wallet exists before attempting the conditional update
    await getOrCreateWallet(params.userId, innerTx);

    // Atomic conditional decrement – prevents race condition and negative balance.
    // updateMany returns count=0 when balanceCents < amountCents, which means
    // either the balance was already too low or a concurrent debit won the race.
    const result = await innerTx.creditWallet.updateMany({
      where: {
        userId: params.userId,
        balanceCents: { gte: params.amountCents },
      },
      data: {
        balanceCents: { decrement: params.amountCents },
        totalSpentCents: { increment: params.amountCents },
      },
    });

    if (result.count === 0) {
      const wallet = await innerTx.creditWallet.findUnique({
        where: { userId: params.userId },
        select: { balanceCents: true },
      });
      throw new InsufficientCreditsError(
        wallet?.balanceCents ?? 0,
        params.amountCents
      );
    }

    const updatedWallet = await innerTx.creditWallet.findUnique({
      where: { userId: params.userId },
      select: { balanceCents: true },
    });

    if (!updatedWallet) {
      throw new Error("Wallet not found after update");
    }

    // Create ledger entry in the same transaction
    const transaction = await innerTx.creditTransaction.create({
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

  return tx ? execute(tx) : prisma.$transaction(execute);
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
