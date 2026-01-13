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
  title: "FitLane - All Sports Events. One Place.",
  description: "Discover running, trail, HYROX, CrossFit, OCR, BTT, cycling, surf, triathlon and swimming events in Portugal. Find races, competitions and challenges near you.",
  keywords: ["sports events", "running", "trail", "HYROX", "CrossFit", "OCR", "BTT", "cycling", "surf", "triathlon", "Portugal"],
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
        <header className="border-b sticky top-0 bg-background z-50">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="font-bold text-2xl hover:opacity-80 transition-opacity">
              FitLane
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/events" className="text-sm font-medium hover:underline">
                Eventos
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>FitLane - All sports events. One place.</p>
            <p className="mt-2">© 2026 FitLane. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
