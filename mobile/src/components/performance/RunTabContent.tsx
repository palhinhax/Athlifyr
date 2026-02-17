import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Timer, TrendingUp, MapPin } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  formatTime,
  formatPace,
  type PerformanceSummary,
} from "@/src/hooks/usePerformance";
import { PerformanceEntriesList } from "./PerformanceEntriesList";

interface RunTabContentProps {
  summary: PerformanceSummary;
}

export function RunTabContent({ summary }: RunTabContentProps) {
  const { t } = useTranslation();
  const { run, entries } = summary;

  if (run.totalEntries === 0) {
    return null;
  }

  const lastChartPoint =
    run.chartPoints.length > 0
      ? run.chartPoints[run.chartPoints.length - 1]
      : null;

  return (
    <View style={styles.container}>
      {/* Half Marathon Prediction */}
      {run.halfPrediction && (
        <View
          style={[
            styles.predictionCard,
            run.halfPrediction.confidence === "HIGH"
              ? styles.predictionHigh
              : run.halfPrediction.confidence === "MEDIUM"
                ? styles.predictionMedium
                : styles.predictionLow,
          ]}
        >
          <Text style={styles.predictionTitle}>
            🏅 {t("performance.run.halfMarathonPrediction")}
          </Text>
          <Text style={styles.predictionTime}>
            {formatTime(run.halfPrediction.predictedTimeSeconds)}
          </Text>
          <Text style={styles.predictionRange}>
            {formatTime(run.halfPrediction.rangeLowSeconds)} -{" "}
            {formatTime(run.halfPrediction.rangeHighSeconds)}
          </Text>
          <Text style={styles.predictionConfidence}>
            {t(
              `performance.confidence.${run.halfPrediction.confidence.toLowerCase()}`
            )}{" "}
            ·{" "}
            {t("performance.run.basedOn", {
              count: run.halfPrediction.inputsUsedCount,
            })}
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{run.totalEntries}</Text>
          <Text style={styles.statLabel}>{t("performance.run.totalRuns")}</Text>
        </View>
        {lastChartPoint && (
          <>
            <View style={styles.statCard}>
              <Timer size={18} color={theme.colors.primary} />
              <Text style={styles.statValue}>
                {formatPace(lastChartPoint.pace)}
              </Text>
              <Text style={styles.statLabel}>
                {t("performance.run.lastPace")}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MapPin size={18} color={theme.colors.primary} />
              <Text style={styles.statValue}>
                {lastChartPoint.distanceKm.toFixed(1)}km
              </Text>
              <Text style={styles.statLabel}>
                {t("performance.run.lastDistance")}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Entries List */}
      <PerformanceEntriesList entries={entries} type="RUN" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  predictionCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  predictionHigh: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  predictionMedium: {
    backgroundColor: "#fef9c3",
    borderWidth: 1,
    borderColor: "#fde047",
  },
  predictionLow: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  predictionTime: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  predictionRange: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  predictionConfidence: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.textTertiary,
    textAlign: "center",
  },
});
