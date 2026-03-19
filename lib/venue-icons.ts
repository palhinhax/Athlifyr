/**
 * Centralized venue icon and color logic
 *
 * This file contains the logic for determining venue map pins and colors
 * based on their services. The priority system ensures consistency across
 * the entire application.
 */

// Priority order for services (higher priority = shown first)
// If a venue has multiple services, the highest priority one determines the icon/color
const SERVICE_PRIORITY: Record<string, number> = {
  // Combat Sports (highest priority)
  MMA: 100,
  BJJ: 99,
  BOXING: 98,
  KICKBOXING: 97,

  // Specialized Fitness
  CROSSFIT: 90,
  HYROX: 89,

  // Strength Sports
  WEIGHTLIFTING: 80,
  POWERLIFTING: 79,
  OLYMPIC_LIFTING: 78,

  // Functional & Training
  FUNCTIONAL_FITNESS: 70,
  PERSONAL_TRAINING: 69,
  GROUP_CLASSES: 68,
  OPEN_GYM: 67,

  // Mind & Body
  YOGA: 60,
  PILATES: 59,

  // Recovery & Wellness
  PHYSIOTHERAPY: 50,
  MASSAGE: 49,
  NUTRITION: 48,
  RECOVERY: 47,
  SAUNA: 46,
  COLD_PLUNGE: 45,

  // Other
  OTHER: 0,
};

// Color definitions for each service category
export const SERVICE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  // Combat Sports - Red/Orange tones
  MMA: { bg: "#dc2626", border: "#b91c1c", text: "#ffffff" },
  BJJ: { bg: "#ea580c", border: "#c2410c", text: "#ffffff" },
  BOXING: { bg: "#ef4444", border: "#dc2626", text: "#ffffff" },
  KICKBOXING: { bg: "#f97316", border: "#ea580c", text: "#ffffff" },

  // CrossFit/HYROX - Black background with white icon
  CROSSFIT: { bg: "#000000", border: "#333333", text: "#ffffff" },
  HYROX: { bg: "#1a1a1a", border: "#404040", text: "#ffffff" },

  // Strength Sports - Blue tones
  WEIGHTLIFTING: { bg: "#3b82f6", border: "#2563eb", text: "#ffffff" },
  POWERLIFTING: { bg: "#1d4ed8", border: "#1e40af", text: "#ffffff" },
  OLYMPIC_LIFTING: { bg: "#2563eb", border: "#1d4ed8", text: "#ffffff" },

  // Functional & Training - Teal/Cyan
  FUNCTIONAL_FITNESS: { bg: "#14b8a6", border: "#0d9488", text: "#ffffff" },
  PERSONAL_TRAINING: { bg: "#06b6d4", border: "#0891b2", text: "#ffffff" },
  GROUP_CLASSES: { bg: "#0891b2", border: "#0e7490", text: "#ffffff" },
  OPEN_GYM: { bg: "#0d9488", border: "#0f766e", text: "#ffffff" },

  // Mind & Body - Purple/Violet
  YOGA: { bg: "#8b5cf6", border: "#7c3aed", text: "#ffffff" },
  PILATES: { bg: "#a855f7", border: "#9333ea", text: "#ffffff" },

  // Recovery & Wellness - Green tones
  PHYSIOTHERAPY: { bg: "#22c55e", border: "#16a34a", text: "#ffffff" },
  MASSAGE: { bg: "#10b981", border: "#059669", text: "#ffffff" },
  NUTRITION: { bg: "#34d399", border: "#10b981", text: "#000000" },
  RECOVERY: { bg: "#059669", border: "#047857", text: "#ffffff" },
  SAUNA: { bg: "#047857", border: "#065f46", text: "#ffffff" },
  COLD_PLUNGE: { bg: "#0ea5e9", border: "#0284c7", text: "#ffffff" },

  // Default/Other
  OTHER: { bg: "#6b7280", border: "#4b5563", text: "#ffffff" },
  DEFAULT: { bg: "#6b7280", border: "#4b5563", text: "#ffffff" },
};

// Emoji icons for each service category (single source of truth)
export const SERVICE_EMOJIS: Record<string, string> = {
  // Combat Sports
  MMA: "🥊",
  BJJ: "🥋",
  BOXING: "🥊",
  KICKBOXING: "🦵",

  // CrossFit/HYROX
  CROSSFIT: "🏋️",
  HYROX: "💪",

  // Strength Sports
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

  // Default/Other
  OTHER: "📍",
  DEFAULT: "📍",
};

/**
 * Get the primary service for a venue based on priority
 * If the venue has CROSSFIT, it takes priority over most services
 */
export function getPrimaryService(services?: string[] | null): string {
  if (!services || services.length === 0) {
    return "DEFAULT";
  }

  // Sort by priority (descending) and return the highest
  const sorted = [...services].sort((a, b) => {
    const priorityA = SERVICE_PRIORITY[a] ?? 0;
    const priorityB = SERVICE_PRIORITY[b] ?? 0;
    return priorityB - priorityA;
  });

  return sorted[0];
}

/**
 * Get the color configuration for a venue based on its services
 */
export function getVenueColor(
  services?: string[] | null
): (typeof SERVICE_COLORS)[string] {
  const primaryService = getPrimaryService(services);
  return SERVICE_COLORS[primaryService] || SERVICE_COLORS.DEFAULT;
}

/**
 * Get the emoji icon for a venue based on its services
 */
export function getVenueEmoji(services?: string[] | null): string {
  const primaryService = getPrimaryService(services);
  return SERVICE_EMOJIS[primaryService] || SERVICE_EMOJIS.DEFAULT;
}

/**
 * Create an HTML string for a venue marker (used with Mapbox GL JS custom markers)
 * @param services - Array of services the venue offers
 * @param size - Size of the marker (default: 40, small: 28, large: 48)
 */
export function createVenueMarkerHtml(
  services?: string[] | null,
  size: number = 40
): string {
  const color = getVenueColor(services);
  const emoji = getVenueEmoji(services);
  const fontSize = Math.round(size * 0.45);
  const borderWidth = size >= 36 ? 3 : 2;

  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color.bg};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 ${Math.round(size * 0.1)}px ${Math.round(size * 0.3)}px rgba(0, 0, 0, 0.3);
      border: ${borderWidth}px solid ${color.border};
    ">
      <span style="
        transform: rotate(45deg);
        font-size: ${fontSize}px;
        line-height: 1;
      ">${emoji}</span>
    </div>
  `;
}

/**
 * Get CSS classes for venue badges/tags based on services
 */
export function getVenueBadgeStyle(services?: string[] | null): {
  backgroundColor: string;
  color: string;
  borderColor: string;
} {
  const color = getVenueColor(services);
  return {
    backgroundColor: color.bg,
    color: color.text,
    borderColor: color.border,
  };
}

/**
 * Get emoji icon for a service type
 */
export function getServiceIcon(service: string): string {
  return SERVICE_EMOJIS[service] || SERVICE_EMOJIS.DEFAULT;
}
