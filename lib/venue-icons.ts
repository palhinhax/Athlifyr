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

  // CrossFit/HYROX - Orange/Yellow
  CROSSFIT: { bg: "#f59e0b", border: "#d97706", text: "#000000" },
  HYROX: { bg: "#eab308", border: "#ca8a04", text: "#000000" },

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

// SVG icons for each service category
export const SERVICE_ICONS: Record<string, string> = {
  // Combat Sports - Fist/Glove icon
  MMA: `<path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5m12 0v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7m12 0H6"/>`,
  BJJ: `<path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5m12 0v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7m12 0H6"/>`,
  BOXING: `<path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5m12 0v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7m12 0H6"/>`,
  KICKBOXING: `<path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5m12 0v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7m12 0H6"/>`,

  // CrossFit/HYROX - Dumbbell icon
  CROSSFIT: `<path d="M6.5 6.5h11M6.5 17.5h11M3 9h3v6H3zM18 9h3v6h-3zM6 11h2v2H6zM16 11h2v2h-2z"/>`,
  HYROX: `<path d="M6.5 6.5h11M6.5 17.5h11M3 9h3v6H3zM18 9h3v6h-3zM6 11h2v2H6zM16 11h2v2h-2z"/>`,

  // Strength Sports - Barbell icon
  WEIGHTLIFTING: `<path d="M6.5 6.5h11M6.5 17.5h11M3 8h3v8H3zM18 8h3v8h-3z"/>`,
  POWERLIFTING: `<path d="M6.5 6.5h11M6.5 17.5h11M3 8h3v8H3zM18 8h3v8h-3z"/>`,
  OLYMPIC_LIFTING: `<path d="M6.5 6.5h11M6.5 17.5h11M3 8h3v8H3zM18 8h3v8h-3z"/>`,

  // Functional & Training - Activity icon
  FUNCTIONAL_FITNESS: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  PERSONAL_TRAINING: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  GROUP_CLASSES: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  OPEN_GYM: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>`,

  // Mind & Body - Lotus/Meditation icon
  YOGA: `<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/>`,
  PILATES: `<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/>`,

  // Recovery & Wellness - Heart/Health icons
  PHYSIOTHERAPY: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  MASSAGE: `<path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>`,
  NUTRITION: `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>`,
  RECOVERY: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  SAUNA: `<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><circle cx="12" cy="10" r="3"/>`,
  COLD_PLUNGE: `<path d="M12 2v10"/><path d="m4.93 10.93 7.07 7.07"/><path d="M2 12h10"/><path d="M12 22a10 10 0 0 0 0-20"/>`,

  // Default - Location pin
  OTHER: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
  DEFAULT: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
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
 * Get the SVG icon path for a venue based on its services
 */
export function getVenueIconPath(services?: string[] | null): string {
  const primaryService = getPrimaryService(services);
  return SERVICE_ICONS[primaryService] || SERVICE_ICONS.DEFAULT;
}

/**
 * Create a Leaflet-compatible HTML string for a venue marker
 */
export function createVenueMarkerHtml(services?: string[] | null): string {
  const color = getVenueColor(services);
  const iconPath = getVenueIconPath(services);

  return `
    <div style="
      width: 40px;
      height: 40px;
      background: ${color.bg};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 3px solid ${color.border};
    ">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="${color.text}" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="transform: rotate(45deg);"
      >
        ${iconPath}
      </svg>
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
