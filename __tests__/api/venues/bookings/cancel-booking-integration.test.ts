/**
 * @jest-environment node
 */

/**
 * Integration tests for booking cancellation flow
 *
 * These tests simulate real-world scenarios without extensive mocking
 * to catch production-like failures that unit tests might miss.
 *
 * Tests cover the complete flow:
 * 1. Create venue, session, user, subscription
 * 2. Book session
 * 3. Attempt to cancel booking
 * 4. Verify state transitions
 */

import { POST as CancelBooking } from "@/app/api/venues/[id]/bookings/[bookingId]/cancel/route";
import { DELETE as CancelBookingV2 } from "@/app/api/venues/[id]/sessions/[sessionId]/book/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// Mock auth with test user
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock analytics (fire-and-forget, not relevant for integration tests)
jest.mock("@/lib/analytics", () => ({
  trackServerEvent: jest.fn().mockResolvedValue(undefined),
  ANALYTICS_EVENTS: {
    BOOKING_CANCELLED: "booking_cancelled",
  },
}));

describe("Booking Cancellation Integration Tests", () => {
  const testUserId = "integration-test-user-1";
  const testUserEmail = "integration@test.com";

  // Create test user before all tests
  beforeAll(async () => {
    await prisma.user.upsert({
      where: { id: testUserId },
      update: {},
      create: {
        id: testUserId,
        email: testUserEmail,
        name: "Integration Test User",
      },
    });
  });

  // Clean up test user after all tests
  afterAll(async () => {
    await prisma.user
      .delete({
        where: { id: testUserId },
      })
      .catch(() => {
        // Ignore if already deleted
      });
  });

  beforeEach(() => {
    mockAuth.mockResolvedValue({
      user: { id: testUserId, email: testUserEmail },
    });
  });

  afterEach(async () => {
    // Clean up all test data to prevent unique constraint violations
    // Order matters due to foreign key constraints
    await prisma.venueBooking.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.venueSession.deleteMany({
      where: { venue: { createdByUserId: testUserId } },
    });
    await prisma.venueSubscription.deleteMany({
      where: {
        OR: [
          { userId: testUserId },
          { venue: { createdByUserId: testUserId } },
        ],
      },
    });
    await prisma.venuePlanVenue.deleteMany({
      where: { venue: { createdByUserId: testUserId } },
    });
    await prisma.venuePlan.deleteMany({
      where: { venue: { createdByUserId: testUserId } },
    });
    await prisma.venue.deleteMany({
      where: { createdByUserId: testUserId },
    });
    jest.clearAllMocks();
  });

  describe("POST /api/venues/[id]/bookings/[bookingId]/cancel - Full flow", () => {
    it("successfully cancels a booking with complete validation chain", async () => {
      // Setup: Create test data
      const venue = await prisma.venue.create({
        data: {
          name: "Integration Test Venue",
          slug: "integration-test-venue",
          description: "Test venue for cancellation flow",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false, // Allow booking without subscription
        },
      });

      const session = await prisma.venueSession.create({
        data: {
          venueId: venue.id,
          title: "Test Class",
          startsAt: new Date("2027-12-31T10:00:00Z"), // Far future
          endsAt: new Date("2027-12-31T11:00:00Z"),
          capacity: 10,
          type: "CLASS",
        },
      });

      const booking = await prisma.venueBooking.create({
        data: {
          venueId: venue.id,
          sessionId: session.id,
          userId: testUserId,
          status: BookingStatus.BOOKED,
        },
      });

      // Execute: Cancel booking
      const request = new Request("http://localhost", { method: "POST" });
      const params = {
        params: Promise.resolve({ id: venue.id, bookingId: booking.id }),
      } as { params: Promise<{ id: string; bookingId: string }> };

      const response = await CancelBooking(request, params);
      const body = await response.json();

      // Verify: Status and response
      expect(response.status).toBe(200);
      expect(body.status).toBe(BookingStatus.CANCELLED);

      // Verify: Database state
      const updatedBooking = await prisma.venueBooking.findUnique({
        where: { id: booking.id },
      });

      expect(updatedBooking?.status).toBe(BookingStatus.CANCELLED);

      // Cleanup
      await prisma.venueBooking.delete({ where: { id: booking.id } });
      await prisma.venueSession.delete({ where: { id: session.id } });
      await prisma.venue.delete({ where: { id: venue.id } });
    });

    it("fails when venue ID mismatch (security check)", async () => {
      const venue1 = await prisma.venue.create({
        data: {
          name: "Venue 1",
          slug: "venue-1-test",
          description: "First venue",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false,
        },
      });

      const venue2 = await prisma.venue.create({
        data: {
          name: "Venue 2",
          slug: "venue-2-test",
          description: "Second venue",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false,
        },
      });

      const session = await prisma.venueSession.create({
        data: {
          venueId: venue1.id,
          title: "Test Class",
          startsAt: new Date("2027-12-31T10:00:00Z"),
          endsAt: new Date("2027-12-31T11:00:00Z"),
          type: "CLASS",
        },
      });

      const booking = await prisma.venueBooking.create({
        data: {
          venueId: venue1.id,
          sessionId: session.id,
          userId: testUserId,
          status: BookingStatus.BOOKED,
        },
      });

      // Try to cancel booking via wrong venue ID
      const request = new Request("http://localhost", { method: "POST" });
      const params = {
        params: Promise.resolve({ id: venue2.id, bookingId: booking.id }),
      } as { params: Promise<{ id: string; bookingId: string }> };

      const response = await CancelBooking(request, params);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Invalid venue");

      // Verify booking is still BOOKED
      const unchangedBooking = await prisma.venueBooking.findUnique({
        where: { id: booking.id },
      });
      expect(unchangedBooking?.status).toBe(BookingStatus.BOOKED);

      // Cleanup
      await prisma.venueBooking.delete({ where: { id: booking.id } });
      await prisma.venueSession.delete({ where: { id: session.id } });
      await prisma.venue.delete({ where: { id: venue1.id } });
      await prisma.venue.delete({ where: { id: venue2.id } });
    });

    it("prevents cancelling already started session", async () => {
      const venue = await prisma.venue.create({
        data: {
          name: "Past Session Venue",
          slug: "past-session-venue",
          description: "Test venue",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false,
        },
      });

      const pastSession = await prisma.venueSession.create({
        data: {
          venueId: venue.id,
          title: "Past Class",
          startsAt: new Date("2020-01-01T10:00:00Z"), // Past date
          endsAt: new Date("2020-01-01T11:00:00Z"),
          type: "CLASS",
        },
      });

      const booking = await prisma.venueBooking.create({
        data: {
          venueId: venue.id,
          sessionId: pastSession.id,
          userId: testUserId,
          status: BookingStatus.BOOKED,
        },
      });

      const request = new Request("http://localhost", { method: "POST" });
      const params = {
        params: Promise.resolve({ id: venue.id, bookingId: booking.id }),
      } as { params: Promise<{ id: string; bookingId: string }> };

      const response = await CancelBooking(request, params);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Cannot cancel session that has already started");

      // Cleanup
      await prisma.venueBooking.delete({ where: { id: booking.id } });
      await prisma.venueSession.delete({ where: { id: pastSession.id } });
      await prisma.venue.delete({ where: { id: venue.id } });
    });
  });

  describe("DELETE /api/venues/[id]/sessions/[sessionId]/book - Alternative endpoint", () => {
    it("successfully cancels booking via sessionId endpoint", async () => {
      const venue = await prisma.venue.create({
        data: {
          name: "Alt Endpoint Venue",
          slug: "alt-endpoint-venue",
          description: "Test alternative cancellation endpoint",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false,
        },
      });

      const session = await prisma.venueSession.create({
        data: {
          venueId: venue.id,
          title: "Test Class",
          startsAt: new Date("2027-12-31T10:00:00Z"),
          endsAt: new Date("2027-12-31T11:00:00Z"),
          type: "CLASS",
        },
      });

      const booking = await prisma.venueBooking.create({
        data: {
          venueId: venue.id,
          sessionId: session.id,
          userId: testUserId,
          status: BookingStatus.BOOKED,
        },
      });

      const request = new Request("http://localhost", { method: "DELETE" });
      const params = {
        params: Promise.resolve({ id: venue.id, sessionId: session.id }),
      } as { params: Promise<{ id: string; sessionId: string }> };

      const response = await CancelBookingV2(request, params);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);

      // Verify database state
      const updatedBooking = await prisma.venueBooking.findUnique({
        where: { id: booking.id },
      });
      expect(updatedBooking?.status).toBe(BookingStatus.CANCELLED);

      // Cleanup
      await prisma.venueBooking.delete({ where: { id: booking.id } });
      await prisma.venueSession.delete({ where: { id: session.id } });
      await prisma.venue.delete({ where: { id: venue.id } });
    });

    it("returns 404 when no booking exists for user and session", async () => {
      const venue = await prisma.venue.create({
        data: {
          name: "No Booking Venue",
          slug: "no-booking-venue",
          description: "Test venue",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: false,
        },
      });

      const session = await prisma.venueSession.create({
        data: {
          venueId: venue.id,
          title: "Test Class",
          startsAt: new Date("2027-12-31T10:00:00Z"),
          endsAt: new Date("2027-12-31T11:00:00Z"),
          type: "CLASS",
        },
      });

      // No booking created - user tries to cancel non-existent booking

      const request = new Request("http://localhost", { method: "DELETE" });
      const params = {
        params: Promise.resolve({ id: venue.id, sessionId: session.id }),
      } as { params: Promise<{ id: string; sessionId: string }> };

      const response = await CancelBookingV2(request, params);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe("Booking not found");

      // Cleanup
      await prisma.venueSession.delete({ where: { id: session.id } });
      await prisma.venue.delete({ where: { id: venue.id } });
    });
  });

  describe("Cancellation with subscription policy", () => {
    it("respects cancellation policy from subscription plan", async () => {
      const venue = await prisma.venue.create({
        data: {
          name: "Policy Test Venue",
          slug: "policy-test-venue",
          description: "Venue with cancellation policy",
          type: "GYM",
          createdByUserId: testUserId,
          requiresPlanToBook: true,
        },
      });

      const plan = await prisma.venuePlan.create({
        data: {
          venueId: venue.id,
          name: "No Cancel Plan",
          description: "Plan that does not allow cancellations",
          price: 50,
          currency: "EUR",
          policy: {
            allowCancellation: false, // Key: no cancellation allowed
          },
        },
      });

      const subscription = await prisma.venueSubscription.create({
        data: {
          venueId: venue.id,
          planId: plan.id,
          userId: testUserId,
          status: "ACTIVE",
          startsAt: new Date("2026-01-01T00:00:00Z"),
          endsAt: new Date("2026-12-31T23:59:59Z"),
        },
      });

      const session = await prisma.venueSession.create({
        data: {
          venueId: venue.id,
          title: "Policy Test Class",
          startsAt: new Date("2027-06-15T10:00:00Z"),
          endsAt: new Date("2027-06-15T11:00:00Z"),
          type: "CLASS",
        },
      });

      const booking = await prisma.venueBooking.create({
        data: {
          venueId: venue.id,
          sessionId: session.id,
          userId: testUserId,
          status: BookingStatus.BOOKED,
          subscriptionId: subscription.id,
        },
      });

      const request = new Request("http://localhost", { method: "POST" });
      const params = {
        params: Promise.resolve({ id: venue.id, bookingId: booking.id }),
      } as { params: Promise<{ id: string; bookingId: string }> };

      const response = await CancelBooking(request, params);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Your plan does not allow cancellations");
      expect(body.reason).toBe("CANCELLATION_NOT_ALLOWED");

      // Verify booking remains BOOKED
      const unchangedBooking = await prisma.venueBooking.findUnique({
        where: { id: booking.id },
      });
      expect(unchangedBooking?.status).toBe(BookingStatus.BOOKED);

      // Cleanup
      await prisma.venueBooking.delete({ where: { id: booking.id } });
      await prisma.venueSession.delete({ where: { id: session.id } });
      await prisma.venueSubscription.delete({ where: { id: subscription.id } });
      await prisma.venuePlan.delete({ where: { id: plan.id } });
      await prisma.venue.delete({ where: { id: venue.id } });
    });
  });
});
