import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { TrendingUp, Timer, Layers } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  formatTime,
  type PerformanceSummary,
} from "@/src/hooks/usePerformance";
import { PerformanceEntriesList } from "./PerformanceEntriesList";

interface HyroxTabContentProps {
  summary: PerformanceSummary;
}

export function HyroxTabContent({ summary }: HyroxTabContentProps) {
  const { t } = useTranslation();
  const { hyrox, entries } = summary;

  if (hyrox.totalEntries === 0) {
    return null;
  }

  // Find overall personal best
  const bestCategories = Object.entries(hyrox.bestTimeByCategory);
  const overallBest =
    bestCategories.length > 0
      ? bestCategories.reduce((best, current) =>
          current[1].timeSeconds < best[1].timeSeconds ? current : best
        )
      : null;

  // Unique categories raced
  const uniqueCategories = new Set(hyrox.entries.map((e) => e.hyroxCategory))
    .size;

  // Last entry time
  const sortedEntries = [...hyrox.entries].sort(
    (a, b) =>
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );
  const lastEntry = sortedEntries[0] ?? null;

  return (
    <View style={styles.container}>
      {/* Personal Best */}
      {overallBest && (
        <View style={styles.bestCard}>
          <Text style={styles.bestTitle}>
            🏆 {t("performance.hyrox.personalBest")}
          </Text>
          <Text style={styles.bestTime}>
            {formatTime(overallBest[1].timeSeconds)}
          </Text>
          <Text style={styles.bestMeta}>
            {t("performance.hyrox.basedOn", { count: hyrox.totalEntries })}
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{hyrox.totalEntries}</Text>
          <Text style={styles.statLabel}>
            {t("performance.hyrox.totalRaces")}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Layers size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{uniqueCategories}</Text>
          <Text style={styles.statLabel}>
            {t("performance.hyrox.categoriesRaced")}
          </Text>
        </View>
        {lastEntry && (
          <View style={styles.statCard}>
            <Timer size={18} color={theme.colors.primary} />
            <Text style={styles.statValue}>
              {formatTime(lastEntry.timeSeconds)}
            </Text>
            <Text style={styles.statLabel}>
              {t("performance.hyrox.lastTime")}
            </Text>
          </View>
        )}
      </View>

      {/* Entries List */}
      <PerformanceEntriesList entries={entries} type="HYROX" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  bestCard: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fbbf24",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  bestTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  bestTime: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  bestMeta: {
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
