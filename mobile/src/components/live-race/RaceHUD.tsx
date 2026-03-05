// ============================================================================
// Athlifyr Mobile — RaceHUD Component
//
// Heads-up display overlay during a live race showing:
// - Elapsed time  - Distance  - Avg pace  - Current speed
// - Elevation gain/loss  - Altitude  - Rank  - Progress
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
  Trophy,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { RaceStats } from "@/src/hooks/useLiveRace";

interface RaceHUDProps {
  stats: RaceStats;
  connected: boolean;
  offlineQueueSize: number;
  syncing: boolean;
  spectatorCount: number;
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

export function RaceHUD({
  stats,
  connected,
  offlineQueueSize,
  syncing,
  spectatorCount,
}: RaceHUDProps) {
  const { t } = useTranslation();

  const isFinished = stats.status === "FINISHED";

  const timeDisplay = useMemo(
    () => formatElapsed(stats.finishTimeMs ?? stats.elapsedTimeMs),
    [stats.elapsedTimeMs, stats.finishTimeMs]
  );

  return (
    <View style={styles.container}>
      {/* Connection status bar */}
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: connected
              ? theme.colors.success + "20"
              : theme.colors.error + "20",
          },
        ]}
      >
        {connected ? (
          <Wifi size={12} color={theme.colors.success} />
        ) : (
          <WifiOff size={12} color={theme.colors.error} />
        )}
        <Text
          style={[
            styles.statusText,
            { color: connected ? theme.colors.success : theme.colors.error },
          ]}
        >
          {connected ? t("liveRace.connected") : t("liveRace.disconnected")}
        </Text>
        {offlineQueueSize > 0 && (
          <Text style={styles.offlineCount}>
            {t("liveRace.buffered", { count: offlineQueueSize })}
          </Text>
        )}
        {syncing && (
          <Text style={styles.syncText}>{t("liveRace.syncing")}</Text>
        )}
        {spectatorCount > 0 && (
          <Text style={styles.spectatorText}>👁 {spectatorCount}</Text>
        )}
      </View>

      {/* Main timer */}
      <View style={styles.timerRow}>
        <Clock
          size={18}
          color={isFinished ? theme.colors.success : theme.colors.text}
        />
        <Text style={[styles.timer, isFinished && styles.timerFinished]}>
          {timeDisplay}
        </Text>
        {isFinished && (
          <View style={styles.finishedBadge}>
            <Text style={styles.finishedText}>{t("liveRace.finished")}</Text>
          </View>
        )}
      </View>

      {/* Stats grid — 2 rows of 4 */}
      <View style={styles.statsGrid}>
        {/* Row 1 */}
        <StatCell
          icon={<Route size={14} color={theme.colors.primary} />}
          label={t("liveRace.distance")}
          value={formatDistance(stats.distanceM)}
        />
        <StatCell
          icon={<Gauge size={14} color={theme.colors.primary} />}
          label={t("liveRace.avgPace")}
          value={
            stats.avgPaceMinKm
              ? `${formatPace(stats.avgPaceMinKm)}/km`
              : "--:--"
          }
        />
        <StatCell
          icon={<Activity size={14} color={theme.colors.primary} />}
          label={t("liveRace.speed")}
          value={
            stats.currentSpeedKmh != null
              ? `${stats.currentSpeedKmh.toFixed(1)} km/h`
              : "-- km/h"
          }
        />
        <StatCell
          icon={<Trophy size={14} color={theme.colors.warning} />}
          label={t("liveRace.position")}
          value={
            stats.rank > 0
              ? `${stats.rank}/${stats.totalAthletes}`
              : `--/${stats.totalAthletes || "--"}`
          }
          highlighted={stats.rank > 0 && stats.rank <= 3}
        />

        {/* Row 2 */}
        <StatCell
          icon={<TrendingUp size={14} color={theme.colors.success} />}
          label={t("liveRace.elevGain")}
          value={`+${stats.elevationGainM}m`}
        />
        <StatCell
          icon={<TrendingDown size={14} color={theme.colors.error} />}
          label={t("liveRace.elevLoss")}
          value={`-${stats.elevationLossM}m`}
        />
        <StatCell
          icon={<Mountain size={14} color={theme.colors.primary} />}
          label={t("liveRace.altitude")}
          value={
            stats.currentAltitudeM != null
              ? `${stats.currentAltitudeM}m`
              : "--m"
          }
        />
        <StatCell
          icon={null}
          label={t("liveRace.progress")}
          value={`${stats.progressPercent.toFixed(1)}%`}
        />
      </View>

      {/* Off-route warning */}
      {stats.status === "OFF_ROUTE" && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ {t("liveRace.offRoute")}</Text>
        </View>
      )}
    </View>
  );
}

// ─── StatCell ───────────────────────────────────────────────────────────────

interface StatCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
}

function StatCell({ icon, label, value, highlighted }: StatCellProps) {
  return (
    <View style={styles.statCell}>
      {icon && <View style={styles.statIcon}>{icon}</View>}
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          highlighted && { color: theme.colors.warning },
        ]}
      >
        {value}
      </Text>
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
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  offlineCount: {
    fontSize: 10,
    color: theme.colors.warning,
    marginLeft: "auto",
  },
  syncText: {
    fontSize: 10,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  spectatorText: {
    fontSize: 10,
    color: theme.colors.muted,
    marginLeft: "auto",
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
  warningBanner: {
    backgroundColor: theme.colors.warning + "30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  warningText: {
    color: theme.colors.warning,
    fontWeight: "700",
    fontSize: 13,
  },
});
