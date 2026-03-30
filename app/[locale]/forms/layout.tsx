import "@/app/globals.css";

/**
 * Minimal layout for public forms — hides the app sidebar, header, and footer
 * so the form renders as a clean full-screen standalone page.
 */
export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Hide the parent layout chrome (sidebar, header, footer) */}
      <style>{`
        header, footer, aside, nav,
        [data-sidebar], [data-active-venues] {
          display: none !important;
        }
        /* Reset the flex parent so the form takes full screen */
        #main-content {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow-y: auto;
        }
      `}</style>
      {children}
    </>
  );
}
