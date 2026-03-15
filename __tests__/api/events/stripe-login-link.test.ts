/**
 * @jest-environment node
 */

import { POST } from "@/app/api/events/[id]/stripe/login-link/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Mock auth helpers
const mockGetAuthenticatedUser = jest.fn();
jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: () => mockGetAuthenticatedUser(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    accounts: { createLoginLink: jest.fn() },
  },
}));

// Mock event permissions
const mockGetUserEventContext = jest.fn();
const mockHasEventPermission = jest.fn();
jest.mock("@/lib/event-permissions", () => ({
  getUserEventContext: (...args: unknown[]) => mockGetUserEventContext(...args),
  hasEventPermission: (...args: unknown[]) => mockHasEventPermission(...args),
}));

const eventId = "event-1";
const userId = "user-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: eventId }) }) as {
    params: Promise<{ id: string }>;
  };

const makeRequest = () =>
  new Request(`http://localhost/api/events/${eventId}/stripe/login-link`, {
    method: "POST",
  });

describe("POST /api/events/[id]/stripe/login-link", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when event not found", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({ id: userId, role: "USER" });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 403 when user lacks manage_stripe permission", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({ id: userId, role: "USER" });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: eventId,
      stripeAccountId: "acct_123",
    });
    mockGetUserEventContext.mockResolvedValue({});
    mockHasEventPermission.mockReturnValue(false);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(403);
  });

  it("returns 400 when event has no Stripe account", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({ id: userId, role: "ADMIN" });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: eventId,
      stripeAccountId: null,
    });
    mockGetUserEventContext.mockResolvedValue({});
    mockHasEventPermission.mockReturnValue(true);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "No Stripe account found",
    });
  });

  it("returns login link URL when authorized", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({ id: userId, role: "ADMIN" });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: eventId,
      stripeAccountId: "acct_event_123",
    });
    mockGetUserEventContext.mockResolvedValue({});
    mockHasEventPermission.mockReturnValue(true);
    (stripe.accounts.createLoginLink as jest.Mock).mockResolvedValue({
      url: "https://stripe.com/event-dashboard",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe("https://stripe.com/event-dashboard");
    expect(stripe.accounts.createLoginLink).toHaveBeenCalledWith(
      "acct_event_123"
    );
  });

  it("returns 500 on unexpected error", async () => {
    mockGetAuthenticatedUser.mockResolvedValue({ id: userId, role: "ADMIN" });
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB crash")
    );

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(500);
  });
});
