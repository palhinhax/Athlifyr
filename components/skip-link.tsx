"use client";

import { useTranslations } from "next-intl";

/**
 * Skip to main content link for accessibility (WCAG 2.4.1)
 * This link is visually hidden but becomes visible when focused,
 * allowing keyboard and screen reader users to skip navigation.
 */
export function SkipLink() {
  const t = useTranslations("common");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t("skipToMainContent")}
    </a>
  );
}
