/**
 * Detects user's country based on browser timezone
 * Maps IANA timezone to country name
 * Only works in browser context - returns null on server
 */
export function getCountryFromTimezone(): string | null {
  // Check if we're in a browser context
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Map common European timezones to countries
    const timezoneToCountry: Record<string, string> = {
      "Europe/Lisbon": "Portugal",
      "Europe/Madrid": "Spain",
      "Europe/Paris": "France",
      "Europe/Berlin": "Germany",
      "Europe/Rome": "Italy",
      "Europe/London": "United Kingdom",
      "Europe/Dublin": "Ireland",
      "Europe/Brussels": "Belgium",
      "Europe/Amsterdam": "Netherlands",
      "Europe/Vienna": "Austria",
      "Europe/Warsaw": "Poland",
      "Europe/Prague": "Czech Republic",
      "Europe/Budapest": "Hungary",
      "Europe/Athens": "Greece",
      "Europe/Stockholm": "Sweden",
      "Europe/Oslo": "Norway",
      "Europe/Copenhagen": "Denmark",
      "Europe/Helsinki": "Finland",
      "Europe/Zurich": "Switzerland",
      "America/New_York": "United States",
      "America/Chicago": "United States",
      "America/Los_Angeles": "United States",
      "America/Denver": "United States",
      "America/Sao_Paulo": "Brazil",
      "America/Mexico_City": "Mexico",
      "America/Toronto": "Canada",
    };

    return timezoneToCountry[timezone] || null;
  } catch {
    return null;
  }
}

/**
 * Gets geographic center coordinates for a country
 * Returns [latitude, longitude]
 */
export function getCountryCenter(country: string): [number, number] | null {
  const countryCoordinates: Record<string, [number, number]> = {
    Portugal: [39.5, -8.0],
    Spain: [40.4, -3.7],
    France: [46.6, 2.3],
    Germany: [51.2, 10.4],
    Italy: [42.8, 12.6],
    "United Kingdom": [54.0, -2.5],
    Ireland: [53.4, -8.0],
    Belgium: [50.5, 4.5],
    Netherlands: [52.1, 5.3],
    Austria: [47.5, 14.5],
    Poland: [52.0, 19.0],
    "Czech Republic": [49.8, 15.5],
    Hungary: [47.2, 19.5],
    Greece: [39.0, 22.0],
    Sweden: [62.0, 15.0],
    Norway: [60.5, 8.5],
    Denmark: [56.0, 10.0],
    Finland: [64.0, 26.0],
    Switzerland: [46.8, 8.2],
    "United States": [37.1, -95.7],
    Brazil: [-14.2, -51.9],
    Mexico: [23.6, -102.5],
    Canada: [56.1, -106.3],
  };

  return countryCoordinates[country] || null;
}

/**
 * Gets default map center based on detected country
 * Priority: timezone > locale > default to Portugal
 */
export function getDefaultMapCenter(locale?: string): [number, number] {
  // Try to detect country from timezone first
  const timezoneCountry = getCountryFromTimezone();
  if (timezoneCountry) {
    const center = getCountryCenter(timezoneCountry);
    if (center) return center;
  }

  // Fallback to locale detection
  if (locale) {
    const country = getUserCountryFromLocale(locale);
    if (country) {
      const center = getCountryCenter(country);
      if (center) return center;
    }
  }

  // Default to Portugal (main market)
  return [39.5, -8.0];
}

/**
 * Detects user's country based on locale
 * Returns country name in English for database queries
 */
export function getUserCountryFromLocale(locale: string): string | null {
  // Map locales to countries
  const localeToCountry: Record<string, string | null> = {
    pt: "Portugal",
    "pt-PT": "Portugal",
    "pt-BR": "Brazil",
    en: null, // English is international, don't assume country
    "en-US": "United States",
    "en-GB": "United Kingdom",
    es: "Spain",
    "es-ES": "Spain",
    "es-MX": "Mexico",
    fr: "France",
    "fr-FR": "France",
    de: "Germany",
    "de-DE": "Germany",
    it: "Italy",
    "it-IT": "Italy",
  };

  return localeToCountry[locale] || null;
}

/**
 * Gets default country for filtering events
 * Priority: timezone > locale > default to Portugal
 */
export function getDefaultCountry(locale?: string): string {
  // Try to detect from timezone first (most accurate for device location)
  const timezoneCountry = getCountryFromTimezone();
  if (timezoneCountry) return timezoneCountry;

  // Fallback to locale detection
  if (locale) {
    const country = getUserCountryFromLocale(locale);
    if (country) return country;
  }

  // Default to Portugal as it's the main market
  return "Portugal";
}
