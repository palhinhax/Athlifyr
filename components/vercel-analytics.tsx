"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

const EXCLUDED_EMAILS = ["joao.mduart@gmail.com"];

export function VercelAnalytics() {
  const [isExcluded, setIsExcluded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userEmail =
      typeof window !== "undefined"
        ? window.localStorage.getItem("userEmail")
        : null;

    if (userEmail && EXCLUDED_EMAILS.includes(userEmail)) {
      setIsExcluded(true);
    }
  }, []);

  // Don't render on server or for excluded users
  if (!isClient || isExcluded) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
