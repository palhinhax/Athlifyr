/**
 * @jest-environment node
 */

import {
  getAvailableSessions,
  bookSession,
  getSessionDetails,
} from "@/lib/athli-ai/sessions";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueMember: { findMany: jest.fn() },
    venueSession: { findMany: jest.fn(), findUnique: jest.fn() },
    venueBooking: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    venueSubscription: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

const mockMemberFindMany = prisma.venueMember.findMany as jest.Mock;
const mockSessionFindMany = prisma.venueSession.findMany as jest.Mock;
const mockSessionFindUnique = prisma.venueSession.findUnique as jest.Mock;
const mockBookingFindFirst = prisma.venueBooking.findFirst as jest.Mock;
const mockBookingCreate = prisma.venueBooking.create as jest.Mock;
const mockBookingUpdate = prisma.venueBooking.update as jest.Mock;
const mockSubFindFirst = prisma.venueSubscription.findFirst as jest.Mock;
const mockUserFindUnique = prisma.user.findUnique as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";
const locale = "pt";

// ── getAvailableSessions ──────────────────────────────────────────────────────

describe("getAvailableSessions", () => {
  const makeSession = () => ({
    id: "s1",
    title: "WOD Morning",
    type: "CLASS",
    description: "CrossFit WOD class",
    startsAt: new Date("2026-01-15T08:00:00Z"),
    endsAt: new Date("2026-01-15T09:00:00Z"),
    capacity: 20,
    tags: ["crossfit"],
    venue: { id: "v1", name: "Box Alpha", slug: "box-alpha" },
    bookings: [{ id: "b1", userId: "u2" }],
  });

  it("returns sessions with venue ID filter", async () => {
    mockSessionFindMany.mockResolvedValue([makeSession()]);

    const result = JSON.parse(
      await getAvailableSessions({ venueId: "v1" }, userId, locale)
    );

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("WOD Morning");
    expect(result[0].spotsLeft).toBe(19);
    expect(result[0].isFull).toBe(false);
    expect(result[0].userAlreadyBooked).toBe(false);
  });

  it("detects user already booked", async () => {
    const session = makeSession();
    session.bookings = [{ id: "b1", userId }];
    mockSessionFindMany.mockResolvedValue([session]);

    const result = JSON.parse(
      await getAvailableSessions({ venueId: "v1" }, userId, locale)
    );

    expect(result[0].userAlreadyBooked).toBe(true);
  });

  it("returns no membership message when no venues", async () => {
    mockMemberFindMany.mockResolvedValue([]);

    const result = await getAvailableSessions({}, userId, locale);

    expect(result).toContain("not a member");
  });

  it("returns no sessions message when empty", async () => {
    mockSessionFindMany.mockResolvedValue([]);

    const result = await getAvailableSessions(
      { venueId: "v1" },
      userId,
      locale
    );

    expect(result).toContain("No available sessions");
  });

  it("uses member venues when no venueId", async () => {
    mockMemberFindMany.mockResolvedValue([
      { venueId: "v1" },
      { venueId: "v2" },
    ]);
    mockSessionFindMany.mockResolvedValue([]);

    await getAvailableSessions({}, userId, locale);

    const where = mockSessionFindMany.mock.calls[0][0].where;
    expect(where.venueId).toEqual({ in: ["v1", "v2"] });
  });

  it("handles tomorrow period", async () => {
    mockSessionFindMany.mockResolvedValue([]);

    await getAvailableSessions({ period: "tomorrow" }, userId, locale);

    expect(mockSessionFindMany).toHaveBeenCalled();
  });

  it("handles week period", async () => {
    mockSessionFindMany.mockResolvedValue([]);

    await getAvailableSessions({ period: "week" }, userId, locale);

    expect(mockSessionFindMany).toHaveBeenCalled();
  });

  it("handles date parameter", async () => {
    mockSessionFindMany.mockResolvedValue([]);

    await getAvailableSessions({ date: "2026-01-20" }, userId, locale);

    const where = mockSessionFindMany.mock.calls[0][0].where;
    expect(where.startsAt.gte).toBeDefined();
    expect(where.startsAt.lte).toBeDefined();
  });

  it("session with no capacity shows null spotsLeft", async () => {
    const session = makeSession();
    (session as Record<string, unknown>).capacity = null;
    mockSessionFindMany.mockResolvedValue([session]);

    const result = JSON.parse(
      await getAvailableSessions({ venueId: "v1" }, userId, locale)
    );

    expect(result[0].spotsLeft).toBeNull();
    expect(result[0].isFull).toBe(false);
  });
});

// ── bookSession ───────────────────────────────────────────────────────────────

describe("bookSession", () => {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const makeSessionForBook = () => ({
    id: "s1",
    title: "WOD",
    startsAt: futureDate,
    endsAt: new Date(futureDate.getTime() + 3600000),
    capacity: 20,
    coachId: null,
    venue: {
      id: "v1",
      name: "Box Alpha",
      slug: "box-alpha",
      requiresPlanToBook: false,
    },
    bookings: [{ id: "b1", userId: "u2" }],
  });

  it("creates a new booking", async () => {
    mockSessionFindUnique.mockResolvedValue(makeSessionForBook());
    mockBookingFindFirst.mockResolvedValue(null);
    mockBookingCreate.mockResolvedValue({ id: "new-b" });

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(true);
    expect(result.bookingId).toBe("new-b");
    expect(result.venue.url).toBe("/pt/v/box-alpha");
  });

  it("returns error for missing session", async () => {
    mockSessionFindUnique.mockResolvedValue(null);

    const result = JSON.parse(await bookSession("bad", userId, locale));

    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("returns error for past session", async () => {
    const session = makeSessionForBook();
    session.startsAt = new Date("2020-01-01");
    mockSessionFindUnique.mockResolvedValue(session);

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(false);
    expect(result.error).toContain("already started");
  });

  it("returns error when full", async () => {
    const session = makeSessionForBook();
    session.capacity = 1;
    mockSessionFindUnique.mockResolvedValue(session);

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(false);
    expect(result.error).toContain("full");
  });

  it("returns error when already booked", async () => {
    mockSessionFindUnique.mockResolvedValue(makeSessionForBook());
    mockBookingFindFirst.mockResolvedValue({ id: "b-old", status: "BOOKED" });

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(false);
    expect(result.error).toContain("already booked");
  });

  it("reactivates cancelled booking", async () => {
    mockSessionFindUnique.mockResolvedValue(makeSessionForBook());
    mockBookingFindFirst.mockResolvedValue({
      id: "b-cancelled",
      status: "CANCELLED",
    });
    mockBookingUpdate.mockResolvedValue({ id: "b-cancelled" });

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(true);
    expect(mockBookingUpdate).toHaveBeenCalled();
  });

  it("requires subscription when venue requires plan", async () => {
    const session = makeSessionForBook();
    session.venue.requiresPlanToBook = true;
    mockSessionFindUnique.mockResolvedValue(session);
    mockBookingFindFirst.mockResolvedValue(null);
    mockSubFindFirst.mockResolvedValue(null);

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(false);
    expect(result.error).toContain("active plan");
  });

  it("creates booking with subscription when required", async () => {
    const session = makeSessionForBook();
    session.venue.requiresPlanToBook = true;
    mockSessionFindUnique.mockResolvedValue(session);
    mockBookingFindFirst.mockResolvedValue(null);
    mockSubFindFirst.mockResolvedValue({ id: "sub-1" });
    mockBookingCreate.mockResolvedValue({ id: "new-b" });

    const result = JSON.parse(await bookSession("s1", userId, locale));

    expect(result.success).toBe(true);
    expect(mockBookingCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ subscriptionId: "sub-1" }),
    });
  });
});

// ── getSessionDetails ─────────────────────────────────────────────────────────

describe("getSessionDetails", () => {
  it("returns session details with workout", async () => {
    mockSessionFindUnique.mockResolvedValue({
      id: "s1",
      title: "WOD",
      type: "CLASS",
      description: "CrossFit class",
      startsAt: new Date("2026-01-15T08:00:00Z"),
      endsAt: new Date("2026-01-15T09:00:00Z"),
      capacity: 20,
      coachId: "coach-1",
      tags: ["crossfit"],
      venue: { id: "v1", name: "Box Alpha", slug: "box-alpha" },
      bookings: [{ id: "b1" }, { id: "b2" }],
      sessionWorkouts: [
        {
          notes: "Scale as needed",
          workout: {
            name: "Fran",
            description: "Classic benchmark",
            blocks: [
              {
                type: "FOR_TIME",
                name: "Fran",
                rounds: null,
                timeCap: null,
                exercises: [
                  {
                    exercise: { name: "Thruster", category: "CROSSFIT" },
                    prescribedReps: 21,
                    prescribedSets: null,
                    prescribedWeight: 43,
                    prescribedDistance: null,
                    prescribedTime: null,
                  },
                ],
              },
            ],
          },
        },
      ],
    });
    mockUserFindUnique.mockResolvedValue({ name: "Coach John" });

    const result = JSON.parse(await getSessionDetails("s1", locale));

    expect(result.title).toBe("WOD");
    expect(result.coach).toBe("Coach John");
    expect(result.bookedCount).toBe(2);
    expect(result.spotsLeft).toBe(18);
    expect(result.workouts).toHaveLength(1);
    expect(result.workouts[0].name).toBe("Fran");
  });

  it("returns not found message", async () => {
    mockSessionFindUnique.mockResolvedValue(null);

    const result = await getSessionDetails("bad", locale);

    expect(result).toBe("Session not found.");
  });

  it("handles session without coach", async () => {
    mockSessionFindUnique.mockResolvedValue({
      id: "s1",
      title: "Open Gym",
      type: "OPEN",
      description: null,
      startsAt: new Date("2026-01-15T08:00:00Z"),
      endsAt: new Date("2026-01-15T09:00:00Z"),
      capacity: null,
      coachId: null,
      tags: [],
      venue: { id: "v1", name: "Box", slug: "box" },
      bookings: [],
      sessionWorkouts: [],
    });

    const result = JSON.parse(await getSessionDetails("s1", locale));

    expect(result.coach).toBeNull();
    expect(result.workouts).toBeNull();
    expect(result.spotsLeft).toBeNull();
  });
});
