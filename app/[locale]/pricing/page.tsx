import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StructuredData } from "@/components/structured-data";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { locales } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Dumbbell, Trophy, Radio, Users } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/pricing`])
      ),
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: `${baseUrl}/${locale}/pricing`,
      siteName: "Athlifyr",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function generateSoftwareApplicationSchema(locale: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const descriptions: Record<string, string> = {
    pt: "Software 100% gratuito para gestão de ginásios, boxes de CrossFit, estúdios de yoga, personal trainers e organizadores de eventos desportivos. Sem subscrições, sem custos ocultos.",
    en: "100% free software for managing gyms, CrossFit boxes, yoga studios, personal trainers and sports event organizers. No subscriptions, no hidden fees.",
    es: "Software 100% gratis para gestión de gimnasios, boxes de CrossFit, estudios de yoga, entrenadores personales y organizadores de eventos deportivos. Sin suscripciones, sin costes ocultos.",
    fr: "Logiciel 100% gratuit pour la gestion des salles de sport, boxes CrossFit, studios de yoga, coachs personnels et organisateurs d'événements sportifs. Sans abonnement, sans frais cachés.",
    de: "100% kostenlose Software zur Verwaltung von Fitnessstudios, CrossFit-Boxen, Yoga-Studios, Personal Trainern und Sportveranstaltern. Keine Abonnements, keine versteckten Kosten.",
    it: "Software 100% gratuito per la gestione di palestre, box CrossFit, studi yoga, personal trainer e organizzatori di eventi sportivi. Senza abbonamenti, senza costi nascosti.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Athlifyr",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Gym Management Software",
    operatingSystem: "Web",
    description: descriptions[locale] || descriptions.en,
    url: `${baseUrl}/${locale}/pricing`,
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
      description: "Free forever — no subscriptions, no hidden fees",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Client Management",
      "Class Scheduling",
      "Trial Class Bookings",
      "Subscription Management",
      "Coach Management",
      "WOD Publishing",
      "Event Creation",
      "Live Race Tracking",
      "Community Feed",
      "Multi-language Support",
    ],
  };
}

function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale: string
) {
  const LOCALE_LANG_MAP: Record<string, string> = {
    pt: "pt-PT",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
  };

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
    inLanguage: LOCALE_LANG_MAP[locale] || "pt-PT",
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pricing" });

  const BREADCRUMB_PRICING_LABEL: Record<string, string> = {
    pt: "Preços",
    en: "Pricing",
    es: "Precios",
    fr: "Tarifs",
    de: "Preise",
    it: "Prezzi",
  };

  // Build FAQs from translations
  const faqs = [
    { question: t("faq.q1.question"), answer: t("faq.q1.answer") },
    { question: t("faq.q2.question"), answer: t("faq.q2.answer") },
    { question: t("faq.q3.question"), answer: t("faq.q3.answer") },
    { question: t("faq.q4.question"), answer: t("faq.q4.answer") },
    { question: t("faq.q5.question"), answer: t("faq.q5.answer") },
    { question: t("faq.q6.question"), answer: t("faq.q6.answer") },
  ];

  // Structured data schemas
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    {
      name: BREADCRUMB_PRICING_LABEL[locale] || "Pricing",
      url: `/${locale}/pricing`,
    },
  ]);
  const softwareSchema = generateSoftwareApplicationSchema(locale);
  const faqSchema = generateFAQSchema(faqs, locale);

  const features = [
    {
      icon: Dumbbell,
      titleKey: "features.gymManagement.title" as const,
      descKey: "features.gymManagement.description" as const,
      priceKey: "features.gymManagement.price" as const,
    },
    {
      icon: Trophy,
      titleKey: "features.eventManagement.title" as const,
      descKey: "features.eventManagement.description" as const,
      priceKey: "features.eventManagement.price" as const,
    },
    {
      icon: Radio,
      titleKey: "features.liveRace.title" as const,
      descKey: "features.liveRace.description" as const,
      priceKey: "features.liveRace.price" as const,
    },
    {
      icon: Users,
      titleKey: "features.athletes.title" as const,
      descKey: "features.athletes.description" as const,
      priceKey: "features.athletes.price" as const,
    },
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />

      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold">
            <Check className="mr-1 h-3.5 w-3.5" />
            {t("hero.badge")}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mb-4 text-xl text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            {t("hero.description")}
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">
            {t("features.title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.titleKey} className="relative">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {t(feature.titleKey)}
                    </CardTitle>
                  </div>
                  <CardDescription>{t(feature.descKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">€0</span>
                    <span className="text-sm text-muted-foreground">
                      / {t(feature.priceKey)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="mb-2 text-2xl font-bold">{t("cta.title")}</h2>
          <p className="mb-6 text-muted-foreground">{t("cta.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/venues/join">{t("cta.venueButton")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events">{t("cta.eventsButton")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
