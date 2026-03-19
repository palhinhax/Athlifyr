/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/stripe-subscriptions/[subscriptionId]/cancel/route";
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
    venueSubscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    subscriptions: {
      update: jest.fn(),
    },
  },
}));

const venueId = "venue-1";
const subscriptionId = "sub-local-1";
const userId = "user-1";
const stripeSubscriptionId = "sub_stripe_123";

const makeParams = () =>
  ({
    params: Promise.resolve({ id: venueId, subscriptionId }),
  }) as {
    params: Promise<{ id: string; subscriptionId: string }>;
  };
const makeRequest = () =>
  new Request(
    `http://localhost/api/venues/${venueId}/stripe-subscriptions/${subscriptionId}/cancel`,
    { method: "POST" }
  );

describe("POST /api/venues/[id]/stripe-subscriptions/[subscriptionId]/cancel", () => {
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

  it("returns 404 when subscription not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Subscription not found");
    expect(stripe.subscriptions.update).not.toHaveBeenCalled();
  });

  it("cancels subscription at period end", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: subscriptionId,
      venueId,
      userId,
      status: "ACTIVE",
      stripeSubscriptionId,
    });
    (stripe.subscriptions.update as jest.Mock).mockResolvedValue({});
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue({
      id: subscriptionId,
      status: "CANCELLING",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(stripe.subscriptions.update).toHaveBeenCalledWith(
      stripeSubscriptionId,
      { cancel_at_period_end: true }
    );
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: subscriptionId },
      data: { status: "CANCELLING" },
    });
  });

  it("queries subscription with correct filters", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    await POST(makeRequest(), makeParams());

    expect(prisma.venueSubscription.findFirst).toHaveBeenCalledWith({
      where: {
        id: subscriptionId,
        venueId,
        userId,
        status: "ACTIVE",
        stripeSubscriptionId: { not: null },
      },
    });
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel subscription");
  });

  it("returns 500 on Stripe error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: subscriptionId,
      venueId,
      userId,
      status: "ACTIVE",
      stripeSubscriptionId,
    });
    (stripe.subscriptions.update as jest.Mock).mockRejectedValue(
      new Error("Stripe error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel subscription");
  });
});
