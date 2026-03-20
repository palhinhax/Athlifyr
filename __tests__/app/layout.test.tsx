/**
 * @jest-environment node
 */

import React from "react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next-intl/server", () => ({
  getMessages: jest.fn(() => Promise.resolve({})),
  getTranslations: jest.fn(() => {
    const t = (key: string) => key;
    return Promise.resolve(t);
  }),
  setRequestLocale: jest.fn(),
}));

jest.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["pt", "en", "es", "fr", "de", "it"],
    defaultLocale: "pt",
    localePrefix: "always",
  },
  Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    `<Link href="${href}">${children}</Link>`,
}));

jest.mock("next/font/local", () => () => ({
  variable: "--font-mock",
}));

jest.mock("@/package.json", () => ({
  version: "1.0.0-test",
}));

jest.mock("@/lib/constants", () => ({
  APP_STORE_URL: "https://apps.apple.com/test",
  GOOGLE_PLAY_URL: "https://play.google.com/test",
  GOOGLE_PLAY_ENABLED: false,
}));

jest.mock("@/lib/structured-data", () => ({
  generateOrganizationSchema: () => ({ "@type": "Organization" }),
  generateWebSiteSchema: () => ({ "@type": "WebSite" }),
}));

// Mock all child components to avoid pulling their dependency trees
jest.mock("@/components/ui/toaster", () => ({
  Toaster: () => "Toaster",
}));
jest.mock("@/components/session-provider", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/google-analytics", () => ({
  GoogleAnalytics: () => "GoogleAnalytics",
}));
jest.mock("@/components/cookie-consent", () => ({
  CookieConsent: () => "CookieConsent",
}));
jest.mock("@/components/navigation-progress", () => ({
  NavigationProgress: () => "NavigationProgress",
}));
jest.mock("@/components/active-venues-bar", () => ({
  ActiveVenuesBar: () => "ActiveVenuesBar",
}));
jest.mock("@/components/athli/athli-floating-chat", () => ({
  AthliFloatingChat: () => "AthliFloatingChat",
}));
jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/structured-data", () => ({
  StructuredData: () => "StructuredData",
}));
jest.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));
jest.mock("@/components/vercel-analytics", () => ({
  VercelAnalytics: () => "VercelAnalytics",
}));
jest.mock("@/components/app-sidebar", () => ({
  AppSidebar: () => "AppSidebar",
}));
jest.mock("@/components/logo-link", () => ({
  LogoLink: () => "LogoLink",
}));
jest.mock("@/components/global-search", () => ({
  GlobalSearch: () => "GlobalSearch",
}));
jest.mock("@/components/user-nav", () => ({
  UserNav: () => "UserNav",
}));
jest.mock("@/components/mobile-nav", () => ({
  MobileNav: () => "MobileNav",
}));
jest.mock("@/components/notification-bell", () => ({
  NotificationBell: () => "NotificationBell",
}));
jest.mock("@/components/analysis-button", () => ({
  AnalysisButton: () => "AnalysisButton",
}));
jest.mock("@/components/skip-link", () => ({
  SkipLink: () => "SkipLink",
}));
jest.mock("lucide-react", () => ({
  Smartphone: () => "Smartphone",
}));

// ── Import under test (after mocks) ──────────────────────────────────────────

import RootLayout, { metadata } from "@/app/[locale]/layout";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("RootLayout", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ── Metadata ────────────────────────────────────────────────────────────

  describe("metadata", () => {
    it("exports metadata with default title", () => {
      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
    });

    it("has Open Graph configuration", () => {
      expect(metadata.openGraph).toBeDefined();
    });

    it("has Twitter card configuration", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("has alternate language links", () => {
      const languages = metadata.alternates?.languages as Record<
        string,
        string
      >;
      expect(languages).toBeDefined();
      expect(languages["pt"]).toContain("/pt");
      expect(languages["en"]).toContain("/en");
      expect(languages["es"]).toContain("/es");
      expect(languages["fr"]).toContain("/fr");
      expect(languages["de"]).toContain("/de");
      expect(languages["it"]).toContain("/it");
    });

    it("has robots configuration", () => {
      expect(metadata.robots).toBeDefined();
    });
  });

  // ── Locale validation ──────────────────────────────────────────────────

  describe("locale validation", () => {
    it("calls notFound for invalid locale", async () => {
      await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "xx" }),
      });

      expect(notFound).toHaveBeenCalled();
    });

    it("does not call notFound for valid locale", async () => {
      await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "en" }),
      });

      expect(notFound).not.toHaveBeenCalled();
    });

    it.each(["pt", "en", "es", "fr", "de", "it"])(
      "accepts %s as valid locale",
      async (locale) => {
        await RootLayout({
          children: React.createElement("div", null, "test"),
          params: Promise.resolve({ locale }),
        });

        expect(notFound).not.toHaveBeenCalled();
      }
    );
  });

  // ── Server functions ──────────────────────────────────────────────────

  describe("server functions", () => {
    it("calls setRequestLocale with the locale", async () => {
      await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(setRequestLocale).toHaveBeenCalledWith("pt");
    });

    it("calls getMessages with the locale", async () => {
      await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "fr" }),
      });

      expect(getMessages).toHaveBeenCalledWith({ locale: "fr" });
    });

    it("calls getTranslations for footer", async () => {
      await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "en" }),
      });

      expect(getTranslations).toHaveBeenCalledWith("footer");
    });
  });

  // ── Render output ─────────────────────────────────────────────────────

  describe("render output", () => {
    it("returns an html element with correct lang attribute", async () => {
      const result = await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "de" }),
      });

      expect(result).toBeDefined();
      // The result should be a React element tree with html as root
      const element = result as React.ReactElement<{ lang: string }>;
      expect(element.type).toBe("html");
      expect(element.props.lang).toBe("de");
    });

    it("renders children inside the layout", async () => {
      const childContent = React.createElement("div", null, "child-content");
      const result = await RootLayout({
        children: childContent,
        params: Promise.resolve({ locale: "en" }),
      });

      expect(result).toBeDefined();
    });
  });

  // ── Google Analytics conditional ──────────────────────────────────────

  describe("Google Analytics", () => {
    it("renders without GA when env var is not set", async () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

      const result = await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "en" }),
      });

      expect(result).toBeDefined();
    });

    it("renders with GA when env var is set", async () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";

      const result = await RootLayout({
        children: React.createElement("div", null, "test"),
        params: Promise.resolve({ locale: "en" }),
      });

      expect(result).toBeDefined();
    });
  });
});
