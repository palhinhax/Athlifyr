/**
 * @jest-environment node
 */

import { POST } from "@/app/api/admin/credits/refund/route";
import { auth } from "@/lib/auth";
import * as credits from "@/lib/credits";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/credits", () => ({ refundCreditPurchase: jest.fn() }));

const mockAuth = auth as jest.Mock;
const mockRefund = credits.refundCreditPurchase as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const makeReq = (body: object) =>
  new Request("http://localhost/api/admin/credits/refund", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const adminSession = { user: { id: "admin1", role: "ADMIN" } };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/admin/credits/refund", () => {
  it("returns 401 for unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq({ purchaseId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 for non-admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    const res = await POST(makeReq({ purchaseId: "p1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when purchaseId is missing", async () => {
    mockAuth.mockResolvedValue(adminSession);
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("purchaseId");
  });

  it("returns 400 for invalid partialAmountCents", async () => {
    mockAuth.mockResolvedValue(adminSession);
    const res = await POST(
      makeReq({ purchaseId: "p1", partialAmountCents: -50 })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("partialAmountCents");
  });

  it("returns 400 for non-integer partialAmountCents", async () => {
    mockAuth.mockResolvedValue(adminSession);
    const res = await POST(
      makeReq({ purchaseId: "p1", partialAmountCents: 5.5 })
    );
    expect(res.status).toBe(400);
  });

  it("successfully refunds a purchase", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRefund.mockResolvedValue({
      refundedAmountCents: 500,
      newBalanceCents: 1500,
    });

    const res = await POST(makeReq({ purchaseId: "p1", note: "Refund test" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.refundedAmountCents).toBe(500);
    expect(mockRefund).toHaveBeenCalledWith({
      purchaseId: "p1",
      adminUserId: "admin1",
      adminNote: "Refund test",
      partialAmountCents: undefined,
    });
  });

  it("successfully refunds with partial amount", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRefund.mockResolvedValue({
      refundedAmountCents: 250,
      newBalanceCents: 1250,
    });

    const res = await POST(
      makeReq({ purchaseId: "p1", partialAmountCents: 250 })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.refundedAmountCents).toBe(250);
  });

  it("returns 500 with error message on service failure", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRefund.mockRejectedValue(new Error("Purchase already refunded"));

    const res = await POST(makeReq({ purchaseId: "p1" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Purchase already refunded");
  });

  it("returns generic error for non-Error exceptions", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockRefund.mockRejectedValue("unexpected");

    const res = await POST(makeReq({ purchaseId: "p1" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to refund credit purchase");
  });
});
