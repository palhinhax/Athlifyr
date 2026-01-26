"use client";

import { useEffect } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide footer when chat page is mounted
  useEffect(() => {
    // Find and hide the footer
    const footer = document.querySelector("footer.border-t");
    if (footer) {
      (footer as HTMLElement).style.display = "none";
    }

    // Cleanup: show footer when leaving chat
    return () => {
      const footer = document.querySelector("footer.border-t");
      if (footer) {
        (footer as HTMLElement).style.display = "";
      }
    };
  }, []);

  return <div className="flex h-[calc(100vh-4rem)] flex-col">{children}</div>;
}
