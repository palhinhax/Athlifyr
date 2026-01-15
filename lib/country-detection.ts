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
 * Priority: locale detection > default to Portugal (main market)
 */
export function getDefaultCountry(locale?: string): string {
  if (locale) {
    const country = getUserCountryFromLocale(locale);
    if (country) return country;
  }

  // Default to Portugal as it's the main market
  return "Portugal";
}
