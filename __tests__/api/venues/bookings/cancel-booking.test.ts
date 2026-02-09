/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/venues/[id]/bookings/[bookingId]/cancel
 * Comprehensive test suite for booking cancellation via bookingId
 *
 * This endpoint is used in production when users cancel their venue session bookings
 * Tests cover all validation scenarios and edge cases that could cause failures
 */

import { POST } from "@/app/api/venues/[id]/bookings/[bookingId]/cancel/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import * as bookingValidation from "@/lib/venues/booking-validation";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueBooking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock booking validation
jest.mock("@/lib/venues/booking-validation", () => ({
  validateCancellation: jest.fn(),
}));

describe("POST /api/venues/[id]/bookings/[bookingId]/cancel — cancel booking by ID", () => {
  const venueId = "venue-1";
  const bookingId = "booking-1";
  const userId = "user-1";
  const userEmail = "user@test.com";

  const makeRequest = () => new Request("http://localhost", { method: "POST" });
  const makeParams = () =>
    ({ params: Promise.resolve({ id: venueId, bookingId }) }) as {
      params: Promise<{ id: string; bookingId: string }>;
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Authentication ───────────────────────────────────

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
    expect(prisma.venueBooking.findUnique).not.toHaveBeenCalled();
  });

  // ── Booking not found ────────────────────────────────

  it("returns 404 when booking does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });
    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Booking not found");
    expect(prisma.venueBooking.findUnique).toHaveBeenCalledWith({
      where: { id: bookingId },
      select: {
        venueId: true,
        userId: true,
        status: true,
        sessionId: true,
      },
    });
  });

  // ── Venue mismatch (critical security check) ─────────

  it("returns 400 when booking does not belong to the specified venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    // Booking belongs to a different venue
    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId: "different-venue-id",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid venue");
    expect(bookingValidation.validateCancellation).not.toHaveBeenCalled();
  });

  // ── Validation failures (policy checks) ──────────────

  it("returns 400 when user is not the booking owner", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "NOT_BOOKING_OWNER",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("You can only cancel your own bookings");
    expect(body.reason).toBe("NOT_BOOKING_OWNER");
  });

  it("returns 400 when booking is already cancelled", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "ALREADY_CANCELLED",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Booking is already cancelled");
    expect(body.reason).toBe("ALREADY_CANCELLED");
  });

  it("returns 400 when session has already been attended", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "ALREADY_ATTENDED",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Cannot cancel attended session");
    expect(body.reason).toBe("ALREADY_ATTENDED");
  });

  it("returns 400 when session has already started", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "SESSION_ALREADY_STARTED",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Cannot cancel session that has already started");
    expect(body.reason).toBe("SESSION_ALREADY_STARTED");
  });

  it("returns 400 when plan does not allow cancellation", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "CANCELLATION_NOT_ALLOWED",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Your plan does not allow cancellations");
    expect(body.reason).toBe("CANCELLATION_NOT_ALLOWED");
  });

  it("returns 400 when cancellation deadline has passed", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "CANCELLATION_DEADLINE_PASSED",
      minimumMinutes: 30,
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe(
      "Must cancel at least 30 minutes before the session"
    );
    expect(body.reason).toBe("CANCELLATION_DEADLINE_PASSED");
    expect(body.minimumMinutes).toBe(30);
  });

  it("returns 400 with generic error for unknown validation failure", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: "UNKNOWN_REASON",
    });

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Cannot cancel booking");
    expect(body.reason).toBe("UNKNOWN_REASON");
  });

  // ── Successful cancellation ──────────────────────────

  it("successfully cancels booking when all validations pass", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: true,
    });

    const cancelledBooking = {
      id: bookingId,
      venueId,
      userId,
      sessionId: "session-1",
      status: BookingStatus.CANCELLED,
      session: {
        id: "session-1",
        startsAt: "2027-06-15T10:00:00.000Z", // Response serializes dates as strings
        venue: {
          name: "Test Venue",
          slug: "test-venue",
        },
      },
    };

    (prisma.venueBooking.update as jest.Mock).mockResolvedValue(
      cancelledBooking
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(cancelledBooking);
    expect(prisma.venueBooking.update).toHaveBeenCalledWith({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        session: {
          include: {
            venue: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  });

  // ── Database/Internal errors ─────────────────────────

  it("returns 500 when database query fails on findUnique", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database connection error")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel booking");
  });

  it("returns 500 when validation throws unexpected error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockRejectedValue(
      new Error("Validation service unavailable")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel booking");
  });

  it("returns 500 when database update fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: true,
    });

    (prisma.venueBooking.update as jest.Mock).mockRejectedValue(
      new Error("Database write failed")
    );

    const res = await POST(makeRequest(), makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel booking");
  });

  // ── Edge cases: async params handling ────────────────

  it("handles params promise rejection gracefully", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: userEmail } });

    const faultyParams = {
      params: Promise.reject(new Error("Invalid route parameters")),
    } as { params: Promise<{ id: string; bookingId: string }> };

    const res = await POST(makeRequest(), faultyParams);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to cancel booking");
  });

  // ── Edge case: null/undefined user email ─────────────

  it("handles missing user email gracefully", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId, email: undefined } });

    (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
      venueId,
    });

    (bookingValidation.validateCancellation as jest.Mock).mockResolvedValue({
      allowed: true,
    });

    (prisma.venueBooking.update as jest.Mock).mockResolvedValue({
      id: bookingId,
      status: BookingStatus.CANCELLED,
      session: {
        venue: { name: "Test", slug: "test" },
      },
    });

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
  });
});
