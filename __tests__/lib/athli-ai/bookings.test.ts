/**
 * @jest-environment node
 */

import { getUserBookings } from "@/lib/athli-ai/bookings";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueBooking: { findMany: jest.fn() },
  },
}));

const mockFindMany = prisma.venueBooking.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";
const locale = "pt";

const makeBooking = () => ({
  id: "b1",
  status: "BOOKED",
  bookingType: "REGULAR",
  session: {
    id: "s1",
    title: "WOD Morning",
    type: "CLASS",
    description: "CrossFit WOD",
    startsAt: new Date("2025-03-15T08:00:00Z"),
    endsAt: new Date("2025-03-15T09:00:00Z"),
    capacity: 20,
    tags: ["crossfit"],
  },
  venue: {
    id: "v1",
    name: "Box Alpha",
    slug: "box-alpha",
    city: "Porto",
    sportTypes: ["CROSSFIT"],
  },
});

describe("getUserBookings", () => {
  it("returns formatted bookings for upcoming period", async () => {
    mockFindMany.mockResolvedValue([makeBooking()]);

    const result = JSON.parse(await getUserBookings(userId, locale));

    expect(result).toHaveLength(1);
    expect(result[0].bookingId).toBe("b1");
    expect(result[0].session.title).toBe("WOD Morning");
    expect(result[0].session.date).toBe("2025-03-15");
    expect(result[0].session.startTime).toBe("08:00");
    expect(result[0].session.endTime).toBe("09:00");
    expect(result[0].venue.url).toBe("/pt/v/box-alpha");
  });

  it("returns appropriate message for today when no bookings", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getUserBookings(userId, locale, "today");

    expect(result).toBe("You have no classes booked for today.");
  });

  it("returns appropriate message for week when no bookings", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getUserBookings(userId, locale, "week");

    expect(result).toBe("You have no classes booked for this week.");
  });

  it("returns appropriate message for past when no bookings", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getUserBookings(userId, locale, "past");

    expect(result).toBe("No past bookings found.");
  });

  it("returns default upcoming message when no bookings", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getUserBookings(userId, locale, "upcoming");

    expect(result).toBe("You have no upcoming classes booked.");
  });

  it("returns fallback message for unknown period", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getUserBookings(userId, locale);

    expect(result).toBe("You have no upcoming classes booked.");
  });

  it("truncates session description to 150 chars", async () => {
    const booking = makeBooking();
    booking.session.description = "x".repeat(200);
    mockFindMany.mockResolvedValue([booking]);

    const result = JSON.parse(await getUserBookings(userId, locale));

    expect(result[0].session.description).toHaveLength(150);
  });

  it("passes correct date filter for today period", async () => {
    mockFindMany.mockResolvedValue([]);

    await getUserBookings(userId, locale, "today");

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.session.startsAt.gte).toBeDefined();
    expect(call.where.session.startsAt.lte).toBeDefined();
  });

  it("passes correct date filter for past period", async () => {
    mockFindMany.mockResolvedValue([]);

    await getUserBookings(userId, locale, "past");

    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.session.startsAt.lt).toBeDefined();
  });
});
