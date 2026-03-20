/**
 * @jest-environment node
 */

import { searchGiveaways } from "@/lib/athli-ai/giveaways";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findMany: jest.fn() },
  },
}));

const mockFindMany = prisma.giveaway.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const locale = "pt";

const makeGiveaway = () => ({
  id: "g1",
  status: "SCHEDULED",
  drawAt: new Date("2026-01-20T18:00:00Z"),
  prizeCount: 3,
  translations: [{ title: "Trail Giveaway", details: "Win free entry!" }],
  event: {
    id: "e1",
    title: "Trail X",
    slug: "trail-x",
    startDate: new Date("2026-02-01"),
    translations: [{ title: "Trail X PT" }],
  },
  _count: { participations: 150 },
});

describe("searchGiveaways", () => {
  it("returns formatted giveaways", async () => {
    mockFindMany.mockResolvedValue([makeGiveaway()]);

    const result = JSON.parse(await searchGiveaways(locale));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Trail Giveaway");
    expect(result[0].prizeCount).toBe(3);
    expect(result[0].participantsCount).toBe(150);
    expect(result[0].event.url).toBe("/pt/events/trail-x");
  });

  it("returns no giveaways message", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await searchGiveaways(locale);

    expect(result).toBe("No giveaways found.");
  });

  it("filters active giveaways", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchGiveaways(locale, "active");

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.status).toBe("SCHEDULED");
    expect(where.drawAt).toBeDefined();
  });

  it("filters drawn giveaways", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchGiveaways(locale, "drawn");

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.status).toBe("DRAWN");
  });

  it("uses default filter for unknown status", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchGiveaways(locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.status).toEqual({ in: ["SCHEDULED", "DRAWING"] });
  });

  it("falls back to defaults when no translations", async () => {
    const g = makeGiveaway();
    g.translations = [];
    g.event.translations = [];
    mockFindMany.mockResolvedValue([g]);

    const result = JSON.parse(await searchGiveaways(locale));

    expect(result[0].title).toBe("Giveaway");
    expect(result[0].event.title).toBe("Trail X");
  });

  it("truncates details to 300 chars", async () => {
    const g = makeGiveaway();
    g.translations = [{ title: "Test", details: "x".repeat(500) }];
    mockFindMany.mockResolvedValue([g]);

    const result = JSON.parse(await searchGiveaways(locale));

    expect(result[0].details).toHaveLength(300);
  });
});
