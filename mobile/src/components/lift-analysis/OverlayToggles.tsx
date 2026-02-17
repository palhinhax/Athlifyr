import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Route, PersonStanding, Ruler } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { OverlayVisibility } from "@/src/types/lift-analysis";

interface OverlayTogglesProps {
  visibility: OverlayVisibility;
  onToggle: (key: keyof OverlayVisibility) => void;
}

/**
 * OverlayToggles – Buttons to toggle individual overlay layers
 * (bar path, skeleton, angles) on the analysis playback screen.
 */
export function OverlayToggles({ visibility, onToggle }: OverlayTogglesProps) {
  const { t } = useTranslation();

  const toggles: {
    key: keyof OverlayVisibility;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "barPath",
      label: t("liftAnalysis.overlays.barPath"),
      icon: (
        <Route
          size={16}
          color={
            visibility.barPath
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
      ),
    },
    {
      key: "skeleton",
      label: t("liftAnalysis.overlays.skeleton"),
      icon: (
        <PersonStanding
          size={16}
          color={
            visibility.skeleton
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
      ),
    },
    {
      key: "angles",
      label: t("liftAnalysis.overlays.angles"),
      icon: (
        <Ruler
          size={16}
          color={
            visibility.angles
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {toggles.map(({ key, label, icon }) => (
        <TouchableOpacity
          key={key}
          style={[styles.toggle, visibility[key] && styles.toggleActive]}
          onPress={() => onToggle(key)}
          activeOpacity={0.7}
          accessibilityLabel={label}
          accessibilityRole="switch"
          accessibilityState={{ checked: visibility[key] }}
        >
          {icon}
          <Text
            style={[
              styles.toggleText,
              visibility[key] && styles.toggleTextActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  toggleActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: theme.colors.primary,
  },
});
