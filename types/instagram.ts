export type TemplateKey =
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "T7"
  | "T8"
  | "T9"
  | "T10";

export type InstagramFormat =
  | "SQUARE"
  | "PORTRAIT"
  | "STORY"
  | "REELS"
  | "TIKTOK";

export interface InstagramSize {
  width: number;
  height: number;
  ratio: string;
}

export const INSTAGRAM_SIZES: Record<InstagramFormat, InstagramSize> = {
  SQUARE: { width: 1080, height: 1080, ratio: "1:1" },
  PORTRAIT: { width: 1080, height: 1350, ratio: "4:5" },
  STORY: { width: 1080, height: 1920, ratio: "9:16" },
  REELS: { width: 1080, height: 1920, ratio: "9:16" }, // Instagram Reels format
  TIKTOK: { width: 1080, height: 1920, ratio: "9:16" }, // TikTok optimized format
};

export type BackgroundType = "solid" | "gradient" | "photo" | "transparent";

export interface Background {
  type: BackgroundType;
  value: string; // Color hex for solid, gradient CSS for gradient, URL for photo, empty for transparent
  overlayIntensity?: number; // 0-100 for photo backgrounds
}

// Template T1: Event Hero
export interface EventHeroPayload {
  title: string; // required, max 50 chars
  subtitle?: string; // optional, max 40 chars
  metaLine?: string; // optional, max 30 chars (e.g., "Mar 2026 • Lisboa")
  cta?: string; // optional, max 30 chars
  background: Background;
}

// Template T2: Category Card
export interface CategoryCardPayload {
  categoryTitle: string; // required, max 20 chars
  chips: string[]; // 2-3 items, each max 15 chars
  tagline: string; // required, max 40 chars
  background: Background;
}

// Template T3: Weekly Picks
export interface WeeklyPicksPayload {
  header: string; // default: "EVENTOS DA SEMANA", max 30 chars
  items: string[]; // 3-5 items, each max 40 chars
  footer: string; // default: "athlifyr.com", max 30 chars
  background: Background;
}

// Template T4: Minimal Quote
export interface MinimalQuotePayload {
  quote: string; // required, max 200 chars
  footer: string; // default: "Athlifyr", max 20 chars
  background: Background;
}

// Template T5: Monthly Events
export interface MonthlyEventsPayload {
  month: string; // e.g., "JANEIRO 2026"
  sportType: string; // e.g., "TRAIL", "RUNNING", "BTT"
  events: Array<{
    title: string;
    date: string; // e.g., "15 jan"
    location: string;
  }>;
  footer: string; // default: "athlifyr.com"
  background: Background;
}

// Template T6: Bold Text Overlay (Modern trending style)
export interface BoldTextOverlayPayload {
  mainText: string; // required, max 60 chars - bold statement
  subText?: string; // optional, max 40 chars
  emoji?: string; // optional, single emoji
  background: Background;
}

// Template T7: Split Screen (Comparison/Before-After style)
export interface SplitScreenPayload {
  leftTitle: string; // required, max 30 chars
  leftSubtitle?: string; // optional, max 40 chars
  rightTitle: string; // required, max 30 chars
  rightSubtitle?: string; // optional, max 40 chars
  vsText?: string; // optional, default "VS", max 5 chars
  background: Background;
}

// Template T8: Testimonial/Stats Card (Social proof)
export interface TestimonialStatsPayload {
  statNumber: string; // required, max 10 chars (e.g., "1000+", "95%")
  statLabel: string; // required, max 30 chars
  quote?: string; // optional, max 150 chars
  author?: string; // optional, max 30 chars
  background: Background;
}

// Template T9: Vertical Challenge Card (TikTok/Reels optimized)
export interface VerticalChallengePayload {
  challengeTitle: string; // required, max 40 chars
  steps: string[]; // 3-5 items, each max 50 chars
  hashtag?: string; // optional, max 30 chars
  cta?: string; // optional, max 30 chars
  background: Background;
}

// Template T10: Hook + CTA (Viral TikTok format)
export interface HookCtaPayload {
  hook: string; // required, max 80 chars - attention grabber
  body: string; // required, max 120 chars - main content
  cta: string; // required, max 40 chars - call to action
  background: Background;
}

export type TemplatePayload =
  | EventHeroPayload
  | CategoryCardPayload
  | WeeklyPicksPayload
  | MinimalQuotePayload
  | MonthlyEventsPayload
  | BoldTextOverlayPayload
  | SplitScreenPayload
  | TestimonialStatsPayload
  | VerticalChallengePayload
  | HookCtaPayload;

export interface InstagramDraft {
  id: string;
  userId: string;
  templateKey: TemplateKey;
  format: InstagramFormat;
  payload: TemplatePayload;
  createdAt: Date;
  updatedAt: Date;
}

// Brand colors (Athlifyr palette)
export const BRAND_COLORS = {
  primary: "#000000",
  secondary: "#f5f5f5",
  accent: "#3b82f6",
  text: "#ffffff",
  textDark: "#000000",
};

// Brand gradients (Modern and trendy combinations)
export const BRAND_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple dream
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink passion
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Ocean blue
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Fresh mint
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Sunset glow
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", // Deep ocean
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Soft pastel
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", // Cotton candy
  // New modern gradients for 2024-2026
  "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)", // Warm energy
  "linear-gradient(135deg, #5f27cd 0%, #341f97 100%)", // Royal purple
  "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)", // Sky gradient
  "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)", // Magenta burst
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", // Fire sunset
  "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)", // Nature green
  "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)", // Professional blue
  "linear-gradient(135deg, #000000 0%, #434343 100%)", // Dramatic dark
];

// Safe area margins (in pixels at 1080px width base)
export const SAFE_AREAS = {
  SQUARE: {
    top: 80,
    bottom: 80,
    left: 60,
    right: 60,
  },
  PORTRAIT: {
    top: 80,
    bottom: 80,
    left: 60,
    right: 60,
  },
  STORY: {
    top: 150, // More space for device UI
    bottom: 150,
    left: 60,
    right: 60,
  },
  REELS: {
    top: 180, // More space for Reels UI (profile, like buttons)
    bottom: 200, // Space for comments, share buttons
    left: 60,
    right: 60,
  },
  TIKTOK: {
    top: 180, // Space for TikTok UI
    bottom: 220, // Space for TikTok action buttons and description
    left: 60,
    right: 60,
  },
};
