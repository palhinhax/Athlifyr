/**
 * @jest-environment node
 */

import { GET } from "@/app/api/venues/[id]/analytics/route";
import { prisma } from "@/lib/prisma";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

// Mock Prisma with all methods used in analytics
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueMember: {
      groupBy: jest.fn(),
    },
    venueSubscription: {
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    venueBooking: {
      groupBy: jest.fn(),
      count: jest.fn(),
    },
    venueSession: {
      aggregate: jest.fn(),
    },
    venueProductPurchase: {
      aggregate: jest.fn(),
    },
    $queryRaw: jest.fn(),
  },
}));

const venueId = "venue-1";
const userId = "user-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };

const makeEmptyAnalyticsResult = () => {
  // Mock all prisma calls to return empty results
  (prisma.venueMember.groupBy as jest.Mock).mockResolvedValue([]);
  (prisma.venueSubscription.count as jest.Mock).mockResolvedValue(0);
  (prisma.venueSubscription.aggregate as jest.Mock).mockResolvedValue({
    _sum: { paymentAmount: null },
    _count: 0,
  });
  (prisma.venueBooking.groupBy as jest.Mock).mockResolvedValue([]);
  (prisma.venueBooking.count as jest.Mock).mockResolvedValue(0);
  (prisma.venueSession.aggregate as jest.Mock).mockResolvedValue({
    _count: 0,
    _avg: { capacity: null },
  });
  (prisma.venueProductPurchase.aggregate as jest.Mock).mockResolvedValue({
    _sum: { totalAmount: null },
    _count: 0,
  });
  (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
};

describe("GET /api/venues/[id]/analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  it("returns analytics data for authorized user", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveProperty("members");
    expect(body).toHaveProperty("subscriptions");
    expect(body).toHaveProperty("bookings");
    expect(body).toHaveProperty("sessions");
    expect(body).toHaveProperty("products");
    expect(body).toHaveProperty("revenue");
    expect(body).toHaveProperty("period");
  });

  it("defaults to 30 days period", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.period.days).toBe(30);
  });

  it("respects days query parameter", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(
      `http://localhost/api/venues/${venueId}/analytics?days=60`
    );
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.period.days).toBe(60);
  });

  it("caps days at 365", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(
      `http://localhost/api/venues/${venueId}/analytics?days=1000`
    );
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.period.days).toBe(365);
  });

  it("includes attendance rate when bookings exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    // Override bookings with some data
    (prisma.venueBooking.groupBy as jest.Mock).mockResolvedValue([
      { status: "ATTENDED", _count: 8 },
      { status: "NO_SHOW", _count: 2 },
      { status: "CANCELLED", _count: 1 },
    ]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookings.attendanceRate).toBe(80); // 8/(8+2) = 80%
    expect(body.bookings.attended).toBe(8);
    expect(body.bookings.noShow).toBe(2);
    expect(body.bookings.cancelled).toBe(1);
  });

  it("returns null attendance rate when no attended/no-show bookings", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookings.attendanceRate).toBeNull();
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueMember.groupBy as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to fetch analytics");
  });
});
