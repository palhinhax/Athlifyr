/**
 * @jest-environment node
 */

import { POST as ConnectPOST } from "@/app/api/venues/[id]/stripe/connect/route";
import { POST as OnboardingPOST } from "@/app/api/venues/[id]/stripe/onboarding-link/route";
import { POST as LoginLinkPOST } from "@/app/api/venues/[id]/stripe/login-link/route";
import { GET as StatusGET } from "@/app/api/venues/[id]/stripe/status/route";
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
    venue: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

// Mock Stripe
jest.mock("@/lib/stripe", () => ({
  stripe: {
    accounts: {
      create: jest.fn(),
      retrieve: jest.fn(),
      createLoginLink: jest.fn(),
    },
    accountLinks: { create: jest.fn() },
  },
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

const venueId = "venue-1";
const userId = "user-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };

const makeRequest = (url: string, method = "POST") =>
  new Request(url, { method });

const mockVenue = {
  id: venueId,
  name: "Test Gym",
  slug: "test-gym",
  email: "gym@test.com",
  stripeAccountId: "acct_123",
  stripeOnboardingStatus: "COMPLETE",
  stripeChargesEnabled: true,
  stripePayoutsEnabled: true,
  stripeDetailsSubmitted: true,
  stripeLastWebhookAt: null,
};

// ─── POST /api/venues/[id]/stripe/connect ──────────────────────────────────
describe("POST /api/venues/[id]/stripe/connect", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    expect(res.status).toBe(401);
  });

  it("returns 403 when not authorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    expect(res.status).toBe(403);
  });

  it("returns 404 when venue not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);

    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    expect(res.status).toBe(404);
  });

  it("returns existing account if already connected", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@e.com" } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accounts.retrieve as jest.Mock).mockResolvedValue({
      id: "acct_123",
    });

    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.accountId).toBe("acct_123");
    expect(stripe.accounts.create).not.toHaveBeenCalled();
  });

  it("creates new account when none exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@e.com" } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });
    (stripe.accounts.create as jest.Mock).mockResolvedValue({
      id: "acct_new",
    });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});

    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.accountId).toBe("acct_new");
    expect(prisma.venue.update).toHaveBeenCalledWith({
      where: { id: venueId },
      data: expect.objectContaining({
        stripeAccountId: "acct_new",
        stripeOnboardingStatus: "PENDING",
      }),
    });
  });

  it("recreates account when existing Stripe account is revoked", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@e.com" } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    // Stripe retrieve throws (account revoked)
    (stripe.accounts.retrieve as jest.Mock).mockRejectedValue(
      new Error("No such account")
    );
    // Reset clears old data
    (prisma.venue.update as jest.Mock).mockResolvedValue({});
    // New account creation
    (stripe.accounts.create as jest.Mock).mockResolvedValue({
      id: "acct_replacement",
    });

    const res = (await ConnectPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/connect`),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.accountId).toBe("acct_replacement");
    // Should have been called twice: once to reset, once to save new ID
    expect(prisma.venue.update).toHaveBeenCalledTimes(2);
  });
});

// ─── POST /api/venues/[id]/stripe/onboarding-link ──────────────────────────
describe("POST /api/venues/[id]/stripe/onboarding-link", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await OnboardingPOST(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/onboarding-link`
      ),
      makeParams()
    ))!;
    expect(res.status).toBe(401);
  });

  it("returns 403 when not authorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await OnboardingPOST(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/onboarding-link`
      ),
      makeParams()
    ))!;
    expect(res.status).toBe(403);
  });

  it("returns 400 when no Stripe account exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });

    const res = (await OnboardingPOST(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/onboarding-link`
      ),
      makeParams()
    ))!;
    expect(res.status).toBe(400);
  });

  it("returns onboarding link URL", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accountLinks.create as jest.Mock).mockResolvedValue({
      url: "https://stripe.com/onboarding",
    });

    const res = (await OnboardingPOST(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/onboarding-link`
      ),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe("https://stripe.com/onboarding");
  });
});

// ─── POST /api/venues/[id]/stripe/login-link ───────────────────────────────
describe("POST /api/venues/[id]/stripe/login-link", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await LoginLinkPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/login-link`),
      makeParams()
    ))!;
    expect(res.status).toBe(401);
  });

  it("returns 403 when not authorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await LoginLinkPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/login-link`),
      makeParams()
    ))!;
    expect(res.status).toBe(403);
  });

  it("returns 400 when no Stripe account", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });

    const res = (await LoginLinkPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/login-link`),
      makeParams()
    ))!;
    expect(res.status).toBe(400);
  });

  it("returns login link URL", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accounts.createLoginLink as jest.Mock).mockResolvedValue({
      url: "https://stripe.com/dashboard",
    });

    const res = (await LoginLinkPOST(
      makeRequest(`http://localhost/api/venues/${venueId}/stripe/login-link`),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe("https://stripe.com/dashboard");
  });
});

// ─── GET /api/venues/[id]/stripe/status ────────────────────────────────────
describe("GET /api/venues/[id]/stripe/status", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    expect(res.status).toBe(401);
  });

  it("returns 403 when not authorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    expect(res.status).toBe(403);
  });

  it("returns NOT_STARTED when no Stripe account", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      ...mockVenue,
      stripeAccountId: null,
    });

    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.onboardingStatus).toBe("NOT_STARTED");
    expect(body.accountId).toBeNull();
  });

  it("returns COMPLETE status when charges/payouts enabled", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accounts.retrieve as jest.Mock).mockResolvedValue({
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      requirements: {},
    });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});

    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.onboardingStatus).toBe("COMPLETE");
    expect(body.chargesEnabled).toBe(true);
    expect(body.payoutsEnabled).toBe(true);
  });

  it("returns RESTRICTED when disabled_reason is set", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accounts.retrieve as jest.Mock).mockResolvedValue({
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: true,
      requirements: { disabled_reason: "listed" },
    });
    (prisma.venue.update as jest.Mock).mockResolvedValue({});

    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.onboardingStatus).toBe("RESTRICTED");
  });

  it("resets account when Stripe account is revoked", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(mockVenue);
    (stripe.accounts.retrieve as jest.Mock).mockRejectedValue(
      new Error("No such account")
    );
    (prisma.venue.update as jest.Mock).mockResolvedValue({});

    const res = (await StatusGET(
      makeRequest(
        `http://localhost/api/venues/${venueId}/stripe/status`,
        "GET"
      ),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.onboardingStatus).toBe("NOT_STARTED");
    expect(body.accountId).toBeNull();
    expect(prisma.venue.update).toHaveBeenCalledWith({
      where: { id: venueId },
      data: expect.objectContaining({
        stripeAccountId: null,
        stripeOnboardingStatus: "NOT_STARTED",
      }),
    });
  });
});
