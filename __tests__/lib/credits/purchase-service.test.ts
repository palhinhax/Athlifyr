import {
  purchaseWithCredits,
  refundCreditPurchase,
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

  it("returns false for amounts above threshold", () => {
    expect(requiresCreditsOnly(501)).toBe(false);
    expect(requiresCreditsOnly(10000)).toBe(false);
  });

  it("returns true for amounts at the threshold (500 cents)", () => {
    expect(requiresCreditsOnly(500)).toBe(true);
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

    // 5.00 * 5 = 2500 cents product, fee = 125, total = 2625
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const txClient = {
        creditWallet: {
          findUnique: jest.fn().mockResolvedValue({
            id: "w1",
            userId: "u1",
            balanceCents: 99999,
            totalTopUpCents: 99999,
            totalSpentCents: 0,
            totalRewardedCents: 0,
          }),
          update: jest.fn().mockResolvedValue({ balanceCents: 97374 }),
          create: jest.fn(),
        },
        creditTransaction: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue({ id: "tx_stock", balanceAfterCents: 97374 }),
          update: jest.fn(),
        },
        venueProductPurchase: {
          create: jest.fn().mockResolvedValue({ id: "pur_stock" }),
        },
        venueLedgerEntry: {
          create: jest.fn(),
        },
        venueProduct: {
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      };
      return fn(txClient);
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

  it("executes transaction for valid purchase with consumption fee", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Protein Bar",
      price: 3.5,
      currency: "EUR",
      stock: 10,
    });

    // 3.50 * 2 = 700 cents product price, 5% fee = 35 cents, total = 735
    const mockResult = {
      purchaseId: "pur_1",
      transactionId: "tx_1",
      newBalanceCents: 6265,
      totalAmountCents: 735,
      productPriceCents: 700,
      platformFeeCents: 35,
    };

    mockTransaction.mockResolvedValue(mockResult);

    const result = await purchaseWithCredits({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 2,
    });

    expect(result).toEqual(mockResult);
    expect(result.totalAmountCents).toBe(735);
    expect(result.productPriceCents).toBe(700);
    expect(result.platformFeeCents).toBe(35);
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

    // 10.00€ = 1000 cents, 5% fee = 50, total = 1050
    mockTransaction.mockResolvedValue({
      purchaseId: "pur_2",
      transactionId: "tx_2",
      newBalanceCents: 0,
      totalAmountCents: 1050,
      productPriceCents: 1000,
      platformFeeCents: 50,
    });

    const result = await purchaseWithCredits({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 1,
    });

    expect(result.totalAmountCents).toBe(1050);
    expect(result.productPriceCents).toBe(1000);
    expect(result.platformFeeCents).toBe(50);
  });

  it("calculates correct total with fee for quantity > 1", async () => {
    mockFindProduct.mockResolvedValue({
      id: "p1",
      name: "Water Bottle",
      price: 1.5,
      currency: "EUR",
      stock: 50,
    });

    // 1.50 * 3 = 4.50 = 450 cents, fee = max(450*0.05=22.5→23, 5) = 23, total = 473
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
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
          update: jest.fn().mockResolvedValue({ balanceCents: 4527 }),
          create: jest.fn(),
        },
        creditTransaction: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockResolvedValue({ id: "tx_3", balanceAfterCents: 4527 }),
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
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
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

    expect(result.totalAmountCents).toBe(473); // 450 + 23 fee
    expect(result.productPriceCents).toBe(450);
    expect(result.platformFeeCents).toBe(23);
    expect(result.newBalanceCents).toBe(4527);
  });
});

// ── refundCreditPurchase ──────────────────────────────────────────────────────

const mockFindUniquePurchase = prisma.venueProductPurchase
  .findUnique as jest.Mock;
const mockFindFirstTransaction = prisma.creditTransaction
  .findFirst as jest.Mock;

describe("refundCreditPurchase", () => {
  const basePurchase = {
    id: "pur_1",
    userId: "u1",
    productId: "p1",
    quantity: 2,
    totalAmount: 7.0 - 0, // 700 cents
    status: "CONFIRMED",
    product: { name: "Protein Bar", stock: 10 },
  };

  const baseTransaction = {
    id: "tx_orig",
    type: "PURCHASE",
    venueProductPurchaseId: "pur_1",
  };

  it("throws if purchase not found", async () => {
    mockFindUniquePurchase.mockResolvedValue(null);

    await expect(
      refundCreditPurchase({ purchaseId: "pur_nonexistent" })
    ).rejects.toThrow("Purchase not found");
  });

  it("throws if purchase already refunded", async () => {
    mockFindUniquePurchase.mockResolvedValue({
      ...basePurchase,
      status: "REFUNDED",
    });

    await expect(refundCreditPurchase({ purchaseId: "pur_1" })).rejects.toThrow(
      "Purchase already refunded"
    );
  });

  it("throws if original credit transaction not found", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(null);

    await expect(refundCreditPurchase({ purchaseId: "pur_1" })).rejects.toThrow(
      "Original credit transaction not found"
    );
  });

  it("throws if refund amount exceeds purchase amount", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    await expect(
      refundCreditPurchase({
        purchaseId: "pur_1",
        partialAmountCents: 99999,
      })
    ).rejects.toThrow("Refund amount exceeds purchase amount");
  });

  it("performs full refund with stock restoration", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    const ledgerEntry = {
      id: "le_1",
      amountCents: 700,
      status: "PENDING",
      creditTransactionId: "tx_orig",
    };

    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue({
          id: "w1",
          userId: "u1",
          balanceCents: 300,
          totalTopUpCents: 1000,
          totalSpentCents: 700,
          totalRewardedCents: 0,
        }),
        update: jest.fn().mockResolvedValue({ balanceCents: 1000 }),
        create: jest.fn(),
      },
      creditTransaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockResolvedValue({ id: "tx_refund", balanceAfterCents: 1000 }),
        update: jest.fn(),
      },
      venueProductPurchase: {
        update: jest.fn(),
      },
      venueLedgerEntry: {
        findFirst: jest.fn().mockResolvedValue(ledgerEntry),
        update: jest.fn(),
      },
      venueProduct: {
        update: jest.fn(),
      },
    };

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn(txClient)
    );

    const result = await refundCreditPurchase({ purchaseId: "pur_1" });

    expect(result.refundedAmountCents).toBe(700);
    expect(result.refundTransactionId).toBe("tx_refund");
    // Full refund → status set to REFUNDED
    expect(txClient.venueProductPurchase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "REFUNDED" },
      })
    );
    // Full refund → ledger reversed
    expect(txClient.venueLedgerEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "REVERSED" },
      })
    );
    // Full refund → stock restored
    expect(txClient.venueProduct.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { stock: { increment: 2 } },
      })
    );
  });

  it("performs partial refund without stock restoration", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    const ledgerEntry = {
      id: "le_1",
      amountCents: 700,
      status: "PENDING",
      creditTransactionId: "tx_orig",
    };

    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue({
          id: "w1",
          userId: "u1",
          balanceCents: 300,
          totalTopUpCents: 1000,
          totalSpentCents: 700,
          totalRewardedCents: 0,
        }),
        update: jest.fn().mockResolvedValue({ balanceCents: 650 }),
        create: jest.fn(),
      },
      creditTransaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockResolvedValue({ id: "tx_partial", balanceAfterCents: 650 }),
        update: jest.fn(),
      },
      venueProductPurchase: {
        update: jest.fn(),
      },
      venueLedgerEntry: {
        findFirst: jest.fn().mockResolvedValue(ledgerEntry),
        update: jest.fn(),
      },
      venueProduct: {
        update: jest.fn(),
      },
    };

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn(txClient)
    );

    const result = await refundCreditPurchase({
      purchaseId: "pur_1",
      partialAmountCents: 350,
    });

    expect(result.refundedAmountCents).toBe(350);
    // Partial refund → status stays CONFIRMED
    expect(txClient.venueProductPurchase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "CONFIRMED" },
      })
    );
    // Partial refund → ledger amount reduced
    expect(txClient.venueLedgerEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { amountCents: 350 },
      })
    );
    // Partial refund → stock NOT restored
    expect(txClient.venueProduct.update).not.toHaveBeenCalled();
  });

  it("handles refund when ledger entry is not pending", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue({
          id: "w1",
          userId: "u1",
          balanceCents: 300,
          totalTopUpCents: 1000,
          totalSpentCents: 700,
          totalRewardedCents: 0,
        }),
        update: jest.fn().mockResolvedValue({ balanceCents: 1000 }),
        create: jest.fn(),
      },
      creditTransaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockResolvedValue({ id: "tx_settled", balanceAfterCents: 1000 }),
        update: jest.fn(),
      },
      venueProductPurchase: {
        update: jest.fn(),
      },
      venueLedgerEntry: {
        findFirst: jest.fn().mockResolvedValue({
          id: "le_1",
          status: "SETTLED",
          amountCents: 700,
        }),
        update: jest.fn(),
      },
      venueProduct: {
        update: jest.fn(),
      },
    };

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn(txClient)
    );

    const result = await refundCreditPurchase({ purchaseId: "pur_1" });

    expect(result.refundedAmountCents).toBe(700);
    // Ledger entry not pending → should NOT be updated
    expect(txClient.venueLedgerEntry.update).not.toHaveBeenCalled();
  });

  it("handles refund when no ledger entry exists", async () => {
    mockFindUniquePurchase.mockResolvedValue({
      ...basePurchase,
      product: { name: "Protein Bar", stock: null },
    });
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue({
          id: "w1",
          userId: "u1",
          balanceCents: 300,
          totalTopUpCents: 1000,
          totalSpentCents: 700,
          totalRewardedCents: 0,
        }),
        update: jest.fn().mockResolvedValue({ balanceCents: 1000 }),
        create: jest.fn(),
      },
      creditTransaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: "tx_no_ledger",
          balanceAfterCents: 1000,
        }),
        update: jest.fn(),
      },
      venueProductPurchase: {
        update: jest.fn(),
      },
      venueLedgerEntry: {
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
      },
      venueProduct: {
        update: jest.fn(),
      },
    };

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn(txClient)
    );

    const result = await refundCreditPurchase({ purchaseId: "pur_1" });

    expect(result.refundedAmountCents).toBe(700);
    // No ledger entry → no ledger update
    expect(txClient.venueLedgerEntry.update).not.toHaveBeenCalled();
    // stock is null → no stock update
    expect(txClient.venueProduct.update).not.toHaveBeenCalled();
  });

  it("includes admin metadata in refund", async () => {
    mockFindUniquePurchase.mockResolvedValue(basePurchase);
    mockFindFirstTransaction.mockResolvedValue(baseTransaction);

    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue({
          id: "w1",
          userId: "u1",
          balanceCents: 300,
          totalTopUpCents: 1000,
          totalSpentCents: 700,
          totalRewardedCents: 0,
        }),
        update: jest.fn().mockResolvedValue({ balanceCents: 1000 }),
        create: jest.fn(),
      },
      creditTransaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: "tx_admin",
          balanceAfterCents: 1000,
        }),
        update: jest.fn(),
      },
      venueProductPurchase: {
        update: jest.fn(),
      },
      venueLedgerEntry: {
        findFirst: jest.fn().mockResolvedValue({
          id: "le_1",
          status: "PENDING",
          amountCents: 700,
        }),
        update: jest.fn(),
      },
      venueProduct: {
        update: jest.fn(),
      },
    };

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) =>
      fn(txClient)
    );

    await refundCreditPurchase({
      purchaseId: "pur_1",
      adminUserId: "admin_1",
      adminNote: "Customer complaint",
    });

    // creditWallet creditTransaction.create should receive admin info
    expect(txClient.creditTransaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "REFUND",
          adminUserId: "admin_1",
          adminNote: "Customer complaint",
        }),
      })
    );
  });
});
