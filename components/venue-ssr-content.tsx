/**
 * Server-side rendered content for venue pages
 * Essential for SEO - ensures crawlers can index venue content
 * without depending on client-side JavaScript
 */

import {
  Phone,
  Mail,
  Globe,
  Instagram,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Simple markdown to HTML converter for server-side rendering
 * Supports: headings, bold, italic, lists, links, line breaks
 * This keeps SSR content clean while being SEO-friendly
 */
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown
    // Escape HTML entities first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers (must be at start of line)
    .replace(
      /^### (.+)$/gm,
      '<h4 class="text-base font-semibold mt-4 mb-2">$1</h4>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h3 class="text-lg font-semibold mt-5 mb-2">$1</h3>'
    )
    .replace(/^# (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered lists (- item)
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    // Links [text](url)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, "<br />");

  // Wrap list items in ul
  if (html.includes("<li")) {
    html = html.replace(
      /(<li[^>]*>.*?<\/li>)+/g,
      '<ul class="list-disc space-y-1 my-3">$&</ul>'
    );
  }

  // Wrap in paragraph
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*<(h[2-4])/g, "<$1");
  html = html.replace(/<\/(h[2-4])>\s*<\/p>/g, "</$1>");
  html = html.replace(/<p>\s*<ul/g, "<ul");
  html = html.replace(/<\/ul>\s*<\/p>/g, "</ul>");

  return html;
}

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Venue type for SSR content
interface VenueSSRData {
  id: string;
  slug: string;
  name: string;
  type: string;
  services: string[];
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  country: string;
  isVerified: boolean;
  logo: string | null;
  coverImage: string | null;
}

interface VenueTranslation {
  language: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface VenueSSRContentProps {
  venue: VenueSSRData;
  translation: VenueTranslation | null;
  locale: string;
}

// Venue type labels for all 6 languages
const venueTypeLabels: Record<string, Record<string, string>> = {
  CROSSFIT_BOX: {
    en: "CrossFit Box",
    pt: "Box de CrossFit",
    es: "Box de CrossFit",
    fr: "Box de CrossFit",
    de: "CrossFit Box",
    it: "Box di CrossFit",
  },
  CROSSTRAINING_BOX: {
    en: "CrossTraining Box",
    pt: "Box de CrossTraining",
    es: "Box de CrossTraining",
    fr: "Box de CrossTraining",
    de: "CrossTraining Box",
    it: "Box di CrossTraining",
  },
  GYM: {
    en: "Gym",
    pt: "Ginásio",
    es: "Gimnasio",
    fr: "Salle de sport",
    de: "Fitnessstudio",
    it: "Palestra",
  },
  PT_STUDIO: {
    en: "Personal Training Studio",
    pt: "Estúdio de Personal Training",
    es: "Estudio de Entrenamiento Personal",
    fr: "Studio d'entraînement personnel",
    de: "Personal Training Studio",
    it: "Studio di Personal Training",
  },
  MASSAGE: {
    en: "Massage Therapy",
    pt: "Massagem Terapêutica",
    es: "Masaje Terapéutico",
    fr: "Massothérapie",
    de: "Massagetherapie",
    it: "Massoterapia",
  },
  PHYSIO: {
    en: "Physiotherapy",
    pt: "Fisioterapia",
    es: "Fisioterapia",
    fr: "Physiothérapie",
    de: "Physiotherapie",
    it: "Fisioterapia",
  },
  NUTRITION: {
    en: "Nutrition",
    pt: "Nutrição",
    es: "Nutrición",
    fr: "Nutrition",
    de: "Ernährung",
    it: "Nutrizione",
  },
  OTHER: {
    en: "Venue",
    pt: "Espaço",
    es: "Local",
    fr: "Lieu",
    de: "Einrichtung",
    it: "Locale",
  },
};

// Service labels for all 6 languages
const serviceLabels: Record<string, Record<string, string>> = {
  CROSSFIT: {
    en: "CrossFit",
    pt: "CrossFit",
    es: "CrossFit",
    fr: "CrossFit",
    de: "CrossFit",
    it: "CrossFit",
  },
  HYROX: {
    en: "HYROX Training",
    pt: "Treino HYROX",
    es: "Entrenamiento HYROX",
    fr: "Entraînement HYROX",
    de: "HYROX Training",
    it: "Allenamento HYROX",
  },
  WEIGHTLIFTING: {
    en: "Weightlifting",
    pt: "Halterofilismo",
    es: "Halterofilia",
    fr: "Haltérophilie",
    de: "Gewichtheben",
    it: "Sollevamento pesi",
  },
  POWERLIFTING: {
    en: "Powerlifting",
    pt: "Powerlifting",
    es: "Powerlifting",
    fr: "Force athlétique",
    de: "Kraftdreikampf",
    it: "Powerlifting",
  },
  OLYMPIC_LIFTING: {
    en: "Olympic Lifting",
    pt: "Levantamento Olímpico",
    es: "Levantamiento Olímpico",
    fr: "Haltérophilie Olympique",
    de: "Olympisches Gewichtheben",
    it: "Sollevamento Olimpico",
  },
  FUNCTIONAL_FITNESS: {
    en: "Functional Fitness",
    pt: "Fitness Funcional",
    es: "Fitness Funcional",
    fr: "Fitness fonctionnel",
    de: "Functional Fitness",
    it: "Fitness Funzionale",
  },
  PERSONAL_TRAINING: {
    en: "Personal Training",
    pt: "Personal Training",
    es: "Entrenamiento Personal",
    fr: "Entraînement personnel",
    de: "Personal Training",
    it: "Personal Training",
  },
  GROUP_CLASSES: {
    en: "Group Classes",
    pt: "Aulas de Grupo",
    es: "Clases Grupales",
    fr: "Cours collectifs",
    de: "Gruppenkurse",
    it: "Lezioni di gruppo",
  },
  OPEN_GYM: {
    en: "Open Gym",
    pt: "Open Gym",
    es: "Open Gym",
    fr: "Open Gym",
    de: "Open Gym",
    it: "Open Gym",
  },
  MASSAGE: {
    en: "Sports Massage",
    pt: "Massagem Desportiva",
    es: "Masaje Deportivo",
    fr: "Massage sportif",
    de: "Sportmassage",
    it: "Massaggio sportivo",
  },
  PHYSIOTHERAPY: {
    en: "Physiotherapy",
    pt: "Fisioterapia",
    es: "Fisioterapia",
    fr: "Physiothérapie",
    de: "Physiotherapie",
    it: "Fisioterapia",
  },
  NUTRITION: {
    en: "Nutrition Consulting",
    pt: "Consultoria Nutricional",
    es: "Consultoría Nutricional",
    fr: "Conseil en nutrition",
    de: "Ernährungsberatung",
    it: "Consulenza nutrizionale",
  },
  YOGA: {
    en: "Yoga",
    pt: "Yoga",
    es: "Yoga",
    fr: "Yoga",
    de: "Yoga",
    it: "Yoga",
  },
  PILATES: {
    en: "Pilates",
    pt: "Pilates",
    es: "Pilates",
    fr: "Pilates",
    de: "Pilates",
    it: "Pilates",
  },
  BOXING: {
    en: "Boxing",
    pt: "Boxe",
    es: "Boxeo",
    fr: "Boxe",
    de: "Boxen",
    it: "Pugilato",
  },
  KICKBOXING: {
    en: "Kickboxing",
    pt: "Kickboxing",
    es: "Kickboxing",
    fr: "Kickboxing",
    de: "Kickboxen",
    it: "Kickboxing",
  },
  MMA: {
    en: "MMA",
    pt: "MMA",
    es: "MMA",
    fr: "MMA",
    de: "MMA",
    it: "MMA",
  },
  BJJ: {
    en: "Brazilian Jiu-Jitsu",
    pt: "Jiu-Jitsu Brasileiro",
    es: "Jiu-Jitsu Brasileño",
    fr: "Jiu-Jitsu Brésilien",
    de: "Brasilianisches Jiu-Jitsu",
    it: "Jiu-Jitsu Brasiliano",
  },
  RECOVERY: {
    en: "Recovery Services",
    pt: "Serviços de Recuperação",
    es: "Servicios de Recuperación",
    fr: "Services de récupération",
    de: "Erholungsdienstleistungen",
    it: "Servizi di recupero",
  },
  SAUNA: {
    en: "Sauna",
    pt: "Sauna",
    es: "Sauna",
    fr: "Sauna",
    de: "Sauna",
    it: "Sauna",
  },
  COLD_PLUNGE: {
    en: "Cold Plunge",
    pt: "Imersão em Água Fria",
    es: "Inmersión en Agua Fría",
    fr: "Bain froid",
    de: "Eisbad",
    it: "Immersione in acqua fredda",
  },
  OTHER: {
    en: "Other Services",
    pt: "Outros Serviços",
    es: "Otros Servicios",
    fr: "Autres services",
    de: "Andere Dienstleistungen",
    it: "Altri servizi",
  },
};

// UI labels for all 6 languages
const uiLabels: Record<string, Record<string, string>> = {
  services: {
    en: "Services",
    pt: "Serviços",
    es: "Servicios",
    fr: "Services",
    de: "Dienstleistungen",
    it: "Servizi",
  },
  location: {
    en: "Location",
    pt: "Localização",
    es: "Ubicación",
    fr: "Emplacement",
    de: "Standort",
    it: "Posizione",
  },
  contact: {
    en: "Contact",
    pt: "Contacto",
    es: "Contacto",
    fr: "Contact",
    de: "Kontakt",
    it: "Contatto",
  },
  about: {
    en: "About",
    pt: "Sobre",
    es: "Acerca de",
    fr: "À propos",
    de: "Über",
    it: "Chi siamo",
  },
  verified: {
    en: "Verified",
    pt: "Verificado",
    es: "Verificado",
    fr: "Vérifié",
    de: "Verifiziert",
    it: "Verificato",
  },
  viewWebsite: {
    en: "Visit Website",
    pt: "Visitar Website",
    es: "Visitar Sitio Web",
    fr: "Visiter le site",
    de: "Website besuchen",
    it: "Visita il sito",
  },
  callNow: {
    en: "Call Now",
    pt: "Ligar Agora",
    es: "Llamar Ahora",
    fr: "Appeler maintenant",
    de: "Jetzt anrufen",
    it: "Chiama ora",
  },
  sendEmail: {
    en: "Send Email",
    pt: "Enviar Email",
    es: "Enviar Email",
    fr: "Envoyer un e-mail",
    de: "E-Mail senden",
    it: "Invia email",
  },
  noDescription: {
    en: "No description available for this venue. Please check back later or contact the venue directly for more information.",
    pt: "Nenhuma descrição disponível para este espaço. Por favor, volta mais tarde ou contacta diretamente o espaço para mais informações.",
    es: "No hay descripción disponible para este local. Por favor, vuelve más tarde o contacta directamente con el local para más información.",
    fr: "Aucune description disponible pour ce lieu. Veuillez revenir plus tard ou contacter directement le lieu pour plus d'informations.",
    de: "Keine Beschreibung für diese Einrichtung verfügbar. Bitte schauen Sie später wieder vorbei oder kontaktieren Sie die Einrichtung direkt für weitere Informationen.",
    it: "Nessuna descrizione disponibile per questo locale. Si prega di tornare più tardi o contattare direttamente il locale per ulteriori informazioni.",
  },
};

function getLabel(key: string, locale: string): string {
  return uiLabels[key]?.[locale] || uiLabels[key]?.["en"] || key;
}

function getVenueTypeLabel(type: string, locale: string): string {
  return (
    venueTypeLabels[type]?.[locale] || venueTypeLabels[type]?.["en"] || type
  );
}

function getServiceLabel(service: string, locale: string): string {
  return (
    serviceLabels[service]?.[locale] ||
    serviceLabels[service]?.["en"] ||
    service
  );
}

/**
 * Server-rendered content component for venue pages
 * This content is visible to search engine crawlers without JavaScript
 */
export function VenueSSRContent({
  venue,
  translation,
  locale,
}: VenueSSRContentProps) {
  // Use translated description if available, otherwise fallback to original
  const description = translation?.description || venue.description;
  const hasDescription = description && description.trim().length > 0;
  const hasContact =
    venue.phone ||
    venue.email ||
    venue.website ||
    venue.instagram ||
    venue.whatsapp;
  const hasLocation = venue.address || venue.city;
  const hasServices = venue.services && venue.services.length > 0;

  return (
    <article
      className="venue-ssr-content"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* Hidden meta for additional SEO context */}
      <meta itemProp="name" content={venue.name} />
      {venue.city && <meta itemProp="addressLocality" content={venue.city} />}
      <meta itemProp="addressCountry" content={venue.country} />
      {venue.phone && <meta itemProp="telephone" content={venue.phone} />}
      {venue.email && <meta itemProp="email" content={venue.email} />}
      {venue.website && <meta itemProp="url" content={venue.website} />}

      {/* Main Heading - Essential for SEO */}
      <header className="mb-6">
        <h1 className="mb-3" itemProp="name">
          {venue.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {getVenueTypeLabel(venue.type, locale)}
          </Badge>
          {venue.isVerified && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              {getLabel("verified", locale)}
            </Badge>
          )}
        </div>
      </header>

      {/* Location Info - Critical for Local SEO */}
      {hasLocation && (
        <section className="mb-6" aria-labelledby="venue-location">
          <h2 id="venue-location" className="mb-3 text-xl font-semibold">
            {getLabel("location", locale)}
          </h2>
          <address
            className="flex items-start gap-2 not-italic text-muted-foreground"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              {venue.address && (
                <span itemProp="streetAddress" className="block">
                  {venue.address}
                </span>
              )}
              {venue.city && (
                <span itemProp="addressLocality">{venue.city}</span>
              )}
              {venue.city && venue.country && ", "}
              <span itemProp="addressCountry">{venue.country}</span>
            </div>
          </address>
        </section>
      )}

      {/* Description - Essential for content indexing - Only show if venue has description */}
      {hasDescription && (
        <section className="mb-6" aria-labelledby="venue-about">
          <h2 id="venue-about" className="mb-3">
            {getLabel("about", locale)} {venue.name}
          </h2>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            itemProp="description"
          >
            {/* Render markdown as HTML for crawlers and initial page load */}
            <div
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(description),
              }}
            />
          </div>
        </section>
      )}

      {/* Services - Important for search queries */}
      {hasServices && (
        <section className="mb-6" aria-labelledby="venue-services">
          <h2 id="venue-services" className="mb-3 text-xl font-semibold">
            {getLabel("services", locale)}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {venue.services.map((service) => (
              <li key={service}>
                <Badge variant="outline">
                  {getServiceLabel(service, locale)}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact Information - Essential for Local SEO */}
      {hasContact && (
        <section className="mb-6" aria-labelledby="venue-contact">
          <h2 id="venue-contact" className="mb-3 text-xl font-semibold">
            {getLabel("contact", locale)}
          </h2>
          <div className="flex flex-wrap gap-4">
            {venue.phone && (
              <Link
                href={`tel:${venue.phone}`}
                className="flex items-center gap-2 text-sm hover:text-primary"
                itemProp="telephone"
              >
                <Phone className="h-4 w-4" />
                {venue.phone}
              </Link>
            )}
            {venue.email && (
              <Link
                href={`mailto:${venue.email}`}
                className="flex items-center gap-2 text-sm hover:text-primary"
                itemProp="email"
              >
                <Mail className="h-4 w-4" />
                {venue.email}
              </Link>
            )}
            {venue.website && (
              <Link
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <Globe className="h-4 w-4" />
                {getLabel("viewWebsite", locale)}
              </Link>
            )}
            {venue.instagram && (
              <Link
                href={`https://instagram.com/${venue.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <Instagram className="h-4 w-4" />@
                {venue.instagram.replace("@", "")}
              </Link>
            )}
            {venue.whatsapp && (
              <Link
                href={`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {venue.whatsapp}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* CTA Buttons - Signals relevance to crawlers */}
      <div className="flex flex-wrap gap-3">
        {venue.phone && (
          <Button asChild variant="default">
            <Link href={`tel:${venue.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              {getLabel("callNow", locale)}
            </Link>
          </Button>
        )}
        {venue.email && (
          <Button asChild variant="outline">
            <Link href={`mailto:${venue.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              {getLabel("sendEmail", locale)}
            </Link>
          </Button>
        )}
        {venue.website && (
          <Button asChild variant="outline">
            <Link
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="mr-2 h-4 w-4" />
              {getLabel("viewWebsite", locale)}
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * Fallback content for venues with incomplete data
 * Prevents soft 404 by showing meaningful content
 */
export function VenueSSRFallback({
  venueName,
  locale,
}: {
  venueName?: string;
  locale: string;
}) {
  const fallbackMessages: Record<
    string,
    { title: string; description: string }
  > = {
    en: {
      title: venueName || "Venue",
      description:
        "This venue profile is being updated. Please check back soon for more information about services, location, and contact details.",
    },
    pt: {
      title: venueName || "Espaço",
      description:
        "Este perfil de espaço está a ser atualizado. Por favor, volta em breve para mais informações sobre serviços, localização e contactos.",
    },
    es: {
      title: venueName || "Local",
      description:
        "Este perfil de local está siendo actualizado. Por favor, vuelve pronto para más información sobre servicios, ubicación y contactos.",
    },
    fr: {
      title: venueName || "Lieu",
      description:
        "Ce profil de lieu est en cours de mise à jour. Veuillez revenir bientôt pour plus d'informations sur les services, l'emplacement et les contacts.",
    },
    de: {
      title: venueName || "Einrichtung",
      description:
        "Dieses Einrichtungsprofil wird aktualisiert. Bitte schauen Sie bald wieder vorbei für weitere Informationen zu Dienstleistungen, Standort und Kontaktdaten.",
    },
    it: {
      title: venueName || "Locale",
      description:
        "Questo profilo del locale è in fase di aggiornamento. Si prega di tornare presto per ulteriori informazioni su servizi, posizione e contatti.",
    },
  };

  const message = fallbackMessages[locale] || fallbackMessages["en"];

  return (
    <article className="venue-ssr-fallback rounded-lg border bg-card p-6">
      <h1 className="mb-4 text-2xl font-bold">{message.title}</h1>
      <p className="text-muted-foreground">{message.description}</p>
    </article>
  );
}
