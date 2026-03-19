/**
 * Athlifyr Credits System - Constants
 *
 * Fee model: NO fee on top-up, fee applied ONLY at consumption (purchase).
 * 1€ = 1 credit — users always receive full credits on top-up.
 */

/** @deprecated Top-up fee has been removed. Kept as 0 for backward compatibility. */
export const TOPUP_FEE_PERCENTAGE = 0;

/** Platform fee percentage applied to purchases (5%) */
export const CONSUMPTION_FEE_PERCENTAGE = 5;

/** Minimum platform fee per purchase transaction (in cents) — protects against micro-transactions */
export const MIN_CONSUMPTION_FEE_CENTS = 5; // 0.05€

/** Minimum purchase amount (in cents) that allows direct Stripe payment.
 *  Below this → credits only. */
export const CREDITS_ONLY_THRESHOLD_CENTS = 500; // 5.00€

/** Predefined top-up amounts in cents */
export const TOPUP_AMOUNTS_CENTS = [1000, 2000, 3000, 5000] as const;

/** Maximum top-up amount in a single transaction (in cents) */
export const MAX_TOPUP_AMOUNT_CENTS = 50000; // 500.00€

/** Minimum top-up amount (in cents) — set to 10€ to offset Stripe fees */
export const MIN_TOPUP_AMOUNT_CENTS = 1000; // 10.00€

/** Settlement frequency - day of week (0=Sunday, 1=Monday) */
export const SETTLEMENT_DAY_OF_WEEK = 1; // Monday

/** Maximum retry count for failed settlements */
export const SETTLEMENT_MAX_RETRIES = 3;

/**
 * Calculate the platform fee for a top-up.
 * Under the new model the fee is always 0 (no fee on top-up).
 * @deprecated Use {@link calculateConsumptionFee} for purchase fees instead.
 */
export function calculateTopUpFee(_grossAmountCents: number): number {
  return 0;
}

/**
 * Calculate the net credited amount after fee deduction.
 * Under the new model the full amount is always credited (1€ = 1 credit).
 * @deprecated Use {@link calculateConsumptionFee} for purchase fees instead.
 */
export function calculateNetCredits(grossAmountCents: number): number {
  return grossAmountCents;
}

/**
 * Calculate the platform fee for a purchase (consumption).
 * fee = max(CONSUMPTION_FEE_PERCENTAGE% of product price, MIN_CONSUMPTION_FEE_CENTS)
 * Always rounded to the nearest cent.
 *
 * @param productPriceCents - The product price in cents
 * @returns fee in cents
 */
export function calculateConsumptionFee(productPriceCents: number): number {
  if (productPriceCents <= 0) return 0;
  const percentageFee = Math.round(
    productPriceCents * (CONSUMPTION_FEE_PERCENTAGE / 100)
  );
  return Math.max(percentageFee, MIN_CONSUMPTION_FEE_CENTS);
}

/**
 * Calculate the total amount to deduct from wallet for a purchase.
 * total = product price + consumption fee
 *
 * @param productPriceCents - The product price in cents
 * @returns total deduction in cents
 */
export function calculatePurchaseTotal(productPriceCents: number): number {
  return productPriceCents + calculateConsumptionFee(productPriceCents);
}
