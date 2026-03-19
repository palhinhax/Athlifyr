/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/purchases/[purchaseId]/confirm/route";
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
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      retrieve: jest.fn(),
    },
  },
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
    `http://localhost/api/venues/${venueId}/purchases/${purchaseId}/confirm`,
    { method: "POST" }
  );

describe("POST /api/venues/[id]/purchases/[purchaseId]/confirm", () => {
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

  it("returns 404 when purchase not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Purchase not found or already confirmed");
    expect(prisma.venueProductPurchase.findFirst).toHaveBeenCalledWith({
      where: {
        id: purchaseId,
        venueId,
        userId,
        status: "CREATED",
      },
    });
  });

  it("returns 400 when payment intent not yet succeeded", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 1,
      stripePaymentIntentId: "pi_123",
      status: "CREATED",
    });
    (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
      status: "processing",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Payment not yet succeeded");
    expect(prisma.venueProductPurchase.update).not.toHaveBeenCalled();
  });

  it("confirms purchase when payment has succeeded", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 2,
      stripePaymentIntentId: "pi_123",
      status: "CREATED",
    });
    (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
      status: "succeeded",
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({
      id: purchaseId,
      status: "CONFIRMED",
    });
    (prisma.venueProduct.findUnique as jest.Mock).mockResolvedValue({
      stock: 10,
    });
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.venueProductPurchase.update).toHaveBeenCalledWith({
      where: { id: purchaseId },
      data: {
        status: "CONFIRMED",
        confirmedAt: expect.any(Date),
      },
    });
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { stock: { decrement: 2 } },
    });
  });

  it("confirms purchase without decrementing stock when stock is null", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 1,
      stripePaymentIntentId: "pi_456",
      status: "CREATED",
    });
    (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
      status: "succeeded",
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({
      id: purchaseId,
      status: "CONFIRMED",
    });
    (prisma.venueProduct.findUnique as jest.Mock).mockResolvedValue({
      stock: null,
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.venueProduct.update).not.toHaveBeenCalled();
  });

  it("confirms purchase without Stripe verification when no paymentIntentId", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockResolvedValue({
      id: purchaseId,
      venueId,
      productId,
      quantity: 1,
      stripePaymentIntentId: null,
      status: "CREATED",
    });
    (prisma.venueProductPurchase.update as jest.Mock).mockResolvedValue({
      id: purchaseId,
      status: "CONFIRMED",
    });
    (prisma.venueProduct.findUnique as jest.Mock).mockResolvedValue({
      stock: null,
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueProductPurchase.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to confirm purchase");
  });
});
