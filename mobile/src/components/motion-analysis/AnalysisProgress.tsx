import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";

interface AnalysisProgressProps {
  /** Progress 0–100 */
  progress: number;
  /** Current step label */
  status: "loading_model" | "analyzing" | "computing";
}

export function AnalysisProgress({ progress, status }: AnalysisProgressProps) {
  const { t } = useTranslation();

  const statusText = {
    loading_model: t("motionAnalysis.loadingModel"),
    analyzing: t("motionAnalysis.analyzing"),
    computing: t("motionAnalysis.computing"),
  }[status];

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />

      <Text style={styles.statusText}>{statusText}</Text>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statusText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressBarBg: {
    width: "80%",
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
