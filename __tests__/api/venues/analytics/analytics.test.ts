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

  // ── Members by role ────────────────────────────────────────────────────────
  it("returns members by role with totalActive sum", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueMember.groupBy as jest.Mock)
      // First call: byRole
      .mockResolvedValueOnce([
        { role: "MEMBER", _count: 10 },
        { role: "COACH", _count: 3 },
      ])
      // Second call: totalMembers (byStatus)
      .mockResolvedValueOnce([
        { status: "ACTIVE", _count: 13 },
        { status: "LEFT", _count: 2 },
      ]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.members.byRole).toEqual([
      { role: "MEMBER", count: 10 },
      { role: "COACH", count: 3 },
    ]);
    expect(body.members.totalActive).toBe(13);
  });

  // ── Members by status ─────────────────────────────────────────────────────
  it("returns members by status", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueMember.groupBy as jest.Mock)
      .mockResolvedValueOnce([]) // byRole
      .mockResolvedValueOnce([
        { status: "ACTIVE", _count: 20 },
        { status: "SUSPENDED", _count: 4 },
      ]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.members.byStatus).toEqual([
      { status: "ACTIVE", count: 20 },
      { status: "SUSPENDED", count: 4 },
    ]);
  });

  // ── Member growth bigint serialization ────────────────────────────────────
  it("serializes bigint values in memberGrowth", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    // $queryRaw can return bigint values — first call is memberGrowth
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([
        { month: "2024-01", count: BigInt(5) },
        { month: "2024-02", count: BigInt(12) },
      ])
      .mockResolvedValue([]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.members.growth).toEqual([
      { month: "2024-01", count: 5 },
      { month: "2024-02", count: 12 },
    ]);
    // Must be number, not bigint (JSON can't serialize bigint)
    expect(typeof body.members.growth[0].count).toBe("number");
  });

  // ── Subscription revenue ─────────────────────────────────────────────────
  it("returns subscription revenue totals", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueSubscription.count as jest.Mock).mockResolvedValue(7);
    (prisma.venueSubscription.aggregate as jest.Mock).mockResolvedValue({
      _sum: { paymentAmount: 350 },
      _count: 7,
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.subscriptions.active).toBe(7);
    expect(body.subscriptions.totalPaid).toBe(7);
    expect(body.subscriptions.totalRevenue).toBe(350);
    expect(body.revenue.totalSubscriptions).toBe(350);
  });

  // ── Product sales totals ──────────────────────────────────────────────────
  it("returns product sales totals", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueProductPurchase.aggregate as jest.Mock).mockResolvedValue({
      _sum: { totalAmount: 120 },
      _count: 4,
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.products.totalSales).toBe(4);
    expect(body.products.totalRevenue).toBe(120);
    expect(body.revenue.totalProducts).toBe(120);
  });

  // ── Revenue grandTotal ───────────────────────────────────────────────────
  it("calculates revenue grandTotal from subscriptions + products", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueSubscription.aggregate as jest.Mock).mockResolvedValue({
      _sum: { paymentAmount: 200 },
      _count: 5,
    });
    (prisma.venueProductPurchase.aggregate as jest.Mock).mockResolvedValue({
      _sum: { totalAmount: 80 },
      _count: 3,
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.revenue.grandTotal).toBe(280);
  });

  // ── Session data ──────────────────────────────────────────────────────────
  it("returns session total and avgCapacity", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueSession.aggregate as jest.Mock).mockResolvedValue({
      _count: 15,
      _avg: { capacity: 12.7 },
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.sessions.total).toBe(15);
    expect(body.sessions.avgCapacity).toBe(13); // Math.round(12.7) = 13
  });

  it("returns null avgCapacity when no sessions", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.sessions.avgCapacity).toBeNull();
  });

  // ── Trial bookings ────────────────────────────────────────────────────────
  it("returns trial bookings count", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.venueBooking.count as jest.Mock).mockResolvedValue(6);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookings.trials).toBe(6);
  });

  // ── Popular sessions bigint serialization ─────────────────────────────────
  it("serializes bigint fields in popularSessions", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    // $queryRaw calls in order: memberGrowth, bookingsByDay, bookingsTrend, popularSessions, topProducts, revenueByMonth
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([]) // memberGrowth
      .mockResolvedValueOnce([]) // bookingsByDay
      .mockResolvedValueOnce([]) // bookingsTrend
      .mockResolvedValueOnce([
        {
          title: "Morning Yoga",
          session_count: BigInt(8),
          total_bookings: BigInt(64),
          avg_capacity: 10.5,
        },
      ])
      .mockResolvedValue([]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    const session = body.sessions.popular[0];
    expect(session.session_count).toBe(8);
    expect(session.total_bookings).toBe(64);
    expect(typeof session.session_count).toBe("number");
  });

  // ── Bookings trend bigint serialization ───────────────────────────────────
  it("serializes bigint count in bookingsTrend", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([]) // memberGrowth
      .mockResolvedValueOnce([]) // bookingsByDay
      .mockResolvedValueOnce([
        { week: "2024-01-15", count: BigInt(20) },
        { week: "2024-01-22", count: BigInt(18) },
      ])
      .mockResolvedValue([]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookings.trend).toEqual([
      { week: "2024-01-15", count: 20 },
      { week: "2024-01-22", count: 18 },
    ]);
    expect(typeof body.bookings.trend[0].count).toBe("number");
  });

  // ── Revenue monthly data ──────────────────────────────────────────────────
  it("returns revenue monthly data with subscription and product breakdown", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([]) // memberGrowth
      .mockResolvedValueOnce([]) // bookingsByDay
      .mockResolvedValueOnce([]) // bookingsTrend
      .mockResolvedValueOnce([]) // popularSessions
      .mockResolvedValueOnce([]) // topProducts
      .mockResolvedValueOnce([
        { month: "2024-01", subscription_revenue: 150, product_revenue: 30 },
        { month: "2024-02", subscription_revenue: 200, product_revenue: 0 },
      ]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.revenue.monthly).toEqual([
      { month: "2024-01", subscriptions: 150, products: 30, total: 180 },
      { month: "2024-02", subscriptions: 200, products: 0, total: 200 },
    ]);
  });

  // ── Top products bigint serialization ────────────────────────────────────
  it("serializes bigint fields in topProducts", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    makeEmptyAnalyticsResult();

    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([]) // memberGrowth
      .mockResolvedValueOnce([]) // bookingsByDay
      .mockResolvedValueOnce([]) // bookingsTrend
      .mockResolvedValueOnce([]) // popularSessions
      .mockResolvedValueOnce([
        {
          name: "Protein Shake",
          total_quantity: BigInt(30),
          total_revenue: 120,
        },
      ])
      .mockResolvedValue([]);

    const req = new Request(`http://localhost/api/venues/${venueId}/analytics`);
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    const product = body.products.topProducts[0];
    expect(product.total_quantity).toBe(30);
    expect(typeof product.total_quantity).toBe("number");
  });
});
