import {
  purchaseWithCredits,
  requiresCreditsOnly,
} from "@/lib/credits/purchase-service";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueProduct: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    venueProductPurchase: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    creditWallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    creditTransaction: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    venueLedgerEntry: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("crypto", () => ({
  randomUUID: () => "test-uuid-5678",
}));

const mockFindProduct = prisma.venueProduct.findFirst as jest.Mock;
const mockTransaction = prisma.$transaction as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── requiresCreditsOnly ───────────────────────────────────────────────────────

describe("requiresCreditsOnly", () => {
  it("returns true for amounts below threshold (500 cents)", () => {
    expect(requiresCreditsOnly(100)).toBe(true);
    expect(requiresCreditsOnly(499)).toBe(true);
    expect(requiresCreditsOnly(0)).toBe(true);
  });

  it("returns false for amounts at or above threshold", () => {
    expect(requiresCreditsOnly(500)).toBe(false);
    expect(requiresCreditsOnly(501)).toBe(false);
    expect(requiresCreditsOnly(10000)).toBe(false);
  });
});

// ── purchaseWithCredits ───────────────────────────────────────────────────────

describe("purchaseWithCredits", () => {
  it("throws if quantity is less than 1", async () => {
    await expect(
      purchaseWithCredits({
        userId: "u1",
        venueId: "v1",
        productId: "p1",
        quantity: 0,
      })
    ).rejects.toThrow("Quantity must be at least 1");
  });

  it("throws if product not found or inactive", async () => {
    mockFindProduct.mockResolvedValue(null);

    await expect(
      purchaseWithCredits({
        userId: "u1",
        venueId: "v1",
        productId: "p1",
        quantity: 1,
      })
    ).rejects.toThrow("Product not found or inactive");
  });

  it("throws if product price is 0 or invalid", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Free Item",
      price: 0,
      currency: "EUR",
      stock: null,
    });

    await expect(
      purchaseWithCredits({
        userId: "u1",
        venueId: "v1",
        productId: "p1",
        quantity: 1,
      })
    ).rejects.toThrow("Invalid product price");
  });

  it("throws if insufficient stock", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Limited Item",
      price: 5.0,
      currency: "EUR",
      stock: 1,
    });

    await expect(
      purchaseWithCredits({
        userId: "u1",
        venueId: "v1",
        productId: "p1",
        quantity: 5,
      })
    ).rejects.toThrow("Insufficient stock");
  });

  it("executes transaction for valid purchase", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Protein Bar",
      price: 3.5,
      currency: "EUR",
      stock: 10,
    });

    const mockResult = {
      purchaseId: "pur_1",
      transactionId: "tx_1",
      newBalanceCents: 6300,
      totalAmountCents: 700, // 3.50 * 2 * 100
    };

    mockTransaction.mockResolvedValue(mockResult);

    const result = await purchaseWithCredits({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 2,
    });

    expect(result).toEqual(mockResult);
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it("allows purchase when stock is null (unlimited)", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Digital Pass",
      price: 10.0,
      currency: "EUR",
      stock: null, // unlimited
    });

    mockTransaction.mockResolvedValue({
      purchaseId: "pur_2",
      transactionId: "tx_2",
      newBalanceCents: 0,
      totalAmountCents: 1000,
    });

    const result = await purchaseWithCredits({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 1,
    });

    expect(result.totalAmountCents).toBe(1000);
  });

  it("calculates correct total for quantity > 1", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Water Bottle",
      price: 1.5,
      currency: "EUR",
      stock: 50,
    });

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      // The function creates the transaction — we just verify it's called
      // with proper amount (1.50 * 3 = 4.50 = 450 cents)
      const txClient = {
        creditWallet: {
          findUnique: jest.fn().mockResolvedValue({
            id: "w1",
            userId: "u1",
            balanceCents: 5000,
            totalTopUpCents: 5000,
            totalSpentCents: 0,
            totalRewardedCents: 0,
          }),
          update: jest.fn().mockResolvedValue({ balanceCents: 4550 }),
          create: jest.fn(),
        },
        creditTransaction: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue({ id: "tx_3", balanceAfterCents: 4550 }),
          update: jest.fn(),
        },
        venueProductPurchase: {
          create: jest.fn().mockResolvedValue({ id: "pur_3" }),
        },
        venueLedgerEntry: {
          create: jest.fn(),
        },
        venueProduct: {
          update: jest.fn(),
        },
      };
      return fn(txClient);
    });

    const result = await purchaseWithCredits({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 3,
    });

    expect(result.totalAmountCents).toBe(450);
    expect(result.newBalanceCents).toBe(4550);
  });
});
