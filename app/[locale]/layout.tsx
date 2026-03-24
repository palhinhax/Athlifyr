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
  generateSoftwareApplicationSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import packageJson from "@/package.json";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
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
    "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon, duathlon, aquathlon and swimming events near you. Free gym management software for CrossFit boxes, yoga studios and personal trainers.",
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
    "free gym management software",
    "software gestão ginásio gratuito",
    "free crossfit box software",
    "live race tracking",
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
      "Discover sports events near you. Free gym management software for CrossFit boxes, yoga studios and personal trainers.",
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
      "Discover sports events near you. Free gym management software for CrossFit boxes, yoga studios and personal trainers.",
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

  // Get footer translations
  const tFooter = await getTranslations("footer");
  const tCommon = await getTranslations("common");

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Generate structured data schemas for the site
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const softwareAppSchema = generateSoftwareApplicationSchema();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="4LNSLNsFfe"
          strategy="afterInteractive"
        />
        <Script
          id="userway-tabindex-fix"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var o=new MutationObserver(function(){var e=document.getElementById("userwayAccessibilityIcon");if(e){e.setAttribute("tabindex","-1");o.disconnect()}});o.observe(document.body,{childList:true,subtree:true})})();`,
          }}
        />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={softwareAppSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        {/* Skip to main content: must be the very first focusable element (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {tCommon("skipToMainContent")}
        </a>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <NavigationProgress />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SessionProvider>
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
                  <footer
                    className="border-t border-border/60 bg-muted/30 py-4"
                    role="contentinfo"
                  >
                    <div className="container flex flex-col items-center gap-3 text-sm text-muted-foreground">
                      {/* Brand */}
                      <p className="text-xs font-medium text-foreground">
                        Athlifyr{" "}
                        <span className="font-normal text-muted-foreground">
                          — ONE PLACE. ALL SPORTS.
                        </span>
                      </p>

                      {/* Links - two rows on mobile, one on desktop */}
                      <nav
                        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs"
                        aria-label="Footer"
                      >
                        <Link
                          href="/presentation/venue"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("gymManagement")}
                        </Link>
                        <Link
                          href="/presentation/live-race"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("liveRace")}
                        </Link>
                        <Link
                          href="/contact"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("contact")}
                        </Link>
                        <span className="hidden text-border/60 sm:inline">
                          ·
                        </span>
                        <Link
                          href="/privacy"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("privacy")}
                        </Link>
                        <Link
                          href="/terms"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("terms")}
                        </Link>
                        <Link
                          href="/cookies"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("cookies")}
                        </Link>
                        <Link
                          href="/accessibility"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("accessibility")}
                        </Link>
                        <Link
                          href="/acessibilidade"
                          className="transition-colors hover:text-foreground"
                        >
                          {tFooter("declaration")}
                        </Link>
                      </nav>

                      {/* Social + Apps + Copyright */}
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
                        <a
                          href="https://www.instagram.com/athlifyr/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                          aria-label={`${tFooter("followOnInstagram")} ${tFooter("opensInNewTab")}`}
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
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
                        <span className="text-border/60">·</span>
                        <a
                          href={APP_STORE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                          aria-label={`${tFooter("downloadIos")} ${tFooter("opensInNewTab")}`}
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          <span>iOS</span>
                        </a>
                        {GOOGLE_PLAY_ENABLED && (
                          <>
                            <span className="text-border/60">·</span>
                            <a
                              href={GOOGLE_PLAY_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                              aria-label={`${tFooter("downloadAndroid")} ${tFooter("opensInNewTab")}`}
                            >
                              <Smartphone
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              <span>Android</span>
                            </a>
                          </>
                        )}
                        <span className="text-border/60">·</span>
                        <span>© 2026 Athlifyr • v{packageJson.version}</span>
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
