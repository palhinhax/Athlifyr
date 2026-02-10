// Color palettes (for shade access)
export const primaryPalette = {
  50: "#fef3e8",
  100: "#fde3c9",
  200: "#f9c48f",
  300: "#f5a455",
  400: "#ef8d35",
  500: "#e57b2a",
  600: "#c96621",
  700: "#a5501a",
  800: "#823d15",
  900: "#5e2c10",
};

export const secondaryPalette = {
  50: "#f8f9fa",
  100: "#f3f5f6",
  200: "#e2e5e9",
  300: "#c8cdd4",
  400: "#8d95a1",
  500: "#67717e",
  600: "#4b5563",
  700: "#374151",
  800: "#1f252e",
  900: "#131820",
};

// Colors matching the web app theme (synced with globals.css)
export const colors = {
  // Primary & secondary — from CSS --p-brand: 26 78% 53%
  primary: "#e57b2a",
  primaryLight: "#fde3c9",
  primaryDark: "#a5501a",
  secondary: "#67717e",
  secondaryLight: "#f3f5f6",
  secondaryDark: "#1f252e",

  // Accent — from CSS --p-golden: 41 89% 65%
  accent: "#f5c356",
  accentForeground: "#131820",

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4343",
  info: "#aadeee",

  // UI colors — from CSS :root variables
  background: "#ffffff",
  backgroundSecondary: "#f3f5f6",
  foreground: "#131820",
  surface: "#ffffff",
  muted: "#f3f5f6",
  mutedForeground: "#67717e",
  border: "#e2e5e9",
  card: "#ffffff",
  cardForeground: "#131820",
  white: "#ffffff",

  // Text colors
  text: "#131820",
  textSecondary: "#4b5563",
  textTertiary: "#8d95a1",
  textInverse: "#ffffff",
};

// Typography
export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Layout
export const layout = {
  containerPadding: spacing.md,
  screenPadding: spacing.lg,
  cardSpacing: spacing.md,
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
};

export type Theme = typeof theme;
