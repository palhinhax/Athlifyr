import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppDownloadSection } from "@/components/app-download-section";

// ── Mocks ─────────────────────────────────────────────────────────────────────

let mockLocale = "en";

jest.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...rest} />
  ),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial: _initial,
      whileInView: _whileInView,
      transition: _transition,
      viewport: _viewport,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    a: ({
      children,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <a {...props}>{children}</a>,
  },
}));

jest.mock("lucide-react", () => ({
  Smartphone: () => <span data-testid="smartphone-icon" />,
}));

const mockAnalyticsEvent = jest.fn();
jest.mock("@/lib/analytics", () => ({
  analyticsEvent: (...args: unknown[]) => mockAnalyticsEvent(...args),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AppDownloadSection", () => {
  beforeEach(() => {
    mockLocale = "en";
    mockAnalyticsEvent.mockClear();
  });

  it("renders the headline and description", () => {
    render(<AppDownloadSection />);

    expect(screen.getByText("appDownloadTitle")).toBeInTheDocument();
    expect(screen.getByText("appDownloadDescription")).toBeInTheDocument();
  });

  it("renders both store badges", () => {
    render(<AppDownloadSection />);

    const appStoreImg = screen.getByAltText("appStoreAlt");
    const googlePlayImg = screen.getByAltText("googlePlayAlt");

    expect(appStoreImg).toBeInTheDocument();
    expect(googlePlayImg).toBeInTheDocument();
  });

  it("renders correct store URLs on badge links", () => {
    render(<AppDownloadSection />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute(
      "href",
      "https://apps.apple.com/pt/app/athlifyr/id6759297452?l=en-GB"
    );
    expect(links[1]).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=com.athlifyr.app"
    );
  });

  it("opens store links in new tab with security attributes", () => {
    render(<AppDownloadSection />);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("loads localized badge images for the current locale", () => {
    mockLocale = "pt";
    render(<AppDownloadSection />);

    const appStoreImg = screen.getByAltText("appStoreAlt");
    const googlePlayImg = screen.getByAltText("googlePlayAlt");

    expect(appStoreImg).toHaveAttribute("src", "/badges/app-store/pt.svg");
    expect(googlePlayImg).toHaveAttribute("src", "/badges/google-play/pt.svg");
  });

  it("falls back to English for unsupported locales", () => {
    mockLocale = "ja";
    render(<AppDownloadSection />);

    const appStoreImg = screen.getByAltText("appStoreAlt");
    const googlePlayImg = screen.getByAltText("googlePlayAlt");

    expect(appStoreImg).toHaveAttribute("src", "/badges/app-store/en.svg");
    expect(googlePlayImg).toHaveAttribute("src", "/badges/google-play/en.svg");
  });

  it.each(["pt", "en", "es", "fr", "de", "it"])(
    "loads correct badge paths for %s locale",
    (locale) => {
      mockLocale = locale;
      render(<AppDownloadSection />);

      const appStoreImg = screen.getByAltText("appStoreAlt");
      const googlePlayImg = screen.getByAltText("googlePlayAlt");

      expect(appStoreImg).toHaveAttribute(
        "src",
        `/badges/app-store/${locale}.svg`
      );
      expect(googlePlayImg).toHaveAttribute(
        "src",
        `/badges/google-play/${locale}.svg`
      );
    }
  );

  it("fires analytics event on App Store badge click", () => {
    render(<AppDownloadSection />);

    const links = screen.getAllByRole("link");
    fireEvent.click(links[0]);

    expect(mockAnalyticsEvent).toHaveBeenCalledWith(
      "Homepage_AppDownload_Click",
      { store: "appStore" }
    );
  });

  it("fires analytics event on Google Play badge click", () => {
    render(<AppDownloadSection />);

    const links = screen.getAllByRole("link");
    fireEvent.click(links[1]);

    expect(mockAnalyticsEvent).toHaveBeenCalledWith(
      "Homepage_AppDownload_Click",
      { store: "googlePlay" }
    );
  });

  it("renders the smartphone icon", () => {
    render(<AppDownloadSection />);
    expect(screen.getByTestId("smartphone-icon")).toBeInTheDocument();
  });
});
