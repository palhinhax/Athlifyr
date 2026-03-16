import {
  getVenuePendingBalance,
  getVenueSettlementHistory,
  executeWeeklySettlement,
  retrySettlement,
  settleVenueManually,
} from "@/lib/credits/settlement-service";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueLedgerEntry: {
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
    venueSettlementBatch: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    venue: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    transfers: {
      create: jest.fn(),
    },
  },
}));

const mockAggregate = prisma.venueLedgerEntry.aggregate as jest.Mock;
const mockGroupBy = prisma.venueLedgerEntry.groupBy as jest.Mock;
const mockFindFirstLedger = prisma.venueLedgerEntry.findFirst as jest.Mock;
const mockFindManyBatches = prisma.venueSettlementBatch.findMany as jest.Mock;
const mockFindBatch = prisma.venueSettlementBatch.findUnique as jest.Mock;
const mockFindVenue = prisma.venue.findUnique as jest.Mock;
const mockTransaction = prisma.$transaction as jest.Mock;
const mockStripeTransfer = stripe.transfers.create as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── getVenuePendingBalance ────────────────────────────────────────────────────

describe("getVenuePendingBalance", () => {
  it("returns pending amount and count", async () => {
    mockAggregate.mockResolvedValue({
      _sum: { amountCents: 15000 },
      _count: { id: 5 },
    });

    const result = await getVenuePendingBalance("v1");

    expect(result).toEqual({
      pendingAmountCents: 15000,
      pendingEntriesCount: 5,
    });
    expect(mockAggregate).toHaveBeenCalledWith({
      where: { venueId: "v1", status: "PENDING" },
      _sum: { amountCents: true },
      _count: { id: true },
    });
  });

  it("returns 0 when no pending entries", async () => {
    mockAggregate.mockResolvedValue({
      _sum: { amountCents: null },
      _count: { id: 0 },
    });

    const result = await getVenuePendingBalance("v1");

    expect(result).toEqual({
      pendingAmountCents: 0,
      pendingEntriesCount: 0,
    });
  });
});

// ── getVenueSettlementHistory ─────────────────────────────────────────────────

describe("getVenueSettlementHistory", () => {
  it("returns batches with pagination", async () => {
    const batches = [
      { id: "b1", totalAmountCents: 5000, status: "COMPLETED" },
      { id: "b2", totalAmountCents: 3000, status: "COMPLETED" },
    ];
    mockFindManyBatches.mockResolvedValue(batches);

    const result = await getVenueSettlementHistory("v1", { limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.hasMore).toBe(false);
  });

  it("caps limit at 50", async () => {
    mockFindManyBatches.mockResolvedValue([]);

    await getVenueSettlementHistory("v1", { limit: 100 });

    expect(mockFindManyBatches).toHaveBeenCalledWith(
      expect.objectContaining({ take: 51 })
    );
  });

  it("detects hasMore", async () => {
    const batches = [{ id: "b1" }, { id: "b2" }, { id: "b3" }, { id: "b4" }];
    mockFindManyBatches.mockResolvedValue(batches);

    const result = await getVenueSettlementHistory("v1", { limit: 3 });

    expect(result.hasMore).toBe(true);
    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBe("b3");
  });
});

// ── executeWeeklySettlement ───────────────────────────────────────────────────

describe("executeWeeklySettlement", () => {
  it("returns empty results when no venues have pending entries", async () => {
    mockGroupBy.mockResolvedValue([]);

    const result = await executeWeeklySettlement();

    expect(result).toEqual({
      processedVenues: 0,
      totalTransferred: 0,
      errors: [],
    });
  });

  it("skips venues with 0 pending amount", async () => {
    mockGroupBy.mockResolvedValue([
      { venueId: "v1", _sum: { amountCents: 0 }, _count: { id: 2 } },
    ]);

    const result = await executeWeeklySettlement();

    expect(result.processedVenues).toBe(0);
    expect(mockFindVenue).not.toHaveBeenCalled();
  });

  it("processes valid venues and counts totals", async () => {
    mockGroupBy.mockResolvedValue([
      { venueId: "v1", _sum: { amountCents: 5000 }, _count: { id: 3 } },
    ]);

    mockFindVenue.mockResolvedValue({
      id: "v1",
      name: "Test Gym",
      stripeAccountId: "acct_test",
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
    });

    mockFindBatch.mockResolvedValue(null);
    mockStripeTransfer.mockResolvedValue({ id: "tr_test" });

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const txClient = {
        venueSettlementBatch: {
          create: jest.fn().mockResolvedValue({
            id: "batch_1",
            retryCount: 0,
          }),
          update: jest.fn(),
        },
        venueLedgerEntry: {
          updateMany: jest.fn(),
        },
      };
      return fn(txClient);
    });

    const result = await executeWeeklySettlement();

    expect(result.processedVenues).toBe(1);
    expect(result.totalTransferred).toBe(5000);
    expect(result.errors).toHaveLength(0);
  });

  it("captures errors for failing venues", async () => {
    mockGroupBy.mockResolvedValue([
      { venueId: "v_fail", _sum: { amountCents: 2000 }, _count: { id: 1 } },
    ]);

    mockFindVenue.mockResolvedValue(null);
    mockFindBatch.mockResolvedValue(null);

    // settleVenue should throw because venue is not found
    mockTransaction.mockRejectedValue(new Error("Venue v_fail not found"));

    const result = await executeWeeklySettlement();

    expect(result.processedVenues).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].venueId).toBe("v_fail");
  });
});

// ── retrySettlement ───────────────────────────────────────────────────────────

describe("retrySettlement", () => {
  it("throws if batch not found", async () => {
    mockFindBatch.mockResolvedValue(null);

    await expect(retrySettlement("batch_unknown")).rejects.toThrow(
      "Settlement batch not found"
    );
  });

  it("throws if batch is not FAILED", async () => {
    mockFindBatch.mockResolvedValue({
      id: "b1",
      status: "COMPLETED",
      venueId: "v1",
    });

    await expect(retrySettlement("b1")).rejects.toThrow(
      "Can only retry failed settlements"
    );
  });
});

// ── settleVenueManually ───────────────────────────────────────────────────────

describe("settleVenueManually", () => {
  it("throws if no pending balance", async () => {
    mockAggregate.mockResolvedValue({
      _sum: { amountCents: 0 },
      _count: { id: 0 },
    });

    await expect(settleVenueManually("v1")).rejects.toThrow(
      "No pending balance to settle"
    );
  });

  it("settles venue with pending entries", async () => {
    mockAggregate.mockResolvedValue({
      _sum: { amountCents: 8000 },
      _count: { id: 4 },
    });

    mockFindFirstLedger.mockResolvedValue({
      createdAt: new Date("2026-03-10"),
    });

    mockFindVenue.mockResolvedValue({
      id: "v1",
      name: "Test Gym",
      stripeAccountId: "acct_test",
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
    });

    mockFindBatch.mockResolvedValue(null);
    mockStripeTransfer.mockResolvedValue({ id: "tr_manual" });

    mockTransaction.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const txClient = {
        venueSettlementBatch: {
          create: jest.fn().mockResolvedValue({
            id: "batch_manual",
            retryCount: 0,
          }),
          update: jest.fn(),
        },
        venueLedgerEntry: {
          updateMany: jest.fn(),
        },
      };
      return fn(txClient);
    });

    await expect(settleVenueManually("v1")).resolves.not.toThrow();
  });
});
