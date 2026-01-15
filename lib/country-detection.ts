/**
 * Detects user's country based on browser timezone
 * Maps IANA timezone to country name
 */
export function getCountryFromTimezone(): string | null {
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
