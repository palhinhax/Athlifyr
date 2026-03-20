/**
 * @jest-environment node
 */

import {
  searchEvents,
  getEventDetails,
  getUserEvents,
} from "@/lib/athli-ai/events";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    participation: { findMany: jest.fn() },
  },
}));

const mockEventFindMany = prisma.event.findMany as jest.Mock;
const mockEventFindUnique = prisma.event.findUnique as jest.Mock;
const mockParticipationFindMany = prisma.participation.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const locale = "pt";

// ── searchEvents ──────────────────────────────────────────────────────────────

describe("searchEvents", () => {
  const makeEvent = (overrides = {}) => ({
    id: "e1",
    title: "Trail X",
    slug: "trail-x",
    startDate: new Date("2026-01-15"),
    city: "Porto",
    country: "PT",
    sportTypes: ["TRAIL"],
    translations: [{ title: "Trail X PT", city: "Porto" }],
    variants: [
      { name: "20km", distanceKm: 20, price: 25, elevationGainM: 800 },
    ],
    weather: [],
    ...overrides,
  });

  it("returns formatted events", async () => {
    mockEventFindMany.mockResolvedValue([makeEvent()]);

    const result = JSON.parse(await searchEvents({}, locale));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Trail X PT");
    expect(result[0].url).toBe("/pt/events/trail-x");
    expect(result[0].variants[0].distanceKm).toBe(20);
  });

  it("returns message when no events found", async () => {
    mockEventFindMany.mockResolvedValue([]);

    const result = await searchEvents({}, locale);

    expect(result).toBe("No events found matching the criteria.");
  });

  it("applies sportTypes filter", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents({ sportTypes: ["TRAIL"] }, locale);

    const where = mockEventFindMany.mock.calls[0][0].where;
    expect(where.sportTypes).toEqual({ hasSome: ["TRAIL"] });
  });

  it("applies country filter", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents({ country: "PT" }, locale);

    const where = mockEventFindMany.mock.calls[0][0].where;
    expect(where.country).toEqual({ contains: "PT", mode: "insensitive" });
  });

  it("applies date range filters", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents(
      { fromDate: "2026-01-01", toDate: "2026-12-31" },
      locale
    );

    const where = mockEventFindMany.mock.calls[0][0].where;
    expect(where.startDate.gte).toEqual(new Date("2026-01-01"));
    expect(where.startDate.lte).toBeDefined();
  });

  it("includes weather data when present", async () => {
    mockEventFindMany.mockResolvedValue([
      makeEvent({
        weather: [
          {
            date: new Date("2026-01-15"),
            temperature: 12,
            condition: "clear",
            humidity: 60,
            windSpeed: 15,
          },
        ],
      }),
    ]);

    const result = JSON.parse(await searchEvents({}, locale));

    expect(result[0].weather).toHaveLength(1);
    expect(result[0].weather[0].temperature).toBe(12);
  });

  it("applies city and search with AND conditions", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents({ city: "Porto", search: "Trail" }, locale);

    const where = mockEventFindMany.mock.calls[0][0].where;
    expect(where.AND).toBeDefined();
    expect(where.AND).toHaveLength(2);
  });

  it("applies only city with OR conditions", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents({ city: "Porto" }, locale);

    const where = mockEventFindMany.mock.calls[0][0].where;
    expect(where.OR).toBeDefined();
  });

  it("falls back to event title when no translation", async () => {
    mockEventFindMany.mockResolvedValue([makeEvent({ translations: [] })]);

    const result = JSON.parse(await searchEvents({}, locale));

    expect(result[0].title).toBe("Trail X");
  });

  it("respects limit parameter", async () => {
    mockEventFindMany.mockResolvedValue([]);

    await searchEvents({ limit: 5 }, locale);

    expect(mockEventFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });
});

// ── getEventDetails ───────────────────────────────────────────────────────────

describe("getEventDetails", () => {
  const makeDetailEvent = () => ({
    id: "e1",
    title: "Trail X",
    slug: "trail-x",
    description: "A great trail run",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-01-15"),
    city: "Porto",
    country: "PT",
    sportTypes: ["TRAIL"],
    registrationDeadline: new Date("2025-12-31"),
    externalUrl: "https://example.com",
    translations: [
      { title: "Trail X PT", city: "Porto PT", description: "Uma trail" },
    ],
    variants: [
      {
        name: "20km",
        distanceKm: 20,
        price: 25,
        elevationGainM: 800,
        elevationLossM: 750,
        itraPoints: 2,
        atrpGrade: "A",
        cutoffTimeHours: 5,
        translations: [{ name: "20km PT" }],
      },
    ],
    pricingPhases: [
      {
        name: "Phase 1",
        price: 20,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-09-30"),
      },
    ],
    weather: [],
    faqs: [],
  });

  it("returns detailed event info", async () => {
    mockEventFindUnique.mockResolvedValue(makeDetailEvent());

    const result = JSON.parse(await getEventDetails("e1", locale));

    expect(result.title).toBe("Trail X PT");
    expect(result.variants[0].name).toBe("20km PT");
    expect(result.pricingPhases).toHaveLength(1);
    expect(result.registrationDeadline).toBe("2025-12-31");
    expect(result.url).toBe("/pt/events/trail-x");
  });

  it("returns not found message", async () => {
    mockEventFindUnique.mockResolvedValue(null);

    const result = await getEventDetails("bad-id", locale);

    expect(result).toBe("Event not found.");
  });

  it("falls back to event fields when no translation", async () => {
    const event = makeDetailEvent();
    event.translations = [];
    event.variants[0].translations = [];
    mockEventFindUnique.mockResolvedValue(event);

    const result = JSON.parse(await getEventDetails("e1", locale));

    expect(result.title).toBe("Trail X");
    expect(result.description).toBe("A great trail run");
    expect(result.variants[0].name).toBe("20km");
  });
});

// ── getUserEvents ─────────────────────────────────────────────────────────────

describe("getUserEvents", () => {
  const makeParticipation = (startDate: Date) => ({
    id: "p1",
    status: "REGISTERED",
    completionTime: null,
    event: {
      id: "e1",
      title: "Trail Y",
      slug: "trail-y",
      startDate,
      city: "Lisbon",
      country: "PT",
      sportTypes: ["TRAIL"],
      cancelled: false,
      translations: [{ title: "Trail Y PT", city: "Lisboa" }],
      variants: [
        { id: "v1", name: "30km", distanceKm: 30, elevationGainM: 1200 },
      ],
    },
    variant: { id: "v1", name: "30km", distanceKm: 30, elevationGainM: 1200 },
  });

  it("returns all user events when upcoming is undefined", async () => {
    mockParticipationFindMany.mockResolvedValue([
      makeParticipation(new Date("2026-06-01")),
    ]);

    const result = JSON.parse(await getUserEvents("u1", locale));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Trail Y PT");
    expect(result[0].registeredVariant.name).toBe("30km");
    expect(result[0].url).toBe("/pt/events/trail-y");
  });

  it("filters upcoming events", async () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    mockParticipationFindMany.mockResolvedValue([makeParticipation(future)]);

    const result = JSON.parse(await getUserEvents("u1", locale, true));
    expect(result).toHaveLength(1);
  });

  it("filters past events", async () => {
    mockParticipationFindMany.mockResolvedValue([
      makeParticipation(new Date("2020-01-01")),
    ]);

    const result = JSON.parse(await getUserEvents("u1", locale, false));
    expect(result).toHaveLength(1);
  });

  it("returns message when no upcoming events", async () => {
    mockParticipationFindMany.mockResolvedValue([]);

    const result = await getUserEvents("u1", locale, true);

    expect(result).toBe("You have no upcoming events.");
  });

  it("returns message when no events at all", async () => {
    mockParticipationFindMany.mockResolvedValue([]);

    const result = await getUserEvents("u1", locale, false);

    expect(result).toBe("No events found.");
  });

  it("handles participation with no variant", async () => {
    const p = makeParticipation(new Date("2026-06-01"));
    p.variant = null as unknown as typeof p.variant;
    mockParticipationFindMany.mockResolvedValue([p]);

    const result = JSON.parse(await getUserEvents("u1", locale));

    expect(result[0].registeredVariant).toBeNull();
  });
});
