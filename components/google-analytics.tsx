"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface GoogleAnalyticsProps {
  gaId: string;
  nonce?: string;
}

// List of emails to exclude from analytics tracking
const EXCLUDED_EMAILS = [
  "joao.mduart@gmail.com", // Developer account
];

// Validate Google Analytics Measurement ID format
function isValidGAId(gaId: string): boolean {
  return /^G-[A-Z0-9]{10}$/.test(gaId);
}

export function GoogleAnalytics({ gaId, nonce }: GoogleAnalyticsProps) {
  const [isExcluded, setIsExcluded] = useState(false);

  useEffect(() => {
    // Check if user should be excluded from analytics
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail && EXCLUDED_EMAILS.includes(userEmail.toLowerCase())) {
        setIsExcluded(true);
        console.log("Google Analytics disabled for excluded user");
      }
    } catch {
      // localStorage might not be available
    }
  }, []);

  if (!gaId || !isValidGAId(gaId)) {
    if (gaId && !isValidGAId(gaId)) {
      console.warn(
        `Invalid Google Analytics Measurement ID: ${gaId}. Expected format: G-XXXXXXXXXX`
      );
    }
    return null;
  }

  // Don't load Google Analytics for excluded users
  if (isExcluded) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        nonce={nonce}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
