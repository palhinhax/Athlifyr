import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Route, Clock, Gauge, TrendingUp } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  formatDistance,
  formatDuration,
  formatPace,
} from "./save-activity.utils";

interface ActivityQuickStatsProps {
  distanceM: number;
  durationMs: number;
  avgPaceMinKm: number | null | undefined;
  elevationGainM: number;
}

export function ActivityQuickStats({
  distanceM,
  durationMs,
  avgPaceMinKm,
  elevationGainM,
}: Readonly<ActivityQuickStatsProps>) {
  return (
    <View style={styles.quickStats}>
      <QuickStat
        icon={<Route size={14} color={theme.colors.primary} />}
        value={formatDistance(distanceM)}
      />
      <QuickStat
        icon={<Clock size={14} color={theme.colors.primary} />}
        value={formatDuration(durationMs)}
      />
      <QuickStat
        icon={<Gauge size={14} color={theme.colors.primary} />}
        value={avgPaceMinKm ? `${formatPace(avgPaceMinKm)}/km` : "--"}
      />
      <QuickStat
        icon={<TrendingUp size={14} color={theme.colors.success} />}
        value={`+${elevationGainM}m`}
      />
    </View>
  );
}

function QuickStat({
  icon,
  value,
}: Readonly<{
  icon: React.ReactNode;
  value: string;
}>) {
  return (
    <View style={styles.quickStatItem}>
      {icon}
      <Text style={styles.quickStatValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickStatItem: {
    alignItems: "center",
    gap: 4,
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
});
