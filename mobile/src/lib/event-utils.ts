/**
 * Sport type icons (emoji) - aligned with web: lib/sport-config.ts sportIcons
 */
export const sportTypeIcons: Record<string, string> = {
  RUNNING: "🏃",
  TRAIL: "🥾",
  WALKING: "🚶",
  HYROX: "💪",
  CROSSFIT: "🏋️",
  OCR: "🤸",
  BTT: "🚵",
  CYCLING: "🚴",
  SURF: "🏄",
  TRIATHLON: "🏊‍♂️",
  DUATHLON: "🏃‍♂️🚴",
  AQUATHLON: "🏊🏃",
  SWIMMING: "🏊",
  OTHER: "📍",
};

export function getSportIcon(sportType: string): string {
  return sportTypeIcons[sportType] || sportTypeIcons.OTHER;
}

/**
 * Sport type colors - aligned with web: lib/sport-config.ts
 */
export const sportTypeColors: Record<string, string> = {
  RUNNING: "#3B82F6",
  TRAIL: "#10B981",
  CYCLING: "#F59E0B",
  BTT: "#84CC16",
  SWIMMING: "#06B6D4",
  TRIATHLON: "#8B5CF6",
  DUATHLON: "#7C3AED",
  AQUATHLON: "#2DD4BF",
  HYROX: "#EF4444",
  CROSSFIT: "#F97316",
  OCR: "#A855F7",
  WALKING: "#14B8A6",
  SURF: "#0EA5E9",
  OTHER: "#FE8818",
};

export function getSportColor(sportType: string): string {
  return sportTypeColors[sportType] || sportTypeColors.OTHER;
}

/**
 * Get primary sport from array of sport types
 * Aligned with web: lib/sport-config.ts
 */
export function getPrimarySport(sportTypes: string[]): string {
  return sportTypes[0] || "OTHER";
}

/**
 * All sport types available for filtering
 */
export const SPORT_TYPES = [
  "RUNNING",
  "TRAIL",
  "WALKING",
  "HYROX",
  "CROSSFIT",
  "OCR",
  "BTT",
  "CYCLING",
  "SURF",
  "TRIATHLON",
  "DUATHLON",
  "AQUATHLON",
  "SWIMMING",
  "OTHER",
] as const;

export function formatDate(date: Date, locale: string = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date, locale: string = "en"): string {
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
  startDate: Date | string,
  endDate: Date | string | null,
  locale: string = "en"
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
