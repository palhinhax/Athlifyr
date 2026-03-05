import { Metadata } from "next";
import { VenuePresentationClient } from "@/components/presentations/venue-presentation-client";
import { VenueFAQSection } from "@/components/presentations/venue-faq-section";
import { VenueSEOContent } from "@/components/presentations/venue-seo-content";
import { StructuredData } from "@/components/structured-data";
import { generatePresentationMetadata } from "@/lib/presentation-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePresentationMetadata({
    locale,
    translationNamespace: "presentation.meta",
    pagePath: "venue",
  });
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
