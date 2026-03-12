// ─── Platform Definitions ────────────────────────────────────────────────────

export type Platform = "google" | "ios";

// ─── Google Play Asset Specs ─────────────────────────────────────────────────

export interface AssetSpec {
  id: string;
  label: string;
  width: number;
  height: number;
  maxSizeMB: number;
  formats: ("png" | "jpeg")[];
  description: string;
}

export const GOOGLE_PLAY_ASSETS: AssetSpec[] = [
  {
    id: "google-feature",
    label: "Feature Graphic",
    width: 1024,
    height: 500,
    maxSizeMB: 15,
    formats: ["png", "jpeg"],
    description: "Main promotional banner at the top of your store listing",
  },
  {
    id: "google-phone-16x9",
    label: "Phone Screenshot (16:9)",
    width: 1920,
    height: 1080,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Landscape phone screenshot (16:9 ratio)",
  },
  {
    id: "google-phone-9x16",
    label: "Phone Screenshot (9:16)",
    width: 1080,
    height: 1920,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Portrait phone screenshot (9:16 ratio)",
  },
  {
    id: "google-tablet-16x9",
    label: "Tablet Screenshot (16:9)",
    width: 1920,
    height: 1080,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Landscape tablet screenshot (16:9 ratio)",
  },
  {
    id: "google-tablet-9x16",
    label: "Tablet Screenshot (9:16)",
    width: 1080,
    height: 1920,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Portrait tablet screenshot (9:16 ratio)",
  },
  {
    id: "google-large-16x9",
    label: "Large Device Screenshot (16:9)",
    width: 3840,
    height: 2160,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Landscape large device screenshot (16:9 ratio)",
  },
  {
    id: "google-large-9x16",
    label: "Large Device Screenshot (9:16)",
    width: 2160,
    height: 3840,
    maxSizeMB: 8,
    formats: ["png", "jpeg"],
    description: "Portrait large device screenshot (9:16 ratio)",
  },
];

// ─── iOS / App Store Connect Asset Specs ─────────────────────────────────────

export const IOS_ASSETS: AssetSpec[] = [
  {
    id: "ios-iphone-65-portrait",
    label: 'iPhone 6.5" Portrait',
    width: 1242,
    height: 2688,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: "iPhone 6.5-inch display (portrait)",
  },
  {
    id: "ios-iphone-65-landscape",
    label: 'iPhone 6.5" Landscape',
    width: 2688,
    height: 1242,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: "iPhone 6.5-inch display (landscape)",
  },
  {
    id: "ios-iphone-67-portrait",
    label: 'iPhone 6.7" Portrait',
    width: 1284,
    height: 2778,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: "iPhone 6.7-inch display (portrait)",
  },
  {
    id: "ios-iphone-67-landscape",
    label: 'iPhone 6.7" Landscape',
    width: 2778,
    height: 1284,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: "iPhone 6.7-inch display (landscape)",
  },
  {
    id: "ios-ipad-13-portrait",
    label: 'iPad 13" Portrait',
    width: 2064,
    height: 2752,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: 'iPad 13" display (portrait)',
  },
  {
    id: "ios-ipad-13-landscape",
    label: 'iPad 13" Landscape',
    width: 2752,
    height: 2064,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: 'iPad 13" display (landscape)',
  },
  {
    id: "ios-ipad-129-portrait",
    label: 'iPad 12.9" Portrait',
    width: 2048,
    height: 2732,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: 'iPad 12.9" display (portrait)',
  },
  {
    id: "ios-ipad-129-landscape",
    label: 'iPad 12.9" Landscape',
    width: 2732,
    height: 2048,
    maxSizeMB: 10,
    formats: ["png", "jpeg"],
    description: 'iPad 12.9" display (landscape)',
  },
];

// ─── Combined Helpers ────────────────────────────────────────────────────────

export function getAssetsForPlatform(platform: Platform): AssetSpec[] {
  return platform === "google" ? GOOGLE_PLAY_ASSETS : IOS_ASSETS;
}

// ─── Canvas Design State ─────────────────────────────────────────────────────

export interface CanvasDesign {
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  backgroundType: "solid" | "gradient" | "image";
  backgroundImageUrl: string;
  overlayColor: string;
  overlayOpacity: number;
  // Device mockup
  showDevice: boolean;
  deviceType: "iphone" | "android";
  deviceScreenImage: string | null; // Screenshot to show in device screen
  deviceScale: number; // 0.3 - 2.0
  deviceOffsetX: number; // percentage -50 to 50
  deviceOffsetY: number; // percentage -50 to 50
  // Text
  headline: string;
  headlineColor: string;
  headlineFontSize: number;
  subheadline: string;
  subheadlineColor: string;
  subheadlineFontSize: number;
  textAlign: "left" | "center" | "right";
  textPosition: "top" | "bottom";
}

export const DEFAULT_CANVAS_DESIGN: CanvasDesign = {
  backgroundColor: "#FF6B2B",
  gradientFrom: "#FF6B2B",
  gradientTo: "#FF9F1C",
  gradientAngle: 135,
  backgroundType: "gradient",
  backgroundImageUrl: "",
  overlayColor: "#000000",
  overlayOpacity: 40,
  showDevice: true,
  deviceType: "iphone",
  deviceScreenImage: null,
  deviceScale: 0.65,
  deviceOffsetX: 0,
  deviceOffsetY: 10,
  headline: "Athlifyr",
  headlineColor: "#FFFFFF",
  headlineFontSize: 64,
  subheadline: "Find your next event",
  subheadlineColor: "#FFFFFF",
  subheadlineFontSize: 28,
  textAlign: "center",
  textPosition: "top",
};
