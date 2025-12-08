// Modern Contact Management App Theme
export const colors = {
  // Primary colors
  primary: "#2563EB", // Modern blue
  primaryLight: "#3B82F6",
  primaryDark: "#1D4ED8",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",

  // Semantic colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#06B6D4",

  // Background
  background: "#FFFFFF",
  backgroundAlt: "#F9FAFB",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Text
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",

  // Avatar placeholders
  avatarBg: "#EFF6FF",
  avatarText: "#1E40AF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  bodySmMedium: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
};
