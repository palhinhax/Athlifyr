/**
 * @jest-environment node
 */

import { getPlatformInfo } from "@/lib/athli-ai/platform";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    platformKnowledge: { findMany: jest.fn() },
  },
}));

const mockFindMany = prisma.platformKnowledge.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const locale = "pt";

const makeArticle = (overrides = {}) => ({
  id: "a1",
  title: "Getting Started",
  content: "Welcome to Athlifyr!",
  category: "about",
  priority: 1,
  language: "pt",
  ...overrides,
});

describe("getPlatformInfo", () => {
  it("returns formatted articles", async () => {
    mockFindMany.mockResolvedValue([makeArticle()]);

    const result = await getPlatformInfo({}, locale);

    expect(result).toContain("## Getting Started");
    expect(result).toContain("Welcome to Athlifyr!");
  });

  it("concatenates multiple articles with separator", async () => {
    mockFindMany.mockResolvedValue([
      makeArticle({ title: "A", content: "Content A" }),
      makeArticle({ id: "a2", title: "B", content: "Content B" }),
    ]);

    const result = await getPlatformInfo({}, locale);

    expect(result).toContain("## A");
    expect(result).toContain("## B");
    expect(result).toContain("---");
  });

  it("returns not found message when empty", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getPlatformInfo({}, locale);

    expect(result).toContain("No platform information found");
  });

  it("filters by category", async () => {
    mockFindMany.mockResolvedValue([makeArticle()]);

    await getPlatformInfo({ category: "pricing" }, locale);

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.category).toBe("pricing");
  });

  it("falls back to Portuguese when no results in user language", async () => {
    // First call (user lang) returns empty, second call (pt) returns articles
    mockFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeArticle({ language: "pt" })]);

    const result = await getPlatformInfo({}, "en");

    expect(mockFindMany).toHaveBeenCalledTimes(2);
    expect(result).toContain("## Getting Started");
  });

  it("filters by search term", async () => {
    mockFindMany.mockResolvedValue([
      makeArticle({ title: "Pricing", content: "Free for everyone" }),
      makeArticle({ id: "a2", title: "Features", content: "Run tracking" }),
    ]);

    const result = await getPlatformInfo({ search: "free" }, locale);

    expect(result).toContain("## Pricing");
    // Features article doesn't match "free" but is still returned as fallback
  });

  it("returns all articles when search has no match", async () => {
    mockFindMany.mockResolvedValue([
      makeArticle({ title: "About", content: "Info" }),
    ]);

    const result = await getPlatformInfo({ search: "zzzznotfound" }, locale);

    // Falls back to all results
    expect(result).toContain("## About");
  });

  it("matches search in category name", async () => {
    mockFindMany.mockResolvedValue([
      makeArticle({ title: "Plans", content: "Details", category: "pricing" }),
    ]);

    const result = await getPlatformInfo({ search: "pricing" }, locale);

    expect(result).toContain("## Plans");
  });
});
