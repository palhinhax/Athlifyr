// ============================================================================
// Athlifyr Mobile — Activity Detail Screen
//
// Shows a completed free run with:
// - Full map with the recorded GPS track
// - Summary stats (distance, time, pace, elevation, etc.)
// - Export GPX action
// ============================================================================

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Download,
  Trash2,
  Route,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  Mountain,
  Zap,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { theme } from "@/src/constants/theme";
import {
  getActivity,
  deleteActivity,
  exportGPX,
  type FreeRunActivity,
} from "@/src/lib/free-run-store";
import { RaceMap } from "@/src/components/live-race/RaceMap";

export default function ActivityDetailScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [activity, setActivity] = useState<FreeRunActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activityId) return;
    getActivity(activityId)
      .then(setActivity)
      .finally(() => setLoading(false));
  }, [activityId]);

  const trackPoints = useMemo<[number, number][]>(
    () => (activity?.track ?? []).map((pt) => [pt.lat, pt.lng]),
    [activity]
  );

  // ─── Handlers ───────────────────────────────────────────────────────

  const handleExportGPX = useCallback(async () => {
    if (!activity) return;
    const gpxContent = exportGPX(activity);
    const fileName = `athlifyr-run-${new Date(activity.startedAt).toISOString().slice(0, 10)}.gpx`;

    if (FileSystem.documentDirectory) {
      const filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(filePath, gpxContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/gpx+xml",
          dialogTitle: t("freeRun.exportGPX"),
        });
      } else {
        await Share.share({ message: gpxContent, title: fileName });
      }
    } else {
      await Share.share({ message: gpxContent, title: fileName });
    }
  }, [activity, t]);

  const handleDelete = useCallback(() => {
    Alert.alert(t("freeRun.deleteActivity"), t("freeRun.deleteConfirmation"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          if (activityId) {
            await deleteActivity(activityId);
            router.back();
          }
        },
      },
    ]);
  }, [activityId, router, t]);

  // ─── Render ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </>
    );
  }

  if (!activity) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>{t("freeRun.activityNotFound")}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>{t("common.goBack")}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("freeRun.activityDetail")}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleExportGPX}
              style={styles.headerAction}
            >
              <Download size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.headerAction}
            >
              <Trash2 size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Map with the full track */}
          <RaceMap
            routePoints={trackPoints}
            checkpoints={[]}
            currentPosition={null}
            otherAthletes={[]}
            isOffRoute={false}
            height={280}
            followUser={false}
          />

          {/* Title & Description */}
          <View style={styles.dateSection}>
            {activity.title ? (
              <Text style={styles.dateTitle}>{activity.title}</Text>
            ) : null}
            <Text
              style={[styles.dateSubtitle, !activity.title && styles.dateTitle]}
            >
              {new Date(activity.startedAt).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text style={styles.dateSubtitle}>
              {new Date(activity.startedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" — "}
              {new Date(activity.finishedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {activity.description ? (
              <Text style={styles.descriptionText}>{activity.description}</Text>
            ) : null}
          </View>

          {/* Stats grid */}
          <View style={styles.statsCard}>
            <StatRow
              icon={<Route size={16} color={theme.colors.primary} />}
              label={t("freeRun.distance")}
              value={formatDistance(activity.distanceM)}
            />
            <StatRow
              icon={<Clock size={16} color={theme.colors.primary} />}
              label={t("freeRun.duration")}
              value={formatDuration(activity.durationMs)}
            />
            <StatRow
              icon={<Gauge size={16} color={theme.colors.primary} />}
              label={t("freeRun.avgPace")}
              value={
                activity.avgPaceMinKm
                  ? `${formatPace(activity.avgPaceMinKm)}/km`
                  : "--"
              }
            />
            <StatRow
              icon={<Zap size={16} color={theme.colors.warning} />}
              label={t("freeRun.maxSpeed")}
              value={
                activity.maxSpeedKmh > 0
                  ? `${activity.maxSpeedKmh.toFixed(1)} km/h`
                  : "--"
              }
            />
            <StatRow
              icon={<TrendingUp size={16} color={theme.colors.success} />}
              label={t("freeRun.elevGain")}
              value={`+${activity.elevationGainM}m`}
            />
            <StatRow
              icon={<TrendingDown size={16} color={theme.colors.error} />}
              label={t("freeRun.elevLoss")}
              value={`-${activity.elevationLossM}m`}
            />
            <StatRow
              icon={<Mountain size={16} color={theme.colors.primary} />}
              label={t("freeRun.trackPoints")}
              value={`${activity.track.length}`}
            />
          </View>

          {/* Photos */}
          {activity.photos && activity.photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoStrip}
              contentContainerStyle={styles.photoStripContent}
            >
              {activity.photos.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={styles.photoImage}
                  alt=""
                />
              ))}
            </ScrollView>
          )}

          {/* Export GPX button */}
          <TouchableOpacity style={styles.exportBtn} onPress={handleExportGPX}>
            <Download size={18} color="#fff" />
            <Text style={styles.exportBtnText}>{t("freeRun.exportGPX")}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statRowLeft}>
        {icon}
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatPace(paceMinKm: number): string {
  const mins = Math.floor(paceMinKm);
  const secs = Math.round((paceMinKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerAction: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  dateSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  dateSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  statsCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.muted + "30",
  },
  statRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  photoStrip: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  photoStripContent: {
    gap: 8,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  exportBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
