/**
 * @jest-environment node
 */

import { POST } from "@/app/api/venues/[id]/stripe-subscriptions/confirm/route";
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
      retrieve: jest.fn(),
    },
  },
}));

// Mock calculatePlanEndDate
jest.mock("@/types/venue-plan", () => ({
  calculatePlanEndDate: jest.fn(() => new Date("2026-04-15")),
}));

const venueId = "venue-1";
const userId = "user-1";
const stripeSubscriptionId = "sub_stripe_abc";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };
const makeRequest = (body: object = { stripeSubscriptionId }) =>
  new Request(
    `http://localhost/api/venues/${venueId}/stripe-subscriptions/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

describe("POST /api/venues/[id]/stripe-subscriptions/confirm", () => {
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

  it("returns 400 when stripeSubscriptionId is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });

    const res = await POST(makeRequest({}), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("stripeSubscriptionId is required");
  });

  it("returns 404 when subscription not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Subscription not found");
  });

  it("returns idempotently when subscription already active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    const existingSub = {
      id: "sub-local-1",
      status: "ACTIVE",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    };
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(
      existingSub
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(existingSub);
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled();
    expect(prisma.venueSubscription.update).not.toHaveBeenCalled();
  });

  it("returns 400 when Stripe subscription is not active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "incomplete",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Stripe subscription is not active yet");
    expect(prisma.venueSubscription.update).not.toHaveBeenCalled();
  });

  it("activates subscription when Stripe subscription is active", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: {
        id: "plan-1",
        name: "Monthly",
        policy: { duration: "MONTHLY", durationValue: 1 },
      },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "active",
    });
    const updated = {
      id: "sub-local-1",
      status: "ACTIVE",
      paymentStatus: "PAID",
    };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(updated);
    expect(prisma.venueSubscription.update).toHaveBeenCalledWith({
      where: { id: "sub-local-1" },
      data: {
        status: "ACTIVE",
        paymentStatus: "PAID",
        paymentConfirmedAt: expect.any(Date),
        startsAt: expect.any(Date),
        endsAt: expect.any(Date),
      },
    });
  });

  it("activates subscription when Stripe subscription is trialing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-local-1",
      status: "PENDING",
      plan: { id: "plan-1", name: "Monthly", policy: null },
    });
    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      status: "trialing",
    });
    const updated = {
      id: "sub-local-1",
      status: "ACTIVE",
    };
    (prisma.venueSubscription.update as jest.Mock).mockResolvedValue(updated);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscription).toEqual(updated);
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    (prisma.venueSubscription.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to confirm subscription");
  });
});
