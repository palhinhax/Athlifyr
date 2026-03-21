/**
 * @jest-environment node
 */

const mockFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(() =>
    Promise.resolve(new Headers({ "x-vercel-ip-country": "PT" }))
  ),
}));

const mockTranslations: Record<string, string> = {
  heroTitle: "Welcome",
  heroTitleHighlight: "Athlifyr",
  heroDescription: "Find events near you",
  heroDescriptionCountry: "Events in {country}",
  upcomingEventsTitle: "Upcoming in {country}",
  seeAll: "See All",
  noUpcomingEventsTitle: "No events in {country}",
  noUpcomingEventsDescription: "Check back soon",
  exploreAllEvents: "Explore All Events",
  ctaTitle: "Get Started",
  ctaDescription: "Join now",
};

const mockNavTranslations: Record<string, string> = {
  events: "Events",
};

jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
  getTranslations: jest.fn(
    ({ namespace }: { locale: string; namespace: string }) => {
      const translations =
        namespace === "navigation" ? mockNavTranslations : mockTranslations;
      const t = (key: string, params?: Record<string, string>) => {
        let value = translations[key] ?? key;
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            value = value.replace(`{${k}}`, v);
          }
        }
        return value;
      };
      return t;
    }
  ),
}));

jest.mock("@/lib/event-utils", () => ({
  getUserCountry: () => "PT",
}));

jest.mock("@/components/event-card", () => ({
  EventCard: ({ event }: { event: { id: string } }) => (
    <div data-testid={`event-card-${event.id}`}>Event</div>
  ),
}));

jest.mock("@/components/home-client-tracking", () => ({
  HomeCtaSection: () => <div data-testid="cta-section">CTA</div>,
  HomeSeeAllButton: () => <div data-testid="see-all-button">See All</div>,
  HomeNoEventsCta: () => <div data-testid="no-events-cta">Explore</div>,
}));

jest.mock("@/components/app-download-section", () => ({
  AppDownloadSection: () => (
    <div data-testid="app-download-section">Download</div>
  ),
}));

import Home from "@/app/[locale]/page";

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue(null);
    mockFindMany.mockResolvedValue([]);
  });

  it("redirects authenticated users to feed", async () => {
    mockAuth.mockResolvedValue({ user: { id: "1", name: "Test" } });

    await Home({ params: Promise.resolve({ locale: "en" }) });

    expect(mockRedirect).toHaveBeenCalledWith("/en/feed");
  });

  it("renders without errors for unauthenticated users", async () => {
    const result = await Home({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(result).toBeDefined();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("renders with upcoming events", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "evt-1",
        title: "Trail Run",
        startDate: new Date(),
        variants: [],
        _count: { comments: 0, giveaways: 0 },
      },
      {
        id: "evt-2",
        title: "Marathon",
        startDate: new Date(),
        variants: [],
        _count: { comments: 0, giveaways: 0 },
      },
    ]);

    const result = await Home({
      params: Promise.resolve({ locale: "pt" }),
    });

    expect(result).toBeDefined();
    expect(mockFindMany).toHaveBeenCalled();
  });
});
