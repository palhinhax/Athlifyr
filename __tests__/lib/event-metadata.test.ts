import { generateEventMetadata } from "@/lib/event-metadata";
import { SportType } from "@prisma/client";

// Mock dependencies
jest.mock("@/lib/event-utils", () => ({
  formatDate: jest.fn(() => "1 Fev 2026"),
  sportTypeLabels: {
    RUNNING: "Corrida",
    TRAIL: "Trail",
    WALKING: "Caminhada",
    HYROX: "HYROX",
    CROSSFIT: "Cross Training",
    OCR: "OCR",
    BTT: "BTT",
    CYCLING: "Ciclismo",
    SURF: "Surf",
    TRIATHLON: "Triatlo",
    SWIMMING: "Natação",
    OTHER: "Outros",
  },
}));

jest.mock("@/lib/presentation-metadata", () => ({
  SUPPORTED_LOCALES: ["pt", "en", "es", "fr", "de", "it"],
  localeToOgLocale: {
    pt: "pt_PT",
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
    it: "it_IT",
  },
}));

const baseEvent = {
  slug: "trail-manuelino-2026",
  title: "Trail Manuelino 2026",
  description: "Um grande trail em Abiul",
  sportTypes: [SportType.TRAIL],
  startDate: new Date("2026-02-01"),
  city: "Abiul",
  country: "Portugal",
  imageUrl: "https://example.com/image.jpg",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-06-01"),
  metaTitle: null,
  metaDescription: null,
};

describe("generateEventMetadata", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";
  });

  it("generates metadata with auto-generated title when no metaTitle", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    expect(metadata.title).toBe("Trail Manuelino 2026 - Trail | Athlifyr");
  });

  it("uses custom metaTitle when provided", async () => {
    const event = {
      ...baseEvent,
      metaTitle: "Custom SEO Title for Trail",
    };
    const metadata = await generateEventMetadata({ event });
    expect(metadata.title).toBe("Custom SEO Title for Trail");
  });

  it("uses custom metaDescription when provided", async () => {
    const event = {
      ...baseEvent,
      metaDescription: "Custom description for SEO",
    };
    const metadata = await generateEventMetadata({ event });
    expect(metadata.description).toBe("Custom description for SEO");
  });

  it("auto-generates description with date and location", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    expect(metadata.description).toContain("Abiul");
    expect(metadata.description).toContain("Portugal");
  });

  it("truncates long descriptions", async () => {
    const event = {
      ...baseEvent,
      description: "A".repeat(200),
    };
    const metadata = await generateEventMetadata({ event });
    expect(metadata.description!.length).toBeLessThanOrEqual(200);
    expect(metadata.description).toContain("...");
  });

  it("uses default locale pt if not specified", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    expect(metadata.openGraph?.locale).toBe("pt_PT");
  });

  it("uses specified locale", async () => {
    const metadata = await generateEventMetadata({
      event: baseEvent,
      locale: "en",
    });
    expect(metadata.openGraph?.locale).toBe("en_US");
  });

  it("generates canonical URL with locale and slug", async () => {
    const metadata = await generateEventMetadata({
      event: baseEvent,
      locale: "en",
    });
    expect(metadata.alternates?.canonical).toBe(
      "https://www.athlifyr.com/en/events/trail-manuelino-2026"
    );
  });

  it("generates hreflang alternates for all supported locales", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["pt"]).toContain("/pt/events/");
    expect(languages["en"]).toContain("/en/events/");
    expect(languages["es"]).toContain("/es/events/");
    expect(languages["fr"]).toContain("/fr/events/");
    expect(languages["de"]).toContain("/de/events/");
    expect(languages["it"]).toContain("/it/events/");
    expect(languages["x-default"]).toContain("/pt/events/");
  });

  it("generates OpenGraph metadata", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.title).toContain("Trail Manuelino 2026");
    expect(og?.siteName).toBe("Athlifyr");
    expect(og?.type).toBe("article");
    expect(og?.images).toHaveLength(1);
  });

  it("generates Twitter card metadata", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    const twitter = metadata.twitter as Record<string, unknown>;
    expect(twitter?.card).toBe("summary_large_image");
    expect(twitter?.creator).toBe("@athlifyr");
  });

  it("uses fallback image when no imageUrl", async () => {
    const event = { ...baseEvent, imageUrl: null };
    const metadata = await generateEventMetadata({ event });
    const images = metadata.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toContain("logo.png");
  });

  it("makes relative imageUrl absolute", async () => {
    const event = { ...baseEvent, imageUrl: "/uploads/image.jpg" };
    const metadata = await generateEventMetadata({ event });
    const images = metadata.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe("https://www.athlifyr.com/uploads/image.jpg");
  });

  it("includes keywords with sport type and location", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    const keywords = metadata.keywords as string;
    expect(keywords).toContain("Trail");
    expect(keywords).toContain("Abiul");
    expect(keywords).toContain("Portugal");
  });

  it("sets robots to index and follow", async () => {
    const metadata = await generateEventMetadata({ event: baseEvent });
    const robots = metadata.robots as Record<string, unknown>;
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });
});
