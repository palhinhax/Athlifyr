import { validateBooking, PlanPolicy } from "@/lib/venues/booking-validation";
import { prisma } from "@/lib/prisma";
import { MemberStatus, BookingStatus, SessionType } from "@prisma/client";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueMember: {
      findUnique: jest.fn(),
    },
    venueSubscription: {
      findFirst: jest.fn(),
    },
    venueSession: {
      findUnique: jest.fn(),
    },
    venueBooking: {
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("booking-validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue({
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
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);

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
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);
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
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("OUTSIDE_TIME_WINDOW");
    });

    it("should allow booking when all validations pass", async () => {
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
      (prisma.venueBooking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateBooking(userId, venueId, sessionId);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });
});
