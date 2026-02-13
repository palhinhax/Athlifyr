import { Metadata } from "next";
import { VenuePresentationClient } from "@/components/presentations/venue-presentation-client";
import { VenueFAQSection } from "@/components/presentations/venue-faq-section";
import { VenueSEOContent } from "@/components/presentations/venue-seo-content";
import { getTranslations } from "next-intl/server";
import { StructuredData } from "@/components/structured-data";

// Supported locales for hreflang generation
const SUPPORTED_LOCALES = ["pt", "en", "es", "fr", "de", "it"] as const;

// Map locale codes to Open Graph locale format
const localeToOgLocale: Record<string, string> = {
  pt: "pt_PT",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "presentation.meta",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const pageUrl = `${baseUrl}/${locale}/presentation/venue`;

  // Generate hreflang alternates for all supported locales
  const languageAlternates: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languageAlternates[loc] = `${baseUrl}/${loc}/presentation/venue`;
  }
  // x-default points to English version
  languageAlternates["x-default"] = `${baseUrl}/en/presentation/venue`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: pageUrl,
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
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Generate SoftwareApplication structured data
function generateSoftwareApplicationSchema(locale: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const descriptions: Record<string, string> = {
    en: "All-in-one gym management platform to manage bookings, trial classes, memberships and coaches. Built for CrossFit boxes and fitness studios.",
    pt: "Plataforma completa de gestão de ginásio para gerir reservas, aulas experimentais, membros e treinadores. Desenvolvido para boxes de CrossFit e estúdios de fitness.",
    es: "Plataforma integral de gestión de gimnasios para administrar reservas, clases de prueba, membresías y entrenadores. Diseñada para boxes de CrossFit y estudios de fitness.",
    fr: "Plateforme complète de gestion de salle de sport pour gérer les réservations, cours d'essai, abonnements et coachs. Conçue pour les boxes CrossFit et studios de fitness.",
    de: "All-in-One Fitnessstudio-Management-Plattform zur Verwaltung von Buchungen, Probestunden, Mitgliedschaften und Trainern. Entwickelt für CrossFit-Boxen und Fitnessstudios.",
    it: "Piattaforma completa di gestione palestra per gestire prenotazioni, lezioni di prova, abbonamenti e coach. Progettata per box CrossFit e studi fitness.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Athlifyr",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Gym Management Software",
    operatingSystem: "Web",
    description: descriptions[locale] || descriptions.en,
    url: baseUrl,
    image: `${baseUrl}/logo.png`,
    author: {
      "@type": "Organization",
      name: "Athlifyr",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Class Booking System",
      "Trial Class Management",
      "Membership Management",
      "Coach Management",
      "WOD Publishing",
      "Athlete Progress Tracking",
      "Community Feed",
      "Event Discovery",
      "Multi-language Support",
      "Mobile-friendly Booking",
    ],
  };
}

export default async function VenuePresentation({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const softwareSchema = generateSoftwareApplicationSchema(locale);

  return (
    <>
      <StructuredData data={softwareSchema} />
      <VenuePresentationClient />
      <VenueSEOContent />
      <VenueFAQSection />
    </>
  );
}
