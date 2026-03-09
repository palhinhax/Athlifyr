// ============================================================================
// Athlifyr Mobile — FreeRunHUD Component
//
// Simplified heads-up display for solo free runs.
// Shows: time, distance, pace, speed, max speed, elevation, altitude.
// No connection status, no rank, no progress %.
// ============================================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Clock,
  Route,
  Gauge,
  TrendingUp,
  TrendingDown,
  Mountain,
  Activity,
  Zap,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { FreeRunStats } from "@/src/hooks/useFreeRun";

interface FreeRunHUDProps {
  stats: FreeRunStats;
  finished: boolean;
}

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatElapsed(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
}

function formatPace(paceMinKm: number): string {
  const mins = Math.floor(paceMinKm);
  const secs = Math.round((paceMinKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function FreeRunHUD({ stats, finished }: FreeRunHUDProps) {
  const { t } = useTranslation();

  const timeDisplay = useMemo(
    () => formatElapsed(stats.elapsedTimeMs),
    [stats.elapsedTimeMs]
  );

  return (
    <View style={styles.container}>
      {/* Main timer */}
      <View style={styles.timerRow}>
        <Clock
          size={18}
          color={finished ? theme.colors.success : theme.colors.text}
        />
        <Text style={[styles.timer, finished && styles.timerFinished]}>
          {timeDisplay}
        </Text>
        {finished && (
          <View style={styles.finishedBadge}>
            <Text style={styles.finishedText}>{t("freeRun.runComplete")}</Text>
          </View>
        )}
      </View>

      {/* Stats grid — 2 rows of 4 */}
      <View style={styles.statsGrid}>
        {/* Row 1 */}
        <StatCell
          icon={<Route size={14} color={theme.colors.primary} />}
          label={t("freeRun.distance")}
          value={formatDistance(stats.distanceM)}
        />
        <StatCell
          icon={<Gauge size={14} color={theme.colors.primary} />}
          label={t("freeRun.avgPace")}
          value={
            stats.avgPaceMinKm
              ? `${formatPace(stats.avgPaceMinKm)}/km`
              : "--:--"
          }
        />
        <StatCell
          icon={<Activity size={14} color={theme.colors.primary} />}
          label={t("freeRun.speed")}
          value={
            stats.currentSpeedKmh != null
              ? `${stats.currentSpeedKmh.toFixed(1)} km/h`
              : "-- km/h"
          }
        />
        <StatCell
          icon={<Zap size={14} color={theme.colors.warning} />}
          label={t("freeRun.maxSpeed")}
          value={
            stats.maxSpeedKmh > 0
              ? `${stats.maxSpeedKmh.toFixed(1)} km/h`
              : "-- km/h"
          }
        />

        {/* Row 2 */}
        <StatCell
          icon={<TrendingUp size={14} color={theme.colors.success} />}
          label={t("freeRun.elevGain")}
          value={`+${stats.elevationGainM}m`}
        />
        <StatCell
          icon={<TrendingDown size={14} color={theme.colors.error} />}
          label={t("freeRun.elevLoss")}
          value={`-${stats.elevationLossM}m`}
        />
        <StatCell
          icon={<Mountain size={14} color={theme.colors.primary} />}
          label={t("freeRun.altitude")}
          value={
            stats.currentAltitudeM != null
              ? `${stats.currentAltitudeM}m`
              : "--m"
          }
        />
        <StatCell icon={null} label="" value="" />
      </View>
    </View>
  );
}

// ─── StatCell ───────────────────────────────────────────────────────────────

interface StatCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCell({ icon, label, value }: StatCellProps) {
  if (!label && !value) return <View style={styles.statCell} />;
  return (
    <View style={styles.statCell}>
      {icon && <View style={styles.statIcon}>{icon}</View>}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card + "F5",
    borderRadius: 16,
    padding: 12,
    margin: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  timer: {
    fontSize: 36,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    color: theme.colors.text,
    letterSpacing: 1,
  },
  timerFinished: {
    color: theme.colors.success,
  },
  finishedBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  finishedText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statCell: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 6,
  },
  statIcon: {
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
});
