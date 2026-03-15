/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/products/[productId]/purchase/route";
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
    venue: { findUnique: jest.fn() },
    venueProduct: { findFirst: jest.fn() },
    venueProductPurchase: { create: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: { create: jest.fn(), update: jest.fn() },
  },
  toStripeAmount: (n: number) => Math.round(n * 100),
}));

const venueId = "venue-1";
const productId = "product-1";
const userId = "user-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId, productId }) }) as {
    params: Promise<{ id: string; productId: string }>;
  };

const makeRequest = (body: object = {}) =>
  new Request(
    `http://localhost/api/venues/${venueId}/products/${productId}/purchase`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

const mockVenue = {
  id: venueId,
  name: "Test Gym",
  isActive: true,
  paymentMode: "IN_APP",
  stripeAccountId: "acct_123",
  stripeOnboardingStatus: "COMPLETE",
  commissionType: "PERCENT",
  commissionValue: 10,
};

const mockProduct = {
  id: productId,
  venueId,
  name: "Protein Bar",
  price: 5,
  currency: "EUR",
  isActive: true,
  stock: 10,
};

describe("POST /api/venues/[id]/products/[productId]/purchase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 when quantity is zero", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const res = (await POST(makeRequest({ quantity: 0 }), makeParams()))!;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Quantity must be a positive integer",
    });
  });

  it("returns 400 when quantity is negative", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const res = (await POST(makeRequest({ quantity: -1 }), makeParams()))!;
    expect(res.status).toBe(400);
  });

  it("returns 400 when quantity is not an integer", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const res = (await POST(makeRequest({ quantity: 1.5 }), makeParams()))!;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Quantity must be a positive integer",
    });
  });

  it("defaults quantity to 1 if not provided", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(mockProduct);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
      metadata: {},
    });
    (prisma.venueProductPurchase.create as jest.Mock).mockResolvedValue({
      id: "purchase-1",
    });
    (stripe.paymentIntents.update as jest.Mock).mockResolvedValue({});

    const res = (await POST(makeRequest({}), makeParams()))!;
    expect(res.status).toBe(201);

    // quantity defaults to 1, so totalAmount = 5 * 1 = 5
    expect(prisma.venueProductPurchase.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        quantity: 1,
        unitPrice: 5,
        totalAmount: 5,
      }),
    });
  });

  it("returns 404 when venue not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Venue not found" });
  });

  it("returns 404 when venue is inactive", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      isActive: false,
    });

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(404);
  });

  it("returns 400 when venue payment mode is EXTERNAL", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      paymentMode: "EXTERNAL",
    });

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue does not support IN_APP payments",
    });
  });

  it("returns 400 when Stripe not fully configured", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Venue Stripe account is not fully configured",
    });
  });

  it("returns 404 when product not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(null);

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Product not found" });
  });

  it("returns 400 when insufficient stock", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      ...mockProduct,
      stock: 2,
    });

    const res = (await POST(makeRequest({ quantity: 5 }), makeParams()))!;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Insufficient stock" });
  });

  it("allows purchase when stock is null (unlimited)", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      ...mockProduct,
      stock: null,
    });
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
      metadata: {},
    });
    (prisma.venueProductPurchase.create as jest.Mock).mockResolvedValue({
      id: "purchase-1",
    });
    (stripe.paymentIntents.update as jest.Mock).mockResolvedValue({});

    const res = (await POST(makeRequest({ quantity: 100 }), makeParams()))!;
    expect(res.status).toBe(201);
  });

  it("creates purchase successfully with correct amounts", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(mockProduct);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
      metadata: { type: "product_purchase" },
    });
    (prisma.venueProductPurchase.create as jest.Mock).mockResolvedValue({
      id: "purchase-1",
    });
    (stripe.paymentIntents.update as jest.Mock).mockResolvedValue({});

    const res = (await POST(makeRequest({ quantity: 3 }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.clientSecret).toBe("pi_secret");
    expect(body.purchase.id).toBe("purchase-1");

    // price=5, qty=3 → total=15 → 1500 cents; commission=10% → 150 cents
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 1500,
        currency: "eur",
        application_fee_amount: 150,
        transfer_data: { destination: "acct_123" },
      })
    );

    expect(prisma.venueProductPurchase.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        venueId,
        productId,
        userId,
        quantity: 3,
        unitPrice: 5,
        totalAmount: 15,
        currency: "EUR",
        status: "CREATED",
        stripePaymentIntentId: "pi_123",
      }),
    });

    // Verify PI update with purchaseId
    expect(stripe.paymentIntents.update).toHaveBeenCalledWith("pi_123", {
      metadata: expect.objectContaining({ purchaseId: "purchase-1" }),
    });
  });

  it("handles FIXED commission", async () => {
    mockAuth.mockResolvedValue({
      user: { id: userId, email: "u@e.com" },
    });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      commissionType: "FIXED",
      commissionValue: 100,
    });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(mockProduct);
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      id: "pi_123",
      client_secret: "pi_secret",
      metadata: {},
    });
    (prisma.venueProductPurchase.create as jest.Mock).mockResolvedValue({
      id: "purchase-1",
    });
    (stripe.paymentIntents.update as jest.Mock).mockResolvedValue({});

    const res = (await POST(makeRequest({}), makeParams()))!;
    expect(res.status).toBe(201);

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        application_fee_amount: 100,
      })
    );
  });

  it("returns 500 on unexpected error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venue.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB crash")
    );

    const res = (await POST(makeRequest(), makeParams()))!;
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to create purchase",
    });
  });
});
