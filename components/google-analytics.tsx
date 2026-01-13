"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  gaId: string;
}

// Validate Google Analytics Measurement ID format
function isValidGAId(gaId: string): boolean {
  return /^G-[A-Z0-9]{10}$/.test(gaId);
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId || !isValidGAId(gaId)) {
    if (gaId && !isValidGAId(gaId)) {
      console.warn(
        `Invalid Google Analytics Measurement ID: ${gaId}. Expected format: G-XXXXXXXXXX`
      );
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
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
