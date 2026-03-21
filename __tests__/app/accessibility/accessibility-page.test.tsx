/**
 * @jest-environment node
 */

import AccessibilityPage, {
  generateMetadata,
} from "@/app/[locale]/accessibility/page";

jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
}));

jest.mock("@/components/page-container", () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => children,
}));

describe("AccessibilityPage", () => {
  describe("generateMetadata", () => {
    it("returns correct title and description", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(metadata.title).toBe(
        "Declaração de Acessibilidade e Usabilidade | Athlifyr"
      );
      expect(metadata.description).toBe(
        "Declaração de Acessibilidade e Usabilidade do sítio web Athlifyr, conforme o Decreto-Lei n.º 83/2018, de 19 de outubro."
      );
    });

    it("includes canonical URL with locale", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.athlifyr.com/pt/accessibility"
      );
    });
  });

  describe("page component", () => {
    it("renders without errors for en locale", async () => {
      const result = await AccessibilityPage({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(result).toBeDefined();
    });

    it("renders without errors for pt locale", async () => {
      const result = await AccessibilityPage({
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(result).toBeDefined();
    });
  });
});
