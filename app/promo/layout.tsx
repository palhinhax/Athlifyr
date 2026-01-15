import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Athlifyr - Promo",
  description: "ONE PLACE. ALL sports.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PromoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 overflow-hidden p-0">{children}</body>
    </html>
  );
}
