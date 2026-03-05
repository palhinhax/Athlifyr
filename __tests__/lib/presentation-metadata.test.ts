import {
  generatePresentationMetadata,
  SUPPORTED_LOCALES,
  localeToOgLocale,
} from "@/lib/presentation-metadata";

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => {
    const t = (key: string) => {
      const translations: Record<string, string> = {
        title: "Test Title",
        description: "Test Description",
        keywords: "test, keywords",
      };
      return translations[key] ?? key;
    };
    return t;
  }),
}));

describe("presentation-metadata", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("SUPPORTED_LOCALES", () => {
    it("should contain all 6 supported locales", () => {
      expect(SUPPORTED_LOCALES).toEqual(["pt", "en", "es", "fr", "de", "it"]);
      expect(SUPPORTED_LOCALES).toHaveLength(6);
    });
  });

  describe("localeToOgLocale", () => {
    it("should map all supported locales to OG locale format", () => {
      expect(localeToOgLocale).toEqual({
        pt: "pt_PT",
        en: "en_US",
        es: "es_ES",
        fr: "fr_FR",
        de: "de_DE",
        it: "it_IT",
      });
    });
  });

  describe("generatePresentationMetadata", () => {
    it("should generate metadata with correct title and description", async () => {
      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      expect(metadata.title).toBe("Test Title");
      expect(metadata.description).toBe("Test Description");
      expect(metadata.keywords).toBe("test, keywords");
    });

    it("should generate correct canonical URL", async () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";

      const metadata = await generatePresentationMetadata({
        locale: "pt",
        translationNamespace: "test.meta",
        pagePath: "venue",
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.athlifyr.com/pt/presentation/venue"
      );
    });

    it("should generate hreflang alternates for all supported locales", async () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";

      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      const languages = metadata.alternates?.languages as Record<
        string,
        string
      >;
      expect(languages).toBeDefined();

      for (const loc of SUPPORTED_LOCALES) {
        expect(languages[loc]).toBe(
          `https://www.athlifyr.com/${loc}/presentation/live-race`
        );
      }

      expect(languages["x-default"]).toBe(
        "https://www.athlifyr.com/en/presentation/live-race"
      );
    });

    it("should set correct Open Graph metadata", async () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";

      const metadata = await generatePresentationMetadata({
        locale: "pt",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      const og = metadata.openGraph;
      expect(og).toBeDefined();

      if (og && "title" in og) {
        expect(og.title).toBe("Test Title");
        expect(og.description).toBe("Test Description");
        expect(og.url).toBe(
          "https://www.athlifyr.com/pt/presentation/live-race"
        );
        expect(og.siteName).toBe("Athlifyr");
        expect(og.locale).toBe("pt_PT");
        expect((og as Record<string, unknown>).type).toBe("website");
      }
    });

    it("should fallback OG locale to en_US for unknown locales", async () => {
      const metadata = await generatePresentationMetadata({
        locale: "xx",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      const og = metadata.openGraph;
      if (og && "locale" in og) {
        expect(og.locale).toBe("en_US");
      }
    });

    it("should set correct Twitter metadata", async () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";

      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "venue",
      });

      const twitter = metadata.twitter;
      expect(twitter).toBeDefined();

      if (twitter && "title" in twitter) {
        expect((twitter as Record<string, unknown>).card).toBe(
          "summary_large_image"
        );
        expect(twitter.title).toBe("Test Title");
        expect(twitter.description).toBe("Test Description");
        expect(twitter.creator).toBe("@athlifyr");
      }
    });

    it("should set correct robots metadata", async () => {
      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      const robots = metadata.robots;
      expect(robots).toBeDefined();

      if (robots && typeof robots === "object") {
        expect(robots).toEqual({
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        });
      }
    });

    it("should use default base URL when env variable is not set", async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;

      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.athlifyr.com/en/presentation/live-race"
      );
    });

    it("should include OG image with correct dimensions", async () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";

      const metadata = await generatePresentationMetadata({
        locale: "en",
        translationNamespace: "test.meta",
        pagePath: "live-race",
      });

      const og = metadata.openGraph;
      if (og && "images" in og && Array.isArray(og.images)) {
        expect(og.images).toHaveLength(1);
        expect(og.images[0]).toEqual({
          url: "https://www.athlifyr.com/logo.png",
          width: 1200,
          height: 630,
          alt: "Test Title",
        });
      }
    });
  });
});
