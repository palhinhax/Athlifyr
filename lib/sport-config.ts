/**
 * Sport Configuration
 * Centralized sport icons and color schemes
 */

export type SportType =
  | "RUNNING"
  | "TRAIL"
  | "CYCLING"
  | "BTT"
  | "SWIMMING"
  | "TRIATHLON"
  | "HYROX"
  | "CROSSFIT"
  | "OBSTACLE"
  | "OCR"
  | "WALKING"
  | "SURF"
  | "OTHER";

/**
 * Sport type icons mapping
 * Emoji icons for each sport type
 */
export const sportIcons: Record<SportType, string> = {
  RUNNING: "🏃",
  TRAIL: "🥾",
  CYCLING: "🚴",
  BTT: "🚵",
  SWIMMING: "🏊",
  TRIATHLON: "🏊‍♂️",
  HYROX: "💪",
  CROSSFIT: "🏋️",
  OBSTACLE: "🧗",
  OCR: "🤸",
  WALKING: "🚶",
  SURF: "🏄",
  OTHER: "📍",
};

/**
 * Sport type colors mapping
 * Gradient colors and shadows for each sport type
 */
export const sportColors: Record<
  SportType,
  { gradient: string; shadow: string; solid: string }
> = {
  RUNNING: {
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", // Blue
    shadow: "rgba(59, 130, 246, 0.4)",
    solid: "#3B82F6",
  },
  TRAIL: {
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)", // Green
    shadow: "rgba(16, 185, 129, 0.4)",
    solid: "#10B981",
  },
  CYCLING: {
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", // Amber
    shadow: "rgba(245, 158, 11, 0.4)",
    solid: "#F59E0B",
  },
  BTT: {
    gradient: "linear-gradient(135deg, #84CC16 0%, #65A30D 100%)", // Lime
    shadow: "rgba(132, 204, 22, 0.4)",
    solid: "#84CC16",
  },
  SWIMMING: {
    gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)", // Cyan
    shadow: "rgba(6, 182, 212, 0.4)",
    solid: "#06B6D4",
  },
  TRIATHLON: {
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", // Purple
    shadow: "rgba(139, 92, 246, 0.4)",
    solid: "#8B5CF6",
  },
  HYROX: {
    gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)", // Red
    shadow: "rgba(239, 68, 68, 0.4)",
    solid: "#EF4444",
  },
  CROSSFIT: {
    gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", // Orange
    shadow: "rgba(249, 115, 22, 0.4)",
    solid: "#F97316",
  },
  OBSTACLE: {
    gradient: "linear-gradient(135deg, #78716C 0%, #57534E 100%)", // Stone
    shadow: "rgba(120, 113, 108, 0.4)",
    solid: "#78716C",
  },
  OCR: {
    gradient: "linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)", // Purple (lighter than Triathlon)
    shadow: "rgba(168, 85, 247, 0.4)",
    solid: "#A855F7",
  },
  WALKING: {
    gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", // Teal
    shadow: "rgba(20, 184, 166, 0.4)",
    solid: "#14B8A6",
  },
  SURF: {
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)", // Sky blue
    shadow: "rgba(14, 165, 233, 0.4)",
    solid: "#0EA5E9",
  },
  OTHER: {
    gradient: "linear-gradient(135deg, #FE8818 0%, #FF6B35 100%)", // Brand orange
    shadow: "rgba(254, 136, 24, 0.4)",
    solid: "#FE8818",
  },
};

/**
 * Get sport icon by sport type
 * @param sportType - Sport type string
 * @returns Emoji icon for the sport
 */
export function getSportIcon(sportType: string): string {
  return sportIcons[sportType as SportType] || sportIcons.OTHER;
}

/**
 * Get sport colors by sport type
 * @param sportType - Sport type string
 * @returns Color configuration object
 */
export function getSportColors(sportType: string): {
  gradient: string;
  shadow: string;
  solid: string;
} {
  return sportColors[sportType as SportType] || sportColors.OTHER;
}

/**
 * Get primary sport from array of sport types
 * @param sportTypes - Array of sport type strings
 * @returns Primary sport type string
 */
export function getPrimarySport(sportTypes: string[]): string {
  return sportTypes[0] || "OTHER";
}
