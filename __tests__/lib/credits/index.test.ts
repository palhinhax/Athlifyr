/**
 * @jest-environment node
 */

// Verify the barrel export re-exports all expected symbols.
import * as credits from "@/lib/credits";

describe("lib/credits barrel export", () => {
  it("exports constants", () => {
    expect(credits.TOPUP_FEE_PERCENTAGE).toBeDefined();
    expect(credits.CONSUMPTION_FEE_PERCENTAGE).toBeDefined();
    expect(credits.MIN_CONSUMPTION_FEE_CENTS).toBeDefined();
    expect(credits.CREDITS_ONLY_THRESHOLD_CENTS).toBeDefined();
    expect(credits.TOPUP_AMOUNTS_CENTS).toBeDefined();
    expect(credits.MIN_TOPUP_AMOUNT_CENTS).toBeDefined();
    expect(credits.MAX_TOPUP_AMOUNT_CENTS).toBeDefined();
    expect(credits.calculateTopUpFee).toBeInstanceOf(Function);
    expect(credits.calculateNetCredits).toBeInstanceOf(Function);
    expect(credits.calculateConsumptionFee).toBeInstanceOf(Function);
    expect(credits.calculatePurchaseTotal).toBeInstanceOf(Function);
  });

  it("exports wallet-service functions", () => {
    expect(credits.getOrCreateWallet).toBeInstanceOf(Function);
    expect(credits.getWalletBalance).toBeInstanceOf(Function);
    expect(credits.getWalletWithStats).toBeInstanceOf(Function);
    expect(credits.creditWallet).toBeInstanceOf(Function);
    expect(credits.debitWallet).toBeInstanceOf(Function);
    expect(credits.getTransactionHistory).toBeInstanceOf(Function);
    expect(credits.InsufficientCreditsError).toBeInstanceOf(Function);
  });

  it("exports topup-service functions", () => {
    expect(credits.createTopUpPaymentIntent).toBeInstanceOf(Function);
    expect(credits.completeTopUp).toBeInstanceOf(Function);
    expect(credits.failTopUp).toBeInstanceOf(Function);
    expect(credits.cancelTopUp).toBeInstanceOf(Function);
    expect(credits.getTopUpHistory).toBeInstanceOf(Function);
  });

  it("exports purchase-service functions", () => {
    expect(credits.purchaseWithCredits).toBeInstanceOf(Function);
    expect(credits.refundCreditPurchase).toBeInstanceOf(Function);
    expect(credits.requiresCreditsOnly).toBeInstanceOf(Function);
  });

  it("exports settlement-service functions", () => {
    expect(credits.getVenuePendingBalance).toBeInstanceOf(Function);
    expect(credits.getVenueSettlementHistory).toBeInstanceOf(Function);
    expect(credits.executeWeeklySettlement).toBeInstanceOf(Function);
    expect(credits.retrySettlement).toBeInstanceOf(Function);
    expect(credits.settleVenueManually).toBeInstanceOf(Function);
  });
});
