"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
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
    title: "Critical Error",
    subtitle: "A critical error occurred in the application",
    description:
      "We apologize for the inconvenience. Please reload the page or return to the home page.",
    tryAgain: "Try Again",
    backHome: "Back to Home",
    slogan: "one place. all sports.",
  },
  pt: {
    title: "Erro Crítico",
    subtitle: "Ocorreu um erro grave na aplicação",
    description:
      "Pedimos desculpa pelo inconveniente. Por favor, recarrega a página ou volta à página inicial.",
    tryAgain: "Tentar novamente",
    backHome: "Voltar à Home",
    slogan: "one place. all sports.",
  },
  es: {
    title: "Error Crítico",
    subtitle: "Ocurrió un error grave en la aplicación",
    description:
      "Disculpa las molestias. Por favor, recarga la página o vuelve a la página principal.",
    tryAgain: "Intentar de nuevo",
    backHome: "Volver al Inicio",
    slogan: "one place. all sports.",
  },
  fr: {
    title: "Erreur Critique",
    subtitle: "Une erreur critique s'est produite dans l'application",
    description:
      "Nous nous excusons pour le dérangement. Veuillez recharger la page ou retourner à la page d'accueil.",
    tryAgain: "Réessayer",
    backHome: "Retour à l'accueil",
    slogan: "one place. all sports.",
  },
  de: {
    title: "Kritischer Fehler",
    subtitle: "Ein kritischer Fehler ist in der Anwendung aufgetreten",
    description:
      "Wir entschuldigen uns für die Unannehmlichkeiten. Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück.",
    tryAgain: "Erneut versuchen",
    backHome: "Zurück zur Startseite",
    slogan: "one place. all sports.",
  },
  it: {
    title: "Errore Critico",
    subtitle: "Si è verificato un errore critico nell'applicazione",
    description:
      "Ci scusiamo per l'inconveniente. Ricarica la pagina o torna alla home page.",
    tryAgain: "Riprova",
    backHome: "Torna alla Home",
    slogan: "one place. all sports.",
  },
} as const;

type SupportedLocale = keyof typeof translations;

function getLocale(): SupportedLocale {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/(pt|en|es|fr|de|it)(\/|$)/);
    if (localeMatch) {
      return localeMatch[1] as SupportedLocale;
    }
    const browserLang = navigator.language.split("-")[0];
    if (browserLang in translations) {
      return browserLang as SupportedLocale;
    }
  }
  return "en";
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [videoSrc, setVideoSrc] = useState<string>(backgroundVideos[0]);
  const [locale, setLocale] = useState<SupportedLocale>("en");

  useEffect(() => {
    console.error("Global Error:", error);
    Sentry.captureException(error);
    setLocale(getLocale());
    const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
    setVideoSrc(backgroundVideos[randomIndex]);
  }, [error]);

  const t = translations[locale];

  return (
    <html>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; }
              html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
              body { margin: 0; line-height: inherit; }
              .antialiased { -webkit-font-smoothing: antialiased; }
              .relative { position: relative; }
              .absolute { position: absolute; }
              .inset-0 { inset: 0; }
              .z-10 { z-index: 10; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .flex { display: flex; }
              .flex-col { flex-direction: column; }
              .items-center { align-items: center; }
              .justify-center { justify-content: center; }
              .min-h-screen { min-height: 100vh; }
              .overflow-hidden { overflow: hidden; }
              .h-full { height: 100%; }
              .w-full { width: 100%; }
              .h-20 { height: 5rem; }
              .w-20 { width: 5rem; }
              .h-4 { height: 1rem; }
              .w-4 { width: 1rem; }
              .object-cover { object-fit: cover; }
              .max-w-2xl { max-width: 42rem; }
              .text-center { text-align: center; }
              .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
              .text-5xl { font-size: 3rem; line-height: 1; }
              .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
              .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .font-bold { font-weight: 700; }
              .font-semibold { font-weight: 600; }
              .font-medium { font-weight: 500; }
              .text-white { color: white; }
              .text-white\\/70 { color: rgb(255 255 255 / 0.7); }
              .text-white\\/80 { color: rgb(255 255 255 / 0.8); }
              .text-white\\/90 { color: rgb(255 255 255 / 0.9); }
              .bg-black\\/60 { background-color: rgb(0 0 0 / 0.6); }
              .bg-white { background-color: white; }
              .bg-white\\/10 { background-color: rgb(255 255 255 / 0.1); }
              .bg-white\\/20 { background-color: rgb(255 255 255 / 0.2); }
              .border-white\\/30 { border-color: rgb(255 255 255 / 0.3); }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-16 { margin-top: 4rem; }
              .mr-2 { margin-right: 0.5rem; }
              .gap-4 { gap: 1rem; }
              .min-w-\\[160px\\] { min-width: 160px; }
              button { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; 
                font-size: 1rem; font-weight: 500; transition: all 0.2s; cursor: pointer; text-decoration: none; 
                border-radius: 0.5rem; padding: 0.625rem 1.5rem; border: 1px solid; }
              button:hover { opacity: 0.9; }
              .text-black { color: black !important; }
              @media (min-width: 640px) {
                .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
                .sm\\:flex-row { flex-direction: row; }
                .sm\\:justify-center { justify-content: center; }
              }
            `,
          }}
        />
      </head>
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
            <AlertTriangle
              className="mx-auto mb-6 h-20 w-20 text-white"
              style={{ display: "inline-block" }}
            />
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              {t.title}
            </h1>
            <h2 className="mb-6 text-xl font-semibold text-white/80">
              {t.subtitle}
            </h2>
            <p className="mb-8 text-lg text-white">{t.description}</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="min-w-[160px] border-white/30 bg-white text-black"
                style={{
                  backdropFilter: "blur(4px)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RefreshCw
                  className="mr-2 h-4 w-4"
                  style={{ display: "inline-block" }}
                />
                {t.tryAgain}
              </button>
              <button
                onClick={() => (window.location.href = `/${locale}`)}
                className="min-w-[160px] border-white/30 bg-white/10 text-white"
                style={{
                  backdropFilter: "blur(4px)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Home
                  className="mr-2 h-4 w-4"
                  style={{ display: "inline-block" }}
                />
                {t.backHome}
              </button>
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
