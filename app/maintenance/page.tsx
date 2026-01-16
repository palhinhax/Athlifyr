"use client";

import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";

// Available background videos
const backgroundVideos = ["/promo/warm-up-girl.mp4"];

// Translations for maintenance page (all 6 languages)
const translations = {
  en: {
    code: "503",
    title: "Under Maintenance",
    description:
      "We're currently performing scheduled maintenance to improve your experience.",
    suggestion:
      "We'll be back shortly. Thank you for your patience and understanding.",
    slogan: "one place. all sports.",
  },
  pt: {
    code: "503",
    title: "Em Manutenção",
    description:
      "Estamos a realizar manutenção programada para melhorar a tua experiência.",
    suggestion:
      "Voltaremos em breve. Obrigado pela tua paciência e compreensão.",
    slogan: "one place. all sports.",
  },
  es: {
    code: "503",
    title: "En Mantenimiento",
    description:
      "Estamos realizando mantenimiento programado para mejorar tu experiencia.",
    suggestion: "Volveremos pronto. Gracias por tu paciencia y comprensión.",
    slogan: "one place. all sports.",
  },
  fr: {
    code: "503",
    title: "En Maintenance",
    description:
      "Nous effectuons actuellement une maintenance programmée pour améliorer votre expérience.",
    suggestion:
      "Nous serons de retour sous peu. Merci pour votre patience et votre compréhension.",
    slogan: "one place. all sports.",
  },
  de: {
    code: "503",
    title: "Wartungsarbeiten",
    description:
      "Wir führen derzeit geplante Wartungsarbeiten durch, um Ihre Erfahrung zu verbessern.",
    suggestion:
      "Wir sind bald wieder zurück. Vielen Dank für Ihre Geduld und Ihr Verständnis.",
    slogan: "one place. all sports.",
  },
  it: {
    code: "503",
    title: "In Manutenzione",
    description:
      "Stiamo attualmente eseguendo manutenzione programmata per migliorare la tua esperienza.",
    suggestion: "Torneremo a breve. Grazie per la tua pazienza e comprensione.",
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

export default function Maintenance() {
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
              .flex { display: flex; }
              .flex-col { flex-direction: column; }
              .items-center { align-items: center; }
              .justify-center { justify-content: center; }
              .min-h-screen { min-height: 100vh; }
              .overflow-hidden { overflow: hidden; }
              .h-full { height: 100%; }
              .w-full { width: 100%; }
              .object-cover { object-fit: cover; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .max-w-2xl { max-width: 42rem; }
              .text-center { text-align: center; }
              .text-9xl { font-size: 8rem; line-height: 1; }
              .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
              .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
              .text-base { font-size: 1rem; line-height: 1.5rem; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .font-bold { font-weight: 700; }
              .font-medium { font-weight: 500; }
              .tracking-tighter { letter-spacing: -0.05em; }
              .tracking-tight { letter-spacing: -0.025em; }
              .text-white { color: rgb(255 255 255); }
              .text-white\\/20 { color: rgb(255 255 255 / 0.2); }
              .text-white\\/30 { color: rgb(255 255 255 / 0.3); }
              .text-white\\/70 { color: rgb(255 255 255 / 0.7); }
              .text-white\\/80 { color: rgb(255 255 255 / 0.8); }
              .text-white\\/90 { color: rgb(255 255 255 / 0.9); }
              .bg-black\\/60 { background-color: rgb(0 0 0 / 0.6); }
              .bg-white\\/10 { background-color: rgb(255 255 255 / 0.1); }
              .bg-white\\/20 { background-color: rgb(255 255 255 / 0.2); }
              .border-white\\/30 { border-color: rgb(255 255 255 / 0.3); }
              .backdrop-blur-sm { backdrop-filter: blur(4px); }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-2 { margin-top: 0.5rem; }
              .mt-6 { margin-top: 1.5rem; }
              .mt-16 { margin-top: 4rem; }
              .-mt-12 { margin-top: -3rem; }
              .h-24 { height: 6rem; }
              .w-24 { width: 6rem; }
              .leading-8 { line-height: 2rem; }
              .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
              @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
              @media (min-width: 640px) {
                .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
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
            {/* 503 Code with Wrench Icon */}
            <div className="mb-8">
              <div className="mb-4 flex justify-center">
                <Wrench className="h-24 w-24 animate-pulse text-white/30" />
              </div>
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
