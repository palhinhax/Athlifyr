import "@/app/globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function EasyBookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="4LNSLNsFfe"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
