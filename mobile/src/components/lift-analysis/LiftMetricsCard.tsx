import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { LiftMetrics } from "@/src/types/lift-analysis";

interface LiftMetricsCardProps {
  metrics: LiftMetrics;
}

export function LiftMetricsCard({ metrics }: LiftMetricsCardProps) {
  const { t } = useTranslation();

  const rows: { label: string; value: string }[] = [
    {
      label: t("liftAnalysis.metrics.duration"),
      value: `${(metrics.durationMs / 1000).toFixed(1)}s`,
    },
    {
      label: t("liftAnalysis.metrics.verticalTravel"),
      value: `${(metrics.totalVerticalTravel * 100).toFixed(1)}%`,
    },
    {
      label: t("liftAnalysis.metrics.horizontalDrift"),
      value: `${(metrics.maxHorizontalDrift * 100).toFixed(1)}%`,
    },
    {
      label: t("liftAnalysis.metrics.avgSpeed"),
      value: `${metrics.averageSpeed.toFixed(3)} u/s`,
    },
    {
      label: t("liftAnalysis.metrics.maxSpeed"),
      value: `${metrics.maxSpeed.toFixed(3)} u/s`,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("liftAnalysis.metrics.title")}</Text>
      {rows.map((row) => (
        <View style={styles.row} key={row.label}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
});
