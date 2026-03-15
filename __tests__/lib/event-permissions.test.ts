import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";
import { prisma } from "@/lib/prisma";
import { EventOrganizerRole, EventStaffRole } from "@prisma/client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    eventOrganizer: {
      findUnique: jest.fn(),
    },
    eventStaffMember: {
      findUnique: jest.fn(),
    },
  },
}));

const mockFindOrganizerUnique = prisma.eventOrganizer.findUnique as jest.Mock;
const mockFindStaffUnique = prisma.eventStaffMember.findUnique as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockFindOrganizerUnique.mockResolvedValue(null);
  mockFindStaffUnique.mockResolvedValue(null);
});

// ── Types ─────────────────────────────────────────────────────────────────────

type Ctx = Parameters<typeof hasEventPermission>[0];

function ctx(overrides: Partial<Ctx> = {}): Ctx {
  return {
    userId: "u1",
    userRole: "USER",
    organizerRole: null,
    staffRole: null,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("getUserEventContext", () => {
  it("returns context with null roles when user has no organizer or staff record", async () => {
    const result = await getUserEventContext("u1", "USER", "event-1");
    expect(result).toEqual({
      userId: "u1",
      userRole: "USER",
      organizerRole: null,
      staffRole: null,
    });
  });

  it("returns organizer role when user is an organizer", async () => {
    mockFindOrganizerUnique.mockResolvedValue({
      role: EventOrganizerRole.OWNER,
    });
    const result = await getUserEventContext("u1", "USER", "event-1");
    expect(result.organizerRole).toBe(EventOrganizerRole.OWNER);
  });

  it("returns staff role when user is staff", async () => {
    mockFindStaffUnique.mockResolvedValue({
      role: EventStaffRole.STAFF,
    });
    const result = await getUserEventContext("u1", "USER", "event-1");
    expect(result.staffRole).toBe(EventStaffRole.STAFF);
  });

  it("queries with correct event and user IDs", async () => {
    await getUserEventContext("user-42", "USER", "event-99");
    expect(mockFindOrganizerUnique).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: "event-99", userId: "user-42" } },
    });
    expect(mockFindStaffUnique).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: "event-99", userId: "user-42" } },
    });
  });

  it("fetches organizer and staff in parallel (both called)", async () => {
    await getUserEventContext("u1", "USER", "event-1");
    expect(mockFindOrganizerUnique).toHaveBeenCalledTimes(1);
    expect(mockFindStaffUnique).toHaveBeenCalledTimes(1);
  });
});

describe("hasEventPermission", () => {
  // ── manage_liverace ───────────────────────────────────────────────────────────

  describe("manage_liverace", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "manage_liverace")
      ).toBe(true);
    });

    it("denies regular user", () => {
      expect(
        hasEventPermission(ctx({ userRole: "USER" }), "manage_liverace")
      ).toBe(false);
    });

    it("denies event owner", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "manage_liverace"
        )
      ).toBe(false);
    });
  });

  // ── manage_stripe ─────────────────────────────────────────────────────────────

  describe("manage_stripe", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "manage_stripe")
      ).toBe(true);
    });

    it("grants OWNER organizer role", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "manage_stripe"
        )
      ).toBe(true);
    });

    it("grants ADMIN organizer role", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.ADMIN }),
          "manage_stripe"
        )
      ).toBe(true);
    });

    it("denies regular staff", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.STAFF }),
          "manage_stripe"
        )
      ).toBe(false);
    });
  });

  // ── manage_team ───────────────────────────────────────────────────────────────

  describe("manage_team", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "manage_team")
      ).toBe(true);
    });

    it("grants OWNER organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "manage_team"
        )
      ).toBe(true);
    });

    it("grants ADMIN organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.ADMIN }),
          "manage_team"
        )
      ).toBe(true);
    });

    it("denies regular user", () => {
      expect(hasEventPermission(ctx(), "manage_team")).toBe(false);
    });
  });

  // ── manage_event ──────────────────────────────────────────────────────────────

  describe("manage_event", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "manage_event")
      ).toBe(true);
    });

    it("grants OWNER organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "manage_event"
        )
      ).toBe(true);
    });

    it("denies plain user without role", () => {
      expect(hasEventPermission(ctx(), "manage_event")).toBe(false);
    });
  });

  // ── view_registrations ────────────────────────────────────────────────────────

  describe("view_registrations", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "view_registrations")
      ).toBe(true);
    });

    it("grants any organizer role", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "view_registrations"
        )
      ).toBe(true);
    });

    it("grants any staff role", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.CHECKIN_ONLY }),
          "view_registrations"
        )
      ).toBe(true);
    });

    it("denies user with no event role", () => {
      expect(hasEventPermission(ctx(), "view_registrations")).toBe(false);
    });
  });

  // ── manage_registrations ──────────────────────────────────────────────────────

  describe("manage_registrations", () => {
    it("grants platform admin", () => {
      expect(
        hasEventPermission(ctx({ userRole: "ADMIN" }), "manage_registrations")
      ).toBe(true);
    });

    it("grants organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.ADMIN }),
          "manage_registrations"
        )
      ).toBe(true);
    });

    it("grants STAFF role", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.STAFF }),
          "manage_registrations"
        )
      ).toBe(true);
    });

    it("denies CHECKIN_ONLY staff", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.CHECKIN_ONLY }),
          "manage_registrations"
        )
      ).toBe(false);
    });

    it("denies plain user", () => {
      expect(hasEventPermission(ctx(), "manage_registrations")).toBe(false);
    });
  });

  // ── checkin ───────────────────────────────────────────────────────────────────

  describe("checkin", () => {
    it("grants platform admin", () => {
      expect(hasEventPermission(ctx({ userRole: "ADMIN" }), "checkin")).toBe(
        true
      );
    });

    it("grants any organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "checkin"
        )
      ).toBe(true);
    });

    it("grants STAFF role", () => {
      expect(
        hasEventPermission(ctx({ staffRole: EventStaffRole.STAFF }), "checkin")
      ).toBe(true);
    });

    it("grants CHECKIN_ONLY role", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.CHECKIN_ONLY }),
          "checkin"
        )
      ).toBe(true);
    });

    it("denies STREAM_ONLY staff", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.STREAM_ONLY }),
          "checkin"
        )
      ).toBe(false);
    });
  });

  // ── stream ────────────────────────────────────────────────────────────────────

  describe("stream", () => {
    it("grants platform admin", () => {
      expect(hasEventPermission(ctx({ userRole: "ADMIN" }), "stream")).toBe(
        true
      );
    });

    it("grants any organizer", () => {
      expect(
        hasEventPermission(
          ctx({ organizerRole: EventOrganizerRole.OWNER }),
          "stream"
        )
      ).toBe(true);
    });

    it("grants STAFF role", () => {
      expect(
        hasEventPermission(ctx({ staffRole: EventStaffRole.STAFF }), "stream")
      ).toBe(true);
    });

    it("grants STREAM_ONLY role", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.STREAM_ONLY }),
          "stream"
        )
      ).toBe(true);
    });

    it("denies CHECKIN_ONLY staff", () => {
      expect(
        hasEventPermission(
          ctx({ staffRole: EventStaffRole.CHECKIN_ONLY }),
          "stream"
        )
      ).toBe(false);
    });
  });

  // ── unknown permission ────────────────────────────────────────────────────────

  it("returns false for unknown permission", () => {
    expect(
      hasEventPermission(
        ctx({ userRole: "ADMIN" }),
        "unknown_permission" as Parameters<typeof hasEventPermission>[1]
      )
    ).toBe(false);
  });
});
