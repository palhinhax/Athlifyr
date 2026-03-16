/**
 * @jest-environment node
 */

import TermsPage from "@/app/[locale]/terms/page";

jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    `<a href="${href}">${children}</a>`,
}));

jest.mock("lucide-react", () => ({
  ChevronLeft: () => "ChevronLeft",
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode; asChild?: boolean }) =>
    children,
}));

jest.mock("@/components/page-container", () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => children,
}));

describe("TermsPage", () => {
  it("renders without errors", async () => {
    const result = await TermsPage({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(result).toBeDefined();
  });
});
