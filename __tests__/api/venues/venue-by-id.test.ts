/**
 * @jest-environment node
 */

import { GET } from "@/app/api/venues/[id]/route";

// Mock auth-utils
const mockGetAuthUser = jest.fn();
jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: (...args: unknown[]) => mockGetAuthUser(...args),
}));

// Mock authorization
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: jest.fn(),
}));

// Mock subscription-utils
const mockHasActiveSubscription = jest.fn();
jest.mock("@/lib/venues/subscription-utils", () => ({
  hasActiveSubscription: (...args: unknown[]) =>
    mockHasActiveSubscription(...args),
}));

// Mock prisma
const mockFindFirst = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCount = jest.fn();
const mockGroupBy = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: { findFirst: (...args: unknown[]) => mockFindFirst(...args) },
    venueSubscription: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      groupBy: (...args: unknown[]) => mockGroupBy(...args),
    },
    venuePlanVenue: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
    venueBooking: { count: (...args: unknown[]) => mockCount(...args) },
    venueMember: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

const makeParams = () =>
  ({ params: Promise.resolve({ id: "venue-1" }) }) as {
    params: Promise<{ id: string }>;
  };

function makeVenue(overrides?: Record<string, unknown>) {
  return {
    id: "venue-1",
    name: "Test Venue",
    slug: "test-venue",
    requiresPlanToBook: true,
    members: [],
    plans: [],
    _count: { sessions: 0, bookings: 0 },
    ...overrides,
  };
}

describe("GET /api/venues/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockGroupBy.mockResolvedValue([]);
    mockFindMany.mockResolvedValue([]);
    mockFindUnique.mockResolvedValue(null);
    mockCount.mockResolvedValue(0);
  });

  it("returns 404 when venue is not found", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockFindFirst.mockResolvedValue(null);

    const req = new Request("http://localhost/api/venues/nonexistent");
    const res = await GET(req, makeParams());
    expect(res.status).toBe(404);
  });

  it("returns venue for unauthenticated user", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockFindFirst.mockResolvedValue(makeVenue());

    const req = new Request("http://localhost/api/venues/venue-1");
    const res = await GET(req, makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Test Venue");
    expect(body.userSubscriptionStatus).toBeNull();
  });

  it("uses ??= to fall back to hasActiveSubscription when resolveUserSubscriptionStatus returns null", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user-1" });
    // requiresPlanToBook = true, no members → resolveUserSubscriptionStatus returns null
    mockFindFirst.mockResolvedValue(makeVenue({ members: [] }));
    mockHasActiveSubscription.mockResolvedValue({
      hasSubscription: true,
      reason: "active_plan",
      subscriptionCount: 1,
    });

    const req = new Request("http://localhost/api/venues/venue-1");
    const res = await GET(req, makeParams());
    expect(res.status).toBe(200);

    // hasActiveSubscription should have been called (??= path)
    expect(mockHasActiveSubscription).toHaveBeenCalledWith("user-1", "venue-1");

    const body = await res.json();
    expect(body.userSubscriptionStatus.hasSubscription).toBe(true);
    expect(body.userSubscriptionStatus.reason).toBe("active_plan");
  });

  it("skips hasActiveSubscription when resolveUserSubscriptionStatus returns a value", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user-1" });
    // requiresPlanToBook = false → resolveUserSubscriptionStatus returns non-null
    mockFindFirst.mockResolvedValue(
      makeVenue({ requiresPlanToBook: false, members: [] })
    );

    const req = new Request("http://localhost/api/venues/venue-1");
    const res = await GET(req, makeParams());
    expect(res.status).toBe(200);

    // hasActiveSubscription should NOT be called (??= skipped)
    expect(mockHasActiveSubscription).not.toHaveBeenCalled();

    const body = await res.json();
    expect(body.userSubscriptionStatus.hasSubscription).toBe(true);
    expect(body.userSubscriptionStatus.reason).toBe("no_plan_required");
  });

  it("returns userSubscriptionStatus for venue member (OWNER)", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "user-1" });
    mockFindFirst.mockResolvedValue(
      makeVenue({
        requiresPlanToBook: true,
        members: [{ user: { id: "user-1" }, role: "OWNER" }],
      })
    );

    const req = new Request("http://localhost/api/venues/venue-1");
    const res = await GET(req, makeParams());
    expect(res.status).toBe(200);

    expect(mockHasActiveSubscription).not.toHaveBeenCalled();

    const body = await res.json();
    expect(body.userSubscriptionStatus.hasSubscription).toBe(true);
    expect(body.userSubscriptionStatus.reason).toBe("venue_member");
  });
});
