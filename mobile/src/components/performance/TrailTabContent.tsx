import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { TrendingUp, Timer, MapPin, Mountain } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  formatPace,
  type PerformanceSummary,
} from "@/src/hooks/usePerformance";
import { PerformanceEntriesList } from "./PerformanceEntriesList";

interface TrailTabContentProps {
  summary: PerformanceSummary;
}

export function TrailTabContent({ summary }: TrailTabContentProps) {
  const { t } = useTranslation();
  const { trail, entries } = summary;

  if (trail.totalEntries === 0) {
    return null;
  }

  // Compute trail-specific stats from entries
  const trailEntries = entries.filter((e) => e.type === "TRAIL");
  const totalDistance = trailEntries.reduce(
    (sum, e) => sum + (e.distanceKm ?? 0),
    0
  );
  const totalElevation = trailEntries.reduce(
    (sum, e) => sum + (e.elevationGainM ?? 0),
    0
  );
  const lastChartPoint =
    trail.chartPoints.length > 0
      ? trail.chartPoints[trail.chartPoints.length - 1]
      : null;

  return (
    <View style={styles.container}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{trail.totalEntries}</Text>
          <Text style={styles.statLabel}>
            {t("performance.trail.totalTrails")}
          </Text>
        </View>
        <View style={styles.statCard}>
          <MapPin size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{totalDistance.toFixed(0)}km</Text>
          <Text style={styles.statLabel}>
            {t("performance.trail.totalDistance")}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Mountain size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{totalElevation.toFixed(0)}m</Text>
          <Text style={styles.statLabel}>
            {t("performance.trail.totalElevation")}
          </Text>
        </View>
        {lastChartPoint && (
          <View style={styles.statCard}>
            <Timer size={18} color={theme.colors.primary} />
            <Text style={styles.statValue}>
              {formatPace(lastChartPoint.pace)}
            </Text>
            <Text style={styles.statLabel}>
              {t("performance.trail.lastPace")}
            </Text>
          </View>
        )}
      </View>

      {/* Entries List */}
      <PerformanceEntriesList entries={entries} type="TRAIL" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
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
