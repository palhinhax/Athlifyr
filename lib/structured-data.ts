/**
 * Structured Data (JSON-LD) utilities for SEO
 * Generates schema.org markup for rich search results
 */

import { Event, EventVariant, PricingPhase } from "@prisma/client";

interface EventVariantWithPricingPhases extends EventVariant {
  pricingPhases: PricingPhase[];
}

interface EventWithVariants extends Event {
  variants: EventVariantWithPricingPhases[];
  pricingPhases: PricingPhase[];
}

/**
 * Generate SportsEvent schema for event pages
 * https://schema.org/SportsEvent
 * Enhanced for better Google indexing with rich structured data
 */
export function generateSportsEventSchema(event: EventWithVariants) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";
  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const eventImage = event.imageUrl || `${baseUrl}/logo.png`;

  // Build offers array from variants with enhanced details
  // Currency defaults to EUR for Portugal-based events
  const currency = event.country === "Portugal" ? "EUR" : "EUR"; // TODO: Add currency field to Event model

  // Athlifyr organization structure (used for both organizer and performer)
  const athlifyrOrganization = {
    "@type": "Organization" as const,
    name: "Athlifyr",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
  };

  // Determine validFrom date for offers
  // Priority: 1) Variant-specific pricing phase, 2) Event-level pricing phase, 3) Event creation date, 4) 30 days before event
  // Note: Pricing phases are pre-sorted by startDate (ascending) in the database query,
  // so pricingPhases[0] is guaranteed to be the earliest phase
  const getValidFromDate = (variant: EventVariantWithPricingPhases): string => {
    // Check variant-specific pricing phases first
    if (variant.pricingPhases.length > 0) {
      return variant.pricingPhases[0].startDate.toISOString();
    }

    // Fall back to event-level pricing phases
    if (event.pricingPhases.length > 0) {
      return event.pricingPhases[0].startDate.toISOString();
    }

    // If no pricing phases, use event creation date
    if (event.createdAt) {
      return event.createdAt.toISOString();
    }

    // Last resort: 30 days before event start
    const defaultDate = new Date(event.startDate);
    defaultDate.setDate(defaultDate.getDate() - 30);
    return defaultDate.toISOString();
  };

  const offers = event.variants.map((variant) => ({
    "@type": "Offer",
    name: variant.name,
    description:
      variant.description || `${variant.name} - ${variant.distanceKm}km`,
    price: variant.price?.toString() || "0",
    priceCurrency: currency,
    availability:
      new Date() < event.startDate
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    url: eventUrl,
    validFrom: getValidFromDate(variant),
    validThrough: event.startDate.toISOString(),
  }));

  // Enhanced location with coordinates
  const location: {
    "@type": string;
    name: string;
    address: {
      "@type": string;
      addressLocality: string;
      addressCountry: string;
    };
    geo?: {
      "@type": string;
      latitude: number;
      longitude: number;
    };
  } = {
    "@type": "Place",
    name: event.city,
    address: {
      "@type": "PostalAddress",
      addressLocality: event.city,
      addressCountry: event.country,
    },
  };

  // Add geo coordinates if available
  if (event.latitude && event.longitude) {
    location.geo = {
      "@type": "GeoCoordinates",
      latitude: event.latitude,
      longitude: event.longitude,
    };
  }

  // Build sport activity type based on sport types
  const sportActivity = event.sportTypes
    .map((sport) => {
      switch (sport) {
        case "RUNNING":
          return "Running";
        case "TRAIL":
          return "Trail Running";
        case "TRIATHLON":
          return "Triathlon";
        case "CYCLING":
          return "Cycling";
        case "BTT":
          return "Mountain Biking";
        case "SWIMMING":
          return "Swimming";
        case "CROSSFIT":
          return "CrossFit";
        case "HYROX":
          return "HYROX";
        case "OCR":
          return "Obstacle Course Racing";
        case "WALKING":
          return "Walking";
        case "SURF":
          return "Surfing";
        case "OTHER":
          return "Sports";
        default:
          return sport;
      }
    })
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.title,
    description: event.description,
    image: [eventImage],
    url: eventUrl,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() || event.startDate.toISOString(),
    eventStatus:
      new Date() < event.startDate
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventPostponed",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location,
    organizer: athlifyrOrganization,
    performer: athlifyrOrganization,
    ...(offers.length > 0 && { offers }),
    sport: sportActivity,
    // Additional fields for better indexing
    ...(event.externalUrl && {
      sameAs: event.externalUrl,
    }),
    keywords: [
      ...event.sportTypes,
      event.city,
      event.country,
      ...event.variants.map((v) => `${v.distanceKm}km`),
    ].join(", "),
    inLanguage: "pt-PT",
  };
}

/**
 * Generate Organization schema for the website
 * https://schema.org/Organization
 *
 * Follows Google's guidelines for Organization structured data:
 * https://developers.google.com/search/docs/appearance/structured-data/logo
 *
 * Logo requirements for Google Search:
 * - Minimum: 112x112px (current: 307x303px ✓)
 * - Recommended: Square or wide logo, minimum 112x112px
 * - Format: PNG, JPG, or SVG (current: PNG ✓)
 * - URL must be publicly accessible (no login required)
 */
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Athlifyr",
    alternateName: "Athlifyr Platform",
    description: "All Sports Events. One Place.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: 307,
      height: 303,
      caption: "Athlifyr Logo",
    },
    image: `${baseUrl}/logo.png`,
    sameAs: [
      // Social media links - add when available
      // "https://www.instagram.com/athlifyr",
      // "https://www.facebook.com/athlifyr",
      // "https://twitter.com/athlifyr",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@athlifyr.com",
      availableLanguage: [
        "Portuguese",
        "English",
        "Spanish",
        "French",
        "German",
        "Italian",
      ],
    },
  };
}

/**
 * Generate WebSite schema with search action
 * https://schema.org/WebSite
 */
export function generateWebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Athlifyr",
    description: "All Sports Events. One Place.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/events?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate FAQ schema for event pages
 * https://schema.org/FAQPage
 * Helps Google display rich results with common questions
 */
export function generateEventFAQSchema(
  event: EventWithVariants,
  locale: string = "pt"
) {
  // FAQ translations for all supported languages
  const translations: Record<
    string,
    {
      whenQuestion: (title: string) => string;
      whenAnswer: (
        title: string,
        date: string,
        city: string,
        country: string
      ) => string;
      distancesQuestion: (title: string) => string;
      distancesAnswer: (title: string, distances: string) => string;
      whereQuestion: (title: string) => string;
      whereAnswer: (city: string, country: string, mapsUrl?: string) => string;
      priceQuestion: (title: string) => string;
      priceAnswer: (title: string, range: string) => string;
      registerQuestion: (title: string) => string;
      registerAnswer: (title: string, url: string) => string;
      rangeConnector: string;
    }
  > = {
    pt: {
      whenQuestion: (title) => `Quando é ${title}?`,
      whenAnswer: (title, date, city, country) =>
        `${title} realiza-se em ${date}, em ${city}, ${country}.`,
      distancesQuestion: (title) =>
        `Quais as distâncias disponíveis em ${title}?`,
      distancesAnswer: (title, distances) =>
        `${title} oferece as seguintes distâncias: ${distances}.`,
      whereQuestion: (title) => `Onde se realiza ${title}?`,
      whereAnswer: (city, country, mapsUrl) =>
        `O evento realiza-se em ${city}, ${country}${mapsUrl ? `. Consulte a localização exata em: ${mapsUrl}` : "."}`,
      priceQuestion: (title) => `Qual o preço de inscrição em ${title}?`,
      priceAnswer: (title, range) =>
        `Os preços de inscrição em ${title} variam entre ${range}, dependendo da distância escolhida e da fase de inscrição.`,
      registerQuestion: (title) => `Como fazer a inscrição em ${title}?`,
      registerAnswer: (title, url) =>
        `Pode fazer a inscrição em ${title} através do website oficial: ${url}`,
      rangeConnector: " a ",
    },
    en: {
      whenQuestion: (title) => `When is ${title}?`,
      whenAnswer: (title, date, city, country) =>
        `${title} takes place on ${date}, in ${city}, ${country}.`,
      distancesQuestion: (title) => `What distances are available at ${title}?`,
      distancesAnswer: (title, distances) =>
        `${title} offers the following distances: ${distances}.`,
      whereQuestion: (title) => `Where does ${title} take place?`,
      whereAnswer: (city, country, mapsUrl) =>
        `The event takes place in ${city}, ${country}${mapsUrl ? `. Check the exact location at: ${mapsUrl}` : "."}`,
      priceQuestion: (title) => `What is the registration price for ${title}?`,
      priceAnswer: (title, range) =>
        `Registration prices for ${title} range from ${range}, depending on the chosen distance and registration phase.`,
      registerQuestion: (title) => `How to register for ${title}?`,
      registerAnswer: (title, url) =>
        `You can register for ${title} through the official website: ${url}`,
      rangeConnector: " to ",
    },
    es: {
      whenQuestion: (title) => `¿Cuándo es ${title}?`,
      whenAnswer: (title, date, city, country) =>
        `${title} se realiza el ${date}, en ${city}, ${country}.`,
      distancesQuestion: (title) =>
        `¿Qué distancias están disponibles en ${title}?`,
      distancesAnswer: (title, distances) =>
        `${title} ofrece las siguientes distancias: ${distances}.`,
      whereQuestion: (title) => `¿Dónde se realiza ${title}?`,
      whereAnswer: (city, country, mapsUrl) =>
        `El evento se realiza en ${city}, ${country}${mapsUrl ? `. Consulta la ubicación exacta en: ${mapsUrl}` : "."}`,
      priceQuestion: (title) =>
        `¿Cuál es el precio de inscripción en ${title}?`,
      priceAnswer: (title, range) =>
        `Los precios de inscripción en ${title} varían entre ${range}, dependiendo de la distancia elegida y la fase de inscripción.`,
      registerQuestion: (title) => `¿Cómo inscribirse en ${title}?`,
      registerAnswer: (title, url) =>
        `Puedes inscribirte en ${title} a través del sitio web oficial: ${url}`,
      rangeConnector: " a ",
    },
    fr: {
      whenQuestion: (title) => `Quand a lieu ${title} ?`,
      whenAnswer: (title, date, city, country) =>
        `${title} a lieu le ${date}, à ${city}, ${country}.`,
      distancesQuestion: (title) =>
        `Quelles distances sont disponibles à ${title} ?`,
      distancesAnswer: (title, distances) =>
        `${title} propose les distances suivantes : ${distances}.`,
      whereQuestion: (title) => `Où a lieu ${title} ?`,
      whereAnswer: (city, country, mapsUrl) =>
        `L'événement a lieu à ${city}, ${country}${mapsUrl ? `. Consultez l'emplacement exact sur : ${mapsUrl}` : "."}`,
      priceQuestion: (title) => `Quel est le prix d'inscription à ${title} ?`,
      priceAnswer: (title, range) =>
        `Les prix d'inscription à ${title} varient de ${range}, selon la distance choisie et la phase d'inscription.`,
      registerQuestion: (title) => `Comment s'inscrire à ${title} ?`,
      registerAnswer: (title, url) =>
        `Vous pouvez vous inscrire à ${title} via le site officiel : ${url}`,
      rangeConnector: " à ",
    },
    de: {
      whenQuestion: (title) => `Wann findet ${title} statt?`,
      whenAnswer: (title, date, city, country) =>
        `${title} findet am ${date} in ${city}, ${country} statt.`,
      distancesQuestion: (title) =>
        `Welche Distanzen sind bei ${title} verfügbar?`,
      distancesAnswer: (title, distances) =>
        `${title} bietet folgende Distanzen: ${distances}.`,
      whereQuestion: (title) => `Wo findet ${title} statt?`,
      whereAnswer: (city, country, mapsUrl) =>
        `Die Veranstaltung findet in ${city}, ${country} statt${mapsUrl ? `. Den genauen Standort finden Sie unter: ${mapsUrl}` : "."}`,
      priceQuestion: (title) => `Wie hoch ist die Anmeldegebühr für ${title}?`,
      priceAnswer: (title, range) =>
        `Die Anmeldegebühren für ${title} liegen zwischen ${range}, je nach gewählter Distanz und Anmeldephase.`,
      registerQuestion: (title) => `Wie meldet man sich für ${title} an?`,
      registerAnswer: (title, url) =>
        `Sie können sich für ${title} über die offizielle Website anmelden: ${url}`,
      rangeConnector: " bis ",
    },
    it: {
      whenQuestion: (title) => `Quando si svolge ${title}?`,
      whenAnswer: (title, date, city, country) =>
        `${title} si svolge il ${date}, a ${city}, ${country}.`,
      distancesQuestion: (title) =>
        `Quali distanze sono disponibili a ${title}?`,
      distancesAnswer: (title, distances) =>
        `${title} offre le seguenti distanze: ${distances}.`,
      whereQuestion: (title) => `Dove si svolge ${title}?`,
      whereAnswer: (city, country, mapsUrl) =>
        `L'evento si svolge a ${city}, ${country}${mapsUrl ? `. Consulta la posizione esatta su: ${mapsUrl}` : "."}`,
      priceQuestion: (title) => `Qual è il prezzo di iscrizione a ${title}?`,
      priceAnswer: (title, range) =>
        `I prezzi di iscrizione a ${title} variano da ${range}, a seconda della distanza scelta e della fase di iscrizione.`,
      registerQuestion: (title) => `Come iscriversi a ${title}?`,
      registerAnswer: (title, url) =>
        `Puoi iscriverti a ${title} tramite il sito ufficiale: ${url}`,
      rangeConnector: " a ",
    },
  };

  // Get translations for current locale (fallback to Portuguese)
  const t = translations[locale] || translations.pt;

  // Build FAQ based on available event data
  const faqItems = [];

  // Question 1: When is the event?
  const eventDateStr = event.startDate.toLocaleDateString(
    locale === "pt"
      ? "pt-PT"
      : locale === "en"
        ? "en-GB"
        : `${locale}-${locale.toUpperCase()}`,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  faqItems.push({
    "@type": "Question",
    name: t.whenQuestion(event.title),
    acceptedAnswer: {
      "@type": "Answer",
      text: t.whenAnswer(event.title, eventDateStr, event.city, event.country),
    },
  });

  // Question 2: What distances are available?
  if (event.variants.length > 0) {
    const distances = event.variants
      .map((v) => `${v.name} (${v.distanceKm}km)`)
      .join(", ");

    faqItems.push({
      "@type": "Question",
      name: t.distancesQuestion(event.title),
      acceptedAnswer: {
        "@type": "Answer",
        text: t.distancesAnswer(event.title, distances),
      },
    });
  }

  // Question 3: Where is the event?
  faqItems.push({
    "@type": "Question",
    name: t.whereQuestion(event.title),
    acceptedAnswer: {
      "@type": "Answer",
      text: t.whereAnswer(
        event.city,
        event.country,
        event.googleMapsUrl || undefined
      ),
    },
  });

  // Question 4: What are the prices?
  const hasValidPrices = event.variants.some((v) => v.price && v.price > 0);
  if (hasValidPrices) {
    const priceRange = event.variants
      .filter((v) => v.price && v.price > 0)
      .map((v) => `${v.price}€`)
      .join(t.rangeConnector);

    faqItems.push({
      "@type": "Question",
      name: t.priceQuestion(event.title),
      acceptedAnswer: {
        "@type": "Answer",
        text: t.priceAnswer(event.title, priceRange),
      },
    });
  }

  // Question 5: How to register?
  if (event.externalUrl) {
    faqItems.push({
      "@type": "Question",
      name: t.registerQuestion(event.title),
      acceptedAnswer: {
        "@type": "Answer",
        text: t.registerAnswer(event.title, event.externalUrl),
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 * https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
