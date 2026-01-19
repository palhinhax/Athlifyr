"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

const backgroundVideos = [
  "/promo/group-running.mp4",
  "/promo/woman-running.mp4",
  "/promo/crossfit-workout.mp4",
  "/promo/warm-up-girl.mp4",
  "/promo/promo.mp4",
];

const translations = {
  en: {
    title: "Something went wrong",
    subtitle: "An unexpected error occurred",
    description:
      "We apologize for the inconvenience. Please try again or return to the home page.",
    tryAgain: "Try Again",
    backHome: "Back to Home",
    slogan: "one place. all sports.",
    errorDevOnly: "Error (dev only):",
  },
  pt: {
    title: "Algo correu mal",
    subtitle: "Ocorreu um erro inesperado",
    description:
      "Pedimos desculpa pelo inconveniente. Por favor, tenta novamente ou volta à página inicial.",
    tryAgain: "Tentar novamente",
    backHome: "Voltar à Home",
    slogan: "one place. all sports.",
    errorDevOnly: "Erro (apenas em dev):",
  },
  es: {
    title: "Algo salió mal",
    subtitle: "Ocurrió un error inesperado",
    description:
      "Disculpa las molestias. Por favor, inténtalo de nuevo o vuelve a la página principal.",
    tryAgain: "Intentar de nuevo",
    backHome: "Volver al Inicio",
    slogan: "one place. all sports.",
    errorDevOnly: "Error (solo dev):",
  },
  fr: {
    title: "Quelque chose s'est mal passé",
    subtitle: "Une erreur inattendue s'est produite",
    description:
      "Nous nous excusons pour le dérangement. Veuillez réessayer ou retourner à la page d'accueil.",
    tryAgain: "Réessayer",
    backHome: "Retour à l'accueil",
    slogan: "one place. all sports.",
    errorDevOnly: "Erreur (dev uniquement):",
  },
  de: {
    title: "Etwas ist schiefgelaufen",
    subtitle: "Ein unerwarteter Fehler ist aufgetreten",
    description:
      "Wir entschuldigen uns für die Unannehmlichkeiten. Bitte versuche es erneut oder kehre zur Startseite zurück.",
    tryAgain: "Erneut versuchen",
    backHome: "Zurück zur Startseite",
    slogan: "one place. all sports.",
    errorDevOnly: "Fehler (nur Dev):",
  },
  it: {
    title: "Qualcosa è andato storto",
    subtitle: "Si è verificato un errore imprevisto",
    description:
      "Ci scusiamo per l'inconveniente. Riprova o torna alla pagina principale.",
    tryAgain: "Riprova",
    backHome: "Torna alla Home",
    slogan: "one place. all sports.",
    errorDevOnly: "Errore (solo dev):",
  },
};

function getLocale(): string {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/(pt|en|es|fr|de|it)/);
    if (localeMatch) return localeMatch[1];

    const browserLang = navigator.language.split("-")[0];
    if (["pt", "en", "es", "fr", "de", "it"].includes(browserLang)) {
      return browserLang;
    }
  }
  return "en";
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  useEffect(() => {
    console.error(error);
    setCurrentLocale(getLocale());
  }, [error]);

  const t = translations[currentLocale as keyof typeof translations];

  const [videoSrc] = useState(() => {
    const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
    return backgroundVideos[randomIndex];
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Background Video */}
      {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay to darken video */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-8 inline-block rounded-full bg-white/10 p-4 backdrop-blur-sm">
          <AlertTriangle className="h-16 w-16 text-white" />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          {t.title}
        </h1>
        <h2 className="mb-6 text-xl font-semibold text-white/80">
          {t.subtitle}
        </h2>
        <p className="mb-8 text-lg text-white/90">{t.description}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="min-w-[160px] border-white/30 bg-white text-black backdrop-blur-sm hover:bg-white/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.tryAgain}
          </Button>
          <Button
            onClick={() => (window.location.href = `/${currentLocale}`)}
            variant="outline"
            size="lg"
            className="min-w-[160px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <Home className="mr-2 h-4 w-4" />
            {t.backHome}
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-8 rounded-lg border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-2 font-mono text-sm font-semibold text-white">
              {t.errorDevOnly}
            </p>
            <p className="font-mono text-xs text-white/70">{error.message}</p>
          </div>
        )}

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
  );
}
