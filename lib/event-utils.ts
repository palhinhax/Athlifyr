import { SportType } from "@prisma/client";

export const sportTypeLabels: Record<SportType, string> = {
  RUNNING: "Corrida",
  TRAIL: "Trail",
  HYROX: "HYROX",
  CROSSFIT: "Cross Training",
  OCR: "OCR",
  BTT: "BTT",
  CYCLING: "Ciclismo",
  SURF: "Surf",
  TRIATHLON: "Triatlo",
  SWIMMING: "Natação",
  OTHER: "Outros",
};

export const sportTypeIcons: Record<SportType, string> = {
  RUNNING: "🏃",
  TRAIL: "⛰️",
  HYROX: "💪",
  CROSSFIT: "🏋️",
  OCR: "🧗",
  BTT: "🚵",
  CYCLING: "🚴",
  SURF: "🏄",
  TRIATHLON: "🏊",
  SWIMMING: "🏊",
  OTHER: "🎯",
};

export function formatDate(date: Date, locale: string = "pt-PT"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date, locale: string = "pt-PT"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date range for event cards
 * - If single day or no end date: "1 Jan 2026"
 * - If same month: "1 - 2 Jan 2026"
 * - If different months, same year: "30 Jan - 3 Feb 2026"
 * - If different years: "30 Dec 2025 - 3 Jan 2026"
 */
export function formatDateRange(
  startDate: Date,
  endDate: Date | null,
  locale: string = "pt-PT"
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  // If no end date or same day, return single date
  if (
    !end ||
    (start.getDate() === end.getDate() &&
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear())
  ) {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(start);
  }

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  // Different years
  if (startYear !== endYear) {
    const startFormatted = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(start);
    const endFormatted = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(end);
    return `${startFormatted} - ${endFormatted}`;
  }

  // Same year, different months: "30 Jan - 3 Feb 2026"
  if (startMonth !== endMonth) {
    const startDayMonth = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
    }).format(start);
    const endDayMonth = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
    }).format(end);
    return `${startDayMonth} - ${endDayMonth} ${startYear}`;
  }

  // Same month: "1 - 2 Jan 2026"
  const monthYear = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(start);
  return `${startDay} - ${endDay} ${monthYear}`;
}

// Country code to name mapping
export const countryNames: Record<string, string> = {
  PT: "Portugal",
  ES: "Spain",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  GB: "United Kingdom",
  US: "United States",
  BR: "Brazil",
  MX: "Mexico",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  DK: "Denmark",
  NO: "Norway",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czech Republic",
  GR: "Greece",
  TR: "Turkey",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  TW: "Taiwan",
  HK: "Hong Kong",
  SG: "Singapore",
  IN: "India",
  AU: "Australia",
  NZ: "New Zealand",
  TH: "Thailand",
  ID: "Indonesia",
  CA: "Canada",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
};

export function getUserCountry(request: Request): string {
  // Try to get country from Cloudflare, Vercel, or other edge providers
  const cfCountry = request.headers.get("cf-ipcountry");
  const vercelCountry = request.headers.get("x-vercel-ip-country");

  const countryCode = cfCountry || vercelCountry || "PT"; // Default to Portugal

  return countryNames[countryCode] || countryCode;
}
