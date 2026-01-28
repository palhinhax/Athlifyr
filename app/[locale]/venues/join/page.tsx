import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VenueLandingClient } from "@/components/venue-landing-client";
import { StructuredData } from "@/components/structured-data";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { locales, type Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "venues.landing" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  // SEO optimized keywords for gym/venue management software searches
  const keywords = {
    pt: [
      "software gestão ginásio gratuito",
      "gestão de clientes ginásio",
      "software personal trainer",
      "gestão box crossfit",
      "software estúdio yoga",
      "gestão subscrições ginásio",
      "agenda aulas fitness",
      "software massagista",
      "gestão fisioterapia",
      "plataforma ginásio online",
    ],
    en: [
      "free gym management software",
      "gym client management",
      "personal trainer software",
      "crossfit box management",
      "yoga studio software",
      "gym subscription management",
      "fitness class scheduling",
      "massage therapist software",
      "physiotherapy management",
      "online gym platform",
    ],
    es: [
      "software gestión gimnasio gratis",
      "gestión clientes gimnasio",
      "software entrenador personal",
      "gestión box crossfit",
      "software estudio yoga",
      "gestión suscripciones gimnasio",
      "agenda clases fitness",
      "software masajista",
      "gestión fisioterapia",
      "plataforma gimnasio online",
    ],
    fr: [
      "logiciel gestion salle sport gratuit",
      "gestion clients salle sport",
      "logiciel coach personnel",
      "gestion box crossfit",
      "logiciel studio yoga",
      "gestion abonnements salle",
      "planning cours fitness",
      "logiciel masseur",
      "gestion kinésithérapie",
      "plateforme salle sport en ligne",
    ],
    de: [
      "kostenlose fitnessstudio software",
      "fitnessstudio kundenverwaltung",
      "personal trainer software",
      "crossfit box verwaltung",
      "yoga studio software",
      "fitnessstudio abonnement verwaltung",
      "fitness kursplanung",
      "massage therapeut software",
      "physiotherapie verwaltung",
      "online fitnessstudio plattform",
    ],
    it: [
      "software gestione palestra gratis",
      "gestione clienti palestra",
      "software personal trainer",
      "gestione box crossfit",
      "software studio yoga",
      "gestione abbonamenti palestra",
      "pianificazione lezioni fitness",
      "software massaggiatore",
      "gestione fisioterapia",
      "piattaforma palestra online",
    ],
  };

  const localeKey = (locale as Locale) || "pt";

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: keywords[localeKey] || keywords.pt,
    alternates: {
      canonical: `${baseUrl}/${locale}/venues/join`,
      languages: {
        pt: `${baseUrl}/pt/venues/join`,
        en: `${baseUrl}/en/venues/join`,
        es: `${baseUrl}/es/venues/join`,
        fr: `${baseUrl}/fr/venues/join`,
        de: `${baseUrl}/de/venues/join`,
        it: `${baseUrl}/it/venues/join`,
      },
    },
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      url: `${baseUrl}/${locale}/venues/join`,
      siteName: "Athlifyr",
      images: [
        {
          url: `${baseUrl}/og-venues.png`,
          width: 1200,
          height: 630,
          alt: t("seo.title"),
        },
      ],
      locale: locale === "pt" ? "pt_PT" : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: [`${baseUrl}/og-venues.png`],
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

// Generate FAQ Schema for SEO
function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale: string
) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    inLanguage:
      locale === "pt"
        ? "pt-PT"
        : locale === "en"
          ? "en-US"
          : locale === "es"
            ? "es-ES"
            : locale === "fr"
              ? "fr-FR"
              : locale === "de"
                ? "de-DE"
                : locale === "it"
                  ? "it-IT"
                  : "pt-PT",
  };
}

// Generate SoftwareApplication Schema for better SEO
function generateSoftwareSchema(locale: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const appNames: Record<string, string> = {
    pt: "Athlifyr - Software de Gestão para Ginásios e Estúdios",
    en: "Athlifyr - Gym and Studio Management Software",
    es: "Athlifyr - Software de Gestión para Gimnasios y Estudios",
    fr: "Athlifyr - Logiciel de Gestion pour Salles de Sport et Studios",
    de: "Athlifyr - Verwaltungssoftware für Fitnessstudios und Studios",
    it: "Athlifyr - Software di Gestione per Palestre e Studi",
  };

  const descriptions: Record<string, string> = {
    pt: "Software gratuito para gestão de ginásios, boxes de CrossFit, estúdios de yoga, personal trainers e massagistas. Gere clientes, subscrições, aulas e pagamentos.",
    en: "Free software for managing gyms, CrossFit boxes, yoga studios, personal trainers and massage therapists. Manage clients, subscriptions, classes and payments.",
    es: "Software gratuito para gestión de gimnasios, boxes de CrossFit, estudios de yoga, entrenadores personales y masajistas. Gestiona clientes, suscripciones, clases y pagos.",
    fr: "Logiciel gratuit pour la gestion des salles de sport, boxes CrossFit, studios de yoga, coachs personnels et masseurs. Gérez clients, abonnements, cours et paiements.",
    de: "Kostenlose Software zur Verwaltung von Fitnessstudios, CrossFit-Boxen, Yoga-Studios, Personal Trainern und Masseuren. Verwalten Sie Kunden, Abonnements, Kurse und Zahlungen.",
    it: "Software gratuito per la gestione di palestre, box CrossFit, studi yoga, personal trainer e massaggiatori. Gestisci clienti, abbonamenti, lezioni e pagamenti.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: appNames[locale] || appNames.pt,
    description: descriptions[locale] || descriptions.pt,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
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
    url: `${baseUrl}/${locale}/venues/join`,
    provider: {
      "@type": "Organization",
      name: "Athlifyr",
      url: baseUrl,
    },
    featureList: [
      "Client Management",
      "Class Scheduling",
      "Subscription Management",
      "Payment Processing",
      "Team Management",
      "Multi-language Support",
    ],
  };
}

export default async function VenueJoinPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "venues.landing" });

  // Build FAQs from translations
  const faqs = [
    { question: t("faq.q1.question"), answer: t("faq.q1.answer") },
    { question: t("faq.q2.question"), answer: t("faq.q2.answer") },
    { question: t("faq.q3.question"), answer: t("faq.q3.answer") },
    { question: t("faq.q4.question"), answer: t("faq.q4.answer") },
    { question: t("faq.q5.question"), answer: t("faq.q5.answer") },
    { question: t("faq.q6.question"), answer: t("faq.q6.answer") },
    { question: t("faq.q7.question"), answer: t("faq.q7.answer") },
    { question: t("faq.q8.question"), answer: t("faq.q8.answer") },
  ];

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/${locale}` },
    {
      name: locale === "pt" ? "Locais" : "Venues",
      url: `${baseUrl}/${locale}/venues`,
    },
    {
      name:
        locale === "pt"
          ? "Junta-te"
          : locale === "es"
            ? "Únete"
            : locale === "fr"
              ? "Rejoignez"
              : locale === "de"
                ? "Beitreten"
                : locale === "it"
                  ? "Unisciti"
                  : "Join",
      url: `${baseUrl}/${locale}/venues/join`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs, locale);
  const softwareSchema = generateSoftwareSchema(locale);

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema} />
      {faqSchema && <StructuredData data={faqSchema} />}
      <StructuredData data={softwareSchema} />

      {/* Main Content */}
      <VenueLandingClient locale={locale} />
    </>
  );
}
