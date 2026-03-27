import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/** Supported locales for hreflang generation */
export const SUPPORTED_LOCALES = ["pt", "en", "es", "fr", "de", "it"] as const;

/** Map locale codes to Open Graph locale format */
export const localeToOgLocale: Record<string, string> = {
  pt: "pt_PT",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
};

interface PresentationMetadataOptions {
  /** The current locale (e.g. "pt", "en") */
  locale: string;
  /** The i18n namespace for translations (e.g. "presentation.meta") */
  translationNamespace: string;
  /** The page path segment after /presentation/ (e.g. "venue", "live-race") */
  pagePath: string;
}

/**
 * Generate SEO metadata for presentation pages.
 * Centralises the shared logic for title, description, Open Graph,
 * Twitter, hreflang alternates and robots directives.
 */
export async function generatePresentationMetadata({
  locale,
  translationNamespace,
  pagePath,
}: PresentationMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: translationNamespace,
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const pageUrl = `${baseUrl}/${locale}/presentation/${pagePath}`;

  const languageAlternates: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languageAlternates[loc] = `${baseUrl}/${loc}/presentation/${pagePath}`;
  }
  languageAlternates["x-default"] = `${baseUrl}/pt/presentation/${pagePath}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `${baseUrl}/pt/presentation/${pagePath}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: "Athlifyr",
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: localeToOgLocale[locale] || "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/logo.png`],
      creator: "@athlifyr",
    },
    robots: {
      index: locale === "pt",
      follow: true,
      googleBot: {
        index: locale === "pt",
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
