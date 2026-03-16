/**
 * @jest-environment node
 */

import { POST } from "@/app/api/credits/purchase/route";
import { getAuthUser } from "@/lib/auth-utils";
import * as credits from "@/lib/credits";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({ getAuthUser: jest.fn() }));
jest.mock("@/lib/credits", () => ({
  purchaseWithCredits: jest.fn(),
  InsufficientCreditsError: class InsufficientCreditsError extends Error {
    currentBalanceCents: number;
    requiredAmountCents: number;
    constructor(current: number, required: number) {
      super("Insufficient credits");
      this.currentBalanceCents = current;
      this.requiredAmountCents = required;
    }
  },
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockPurchase = credits.purchaseWithCredits as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const makeReq = (body: object) =>
  new Request("http://localhost/api/credits/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/credits/purchase", () => {
  it("returns 401 for unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await POST(makeReq({ venueId: "v1", productId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when venueId is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const res = await POST(makeReq({ productId: "p1" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("venueId");
  });

  it("returns 400 when productId is missing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const res = await POST(makeReq({ venueId: "v1" }));
    expect(res.status).toBe(400);
  });

  it("successfully purchases with credits", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockResolvedValue({
      purchaseId: "pur1",
      amountCents: 500,
      newBalanceCents: 1500,
    });

    const res = await POST(
      makeReq({ venueId: "v1", productId: "p1", quantity: 2 })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.purchaseId).toBe("pur1");
    expect(mockPurchase).toHaveBeenCalledWith({
      userId: "u1",
      venueId: "v1",
      productId: "p1",
      quantity: 2,
    });
  });

  it("defaults quantity to 1 when invalid", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockResolvedValue({
      purchaseId: "pur1",
      amountCents: 500,
      newBalanceCents: 1500,
    });

    await POST(makeReq({ venueId: "v1", productId: "p1", quantity: -1 }));
    expect(mockPurchase).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1 })
    );
  });

  it("defaults quantity to 1 when not a number", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockResolvedValue({
      purchaseId: "pur1",
      amountCents: 500,
      newBalanceCents: 1500,
    });

    await POST(
      makeReq({ venueId: "v1", productId: "p1", quantity: "invalid" })
    );
    expect(mockPurchase).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1 })
    );
  });

  it("returns 402 for insufficient credits", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockRejectedValue(
      new credits.InsufficientCreditsError(200, 500)
    );

    const res = await POST(makeReq({ venueId: "v1", productId: "p1" }));
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.error).toBe("Insufficient credits");
    expect(body.currentBalanceCents).toBe(200);
    expect(body.requiredAmountCents).toBe(500);
  });

  it("returns 500 with error message on service failure", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockRejectedValue(new Error("Product not found"));

    const res = await POST(makeReq({ venueId: "v1", productId: "p1" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Product not found");
  });

  it("returns generic error for non-Error exceptions", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockPurchase.mockRejectedValue("unexpected");

    const res = await POST(makeReq({ venueId: "v1", productId: "p1" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to process purchase");
  });
});
