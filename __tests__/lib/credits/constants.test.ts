import {
  calculateTopUpFee,
  calculateNetCredits,
  calculateConsumptionFee,
  calculatePurchaseTotal,
  TOPUP_FEE_PERCENTAGE,
  CONSUMPTION_FEE_PERCENTAGE,
  MIN_CONSUMPTION_FEE_CENTS,
  CREDITS_ONLY_THRESHOLD_CENTS,
  MIN_TOPUP_AMOUNT_CENTS,
  MAX_TOPUP_AMOUNT_CENTS,
  TOPUP_AMOUNTS_CENTS,
} from "@/lib/credits/constants";

describe("Credits Constants", () => {
  it("defines sane default values", () => {
    expect(TOPUP_FEE_PERCENTAGE).toBe(0);
    expect(CONSUMPTION_FEE_PERCENTAGE).toBe(5);
    expect(MIN_CONSUMPTION_FEE_CENTS).toBe(5);
    expect(CREDITS_ONLY_THRESHOLD_CENTS).toBe(500);
    expect(MIN_TOPUP_AMOUNT_CENTS).toBe(1000);
    expect(MAX_TOPUP_AMOUNT_CENTS).toBe(50000);
    expect(TOPUP_AMOUNTS_CENTS).toEqual([1000, 2000, 3000, 5000]);
  });
});

describe("calculateTopUpFee (deprecated, always 0)", () => {
  it("returns 0 for any amount", () => {
    expect(calculateTopUpFee(1000)).toBe(0);
    expect(calculateTopUpFee(5000)).toBe(0);
    expect(calculateTopUpFee(500)).toBe(0);
    expect(calculateTopUpFee(0)).toBe(0);
    expect(calculateTopUpFee(50000)).toBe(0);
  });
});

describe("calculateNetCredits (deprecated, returns full amount)", () => {
  it("returns the full gross amount for any input", () => {
    expect(calculateNetCredits(1000)).toBe(1000);
    expect(calculateNetCredits(5000)).toBe(5000);
    expect(calculateNetCredits(500)).toBe(500);
    expect(calculateNetCredits(0)).toBe(0);
  });

  it("fee + net always equals gross (fee is 0)", () => {
    const testAmounts = [500, 750, 1000, 2500, 5000, 10000, 33333, 50000];
    for (const amount of testAmounts) {
      const fee = calculateTopUpFee(amount);
      const net = calculateNetCredits(amount);
      expect(fee + net).toBe(amount);
    }
  });
});

describe("calculateConsumptionFee", () => {
  it("calculates 5% fee for 1000 cents", () => {
    expect(calculateConsumptionFee(1000)).toBe(50);
  });

  it("calculates 5% fee for 5000 cents", () => {
    expect(calculateConsumptionFee(5000)).toBe(250);
  });

  it("enforces minimum fee of 5 cents", () => {
    // 5% of 80 = 4 → should be raised to 5 (minimum)
    expect(calculateConsumptionFee(80)).toBe(5);
  });

  it("enforces minimum fee of 5 cents for very small amounts", () => {
    // 5% of 10 = 0.5 → rounds to 1, but min is 5
    expect(calculateConsumptionFee(10)).toBe(5);
  });

  it("uses percentage when it exceeds minimum", () => {
    // 5% of 200 = 10 > 5 → use 10
    expect(calculateConsumptionFee(200)).toBe(10);
  });

  it("returns 0 for 0 or negative amount", () => {
    expect(calculateConsumptionFee(0)).toBe(0);
    expect(calculateConsumptionFee(-100)).toBe(0);
  });

  it("rounds the result to nearest integer", () => {
    // 5% of 333 = 16.65 → rounds to 17
    expect(calculateConsumptionFee(333)).toBe(17);
  });

  it("handles the issue example: 0.80€ product", () => {
    // 5% of 80 = 4 → min is 5
    expect(calculateConsumptionFee(80)).toBe(5);
  });
});

describe("calculatePurchaseTotal", () => {
  it("returns product price + consumption fee", () => {
    // 80 cents product + 5 cents fee (minimum) = 85
    expect(calculatePurchaseTotal(80)).toBe(85);
  });

  it("returns product price + 5% fee for larger amounts", () => {
    // 1000 cents product + 50 cents fee (5%) = 1050
    expect(calculatePurchaseTotal(1000)).toBe(1050);
  });

  it("handles 0 amount", () => {
    expect(calculatePurchaseTotal(0)).toBe(0);
  });
});
