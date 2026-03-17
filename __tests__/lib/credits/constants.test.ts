import {
  calculateTopUpFee,
  calculateNetCredits,
  TOPUP_FEE_PERCENTAGE,
  CREDITS_ONLY_THRESHOLD_CENTS,
  MIN_TOPUP_AMOUNT_CENTS,
  MAX_TOPUP_AMOUNT_CENTS,
  TOPUP_AMOUNTS_CENTS,
} from "@/lib/credits/constants";

describe("Credits Constants", () => {
  it("defines sane default values", () => {
    expect(TOPUP_FEE_PERCENTAGE).toBe(4);
    expect(CREDITS_ONLY_THRESHOLD_CENTS).toBe(500);
    expect(MIN_TOPUP_AMOUNT_CENTS).toBe(500);
    expect(MAX_TOPUP_AMOUNT_CENTS).toBe(50000);
    expect(TOPUP_AMOUNTS_CENTS).toEqual([500, 1000, 2000, 5000]);
  });
});

describe("calculateTopUpFee", () => {
  it("calculates 4% fee for 1000 cents", () => {
    expect(calculateTopUpFee(1000)).toBe(40);
  });

  it("calculates 4% fee for 5000 cents", () => {
    expect(calculateTopUpFee(5000)).toBe(200);
  });

  it("calculates 4% fee for 500 cents (minimum)", () => {
    expect(calculateTopUpFee(500)).toBe(20);
  });

  it("returns 0 for 0 amount", () => {
    expect(calculateTopUpFee(0)).toBe(0);
  });

  it("rounds the result to nearest integer", () => {
    // 333 * 0.04 = 13.32 → rounds to 13
    expect(calculateTopUpFee(333)).toBe(13);
  });

  it("handles large amounts (50000 cents)", () => {
    expect(calculateTopUpFee(50000)).toBe(2000);
  });
});

describe("calculateNetCredits", () => {
  it("returns gross minus fee for 1000 cents", () => {
    expect(calculateNetCredits(1000)).toBe(960);
  });

  it("returns gross minus fee for 5000 cents", () => {
    expect(calculateNetCredits(5000)).toBe(4800);
  });

  it("returns gross minus fee for 500 cents", () => {
    expect(calculateNetCredits(500)).toBe(480);
  });

  it("returns 0 for 0 amount", () => {
    expect(calculateNetCredits(0)).toBe(0);
  });

  it("fee + net always equals gross", () => {
    const testAmounts = [500, 750, 1000, 2500, 5000, 10000, 33333, 50000];
    for (const amount of testAmounts) {
      const fee = calculateTopUpFee(amount);
      const net = calculateNetCredits(amount);
      expect(fee + net).toBe(amount);
    }
  });
});
