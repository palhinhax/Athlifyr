/**
 * Venue service icons (emoji) and colors for mobile map markers
 * Aligned with web: lib/venue-icons.ts
 */

// Priority order for services (higher = shown first for marker display)
const SERVICE_PRIORITY: Record<string, number> = {
  MMA: 100,
  BJJ: 99,
  BOXING: 98,
  KICKBOXING: 97,
  CROSSFIT: 90,
  HYROX: 89,
  WEIGHTLIFTING: 80,
  POWERLIFTING: 79,
  OLYMPIC_LIFTING: 78,
  FUNCTIONAL_FITNESS: 70,
  PERSONAL_TRAINING: 69,
  GROUP_CLASSES: 68,
  OPEN_GYM: 67,
  YOGA: 60,
  PILATES: 59,
  PHYSIOTHERAPY: 50,
  MASSAGE: 49,
  NUTRITION: 48,
  RECOVERY: 47,
  SAUNA: 46,
  COLD_PLUNGE: 45,
  OTHER: 0,
};

/**
 * Emoji icons for each venue service — aligned with web: lib/venue-icons.ts SERVICE_EMOJIS
 */
export const serviceIcons: Record<string, string> = {
  // Combat Sports
  MMA: "🥊",
  BJJ: "🥋",
  BOXING: "🥊",
  KICKBOXING: "🦵",
  // CrossFit/HYROX
  CROSSFIT: "🏋️",
  HYROX: "💪",
  // Strength
  WEIGHTLIFTING: "🏋️‍♂️",
  POWERLIFTING: "🏋️‍♀️",
  OLYMPIC_LIFTING: "🏅",
  // Functional & Training
  FUNCTIONAL_FITNESS: "⚡",
  PERSONAL_TRAINING: "👤",
  GROUP_CLASSES: "👥",
  OPEN_GYM: "🏢",
  // Mind & Body
  YOGA: "🧘",
  PILATES: "🧘‍♀️",
  // Recovery & Wellness
  PHYSIOTHERAPY: "🩺",
  MASSAGE: "💆",
  NUTRITION: "🥗",
  RECOVERY: "❤️‍🩹",
  SAUNA: "🧖",
  COLD_PLUNGE: "🧊",
  // Default
  OTHER: "📍",
  DEFAULT: "📍",
};

/**
 * Colors for each venue service — aligned with web: lib/venue-icons.ts SERVICE_COLORS
 */
export const serviceColors: Record<string, string> = {
  // Combat Sports - Red/Orange
  MMA: "#dc2626",
  BJJ: "#ea580c",
  BOXING: "#ef4444",
  KICKBOXING: "#f97316",
  // CrossFit/HYROX - Dark
  CROSSFIT: "#000000",
  HYROX: "#1a1a1a",
  // Strength - Blue
  WEIGHTLIFTING: "#3b82f6",
  POWERLIFTING: "#1d4ed8",
  OLYMPIC_LIFTING: "#2563eb",
  // Functional - Teal/Cyan
  FUNCTIONAL_FITNESS: "#14b8a6",
  PERSONAL_TRAINING: "#06b6d4",
  GROUP_CLASSES: "#0891b2",
  OPEN_GYM: "#0d9488",
  // Mind & Body - Purple
  YOGA: "#8b5cf6",
  PILATES: "#a855f7",
  // Recovery - Green
  PHYSIOTHERAPY: "#22c55e",
  MASSAGE: "#10b981",
  NUTRITION: "#34d399",
  RECOVERY: "#059669",
  SAUNA: "#047857",
  COLD_PLUNGE: "#0ea5e9",
  // Default
  OTHER: "#6b7280",
  DEFAULT: "#6b7280",
};

/**
 * Get the primary service for a venue based on priority
 */
export function getPrimaryService(services: string[]): string {
  if (!services || services.length === 0) return "DEFAULT";

  const sorted = [...services].sort((a, b) => {
    const priorityA = SERVICE_PRIORITY[a] ?? 0;
    const priorityB = SERVICE_PRIORITY[b] ?? 0;
    return priorityB - priorityA;
  });

  return sorted[0];
}

export function getServiceIcon(service: string): string {
  return serviceIcons[service] || serviceIcons.DEFAULT;
}

export function getServiceColor(service: string): string {
  return serviceColors[service] || serviceColors.DEFAULT;
}

/**
 * All venue services available for filtering
 * Matches the VenueService enum from Prisma
 */
export const VENUE_SERVICES = [
  "CROSSFIT",
  "HYROX",
  "WEIGHTLIFTING",
  "POWERLIFTING",
  "OLYMPIC_LIFTING",
  "FUNCTIONAL_FITNESS",
  "PERSONAL_TRAINING",
  "GROUP_CLASSES",
  "OPEN_GYM",
  "YOGA",
  "PILATES",
  "BOXING",
  "KICKBOXING",
  "MMA",
  "BJJ",
  "MASSAGE",
  "PHYSIOTHERAPY",
  "NUTRITION",
  "RECOVERY",
  "SAUNA",
  "COLD_PLUNGE",
  "OTHER",
] as const;
