/**
 * Athlifyr Credits System - Constants
 */

/** Platform fee percentage applied to top-ups (4%) */
export const TOPUP_FEE_PERCENTAGE = 4;

/** Minimum purchase amount (in cents) that allows direct Stripe payment.
 *  Below this → credits only. */
export const CREDITS_ONLY_THRESHOLD_CENTS = 500; // 5.00€

/** Predefined top-up amounts in cents */
export const TOPUP_AMOUNTS_CENTS = [500, 1000, 2000, 5000] as const;

/** Maximum top-up amount in a single transaction (in cents) */
export const MAX_TOPUP_AMOUNT_CENTS = 50000; // 500.00€

/** Minimum top-up amount (in cents) */
export const MIN_TOPUP_AMOUNT_CENTS = 500; // 5.00€

/** Settlement frequency - day of week (0=Sunday, 1=Monday) */
export const SETTLEMENT_DAY_OF_WEEK = 1; // Monday

/** Maximum retry count for failed settlements */
export const SETTLEMENT_MAX_RETRIES = 3;

/**
 * Calculate the platform fee for a top-up
 * @param grossAmountCents - The amount the user pays in cents
 * @returns fee in cents
 */
export function calculateTopUpFee(grossAmountCents: number): number {
  return Math.round(grossAmountCents * (TOPUP_FEE_PERCENTAGE / 100));
}

/**
 * Calculate the net credited amount after fee deduction
 * @param grossAmountCents - The amount the user pays in cents
 * @returns net credits in cents
 */
export function calculateNetCredits(grossAmountCents: number): number {
  return grossAmountCents - calculateTopUpFee(grossAmountCents);
}
