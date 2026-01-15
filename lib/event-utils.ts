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

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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
