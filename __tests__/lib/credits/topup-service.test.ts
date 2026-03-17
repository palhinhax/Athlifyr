import {
  createTopUpPaymentIntent,
  completeTopUp,
  failTopUp,
  cancelTopUp,
  getTopUpHistory,
} from "@/lib/credits/topup-service";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    creditTopUp: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    creditWallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    creditTransaction: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/stripe-customer", () => ({
  getOrCreateStripeCustomer: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: () => "test-uuid-1234",
}));

const mockCreateTopUp = prisma.creditTopUp.create as jest.Mock;
const mockUpdateTopUp = prisma.creditTopUp.update as jest.Mock;
const mockFindTopUp = prisma.creditTopUp.findUnique as jest.Mock;
const mockFindManyTopUps = prisma.creditTopUp.findMany as jest.Mock;
const mockTransaction = prisma.$transaction as jest.Mock;
const mockCreatePI = stripe.paymentIntents.create as jest.Mock;
const mockGetCustomer = getOrCreateStripeCustomer as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── createTopUpPaymentIntent ──────────────────────────────────────────────────

describe("createTopUpPaymentIntent", () => {
  beforeEach(() => {
    mockGetCustomer.mockResolvedValue("cus_test_123");
    mockCreateTopUp.mockResolvedValue({ id: "topup_1" });
    mockCreatePI.mockResolvedValue({
      id: "pi_test_abc",
      client_secret: "secret_test",
    });
    mockUpdateTopUp.mockResolvedValue({});
  });

  it("throws for amount below minimum", async () => {
    await expect(
      createTopUpPaymentIntent({ userId: "u1", amountCents: 100 })
    ).rejects.toThrow("Minimum top-up amount is 500 cents");
  });

  it("throws for amount above maximum", async () => {
    await expect(
      createTopUpPaymentIntent({ userId: "u1", amountCents: 60000 })
    ).rejects.toThrow("Maximum top-up amount is 50000 cents");
  });

  it("creates a top-up record and payment intent for valid amount", async () => {
    const result = await createTopUpPaymentIntent({
      userId: "u1",
      amountCents: 1000,
    });

    expect(result).toEqual({
      clientSecret: "secret_test",
      paymentIntentId: "pi_test_abc",
      topUpId: "topup_1",
      grossAmountCents: 1000,
      platformFeeCents: 40, // 4% of 1000
      netCreditedCents: 960, // 1000 - 40
    });

    expect(mockGetCustomer).toHaveBeenCalledWith("u1");

    expect(mockCreateTopUp).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "u1",
        grossAmountCents: 1000,
        platformFeeCents: 40,
        netCreditedCents: 960,
        feePercentage: 4,
        status: "PENDING",
        stripeCustomerId: "cus_test_123",
      }),
    });

    expect(mockCreatePI).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 1000,
        currency: "eur",
        customer: "cus_test_123",
        metadata: expect.objectContaining({
          type: "credit_top_up",
          topUpId: "topup_1",
          userId: "u1",
        }),
      })
    );

    expect(mockUpdateTopUp).toHaveBeenCalledWith({
      where: { id: "topup_1" },
      data: { stripePaymentIntentId: "pi_test_abc" },
    });
  });

  it("calculates correct fee for 5000 cents", async () => {
    const result = await createTopUpPaymentIntent({
      userId: "u1",
      amountCents: 5000,
    });

    expect(result.platformFeeCents).toBe(200);
    expect(result.netCreditedCents).toBe(4800);
  });
});

// ── completeTopUp ─────────────────────────────────────────────────────────────

describe("completeTopUp", () => {
  it("does nothing when top-up not found", async () => {
    mockFindTopUp.mockResolvedValue(null);

    await completeTopUp("pi_unknown");

    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("skips already-completed top-ups", async () => {
    mockFindTopUp.mockResolvedValue({
      id: "topup_1",
      status: "COMPLETED",
      userId: "u1",
      netCreditedCents: 960,
    });

    await completeTopUp("pi_test");

    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("executes transaction to credit wallet and mark completed", async () => {
    mockFindTopUp.mockResolvedValue({
      id: "topup_1",
      status: "PENDING",
      userId: "u1",
      grossAmountCents: 1000,
      platformFeeCents: 40,
      netCreditedCents: 960,
    });

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const txClient = {
        creditWallet: {
          findUnique: jest.fn().mockResolvedValue({
            id: "w1",
            userId: "u1",
            balanceCents: 0,
            totalTopUpCents: 0,
            totalSpentCents: 0,
            totalRewardedCents: 0,
          }),
          update: jest.fn().mockResolvedValue({ balanceCents: 960 }),
          create: jest.fn(),
        },
        creditTransaction: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: "tx1" }),
        },
        creditTopUp: {
          update: jest.fn().mockResolvedValue({}),
        },
      };
      return fn(txClient);
    });

    await completeTopUp("pi_test_abc");

    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });
});

// ── failTopUp ─────────────────────────────────────────────────────────────────

describe("failTopUp", () => {
  it("does nothing when top-up not found", async () => {
    mockFindTopUp.mockResolvedValue(null);

    await failTopUp("pi_unknown");

    expect(mockUpdateTopUp).not.toHaveBeenCalled();
  });

  it("does nothing when already completed", async () => {
    mockFindTopUp.mockResolvedValue({ id: "t1", status: "COMPLETED" });

    await failTopUp("pi_test");

    expect(mockUpdateTopUp).not.toHaveBeenCalled();
  });

  it("does nothing when already failed", async () => {
    mockFindTopUp.mockResolvedValue({ id: "t1", status: "FAILED" });

    await failTopUp("pi_test");

    expect(mockUpdateTopUp).not.toHaveBeenCalled();
  });

  it("marks top-up as failed with reason", async () => {
    mockFindTopUp.mockResolvedValue({
      id: "t1",
      status: "PENDING",
    });
    mockUpdateTopUp.mockResolvedValue({});

    await failTopUp("pi_test", "Card declined");

    expect(mockUpdateTopUp).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: expect.objectContaining({
        status: "FAILED",
        failureReason: "Card declined",
        failedAt: expect.any(Date),
      }),
    });
  });
});

// ── cancelTopUp ───────────────────────────────────────────────────────────────

describe("cancelTopUp", () => {
  it("does nothing when top-up not found", async () => {
    mockFindTopUp.mockResolvedValue(null);

    await cancelTopUp("pi_unknown");

    expect(mockUpdateTopUp).not.toHaveBeenCalled();
  });

  it("does nothing when not PENDING", async () => {
    mockFindTopUp.mockResolvedValue({ id: "t1", status: "COMPLETED" });

    await cancelTopUp("pi_test");

    expect(mockUpdateTopUp).not.toHaveBeenCalled();
  });

  it("marks pending top-up as cancelled", async () => {
    mockFindTopUp.mockResolvedValue({ id: "t1", status: "PENDING" });
    mockUpdateTopUp.mockResolvedValue({});

    await cancelTopUp("pi_test");

    expect(mockUpdateTopUp).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { status: "CANCELLED" },
    });
  });
});

// ── getTopUpHistory ───────────────────────────────────────────────────────────

describe("getTopUpHistory", () => {
  it("returns items with pagination info", async () => {
    const items = [
      { id: "t1", grossAmountCents: 1000, status: "COMPLETED" },
      { id: "t2", grossAmountCents: 2000, status: "COMPLETED" },
    ];
    mockFindManyTopUps.mockResolvedValue(items);

    const result = await getTopUpHistory("u1", { limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.hasMore).toBe(false);
  });

  it("caps limit at 50", async () => {
    mockFindManyTopUps.mockResolvedValue([]);

    await getTopUpHistory("u1", { limit: 200 });

    expect(mockFindManyTopUps).toHaveBeenCalledWith(
      expect.objectContaining({ take: 51 })
    );
  });

  it("detects hasMore correctly", async () => {
    // 4 items for limit 3 → hasMore
    const items = [{ id: "t1" }, { id: "t2" }, { id: "t3" }, { id: "t4" }];
    mockFindManyTopUps.mockResolvedValue(items);

    const result = await getTopUpHistory("u1", { limit: 3 });

    expect(result.hasMore).toBe(true);
    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBe("t3");
  });
});
