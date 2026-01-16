"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Navigation Progress Bar
 * Shows a loading indicator at the top of the page during navigation
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset and hide on route change complete
    setIsLoading(false);
    setProgress(0);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Listen for link clicks to start progress
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.target && !link.download) {
        const url = new URL(link.href);
        // Only show progress for internal navigation
        if (
          url.origin === window.location.origin &&
          url.pathname !== pathname
        ) {
          setIsLoading(true);
          setProgress(0);

          // Simulate progress
          let currentProgress = 0;
          const interval = setInterval(() => {
            currentProgress += Math.random() * 30;
            if (currentProgress > 90) {
              clearInterval(interval);
              setProgress(90);
            } else {
              setProgress(currentProgress);
            }
          }, 300);

          // Cleanup after max time
          setTimeout(() => {
            clearInterval(interval);
            setIsLoading(false);
            setProgress(0);
          }, 5000);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent"
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary shadow-lg shadow-primary/50 transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: `0 0 10px 2px rgba(0, 0, 0, 0.1)`,
        }}
      />
    </div>
  );
}
