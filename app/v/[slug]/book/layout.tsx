import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function EasyBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
