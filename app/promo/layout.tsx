import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athlifyr - Promo",
  description: "All sports events. One place.",
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
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
