import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";
import { UserNav } from "@/components/user-nav";
import { NavLinks } from "@/components/nav-links";
import { MobileNav } from "@/components/mobile-nav";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Instagram } from "lucide-react";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import packageJson from "@/package.json";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com"
  ),
  title: {
    default: "Athlifyr - All Sports Events. One Place.",
    template: "%s | Athlifyr",
  },
  description:
    "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events in Portugal. Find races, competitions and challenges near you.",
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
    title: "Athlifyr - All Sports Events. One Place.",
    description:
      "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events in Portugal.",
    url: "https://athlifyr.com",
    siteName: "Athlifyr",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Athlifyr - All Sports Events. One Place.",
      },
    ],
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Athlifyr - All Sports Events. One Place.",
    description:
      "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events in Portugal.",
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
    canonical: "https://athlifyr.com",
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: 'verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Generate structured data schemas for the site
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <SessionProvider>
          <header className="sticky top-0 z-50 border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link
                href="/"
                className="text-2xl font-bold transition-opacity hover:opacity-80"
              >
                Athlifyr
              </Link>
              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-6 md:flex">
                <NavLinks />
                <UserNav />
              </nav>

              {/* Mobile Navigation */}
              <MobileNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
                <p className="text-center md:text-left">
                  Athlifyr - All sports events. One place.
                </p>
                <a
                  href="https://www.instagram.com/athlifyr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  aria-label="Segue-nos no Instagram"
                >
                  <Instagram className="h-4 w-4" />
                  <span>@athlifyr</span>
                </a>
                <p className="text-center text-xs md:text-right">
                  © 2026 Athlifyr • v{packageJson.version}
                </p>
              </div>
            </div>
          </footer>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
