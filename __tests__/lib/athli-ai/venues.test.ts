/**
 * @jest-environment node
 */

import { searchVenues, getVenueDetails } from "@/lib/athli-ai/venues";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockFindMany = prisma.venue.findMany as jest.Mock;
const mockFindUnique = prisma.venue.findUnique as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const locale = "pt";

// ── searchVenues ──────────────────────────────────────────────────────────────

describe("searchVenues", () => {
  const makeVenue = (overrides = {}) => ({
    id: "v1",
    name: "Box Alpha",
    slug: "box-alpha",
    type: "CROSSFIT_BOX",
    sportTypes: ["CROSSFIT"],
    city: "Porto",
    country: "PT",
    description: "A CrossFit box",
    translations: [{ description: "Uma box de CrossFit" }],
    _count: { reviews: 42 },
    ...overrides,
  });

  it("returns formatted venues", async () => {
    mockFindMany.mockResolvedValue([makeVenue()]);

    const result = JSON.parse(await searchVenues({}, locale));

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Box Alpha");
    expect(result[0].url).toBe("/pt/v/box-alpha");
    expect(result[0].reviewCount).toBe(42);
  });

  it("returns not found message when empty", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await searchVenues({}, locale);

    expect(result).toBe("No venues found matching the criteria.");
  });

  it("applies sportTypes filter", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchVenues({ sportTypes: ["CROSSFIT"] }, locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.sportTypes).toEqual({ hasSome: ["CROSSFIT"] });
  });

  it("applies city filter", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchVenues({ city: "Porto" }, locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.city).toEqual({ contains: "Porto", mode: "insensitive" });
  });

  it("applies search filter", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchVenues({ search: "alpha" }, locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.OR).toBeDefined();
    expect(where.OR).toHaveLength(2);
  });

  it("applies venue type filter", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchVenues({ venueType: "MASSAGE" }, locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.type).toBe("MASSAGE");
  });

  it("respects limit parameter", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchVenues({ limit: 5 }, locale);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  it("falls back to base description when no translation", async () => {
    mockFindMany.mockResolvedValue([makeVenue({ translations: [] })]);

    const result = JSON.parse(await searchVenues({}, locale));

    expect(result[0].description).toBe("A CrossFit box");
  });

  it("truncates description to 200 chars", async () => {
    mockFindMany.mockResolvedValue([
      makeVenue({ translations: [{ description: "x".repeat(300) }] }),
    ]);

    const result = JSON.parse(await searchVenues({}, locale));

    expect(result[0].description).toHaveLength(200);
  });
});

// ── getVenueDetails ───────────────────────────────────────────────────────────

describe("getVenueDetails", () => {
  const makeDetailVenue = () => ({
    id: "v1",
    name: "Box Alpha",
    slug: "box-alpha",
    type: "CROSSFIT_BOX",
    sportTypes: ["CROSSFIT"],
    services: ["PT", "NUTRITION"],
    description: "Full description here",
    city: "Porto",
    country: "PT",
    address: "Rua X 123",
    phone: "+351123456789",
    email: "info@boxalpha.com",
    website: "https://boxalpha.com",
    instagram: "@boxalpha",
    requiresPlanToBook: true,
    enableTrialBooking: true,
    translations: [{ description: "Descrição completa" }],
    plans: [
      {
        id: "plan1",
        name: "Unlimited",
        description: "Full access",
        price: 65,
        currency: "EUR",
        policy: "monthly",
      },
    ],
    members: [
      { user: { id: "c1", name: "Coach John", image: null }, role: "COACH" },
    ],
    _count: { reviews: 42, sessions: 100 },
  });

  it("returns detailed venue info", async () => {
    mockFindUnique.mockResolvedValue(makeDetailVenue());

    const result = JSON.parse(await getVenueDetails("v1", locale));

    expect(result.name).toBe("Box Alpha");
    expect(result.plans).toHaveLength(1);
    expect(result.plans[0].price).toBe(65);
    expect(result.team).toHaveLength(1);
    expect(result.team[0].name).toBe("Coach John");
    expect(result.url).toBe("/pt/v/box-alpha");
  });

  it("returns not found message", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getVenueDetails("bad", locale);

    expect(result).toBe("Venue not found.");
  });

  it("falls back to base description when no translation", async () => {
    const venue = makeDetailVenue();
    venue.translations = [];
    mockFindUnique.mockResolvedValue(venue);

    const result = JSON.parse(await getVenueDetails("v1", locale));

    expect(result.description).toBe("Full description here");
  });

  it("truncates description to 500 chars", async () => {
    const venue = makeDetailVenue();
    venue.translations = [{ description: "x".repeat(600) }];
    mockFindUnique.mockResolvedValue(venue);

    const result = JSON.parse(await getVenueDetails("v1", locale));

    expect(result.description).toHaveLength(500);
  });
});
