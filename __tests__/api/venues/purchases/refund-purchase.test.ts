/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/purchases/[purchaseId]/refund/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueProductPurchase: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    venueProduct: {
      update: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    refunds: {
      create: jest.fn(),
    },
  },
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

const venueId = "venue-1";
const purchaseId = "purchase-1";
const userId = "user-1";
const productId = "product-1";

const makeParams = () =>
  ({
    params: Promise.resolve({ id: venueId, purchaseId }),
  }) as {
    params: Promise<{ id: string; purchaseId: string }>;
  };
const makeRequest = () =>
  new Request(
    `http://localhost/api/venues/${venueId}/purchases/${purchaseId}/refund`,
    { method: "POST" }
  );

describe("POST /api/venues/[id]/purchases/[purchaseId]/refund", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProductPurchase.findFirst).not.toHaveBeenCalled();
  });

  it("returns 404 when purchase not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Purchase not found");
  });

  it("returns 400 when purchase is already refunded", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      status: "REFUNDED",
      product: { name: "Test", stock: null },
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Purchase already refunded");
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("returns 400 when purchase is not confirmed", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      status: "CREATED",
      product: { name: "Test", stock: null },
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Only confirmed purchases can be refunded");
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("returns 400 when no Stripe PaymentIntent associated", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      status: "CONFIRMED",
      stripePaymentIntentId: null,
      product: { name: "Test", stock: null },
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("No Stripe PaymentIntent associated");
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("processes refund successfully without stock restoration", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 2,
      status: "CONFIRMED",
      stripePaymentIntentId: "pi_123",
      product: { name: "Test", stock: null },
    });
    (stripe.refunds.create as jest.Mock).mockResolvedValue({ id: "re_123" });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({
      id: purchaseId,
      status: "REFUNDED",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(stripe.refunds.create).toHaveBeenCalledWith({
      payment_intent: "pi_123",
      reverse_transfer: true,
      refund_application_fee: true,
    });
    expect(prisma.venueProductPurchase.update).toHaveBeenCalledWith({
      where: { id: purchaseId },
      data: { status: "REFUNDED" },
    });
    expect(prisma.venueProduct.update).not.toHaveBeenCalled();
  });

  it("restores stock on refund when product has tracked stock", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 3,
      status: "CONFIRMED",
      stripePaymentIntentId: "pi_456",
      product: { name: "Test", stock: 10 },
    });
    (stripe.refunds.create as jest.Mock).mockResolvedValue({ id: "re_456" });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({});
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { stock: { increment: 3 } },
    });
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to process refund");
  });
});
