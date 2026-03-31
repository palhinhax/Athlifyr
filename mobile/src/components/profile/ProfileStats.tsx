import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";

interface ProfileStatsProps {
  stats: {
    upcomingEvents: number;
    pastEvents: number;
    followersCount: number;
    followingCount: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
          {stats.upcomingEvents}
        </Text>
        <Text style={styles.statLabel}>{t("profile.upcomingEvents")}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: "#3b82f6" }]}>
          {stats.pastEvents}
        </Text>
        <Text style={styles.statLabel}>{t("profile.pastEvents")}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: "#f59e0b" }]}>
          {stats.followersCount}
        </Text>
        <Text style={styles.statLabel}>{t("profile.followers")}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: "#a855f7" }]}>
          {stats.followingCount}
        </Text>
        <Text style={styles.statLabel}>{t("profile.following")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
