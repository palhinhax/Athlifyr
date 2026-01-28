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
    venue.phone || venue.email || venue.website || venue.instagram;
  const hasLocation = venue.address || venue.city;
  const hasServices = venue.services && venue.services.length > 0;

  return (
    <article
      className="venue-ssr-content sr-only-mobile"
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
        <h1
          className="text-3xl font-bold tracking-tight md:text-4xl"
          itemProp="name"
        >
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

      {/* Description - Essential for content indexing */}
      <section className="mb-6" aria-labelledby="venue-about">
        <h2 id="venue-about" className="mb-3 text-xl font-semibold">
          {getLabel("about", locale)} {venue.name}
        </h2>
        {hasDescription ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            itemProp="description"
          >
            {/* Render first 500 chars as plain text for crawlers, full content loads in client */}
            <p>
              {description.substring(0, 500)}
              {description.length > 500 ? "..." : ""}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground" itemProp="description">
            {getLabel("noDescription", locale)}
          </p>
        )}
      </section>

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
