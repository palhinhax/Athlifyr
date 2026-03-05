import { render } from "@testing-library/react";
import LiveRacePresentation, {
  generateMetadata,
} from "@/app/[locale]/presentation/live-race/page";

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => {
    const t = (key: string) => {
      const translations: Record<string, string> = {
        title: "Live Race Tracking",
        description: "Free live race tracking platform",
        keywords: "live race, tracking, GPS",
      };
      return translations[key] ?? key;
    };
    return t;
  }),
}));

// Mock client components
jest.mock("@/components/presentations/live-race-presentation-client", () => ({
  LiveRacePresentationClient: () => (
    <div data-testid="live-race-presentation-client">Presentation Client</div>
  ),
}));

jest.mock("@/components/presentations/live-race-faq-section", () => ({
  LiveRaceFAQSection: () => (
    <div data-testid="live-race-faq-section">FAQ Section</div>
  ),
}));

jest.mock("@/components/presentations/live-race-seo-content", () => ({
  LiveRaceSEOContent: () => (
    <div data-testid="live-race-seo-content">SEO Content</div>
  ),
}));

jest.mock("@/components/structured-data", () => ({
  StructuredData: ({ data }: { data: object }) => (
    <script
      data-testid="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  ),
}));

describe("LiveRacePresentation Page", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_BASE_URL = "https://www.athlifyr.com";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("generateMetadata", () => {
    it("should return metadata with correct title and description", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(metadata.title).toBe("Live Race Tracking");
      expect(metadata.description).toBe("Free live race tracking platform");
    });

    it("should generate metadata for different locales", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.athlifyr.com/pt/presentation/live-race"
      );
    });
  });

  describe("LiveRacePresentation component", () => {
    it("should render all child components", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      expect(getByTestId("structured-data")).toBeInTheDocument();
      expect(getByTestId("live-race-presentation-client")).toBeInTheDocument();
      expect(getByTestId("live-race-seo-content")).toBeInTheDocument();
      expect(getByTestId("live-race-faq-section")).toBeInTheDocument();
    });

    it("should pass correct structured data schema", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent["@context"]).toBe("https://schema.org");
      expect(jsonContent["@type"]).toBe("SoftwareApplication");
      expect(jsonContent.name).toBe("Athlifyr Live Race");
      expect(jsonContent.applicationCategory).toBe("BusinessApplication");
      expect(jsonContent.applicationSubCategory).toBe(
        "Event Management Software"
      );
      expect(jsonContent.operatingSystem).toBe("Web");
    });

    it("should use locale-specific description in structured data", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "pt" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.description).toContain(
        "Plataforma gratuita de rastreamento ao vivo"
      );
      expect(jsonContent.url).toBe(
        "https://www.athlifyr.com/pt/presentation/live-race"
      );
    });

    it("should fallback to English description for unknown locales", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "xx" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.description).toContain(
        "Free live race tracking and event management platform"
      );
    });

    it("should include correct feature list in structured data", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.featureList).toContain(
        "Real-time GPS Athlete Tracking"
      );
      expect(jsonContent.featureList).toContain("Live Leaderboard & Rankings");
      expect(jsonContent.featureList).toContain("Online Race Registration");
      expect(jsonContent.featureList).toContain("GPX Route Editor");
      expect(jsonContent.featureList).toHaveLength(12);
    });

    it("should include correct offers in structured data", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.offers).toEqual({
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      });
    });

    it("should include author information in structured data", async () => {
      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.author).toEqual({
        "@type": "Organization",
        name: "Athlifyr",
        url: "https://www.athlifyr.com",
      });
    });

    it("should use default base URL when env variable is not set", async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;

      const Component = await LiveRacePresentation({
        params: Promise.resolve({ locale: "en" }),
      });

      const { getByTestId } = render(<>{Component}</>);

      const scriptTag = getByTestId("structured-data");
      const jsonContent = JSON.parse(scriptTag.innerHTML);

      expect(jsonContent.url).toBe(
        "https://www.athlifyr.com/en/presentation/live-race"
      );
      expect(jsonContent.image).toBe("https://www.athlifyr.com/logo.png");
    });

    it("should generate correct structured data for all supported locales", async () => {
      const locales = ["pt", "en", "es", "fr", "de", "it"];

      for (const locale of locales) {
        const Component = await LiveRacePresentation({
          params: Promise.resolve({ locale }),
        });

        const { getByTestId, unmount } = render(<>{Component}</>);

        const scriptTag = getByTestId("structured-data");
        const jsonContent = JSON.parse(scriptTag.innerHTML);

        expect(jsonContent.url).toBe(
          `https://www.athlifyr.com/${locale}/presentation/live-race`
        );
        expect(jsonContent.description).toBeTruthy();
        expect(jsonContent.description.length).toBeGreaterThan(50);

        unmount();
      }
    });
  });
});
