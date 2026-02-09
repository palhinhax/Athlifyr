/**
 * @jest-environment node
 */

/**
 * Tests for DELETE /api/venues/[id]/sessions/[sessionId]/book
 * User cancels their enrollment (booking) in a venue session
 */

import { DELETE } from "@/app/api/venues/[id]/sessions/[sessionId]/book/route";
import { prisma } from "@/lib/prisma";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueBooking: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock analytics (fire-and-forget, not relevant for logic tests)
jest.mock("@/lib/analytics", () => ({
  trackServerEvent: jest.fn().mockResolvedValue(undefined),
  ANALYTICS_EVENTS: {
    BOOKING_CANCELLED: "booking_cancelled",
  },
}));

describe("DELETE /api/venues/[id]/sessions/[sessionId]/book — cancel session enrollment", () => {
  const venueId = "venue-1";
  const sessionId = "session-1";
  const userId = "user-1";

  const makeRequest = () =>
    new Request("http://localhost", { method: "DELETE" });
  const makeParams = () =>
    ({ params: Promise.resolve({ id: venueId, sessionId }) }) as {
      params: Promise<{ id: string; sessionId: string }>;
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Unauthenticated ──────────────────────────────────

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await DELETE(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  // ── Booking not found ────────────────────────────────

  it("returns 404 when no active booking exists for the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@test.com" } });
    (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Booking not found");
    expect(prisma.venueBooking.findFirst).toHaveBeenCalledWith({
      where: {
        venueId,
        sessionId,
        userId,
        status: { in: ["BOOKED"] },
      },
      include: { session: true },
    });
  });

  // ── Session already started ──────────────────────────

  it("returns 400 when the session has already started", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@test.com" } });

    const pastDate = new Date("2025-01-01T10:00:00Z");

    (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue({
      id: "booking-1",
      venueId,
      sessionId,
      userId,
      status: "BOOKED",
      session: {
        id: sessionId,
        startsAt: pastDate,
      },
    });

    const res = await DELETE(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Cannot cancel session that has already started");
    expect(prisma.venueBooking.update).not.toHaveBeenCalled();
  });

  // ── Successful cancellation ──────────────────────────

  it("cancels the booking successfully for a future session", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@test.com" } });

    const futureDate = new Date("2027-06-15T10:00:00Z");

    (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue({
      id: "booking-1",
      venueId,
      sessionId,
      userId,
      status: "BOOKED",
      session: {
        id: sessionId,
        startsAt: futureDate,
      },
    });

    (prisma.venueBooking.update as jest.Mock).mockResolvedValue({
      id: "booking-1",
      status: "CANCELLED",
    });

    const res = await DELETE(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.venueBooking.update).toHaveBeenCalledWith({
      where: { id: "booking-1" },
      data: { status: "CANCELLED" },
    });
  });

  // ── Internal server error ────────────────────────────

  it("returns 500 when an unexpected error occurs", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: "u@test.com" } });
    (prisma.venueBooking.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const res = await DELETE(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel booking");
  });
});
