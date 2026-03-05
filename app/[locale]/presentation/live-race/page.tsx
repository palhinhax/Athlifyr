import { Metadata } from "next";
import { LiveRacePresentationClient } from "@/components/presentations/live-race-presentation-client";
import { LiveRaceFAQSection } from "@/components/presentations/live-race-faq-section";
import { LiveRaceSEOContent } from "@/components/presentations/live-race-seo-content";
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
    translationNamespace: "liveRacePresentation.meta",
    pagePath: "live-race",
  });
}

function generateSoftwareApplicationSchema(locale: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  const descriptions: Record<string, string> = {
    en: "Free live race tracking and event management platform for trail running, road races, BTT, and cycling. Real-time GPS tracking, live leaderboards, online registration, and spectator engagement.",
    pt: "Plataforma gratuita de rastreamento ao vivo e gestão de eventos para trail running, corridas de estrada, BTT e ciclismo. Rastreamento GPS em tempo real, classificações ao vivo, inscrições online e envolvimento dos espetadores.",
    es: "Plataforma gratuita de seguimiento en vivo y gestión de eventos para trail running, carreras de ruta, BTT y ciclismo. Seguimiento GPS en tiempo real, clasificaciones en vivo, inscripciones online y participación de espectadores.",
    fr: "Plateforme gratuite de suivi en direct et gestion d'événements pour trail running, courses sur route, VTT et cyclisme. Suivi GPS en temps réel, classements en direct, inscriptions en ligne et engagement des spectateurs.",
    de: "Kostenlose Live-Rennen-Tracking und Event-Management-Plattform für Trailrunning, Straßenläufe, MTB und Radsport. GPS-Echtzeit-Tracking, Live-Bestenlisten, Online-Anmeldung und Zuschauer-Engagement.",
    it: "Piattaforma gratuita di tracciamento gare live e gestione eventi per trail running, gare su strada, MTB e ciclismo. Tracciamento GPS in tempo reale, classifiche live, iscrizioni online e coinvolgimento degli spettatori.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Athlifyr Live Race",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Event Management Software",
    operatingSystem: "Web",
    description: descriptions[locale] || descriptions.en,
    url: `${baseUrl}/${locale}/presentation/live-race`,
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
    featureList: [
      "Real-time GPS Athlete Tracking",
      "Live Leaderboard & Rankings",
      "Online Race Registration",
      "GPX Route Editor",
      "Checkpoint Gate Management",
      "Spectator Push Notifications",
      "Real-time Alerts",
      "Multi-language Support",
      "Trail Running Events",
      "Road Race Events",
      "BTT / Mountain Bike Events",
      "Cycling Events",
    ],
  };
}

export default async function LiveRacePresentation({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const softwareSchema = generateSoftwareApplicationSchema(locale);

  return (
    <>
      <StructuredData data={softwareSchema} />
      <LiveRacePresentationClient />
      <LiveRaceSEOContent />
      <LiveRaceFAQSection />
    </>
  );
}
