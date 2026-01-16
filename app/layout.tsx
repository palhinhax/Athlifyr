// Root layout - minimal wrapper
// Each route group ([locale], promo, etc.) has its own full layout with html and body

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
