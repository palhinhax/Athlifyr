import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

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
  title: "Athlifyr - All Sports Events. One Place.",
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link
              href="/"
              className="text-2xl font-bold transition-opacity hover:opacity-80"
            >
              Athlifyr
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/events"
                className="text-sm font-medium hover:underline"
              >
                Eventos
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Athlifyr - All sports events. One place.</p>
            <p className="mt-2">
              © 2026 Athlifyr. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
