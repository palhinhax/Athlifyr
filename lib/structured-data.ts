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
 */
export function generateSportsEventSchema(event: EventWithVariants) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";
  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const eventImage = event.imageUrl || `${baseUrl}/logo.png`;

  // Build offers array from variants
  // Currency defaults to EUR for Portugal-based events
  const currency = event.country === "Portugal" ? "EUR" : "EUR"; // TODO: Add currency field to Event model

  // Athlifyr organization structure (used for both organizer and performer)
  const athlifyrOrganization = {
    "@type": "Organization" as const,
    name: "Athlifyr",
    url: baseUrl,
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
    price: variant.price?.toString() || "0",
    priceCurrency: currency,
    availability: "https://schema.org/InStock",
    url: eventUrl,
    validFrom: getValidFromDate(variant),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.title,
    description: event.description,
    image: eventImage,
    url: eventUrl,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() || event.startDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    organizer: athlifyrOrganization,
    performer: athlifyrOrganization,
    ...(offers.length > 0 && { offers }),
    sport: event.sportTypes.join(", "),
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
