import { theme } from "./theme";

// Sports constants
export const SPORTS = [
  "RUNNING",
  "CYCLING",
  "SWIMMING",
  "TRIATHLON",
  "HIKING",
  "TRAIL_RUNNING",
  "MOUNTAIN_BIKING",
  "CLIMBING",
  "SKIING",
  "SNOWBOARDING",
  "SURFING",
  "KAYAKING",
  "OTHER",
] as const;

export type Sport = (typeof SPORTS)[number];

export const SPORT_LABELS: Record<Sport, string> = {
  RUNNING: "Running",
  CYCLING: "Cycling",
  SWIMMING: "Swimming",
  TRIATHLON: "Triathlon",
  HIKING: "Hiking",
  TRAIL_RUNNING: "Trail Running",
  MOUNTAIN_BIKING: "Mountain Biking",
  CLIMBING: "Climbing",
  SKIING: "Skiing",
  SNOWBOARDING: "Snowboarding",
  SURFING: "Surfing",
  KAYAKING: "Kayaking",
  OTHER: "Other",
};

export const SPORT_COLORS: Record<Sport, string> = {
  RUNNING: theme.colors.primary[500],
  CYCLING: theme.colors.primary[600],
  SWIMMING: theme.colors.info,
  TRIATHLON: theme.colors.primary[700],
  HIKING: theme.colors.success,
  TRAIL_RUNNING: theme.colors.warning,
  MOUNTAIN_BIKING: theme.colors.primary[800],
  CLIMBING: theme.colors.error,
  SKIING: theme.colors.primary[400],
  SNOWBOARDING: theme.colors.primary[300],
  SURFING: theme.colors.info,
  KAYAKING: theme.colors.primary[500],
  OTHER: theme.colors.secondary[500],
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_ME: "/auth/me",
  AUTH_REGISTER: "/auth/register",

  // Events
  EVENTS: "/events",
  EVENT_DETAILS: (slug: string) => `/events/${slug}`,
  EVENT_REGISTER: (eventId: string) => `/events/${eventId}/register`,
  EVENT_UNREGISTER: (eventId: string) => `/events/${eventId}/unregister`,

  // Venues
  VENUES: "/venues",
  VENUE_DETAILS: (slug: string) => `/venues/${slug}`,

  // Posts
  POSTS: "/posts",
  POST_DETAILS: (postId: string) => `/posts/${postId}`,
  POST_LIKE: (postId: string) => `/posts/${postId}/like`,
  POST_UNLIKE: (postId: string) => `/posts/${postId}/unlike`,

  // Comments
  COMMENTS: (type: "post" | "event", id: string) => `/${type}s/${id}/comments`,

  // User
  USER_PROFILE: (userId: string) => `/users/${userId}`,
  USER_UPDATE: "/users/me",
  USER_EVENTS: (userId: string) => `/users/${userId}/events`,
} as const;

// Screen names (for navigation)
export const SCREENS = {
  // Auth
  LOGIN: "Login",
  REGISTER: "Register",
  FORGOT_PASSWORD: "ForgotPassword",

  // Main tabs
  HOME: "Home",
  EVENTS: "Events",
  VENUES: "Venues",
  PROFILE: "Profile",

  // Event screens
  EVENT_DETAILS: "EventDetails",
  EVENT_MAP: "EventMap",
  CREATE_EVENT: "CreateEvent",

  // Venue screens
  VENUE_DETAILS: "VenueDetails",
  VENUE_MAP: "VenueMap",

  // Profile screens
  EDIT_PROFILE: "EditProfile",
  SETTINGS: "Settings",
  MY_EVENTS: "MyEvents",

  // Lift Analysis screens
  LIFT_ANALYSIS_HISTORY: "LiftAnalysisHistory",
  LIFT_CAMERA: "LiftCamera",
  LIFT_EDITOR: "LiftEditor",
  LIFT_ANALYSIS: "LiftAnalysis",
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Map defaults
export const MAP_DEFAULTS = {
  LATITUDE: 40.416775, // Madrid
  LONGITUDE: -3.70379,
  DELTA: 0.1,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM d, yyyy",
  DISPLAY_WITH_TIME: "MMM d, yyyy h:mm a",
  API: "yyyy-MM-dd",
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Image upload limits
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_COUNT: 5,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
  USER_LANGUAGE: "user-language",
  USER_PREFERENCES: "user-preferences",
} as const;
