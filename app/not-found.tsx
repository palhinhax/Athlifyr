"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import "./globals.css";

// Available background videos
const backgroundVideos = [
  "/promo/group-running.mp4",
  "/promo/woman-running.mp4",
  "/promo/crossfit-workout.mp4",
  "/promo/promo.mp4",
];

// Translations for 404 page (all 6 languages)
const translations = {
  en: {
    code: "404",
    title: "Page Not Found",
    description: "Oops! The page you're looking for doesn't exist.",
    suggestion:
      "It might have been moved or deleted. Let's get you back on track.",
    backHome: "Back to Home",
    browseEvents: "Browse Events",
    slogan: "one place. all sports.",
  },
  pt: {
    code: "404",
    title: "Página Não Encontrada",
    description: "Ups! A página que procuras não existe.",
    suggestion:
      "Pode ter sido movida ou eliminada. Vamos colocar-te de volta no caminho certo.",
    backHome: "Voltar ao Início",
    browseEvents: "Ver Eventos",
    slogan: "one place. all sports.",
  },
  es: {
    code: "404",
    title: "Página No Encontrada",
    description: "¡Ups! La página que buscas no existe.",
    suggestion:
      "Es posible que se haya movido o eliminado. Vamos a llevarte de vuelta al camino.",
    backHome: "Volver al Inicio",
    browseEvents: "Ver Eventos",
    slogan: "one place. all sports.",
  },
  fr: {
    code: "404",
    title: "Page Non Trouvée",
    description: "Oups ! La page que vous recherchez n'existe pas.",
    suggestion:
      "Elle a peut-être été déplacée ou supprimée. Remettons-vous sur la bonne voie.",
    backHome: "Retour à l'accueil",
    browseEvents: "Parcourir les Événements",
    slogan: "one place. all sports.",
  },
  de: {
    code: "404",
    title: "Seite Nicht Gefunden",
    description: "Hoppla! Die gesuchte Seite existiert nicht.",
    suggestion:
      "Sie wurde möglicherweise verschoben oder gelöscht. Lassen Sie uns zurückkehren.",
    backHome: "Zurück zur Startseite",
    browseEvents: "Veranstaltungen Durchsuchen",
    slogan: "one place. all sports.",
  },
  it: {
    code: "404",
    title: "Pagina Non Trovata",
    description: "Ops! La pagina che stai cercando non esiste.",
    suggestion:
      "Potrebbe essere stata spostata o eliminata. Torniamo sulla strada giusta.",
    backHome: "Torna alla Home",
    browseEvents: "Sfoglia Eventi",
    slogan: "one place. all sports.",
  },
} as const;

type SupportedLocale = keyof typeof translations;

// Detect locale from URL or browser, default to 'en'
function getLocale(): SupportedLocale {
  if (typeof window !== "undefined") {
    // Check URL path for locale
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/(pt|en|es|fr|de|it)(\/|$)/);
    if (localeMatch) {
      return localeMatch[1] as SupportedLocale;
    }

    // Fallback to browser language
    const browserLang = navigator.language.split("-")[0];
    if (browserLang in translations) {
      return browserLang as SupportedLocale;
    }
  }

  return "en";
}

export default function NotFound() {
  const locale = getLocale();
  const t = translations[locale];
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    // Select random video on mount
    const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
    setVideoSrc(backgroundVideos[randomIndex]);
  }, []);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
          {/* Background Video */}
          {videoSrc && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              key={videoSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}

          {/* Overlay to darken video */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            {/* 404 Code */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold tracking-tighter text-white/20">
                {t.code}
              </h1>
              <div className="-mt-12">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t.title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-white/90">
              {t.description}
            </p>
            <p className="mt-2 text-base text-white/80">{t.suggestion}</p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link href={`/${locale}`}>
                  <Home className="mr-2 h-4 w-4" />
                  {t.backHome}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-w-[160px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href={`/${locale}/events`}>
                  <Search className="mr-2 h-4 w-4" />
                  {t.browseEvents}
                </Link>
              </Button>
            </div>

            {/* Branding */}
            <div className="mt-16">
              <p className="text-sm font-medium text-white/70">
                <span className="font-bold text-white">Athlifyr</span>
                {" • "}
                {t.slogan}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
