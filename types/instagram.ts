export type TemplateKey = "T1" | "T2" | "T3" | "T4" | "T5";

export type InstagramFormat = "SQUARE" | "PORTRAIT" | "STORY";

export interface InstagramSize {
  width: number;
  height: number;
  ratio: string;
}

export const INSTAGRAM_SIZES: Record<InstagramFormat, InstagramSize> = {
  SQUARE: { width: 1080, height: 1080, ratio: "1:1" },
  PORTRAIT: { width: 1080, height: 1350, ratio: "4:5" },
  STORY: { width: 1080, height: 1920, ratio: "9:16" },
};

export type BackgroundType = "solid" | "gradient" | "photo" | "video";

export interface Background {
  type: BackgroundType;
  value: string; // Color hex for solid, gradient CSS for gradient, URL for photo/video
  overlayIntensity?: number; // 0-100 for photo/video backgrounds
  videoScale?: number; // 100-200 for video backgrounds (100=contain, 200=2x zoom)
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

export type TemplatePayload =
  | EventHeroPayload
  | CategoryCardPayload
  | WeeklyPicksPayload
  | MinimalQuotePayload
  | MonthlyEventsPayload;

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

// Brand gradients
export const BRAND_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
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
};
