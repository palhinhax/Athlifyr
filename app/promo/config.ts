/**
 * Promo Page Configuration
 * Edit this file to customize the promo page timeline, durations, and texts
 */

export interface PromoStep {
  id: string;
  duration: number; // in seconds
}

export const PROMO_CONFIG = {
  // Video configuration
  video: {
    mp4: "/promo/promo.mp4",
    webm: "/promo/promo.webm", // Optional alternative format
    poster: "/promo/poster.jpg",
  },

  // Timeline steps with durations (in seconds)
  steps: [
    { id: "intro", duration: 2 },
    { id: "message", duration: 2.5 },
    { id: "features", duration: 4 },
    { id: "cta", duration: 2.5 },
    { id: "final", duration: 3 },
  ] as PromoStep[],

  // Feature items to display (will be shown with stagger animation)
  featureKeys: ["nearYou", "filters", "details", "favorites", "share"] as const,

  // Animation settings
  animation: {
    fadeInDuration: 0.5,
    fadeOutDuration: 0.4,
    staggerDelay: 0.15, // Delay between each feature item
  },
};

// Calculate total timeline duration
export const getTotalDuration = () => {
  return PROMO_CONFIG.steps.reduce((acc, step) => acc + step.duration, 0);
};
