import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "../globals.css";
import { Link } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { NavigationProgress } from "@/components/navigation-progress";
import { ActiveVenuesBar } from "@/components/active-venues-bar";
import { AthliFloatingChat } from "@/components/athli/athli-floating-chat";
import { ThemeProvider } from "@/components/theme-provider";
import { Smartphone } from "lucide-react";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  GOOGLE_PLAY_ENABLED,
} from "@/lib/constants";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import packageJson from "@/package.json";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { VercelAnalytics } from "@/components/vercel-analytics";
import { AppSidebar } from "@/components/app-sidebar";
import { LogoLink } from "@/components/logo-link";
import { GlobalSearch } from "@/components/global-search";
import { UserNav } from "@/components/user-nav";
import { MobileNav } from "@/components/mobile-nav";
import { NotificationBell } from "@/components/notification-bell";
import { AnalysisButton } from "@/components/analysis-button";
import { SkipLink } from "@/components/skip-link";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  // CRITICAL: Always use www subdomain for canonical URLs and SEO consistency
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com"
  ),
  title: {
    default: "Athlifyr - one place. all sports.",
    template: "%s | Athlifyr",
  },
  description:
    "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events near you. Find races, competitions and challenges near you.",
  keywords: [
    "sports events",
    "running",
    "trail",
    "HYROX",
    "CrossFit",
    "OCR",
    "BTT",
    "cycling",
    "surf",
    "triathlon",
    "Portugal",
    "eventos desportivos",
    "corrida",
    "competição",
  ],
  authors: [{ name: "Athlifyr" }],
  creator: "Athlifyr",
  publisher: "Athlifyr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Athlifyr - one place. all sports.",
    description:
      "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events near you.",
    url: "https://www.athlifyr.com",
    siteName: "Athlifyr",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Athlifyr - one place. all sports.",
      },
    ],
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Athlifyr - one place. all sports.",
    description:
      "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events near you.",
    images: ["/logo.png"],
    creator: "@athlifyr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.athlifyr.com",
    languages: {
      pt: "https://www.athlifyr.com/pt",
      en: "https://www.athlifyr.com/en",
      es: "https://www.athlifyr.com/es",
      fr: "https://www.athlifyr.com/fr",
      de: "https://www.athlifyr.com/de",
      it: "https://www.athlifyr.com/it",
      "x-default": "https://www.athlifyr.com/pt",
    },
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: 'verification-code',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages({ locale });

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Generate structured data schemas for the site
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="4LNSLNsFfe"
          strategy="afterInteractive"
        />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <NavigationProgress />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SessionProvider>
              {/* Skip to main content link for accessibility (WCAG 2.4.1) */}
              <SkipLink />
              <div className="flex min-h-screen">
                {/* Sidebar - Desktop only */}
                <AppSidebar />

                {/* Main content area */}
                <div className="flex flex-1 flex-col">
                  {/* Simplified Header - Logo, Search, User */}
                  <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
                    <div className="container flex h-16 items-center justify-between">
                      <LogoLink />

                      {/* Search - Desktop */}
                      <div className="hidden flex-1 justify-center px-8 md:flex">
                        <GlobalSearch />
                      </div>

                      {/* User Nav - Desktop */}
                      <div className="hidden items-center gap-2 md:flex">
                        <AnalysisButton />
                        <NotificationBell />
                        <UserNav />
                      </div>

                      {/* Mobile Navigation */}
                      <div className="md:hidden">
                        <MobileNav />
                      </div>
                    </div>
                  </header>

                  {/* Active Venues Quick Access Bar */}
                  <ActiveVenuesBar />

                  <main id="main-content" className="flex-1" tabIndex={-1}>
                    {children}
                  </main>
                  <footer className="border-t border-border/60 bg-muted/30 py-6">
                    <div className="container">
                      <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
                        <p className="text-center md:text-left">
                          Athlifyr - ONE PLACE. ALL SPORTS.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          <Link
                            href="/presentation/venue"
                            className="transition-colors hover:text-foreground"
                          >
                            Gym Management
                          </Link>
                          <Link
                            href="/presentation/live-race"
                            className="transition-colors hover:text-foreground"
                          >
                            Live Race
                          </Link>
                          <Link
                            href="/contact"
                            className="transition-colors hover:text-foreground"
                          >
                            Contact
                          </Link>
                          <Link
                            href="/privacy"
                            className="transition-colors hover:text-foreground"
                          >
                            Privacy
                          </Link>
                          <Link
                            href="/terms"
                            className="transition-colors hover:text-foreground"
                          >
                            Terms
                          </Link>
                          <Link
                            href="/cookies"
                            className="transition-colors hover:text-foreground"
                          >
                            Cookies
                          </Link>
                          <a
                            href="https://www.instagram.com/athlifyr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                            aria-label="Segue-nos no Instagram"
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                width="20"
                                height="20"
                                x="2"
                                y="2"
                                rx="5"
                                ry="5"
                              />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                            <span>@athlifyr</span>
                          </a>
                          <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                            aria-label="Download on the App Store"
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            <span>iOS</span>
                          </a>
                          {GOOGLE_PLAY_ENABLED && (
                            <a
                              href={GOOGLE_PLAY_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                              aria-label="Get it on Google Play"
                            >
                              <Smartphone className="h-4 w-4" />
                              <span>Android</span>
                            </a>
                          )}
                        </div>
                        <p className="text-center text-xs md:text-right">
                          © 2026 Athlifyr • v{packageJson.version}
                        </p>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
              <Toaster />
              <CookieConsent />
              <AthliFloatingChat />
            </SessionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
