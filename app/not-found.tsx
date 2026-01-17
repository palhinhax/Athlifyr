import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

// Default locale for root not-found page (used when URL is outside locale structure)
const defaultLocale = "pt";

// Available background videos
const backgroundVideos = [
  "/promo/group-running.mp4",
  "/promo/woman-running.mp4",
  "/promo/crossfit-workout.mp4",
  "/promo/warm-up-girl.mp4",
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

export default function NotFound() {
  // Use default locale for server-side rendering (no client-side detection)
  const locale = defaultLocale as SupportedLocale;
  const t = translations[locale];

  // Select a random video (server-side)
  const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
  const videoSrc = backgroundVideos[randomIndex];

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
              .mb-8 { margin-bottom: 2rem; }
              .mt-2 { margin-top: 0.5rem; }
              .mt-6 { margin-top: 1.5rem; }
              .mt-10 { margin-top: 2.5rem; }
              .mt-16 { margin-top: 4rem; }
              .-mt-12 { margin-top: -3rem; }
              .mr-2 { margin-right: 0.5rem; }
              .h-4 { height: 1rem; }
              .w-4 { width: 1rem; }
              .gap-4 { gap: 1rem; }
              .min-w-\\[160px\\] { min-width: 160px; }
              .leading-8 { line-height: 2rem; }
              button, a { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; 
                font-size: 1rem; font-weight: 500; transition: all 0.2s; cursor: pointer; text-decoration: none; 
                border-radius: 0.5rem; padding: 0.625rem 1.5rem; border: 1px solid transparent; }
              button:hover, a:hover { opacity: 0.9; }
              button { background-color: hsl(222.2 47.4% 11.2%); color: hsl(210 40% 98%); }
              button + button { background-color: transparent; border-color: rgb(255 255 255 / 0.3); 
                color: white; backdrop-filter: blur(4px); }
              @media (min-width: 640px) {
                .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .sm\\:flex-row { flex-direction: row; }
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

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
