import { prisma } from "@/lib/prisma";
import { debitWallet, creditWallet } from "./wallet-service";
import { CREDITS_ONLY_THRESHOLD_CENTS } from "./constants";
import { randomUUID } from "node:crypto";

/**
 * Purchase a venue product using Athlifyr Credits.
 * Atomic operation: debits user wallet + creates venue ledger entry.
 */
export async function purchaseWithCredits(params: {
  userId: string;
  venueId: string;
  productId: string;
  quantity: number;
}): Promise<{
  purchaseId: string;
  transactionId: string;
  newBalanceCents: number;
  totalAmountCents: number;
}> {
  const { userId, venueId, productId, quantity } = params;

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await prisma.venueProduct.findFirst({
    where: {
      id: productId,
      venueId,
      isActive: true,
    },
  });

  if (!product) {
    throw new Error("Product not found or inactive");
  }

  // Convert float price to cents
  const unitPriceCents = Math.round(product.price * 100);
  const totalAmountCents = unitPriceCents * quantity;

  if (totalAmountCents <= 0) {
    throw new Error("Invalid product price");
  }

  const idempotencyKey = `purchase_${userId}_${productId}_${randomUUID()}`;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Debit user wallet
    const debitResult = await debitWallet(
      {
        userId,
        amountCents: totalAmountCents,
        description: `${product.name} x${quantity}`,
        venueId,
        venueProductId: productId,
        idempotencyKey,
      },
      tx
    );

    // 2. Create product purchase record
    const purchase = await tx.venueProductPurchase.create({
      data: {
        venueId,
        productId,
        userId,
        quantity,
        unitPrice: product.price,
        totalAmount: totalAmountCents / 100,
        currency: product.currency,
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    // 3. Update the credit transaction with purchase reference
    await tx.creditTransaction.update({
      where: { id: debitResult.transactionId },
      data: { venueProductPurchaseId: purchase.id },
    });

    // 4. Create venue ledger entry (money owed to venue)
    await tx.venueLedgerEntry.create({
      data: {
        venueId,
        creditTransactionId: debitResult.transactionId,
        amountCents: totalAmountCents,
        currency: product.currency,
        status: "PENDING",
        description: `${product.name} x${quantity} - Credit purchase`,
      },
    });

    // 5. Decrease stock if tracked — updateMany with a conditional WHERE performs an
    //    atomic check-and-decrement in a single statement, preventing overselling under
    //    concurrent requests. `update` cannot express extra WHERE conditions in Prisma,
    //    so updateMany (returning affected row count) is the idiomatic approach here.
    if (product.stock !== null) {
      const updated = await tx.venueProduct.updateMany({
        where: { id: productId, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      });
      if (updated.count === 0) {
        throw new Error(
          `Insufficient stock for "${product.name}" (requested: ${quantity})`
        );
      }
    }

    return {
      purchaseId: purchase.id,
      transactionId: debitResult.transactionId,
      newBalanceCents: debitResult.newBalanceCents,
      totalAmountCents,
    };
  });

  return result;
}

/**
 * Refund a credit purchase (total or partial).
 * Returns credits to user and reverses the venue ledger entry.
 */
export async function refundCreditPurchase(params: {
  purchaseId: string;
  adminUserId?: string;
  adminNote?: string;
  partialAmountCents?: number;
}): Promise<{
  refundTransactionId: string;
  refundedAmountCents: number;
  newBalanceCents: number;
}> {
  const { purchaseId, adminUserId, adminNote, partialAmountCents } = params;

  const purchase = await prisma.venueProductPurchase.findUnique({
    where: { id: purchaseId },
    include: { product: true },
  });

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  if (purchase.status === "REFUNDED") {
    throw new Error("Purchase already refunded");
  }

  // Find the original credit transaction
  const originalTransaction = await prisma.creditTransaction.findFirst({
    where: {
      venueProductPurchaseId: purchaseId,
      type: "PURCHASE",
    },
  });

  if (!originalTransaction) {
    throw new Error("Original credit transaction not found");
  }

  const totalPurchaseCents = Math.round(purchase.totalAmount * 100);
  const refundAmountCents = partialAmountCents ?? totalPurchaseCents;

  if (refundAmountCents > totalPurchaseCents) {
    throw new Error("Refund amount exceeds purchase amount");
  }

  const idempotencyKey = `refund_${purchaseId}_${refundAmountCents}_${randomUUID()}`;
  const isFullRefund = refundAmountCents === totalPurchaseCents;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Credit back to user wallet
    const creditResult = await creditWallet(
      {
        userId: purchase.userId,
        amountCents: refundAmountCents,
        type: "REFUND",
        source: "REFUND_RETURN",
        description: `Refund: ${purchase.product.name}`,
        refundedTransactionId: originalTransaction.id,
        adminUserId,
        adminNote,
        idempotencyKey,
      },
      tx
    );

    // 2. Update purchase status
    await tx.venueProductPurchase.update({
      where: { id: purchaseId },
      data: {
        status: isFullRefund ? "REFUNDED" : "CONFIRMED",
      },
    });

    // 3. Reverse venue ledger entry
    const ledgerEntry = await tx.venueLedgerEntry.findFirst({
      where: { creditTransactionId: originalTransaction.id },
    });

    if (ledgerEntry?.status === "PENDING") {
      if (isFullRefund) {
        await tx.venueLedgerEntry.update({
          where: { id: ledgerEntry.id },
          data: { status: "REVERSED" },
        });
      } else {
        // Partial refund: reduce the ledger amount
        await tx.venueLedgerEntry.update({
          where: { id: ledgerEntry.id },
          data: {
            amountCents: ledgerEntry.amountCents - refundAmountCents,
          },
        });
      }
    }

    // 4. Restore stock if fully refunded
    if (isFullRefund && purchase.product.stock !== null) {
      await tx.venueProduct.update({
        where: { id: purchase.productId },
        data: { stock: { increment: purchase.quantity } },
      });
    }

    return {
      refundTransactionId: creditResult.transactionId,
      refundedAmountCents: refundAmountCents,
      newBalanceCents: creditResult.newBalanceCents,
    };
  });

  return result;
}

/**
 * Check if a purchase amount requires credits-only payment.
 */
export function requiresCreditsOnly(amountCents: number): boolean {
  return amountCents <= CREDITS_ONLY_THRESHOLD_CENTS;
}
