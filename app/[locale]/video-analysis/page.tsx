import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StructuredData } from "@/components/structured-data";
import { VideoAnalysisPageClient } from "@/components/video-analysis/video-analysis-page-client";

const SUPPORTED_LOCALES = ["pt", "en", "es", "fr", "de", "it"] as const;

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
  const t = await getTranslations({ locale, namespace: "videoAnalysisPage.meta" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const pageUrl = `${baseUrl}/${locale}/video-analysis`;

  const languageAlternates: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languageAlternates[loc] = `${baseUrl}/${loc}/video-analysis`;
  }
  languageAlternates["x-default"] = `${baseUrl}/en/video-analysis`;

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
          url: `${baseUrl}/og-video-analysis.png`,
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
      images: [`${baseUrl}/og-video-analysis.png`],
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

function generateVideoAnalysisSchema(locale: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";
  const pageUrl = `${baseUrl}/${locale}/video-analysis`;

  const names: Record<string, string> = {
    en: "AI Sports Video Analysis",
    pt: "Análise de Vídeo Desportivo com IA",
    es: "Análisis de Vídeo Deportivo con IA",
    fr: "Analyse Vidéo Sportive par IA",
    de: "KI-Sport-Videoanalyse",
    it: "Analisi Video Sportiva con IA",
  };

  const descriptions: Record<string, string> = {
    en: "Free AI-powered video analysis for athletes. Upload your training video and get instant motion analysis with 3D skeleton visualization and joint angles, or barbell tracking with rep detection.",
    pt: "Análise de vídeo com inteligência artificial para atletas. Carrega o teu vídeo de treino e obtém análise de movimento com visualização 3D do esqueleto e ângulos articulares, ou rastreio de barra com deteção de repetições.",
    es: "Análisis de vídeo con inteligencia artificial para atletas. Sube tu vídeo de entrenamiento y obtén análisis de movimiento con visualización 3D del esqueleto y ángulos articulares, o seguimiento de barra con detección de repeticiones.",
    fr: "Analyse vidéo par intelligence artificielle pour les athlètes. Téléchargez votre vidéo d'entraînement et obtenez une analyse de mouvement avec visualisation 3D du squelette et angles articulaires, ou suivi de barre avec détection des répétitions.",
    de: "KI-gestützte Videoanalyse für Athleten. Lade dein Trainingsvideo hoch und erhalte sofortige Bewegungsanalyse mit 3D-Skelett-Visualisierung und Gelenkwinkeln, oder Langhantel-Tracking mit Wiederholungserkennung.",
    it: "Analisi video con intelligenza artificiale per gli atleti. Carica il tuo video di allenamento e ottieni l'analisi del movimento con visualizzazione 3D dello scheletro e angoli articolari, o il tracciamento del bilanciere con rilevamento delle ripetizioni.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: names[locale] || names.en,
    description: descriptions[locale] || descriptions.en,
    url: pageUrl,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: [
      "Motion Analysis",
      "3D Skeleton Visualization",
      "Joint Angle Detection",
      "Barbell Tracking",
      "Rep Detection",
      "Velocity Analysis",
      "AI-Powered",
    ],
    provider: {
      "@type": "Organization",
      name: "Athlifyr",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
  };
}

function generateFAQSchema(locale: string) {
  const faqs: Record<string, Array<{ q: string; a: string }>> = {
    en: [
      {
        q: "What is Athlifyr Video Analysis?",
        a: "Athlifyr Video Analysis is a free AI-powered tool that analyzes your sports training videos. It offers Motion Analysis (3D skeleton tracking and joint angles) and Lift Analysis (barbell trajectory, speed, and rep counting).",
      },
      {
        q: "How does the Motion Analysis work?",
        a: "Upload a video of any sport movement. Our AI detects your body's key points, generates a 3D skeleton, and calculates joint angles in real-time so you can understand your movement patterns.",
      },
      {
        q: "What is Lift Analysis used for?",
        a: "Lift Analysis is designed for weightlifting. Upload a video of a barbell exercise (squat, deadlift, snatch, etc.) and get automatic barbell path tracking, bar velocity, rep detection, and symmetry analysis.",
      },
      {
        q: "Is the video analysis free?",
        a: "Yes, Athlifyr Video Analysis is completely free to use. Just upload your video and get instant results.",
      },
      {
        q: "Which video formats are supported?",
        a: "We support MP4, MOV, AVI, and WebM video files. Maximum file size is 100MB.",
      },
    ],
    pt: [
      {
        q: "O que é a Análise de Vídeo do Athlifyr?",
        a: "A Análise de Vídeo do Athlifyr é uma ferramenta gratuita baseada em IA que analisa os teus vídeos de treino desportivo. Oferece Análise de Movimento (esqueleto 3D e ângulos articulares) e Análise de Levantamento (trajetória da barra, velocidade e contagem de repetições).",
      },
      {
        q: "Como funciona a Análise de Movimento?",
        a: "Carrega um vídeo de qualquer movimento desportivo. A nossa IA deteta os pontos-chave do teu corpo, gera um esqueleto 3D e calcula os ângulos articulares em tempo real para que possas compreender os teus padrões de movimento.",
      },
      {
        q: "Para que serve a Análise de Levantamento?",
        a: "A Análise de Levantamento foi desenvolvida para a halterofilia. Carrega um vídeo de um exercício com barra (agachamento, peso morto, arranque, etc.) e obtém rastreio automático do caminho da barra, velocidade, deteção de repetições e análise de simetria.",
      },
      {
        q: "A análise de vídeo é gratuita?",
        a: "Sim, a Análise de Vídeo do Athlifyr é completamente gratuita. Basta carregares o teu vídeo e obteres resultados instantâneos.",
      },
      {
        q: "Que formatos de vídeo são suportados?",
        a: "Suportamos ficheiros de vídeo MP4, MOV, AVI e WebM. O tamanho máximo do ficheiro é 100MB.",
      },
    ],
    es: [
      {
        q: "¿Qué es el Análisis de Vídeo de Athlifyr?",
        a: "El Análisis de Vídeo de Athlifyr es una herramienta gratuita impulsada por IA que analiza tus vídeos de entrenamiento deportivo. Ofrece Análisis de Movimiento (esqueleto 3D y ángulos articulares) y Análisis de Levantamiento (trayectoria de la barra, velocidad y conteo de repeticiones).",
      },
      {
        q: "¿Cómo funciona el Análisis de Movimiento?",
        a: "Sube un vídeo de cualquier movimiento deportivo. Nuestra IA detecta los puntos clave de tu cuerpo, genera un esqueleto 3D y calcula los ángulos articulares en tiempo real.",
      },
      {
        q: "¿Para qué sirve el Análisis de Levantamiento?",
        a: "El Análisis de Levantamiento está diseñado para la halterofilia. Sube un vídeo de un ejercicio con barra y obtén seguimiento automático del camino de la barra, velocidad, detección de repeticiones y análisis de simetría.",
      },
      {
        q: "¿El análisis de vídeo es gratuito?",
        a: "Sí, el Análisis de Vídeo de Athlifyr es completamente gratuito.",
      },
      {
        q: "¿Qué formatos de vídeo son compatibles?",
        a: "Admitimos archivos de vídeo MP4, MOV, AVI y WebM. El tamaño máximo de archivo es 100MB.",
      },
    ],
    fr: [
      {
        q: "Qu'est-ce que l'Analyse Vidéo d'Athlifyr ?",
        a: "L'Analyse Vidéo d'Athlifyr est un outil gratuit alimenté par l'IA qui analyse vos vidéos d'entraînement sportif. Il propose l'Analyse de Mouvement (squelette 3D et angles articulaires) et l'Analyse de Levée (trajectoire de barre, vitesse et comptage de répétitions).",
      },
      {
        q: "Comment fonctionne l'Analyse de Mouvement ?",
        a: "Téléchargez une vidéo de n'importe quel mouvement sportif. Notre IA détecte les points clés de votre corps, génère un squelette 3D et calcule les angles articulaires en temps réel.",
      },
      {
        q: "À quoi sert l'Analyse de Levée ?",
        a: "L'Analyse de Levée est conçue pour l'haltérophilie. Téléchargez une vidéo d'un exercice avec barre et obtenez le suivi automatique du chemin de la barre, la vitesse, la détection des répétitions et l'analyse de symétrie.",
      },
      {
        q: "L'analyse vidéo est-elle gratuite ?",
        a: "Oui, l'Analyse Vidéo d'Athlifyr est entièrement gratuite.",
      },
      {
        q: "Quels formats vidéo sont pris en charge ?",
        a: "Nous supportons les fichiers vidéo MP4, MOV, AVI et WebM. La taille maximale du fichier est de 100MB.",
      },
    ],
    de: [
      {
        q: "Was ist die Athlifyr Videoanalyse?",
        a: "Die Athlifyr Videoanalyse ist ein kostenloses KI-Tool, das deine Sporttrainingsvideos analysiert. Es bietet Bewegungsanalyse (3D-Skelett und Gelenkwinkel) und Hebeanalyse (Langhantel-Trajektorie, Geschwindigkeit und Wiederholungserkennung).",
      },
      {
        q: "Wie funktioniert die Bewegungsanalyse?",
        a: "Lade ein Video einer beliebigen Sportbewegung hoch. Unsere KI erkennt die Schlüsselpunkte deines Körpers, erstellt ein 3D-Skelett und berechnet die Gelenkwinkel in Echtzeit.",
      },
      {
        q: "Wofür wird die Hebeanalyse verwendet?",
        a: "Die Hebeanalyse ist für Gewichtheben konzipiert. Lade ein Video einer Langhantelübung hoch und erhalte automatisches Langhantel-Tracking, Geschwindigkeit, Wiederholungserkennung und Symmetrieanalyse.",
      },
      {
        q: "Ist die Videoanalyse kostenlos?",
        a: "Ja, die Athlifyr Videoanalyse ist völlig kostenlos.",
      },
      {
        q: "Welche Videoformate werden unterstützt?",
        a: "Wir unterstützen MP4, MOV, AVI und WebM Videodateien. Die maximale Dateigröße beträgt 100MB.",
      },
    ],
    it: [
      {
        q: "Cos'è l'Analisi Video di Athlifyr?",
        a: "L'Analisi Video di Athlifyr è uno strumento gratuito basato su IA che analizza i tuoi video di allenamento sportivo. Offre Analisi del Movimento (scheletro 3D e angoli articolari) e Analisi del Sollevamento (traiettoria del bilanciere, velocità e conteggio delle ripetizioni).",
      },
      {
        q: "Come funziona l'Analisi del Movimento?",
        a: "Carica un video di qualsiasi movimento sportivo. La nostra IA rileva i punti chiave del tuo corpo, genera uno scheletro 3D e calcola gli angoli articolari in tempo reale.",
      },
      {
        q: "A cosa serve l'Analisi del Sollevamento?",
        a: "L'Analisi del Sollevamento è progettata per il sollevamento pesi. Carica un video di un esercizio con bilanciere e ottieni il tracciamento automatico del percorso del bilanciere, velocità, rilevamento delle ripetizioni e analisi della simmetria.",
      },
      {
        q: "L'analisi video è gratuita?",
        a: "Sì, l'Analisi Video di Athlifyr è completamente gratuita.",
      },
      {
        q: "Quali formati video sono supportati?",
        a: "Supportiamo file video MP4, MOV, AVI e WebM. La dimensione massima del file è 100MB.",
      },
    ],
  };

  const localeFaqs = faqs[locale] || faqs.en;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export default async function VideoAnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const softwareSchema = generateVideoAnalysisSchema(locale);
  const faqSchema = generateFAQSchema(locale);

  return (
    <>
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />
      <VideoAnalysisPageClient />
    </>
  );
}
