"use client";

import { useEffect } from "react";

export function ChatLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const footer = document.querySelector("footer.border-t");
    if (footer) {
      (footer as HTMLElement).style.display = "none";
    }
    return () => {
      const footer = document.querySelector("footer.border-t");
      if (footer) {
        (footer as HTMLElement).style.display = "";
      }
    };
  }, []);

  return <div className="flex h-[calc(100vh-4rem)] flex-col">{children}</div>;
}
