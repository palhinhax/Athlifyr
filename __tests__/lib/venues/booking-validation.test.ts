import {
  validateBooking,
  validateCancellation,
  PlanPolicy,
} from "@/lib/venues/booking-validation";
import { prisma } from "@/lib/prisma";
import { MemberStatus, BookingStatus, SessionType } from "@prisma/client";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
      findUnique: jest.fn(),
    },
    venueMember: {
      findUnique: jest.fn(),
    },
    venueSubscription: {
      findFirst: jest.fn(),
    },
    venuePlanVenue: {
      findMany: jest.fn(),
    },
    venueSession: {
      findUnique: jest.fn(),
    },
    venueBooking: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("booking-validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: venue requires plan to book
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      requiresPlanToBook: true,
    });
  });

  describe("validateBooking", () => {
    const userId = "user-1";
    const venueId = "venue-1";
    const sessionId = "session-1";

    it("should reject booking if user is not a member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("NOT_A_MEMBER");
    });

    it("should reject booking if member is not active", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.SUSPENDED,
      });

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("MEMBER_NOT_ACTIVE");
    });

    it("should reject booking if no active subscription", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.venuePlanVenue.findMany as jest.Mock).mockResolvedValue([]);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("NO_ACTIVE_SUBSCRIPTION");
    });

    it("should reject booking if session not found", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy: {},
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("SESSION_NOT_FOUND");
    });

    it("should reject booking if session has already started", async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1); // 1 hour ago

      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy: {},
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: pastDate,
        bookings: [],
      });

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("SESSION_ALREADY_STARTED");
    });

    it("should reject booking if subscription has not started yet", async () => {
      const futureStartDate = new Date();
      futureStartDate.setDate(futureStartDate.getDate() + 7); // 7 days from now

      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      // First call returns null (subscription has future start date, not matching the query)
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.venuePlanVenue.findMany as jest.Mock).mockResolvedValue([]);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("NO_ACTIVE_SUBSCRIPTION");
    });

    it("should reject booking if subscription has expired", async () => {
      const expiredEndDate = new Date();
      expiredEndDate.setDate(expiredEndDate.getDate() - 1); // Expired yesterday

      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      // Subscription is expired so findFirst returns null (doesn't match OR condition)
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.venuePlanVenue.findMany as jest.Mock).mockResolvedValue([]);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("NO_ACTIVE_SUBSCRIPTION");
    });

    it("should reject booking if already booked", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy: {},
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-15T10:00:00Z"),
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue({
        id: "booking-1",
        status: BookingStatus.BOOKED,
      });

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("ALREADY_BOOKED");
    });

    it("should reject booking if session is full", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy: {},
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 2,
        startsAt: new Date("2026-06-15T10:00:00Z"),
        bookings: [{ id: "b1" }, { id: "b2" }],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("SESSION_FULL");
    });

    it("should reject booking if max bookings per day reached", async () => {
      const policy: PlanPolicy = {
        maxBookingsPerDay: 1,
      };

      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-15T10:00:00Z"),
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.venueBooking.count as jest.Mock).mockResolvedValue(1);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("MAX_BOOKINGS_PER_DAY_REACHED");
    });

    it("should reject booking if outside allowed time window", async () => {
      const policy: PlanPolicy = {
        allowedStartTimeFrom: "18:00",
      };

      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-15T09:00:00Z"), // 09:00 is before 18:00
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("OUTSIDE_TIME_WINDOW");
    });

    it("should allow booking when all validations pass", async () => {
      (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
        requiresPlanToBook: true,
      });
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy: {},
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-15T10:00:00Z"),
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("should reject booking if advance booking required and not enough time", async () => {
      const policy: PlanPolicy = {
        requiresAdvanceBooking: true,
        advanceBookingHours: 24, // 24 hours in advance required
      };

      (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
        requiresPlanToBook: true,
      });
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });
      // Session starts in 2 hours (less than 24 hours required)
      const sessionStart = new Date();
      sessionStart.setHours(sessionStart.getHours() + 2);
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: sessionStart,
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("ADVANCE_BOOKING_REQUIRED");
      expect(result.minimumHours).toBe(24);
    });

    it("should reject booking if max bookings per month reached", async () => {
      const policy: PlanPolicy = {
        maxBookingsPerMonth: 5,
      };

      (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
        requiresPlanToBook: true,
      });
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-15T10:00:00Z"),
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);
      // Already has 5 bookings this month (at limit)
      (prisma.venueBooking.count as jest.Mock).mockResolvedValue(5);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("MAX_BOOKINGS_PER_MONTH_REACHED");
    });

    it("should reject booking if allowed day restriction not met (string format)", async () => {
      const policy: PlanPolicy = {
        allowedDays: ["MONDAY", "WEDNESDAY", "FRIDAY"], // Only Mon, Wed, Fri
      };

      (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
        requiresPlanToBook: true,
      });
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        status: MemberStatus.ACTIVE,
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });
      // June 15, 2026 is a Monday - wait, let me check
      // Actually, June 15, 2026 is a Monday, so let's use June 16 (Tuesday)
      (prisma.venueSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        type: SessionType.CLASS,
        capacity: 10,
        startsAt: new Date("2026-06-16T10:00:00Z"), // Tuesday
        bookings: [],
      });
      (prisma.venueBooking.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("WEEKDAY_NOT_ALLOWED");
    });
  });

  describe("validateCancellation", () => {
    const userId = "user-1";
    const bookingId = "booking-1";

    it("should reject cancellation if booking not found", async () => {
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateCancellation(userId, bookingId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("BOOKING_NOT_FOUND");
    });

    it("should reject cancellation if not booking owner", async () => {
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId: "other-user",
        status: BookingStatus.BOOKED,
        venueId: "venue-1",
        session: {
          startsAt: new Date("2026-06-20T10:00:00Z"),
        },
      });

      const result = await validateCancellation(userId, bookingId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("NOT_BOOKING_OWNER");
    });

    it("should reject cancellation if plan does not allow it", async () => {
      const policy: PlanPolicy = {
        allowCancellation: false,
      };

      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        status: BookingStatus.BOOKED,
        venueId: "venue-1",
        session: {
          startsAt: new Date("2026-06-20T10:00:00Z"),
        },
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });

      const result = await validateCancellation(userId, bookingId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("CANCELLATION_NOT_ALLOWED");
    });

    it("should reject cancellation if past cancellation deadline", async () => {
      const policy: PlanPolicy = {
        allowCancellation: true,
        cancellationHours: 24, // 24 hours before
      };

      // Session in 2 hours (less than 24 hours required)
      const sessionStart = new Date();
      sessionStart.setHours(sessionStart.getHours() + 2);

      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        status: BookingStatus.BOOKED,
        venueId: "venue-1",
        session: {
          startsAt: sessionStart,
        },
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });

      const result = await validateCancellation(userId, bookingId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("CANCELLATION_DEADLINE_PASSED");
      expect(result.minimumHours).toBe(24);
    });

    it("should allow cancellation when all validations pass", async () => {
      const policy: PlanPolicy = {
        allowCancellation: true,
        cancellationHours: 24,
      };

      // Session in 48 hours (more than 24 hours required)
      const sessionStart = new Date();
      sessionStart.setHours(sessionStart.getHours() + 48);

      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        status: BookingStatus.BOOKED,
        venueId: "venue-1",
        session: {
          startsAt: sessionStart,
        },
      });
      (prisma.venueSubscription.findFirst as jest.Mock).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: {
          id: "plan-1",
          policy,
        },
      });

      const result = await validateCancellation(userId, bookingId);

      expect(result.allowed).toBe(true);
    });
  });
});
