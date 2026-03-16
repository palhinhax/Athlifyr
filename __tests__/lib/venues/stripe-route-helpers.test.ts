/**
 * @jest-environment node
 */
import {
  calculateCommission,
  calculateStripeFee,
  calculateApplicationFee,
  calculateApplicationFeePercent,
  requireStripeAccount,
} from "@/lib/venues/stripe-route-helpers";

// Mock heavy dependencies that stripe-route-helpers imports
jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/stripe", () => ({ stripe: {} }));
jest.mock("@/lib/venues/authorization", () => ({ canManageVenue: jest.fn() }));

// ============================================================================
// calculateCommission
// ============================================================================

describe("calculateCommission", () => {
  it("returns fixed commission when commissionType is FIXED", () => {
    const venue = { commissionType: "FIXED", commissionValue: 500 };
    expect(calculateCommission(venue, 10000)).toBe(500);
  });

  it("returns fixed commission regardless of amount", () => {
    const venue = { commissionType: "FIXED", commissionValue: 200 };
    expect(calculateCommission(venue, 5000)).toBe(200);
    expect(calculateCommission(venue, 50000)).toBe(200);
  });

  it("returns percentage commission when commissionType is PERCENTAGE", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 10 };
    // 10% of 10000 = 1000
    expect(calculateCommission(venue, 10000)).toBe(1000);
  });

  it("rounds percentage commission to nearest cent", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 7 };
    // 7% of 3333 = 233.31 → rounds to 233
    expect(calculateCommission(venue, 3333)).toBe(233);
  });

  it("returns 0 commission when commissionValue is 0 (percentage)", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 0 };
    expect(calculateCommission(venue, 10000)).toBe(0);
  });

  it("returns 0 commission when commissionValue is 0 (fixed)", () => {
    const venue = { commissionType: "FIXED", commissionValue: 0 };
    expect(calculateCommission(venue, 10000)).toBe(0);
  });
});

// ============================================================================
// calculateStripeFee
// ============================================================================

describe("calculateStripeFee", () => {
  it("calculates EU standard fee: 1.5% + €0.25", () => {
    // 10000 cents (€100): 1.5% = 150 + 25 = 175
    expect(calculateStripeFee(10000)).toBe(175);
  });

  it("rounds up (ceil) to cover full fee", () => {
    // 1234 cents: 1.5% = 18.51 + 25 = 43.51 → ceil = 44
    expect(calculateStripeFee(1234)).toBe(44);
  });

  it("handles small amounts", () => {
    // 100 cents (€1): 1.5% = 1.5 + 25 = 26.5 → ceil = 27
    expect(calculateStripeFee(100)).toBe(27);
  });

  it("handles 0 amount", () => {
    // 0: 1.5% = 0 + 25 = 25
    expect(calculateStripeFee(0)).toBe(25);
  });
});

// ============================================================================
// calculateApplicationFee
// ============================================================================

describe("calculateApplicationFee", () => {
  it("returns commission + stripe fee combined", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 10 };
    // Commission: 10% of 10000 = 1000
    // Stripe fee: 150 + 25 = 175
    // Total: 1175
    expect(calculateApplicationFee(venue, 10000)).toBe(1175);
  });

  it("returns only stripe fee when commission is 0", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 0 };
    // Commission: 0
    // Stripe fee: 150 + 25 = 175
    expect(calculateApplicationFee(venue, 10000)).toBe(175);
  });

  it("works with fixed commission", () => {
    const venue = { commissionType: "FIXED", commissionValue: 300 };
    // Commission: 300
    // Stripe fee on 5000: 75 + 25 = 100
    // Total: 400
    expect(calculateApplicationFee(venue, 5000)).toBe(400);
  });
});

// ============================================================================
// calculateApplicationFeePercent
// ============================================================================

describe("calculateApplicationFeePercent", () => {
  it("converts fee to percentage of charge amount", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 10 };
    // Fee = 1175 on 10000 → 11.75%
    const percent = calculateApplicationFeePercent(venue, 10000);
    expect(percent).toBe(11.75);
  });

  it("returns 0 when amount is 0", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 10 };
    expect(calculateApplicationFeePercent(venue, 0)).toBe(0);
  });

  it("returns 0 when amount is negative", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 10 };
    expect(calculateApplicationFeePercent(venue, -100)).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    const venue = { commissionType: "PERCENTAGE", commissionValue: 5 };
    // 5000 amount: commission = 250, stripe = 100, total fee = 350
    // 350/5000 = 7.00%
    const percent = calculateApplicationFeePercent(venue, 5000);
    expect(percent).toBe(7);
  });
});

// ============================================================================
// requireStripeAccount
// ============================================================================

describe("requireStripeAccount", () => {
  it("returns null when stripe account exists", () => {
    expect(requireStripeAccount({ stripeAccountId: "acct_123" })).toBeNull();
  });

  it("returns error response when no stripe account", () => {
    const result = requireStripeAccount({ stripeAccountId: null });
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });
});
