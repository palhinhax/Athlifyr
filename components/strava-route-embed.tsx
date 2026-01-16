"use client";

import { useEffect, useRef } from "react";

interface StravaRouteEmbedProps {
  embedCode: string;
}

export function StravaRouteEmbed({ embedCode }: StravaRouteEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !embedCode) return;

    // Parse the embed code to extract the div and script
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = embedCode;

    // Find the strava embed div
    const embedDiv = tempDiv.querySelector(".strava-embed-placeholder");
    if (embedDiv) {
      // Clear container and append the embed div
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(embedDiv.cloneNode(true));
    }

    // Load the Strava embed script if not already loaded
    const scriptId = "strava-embed-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://strava-embeds.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, trigger the embed initialization
      if (window.StravaEmbed) {
        window.StravaEmbed.reload();
      }
    }

    // Cleanup function
    return () => {
      // Optional: cleanup if needed
    };
  }, [embedCode]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden [&_.route-embed]:!h-auto [&_.strava-embed-root]:!h-auto [&_iframe]:!min-h-[610px] [&_iframe]:w-full [&_iframe]:min-w-full [&_iframe]:overflow-hidden"
    />
  );
}

// Extend window type for StravaEmbed
declare global {
  interface Window {
    StravaEmbed?: {
      reload: () => void;
    };
  }
}
