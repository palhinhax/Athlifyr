import {
  getOrCreateWallet,
  getWalletBalance,
  getWalletWithStats,
  creditWallet,
  debitWallet,
  getTransactionHistory,
  InsufficientCreditsError,
} from "@/lib/credits/wallet-service";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => {
  const mockPrisma = {
    creditWallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    creditTransaction: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  // Execute the callback with mockPrisma as the tx client so inner calls
  // hit the same jest.fn() mocks already configured by each test.
  mockPrisma.$transaction.mockImplementation(
    async (fn: (tx: typeof mockPrisma) => unknown) => fn(mockPrisma)
  );
  return { prisma: mockPrisma };
});

const mockFindWallet = prisma.creditWallet.findUnique as jest.Mock;
const mockCreateWallet = prisma.creditWallet.create as jest.Mock;
const mockUpdateWallet = prisma.creditWallet.update as jest.Mock;
const mockFindTransaction = prisma.creditTransaction.findUnique as jest.Mock;
const mockFindManyTransactions = prisma.creditTransaction.findMany as jest.Mock;
const mockCreateTransaction = prisma.creditTransaction.create as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── getOrCreateWallet ─────────────────────────────────────────────────────────

describe("getOrCreateWallet", () => {
  const existingWallet = {
    id: "w1",
    userId: "u1",
    balanceCents: 5000,
    totalTopUpCents: 10000,
    totalSpentCents: 5000,
    totalRewardedCents: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("returns existing wallet when found", async () => {
    mockFindWallet.mockResolvedValue(existingWallet);

    const result = await getOrCreateWallet("u1");

    expect(result).toEqual(existingWallet);
    expect(mockFindWallet).toHaveBeenCalledWith({ where: { userId: "u1" } });
    expect(mockCreateWallet).not.toHaveBeenCalled();
  });

  it("creates a new wallet with 0 balance when none exists", async () => {
    const newWallet = { ...existingWallet, balanceCents: 0 };
    mockFindWallet.mockResolvedValue(null);
    mockCreateWallet.mockResolvedValue(newWallet);

    const result = await getOrCreateWallet("u1");

    expect(result).toEqual(newWallet);
    expect(mockCreateWallet).toHaveBeenCalledWith({
      data: { userId: "u1", balanceCents: 0 },
    });
  });

  it("uses transaction client when provided", async () => {
    const txClient = {
      creditWallet: {
        findUnique: jest.fn().mockResolvedValue(existingWallet),
        create: jest.fn(),
      },
    };

    const result = await getOrCreateWallet("u1", txClient as never);

    expect(result).toEqual(existingWallet);
    expect(txClient.creditWallet.findUnique).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
    // Should NOT use the global prisma mock
    expect(mockFindWallet).not.toHaveBeenCalled();
  });
});

// ── getWalletBalance ──────────────────────────────────────────────────────────

describe("getWalletBalance", () => {
  it("returns balance when wallet exists", async () => {
    mockFindWallet.mockResolvedValue({ balanceCents: 4200 });

    const result = await getWalletBalance("u1");

    expect(result).toBe(4200);
    expect(mockFindWallet).toHaveBeenCalledWith({
      where: { userId: "u1" },
      select: { balanceCents: true },
    });
  });

  it("returns 0 when no wallet exists", async () => {
    mockFindWallet.mockResolvedValue(null);

    const result = await getWalletBalance("u1");

    expect(result).toBe(0);
  });
});

// ── getWalletWithStats ────────────────────────────────────────────────────────

describe("getWalletWithStats", () => {
  it("returns full wallet stats", async () => {
    mockFindWallet.mockResolvedValue({
      id: "w1",
      userId: "u1",
      balanceCents: 5000,
      totalTopUpCents: 10000,
      totalSpentCents: 5000,
      totalRewardedCents: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await getWalletWithStats("u1");

    expect(result).toEqual({
      balanceCents: 5000,
      totalTopUpCents: 10000,
      totalSpentCents: 5000,
      totalRewardedCents: 200,
    });
  });

  it("creates a new wallet if none exists and returns 0 stats", async () => {
    mockFindWallet.mockResolvedValue(null);
    mockCreateWallet.mockResolvedValue({
      id: "w1",
      userId: "u1",
      balanceCents: 0,
      totalTopUpCents: 0,
      totalSpentCents: 0,
      totalRewardedCents: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await getWalletWithStats("u1");

    expect(result).toEqual({
      balanceCents: 0,
      totalTopUpCents: 0,
      totalSpentCents: 0,
      totalRewardedCents: 0,
    });
  });
});

// ── creditWallet ──────────────────────────────────────────────────────────────

describe("creditWallet", () => {
  const wallet = {
    id: "w1",
    userId: "u1",
    balanceCents: 1000,
    totalTopUpCents: 1000,
    totalSpentCents: 0,
    totalRewardedCents: 0,
  };

  beforeEach(() => {
    mockFindWallet.mockResolvedValue(wallet);
    mockUpdateWallet.mockResolvedValue({ ...wallet, balanceCents: 2000 });
    mockCreateTransaction.mockResolvedValue({
      id: "tx1",
      balanceAfterCents: 2000,
    });
    mockFindTransaction.mockResolvedValue(null);
  });

  it("throws if amount is 0 or negative", async () => {
    await expect(
      creditWallet({
        userId: "u1",
        amountCents: 0,
        type: "TOP_UP",
        source: "STRIPE_TOP_UP",
      })
    ).rejects.toThrow("Credit amount must be positive");

    await expect(
      creditWallet({
        userId: "u1",
        amountCents: -100,
        type: "TOP_UP",
        source: "STRIPE_TOP_UP",
      })
    ).rejects.toThrow("Credit amount must be positive");
  });

  it("credits wallet and creates transaction for TOP_UP", async () => {
    const result = await creditWallet({
      userId: "u1",
      amountCents: 1000,
      type: "TOP_UP",
      source: "STRIPE_TOP_UP",
      grossAmountCents: 1040,
    });

    expect(result).toEqual({
      transactionId: "tx1",
      newBalanceCents: 2000,
    });

    expect(mockUpdateWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1" },
        data: expect.objectContaining({
          balanceCents: { increment: 1000 },
          totalTopUpCents: { increment: 1040 },
        }),
      })
    );
  });

  it("credits wallet and increments totalRewardedCents for REWARD", async () => {
    await creditWallet({
      userId: "u1",
      amountCents: 500,
      type: "REWARD",
      source: "REFERRAL_REWARD",
    });

    expect(mockUpdateWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          balanceCents: { increment: 500 },
          totalRewardedCents: { increment: 500 },
        }),
      })
    );
  });

  it("returns cached result for duplicate idempotency key", async () => {
    mockFindTransaction.mockResolvedValue({
      id: "existing_tx",
      balanceAfterCents: 3000,
    });

    const result = await creditWallet({
      userId: "u1",
      amountCents: 1000,
      type: "TOP_UP",
      source: "STRIPE_TOP_UP",
      idempotencyKey: "dup_key",
    });

    expect(result).toEqual({
      transactionId: "existing_tx",
      newBalanceCents: 3000,
    });
    expect(mockUpdateWallet).not.toHaveBeenCalled();
  });
});

// ── debitWallet ───────────────────────────────────────────────────────────────

describe("debitWallet", () => {
  const wallet = {
    id: "w1",
    userId: "u1",
    balanceCents: 5000,
    totalTopUpCents: 10000,
    totalSpentCents: 5000,
    totalRewardedCents: 0,
  };

  beforeEach(() => {
    mockFindWallet.mockResolvedValue(wallet);
    mockUpdateWallet.mockResolvedValue({ ...wallet, balanceCents: 3000 });
    mockCreateTransaction.mockResolvedValue({
      id: "tx_debit",
      balanceAfterCents: 3000,
    });
    mockFindTransaction.mockResolvedValue(null);
  });

  it("throws if amount is 0 or negative", async () => {
    await expect(debitWallet({ userId: "u1", amountCents: 0 })).rejects.toThrow(
      "Debit amount must be positive"
    );

    await expect(
      debitWallet({ userId: "u1", amountCents: -50 })
    ).rejects.toThrow("Debit amount must be positive");
  });

  it("throws InsufficientCreditsError when balance too low", async () => {
    mockFindWallet.mockResolvedValue({ ...wallet, balanceCents: 100 });

    await expect(
      debitWallet({ userId: "u1", amountCents: 2000 })
    ).rejects.toThrow(InsufficientCreditsError);

    try {
      await debitWallet({ userId: "u1", amountCents: 2000 });
    } catch (error) {
      expect(error).toBeInstanceOf(InsufficientCreditsError);
      const insuffErr = error as InstanceType<typeof InsufficientCreditsError>;
      expect(insuffErr.currentBalanceCents).toBe(100);
      expect(insuffErr.requiredAmountCents).toBe(2000);
    }
  });

  it("debits wallet and creates PURCHASE transaction", async () => {
    const result = await debitWallet({
      userId: "u1",
      amountCents: 2000,
      description: "Protein Bar x2",
      venueId: "v1",
      venueProductId: "p1",
    });

    expect(result).toEqual({
      transactionId: "tx_debit",
      newBalanceCents: 3000,
    });

    expect(mockUpdateWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1" },
        data: {
          balanceCents: { decrement: 2000 },
          totalSpentCents: { increment: 2000 },
        },
      })
    );

    expect(mockCreateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "u1",
          type: "PURCHASE",
          source: "PURCHASE_CONSUMPTION",
          amountCents: -2000,
          description: "Protein Bar x2",
          venueId: "v1",
          venueProductId: "p1",
        }),
      })
    );
  });

  it("returns cached result for duplicate idempotency key", async () => {
    mockFindTransaction.mockResolvedValue({
      id: "dup_tx",
      balanceAfterCents: 4000,
    });

    const result = await debitWallet({
      userId: "u1",
      amountCents: 1000,
      idempotencyKey: "dup_debit",
    });

    expect(result).toEqual({
      transactionId: "dup_tx",
      newBalanceCents: 4000,
    });
    expect(mockUpdateWallet).not.toHaveBeenCalled();
  });
});

// ── getTransactionHistory ─────────────────────────────────────────────────────

describe("getTransactionHistory", () => {
  const mockTransactions = Array.from({ length: 5 }, (_, i) => ({
    id: `tx_${i}`,
    type: "TOP_UP",
    source: "STRIPE_TOP_UP",
    amountCents: 1000,
    balanceAfterCents: 1000 * (i + 1),
    description: null,
    grossAmountCents: 1040,
    platformFeeCents: 40,
    netCreditedCents: 1000,
    venueId: null,
    createdAt: new Date(),
    expiresAt: null,
  }));

  it("returns items with pagination info", async () => {
    mockFindManyTransactions.mockResolvedValue(mockTransactions);

    const result = await getTransactionHistory("u1", { limit: 20 });

    expect(result.items).toHaveLength(5);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });

  it("caps limit at 50", async () => {
    mockFindManyTransactions.mockResolvedValue([]);

    await getTransactionHistory("u1", { limit: 100 });

    expect(mockFindManyTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 51, // 50 + 1
      })
    );
  });

  it("indicates hasMore when results exceed limit", async () => {
    // Return 4 items when limit is 3 → hasMore = true
    const fourItems = mockTransactions.slice(0, 4);
    mockFindManyTransactions.mockResolvedValue(fourItems);

    const result = await getTransactionHistory("u1", { limit: 3 });

    expect(result.items).toHaveLength(3);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe("tx_2");
  });

  it("applies type filter", async () => {
    mockFindManyTransactions.mockResolvedValue([]);

    await getTransactionHistory("u1", { type: "PURCHASE" });

    expect(mockFindManyTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "u1",
          type: "PURCHASE",
        }),
      })
    );
  });

  it("applies cursor for pagination", async () => {
    mockFindManyTransactions.mockResolvedValue([]);

    await getTransactionHistory("u1", { cursor: "tx_5" });

    expect(mockFindManyTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: "tx_5" },
        skip: 1,
      })
    );
  });
});

// ── InsufficientCreditsError ──────────────────────────────────────────────────

describe("InsufficientCreditsError", () => {
  it("contains balance info", () => {
    const error = new InsufficientCreditsError(200, 500);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("InsufficientCreditsError");
    expect(error.currentBalanceCents).toBe(200);
    expect(error.requiredAmountCents).toBe(500);
    expect(error.message).toContain("200");
    expect(error.message).toContain("500");
  });
});
