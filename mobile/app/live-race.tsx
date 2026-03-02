// ============================================================================
// Athlifyr Mobile — Live Race Screen
//
// Full-screen race experience for an athlete:
// - Map view (top) with route, position, checkpoints, other athletes
// - HUD overlay with stats (time, distance, pace, elevation, rank)
// - Mini leaderboard (swipeable bottom sheet)
// - Start/Stop race controls
// ============================================================================

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Play,
  Square,
  Radio,
  AlertTriangle,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { api } from "@/src/lib/api";
import { useLiveRace } from "@/src/hooks/useLiveRace";
import { RaceHUD } from "@/src/components/live-race/RaceHUD";
import { RaceMap } from "@/src/components/live-race/RaceMap";
import { RaceLeaderboard } from "@/src/components/live-race/RaceLeaderboard";
import { useAuthStore } from "@/src/lib/auth-store";

// ─── Types for the event configuration ──────────────────────────────────────

interface RouteCheckpoint {
  id: string;
  name: string;
  type: "START" | "FINISH" | "INTERMEDIATE" | "TRANSITION";
  latitude: number;
  longitude: number;
  order: number;
}

interface EventVariantRoute {
  variantId: string;
  variantName: string;
  routePoints: [number, number][];
  checkpoints: RouteCheckpoint[];
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function LiveRaceScreen() {
  const { eventId, variantId } = useLocalSearchParams<{
    eventId: string;
    variantId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);

  // Route data loaded from the event
  const [routeData, setRouteData] = useState<EventVariantRoute | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Live race hook
  const liveRace = useLiveRace({ eventId: eventId ?? "" });

  const {
    connected,
    connecting,
    raceStatus,
    gpsPermission,
    gpsActive,
    currentPosition,
    offlineQueueSize,
    syncing,
    stats,
    leaderboard,
    athletes,
    spectatorCount,
    error,
    startRace,
    stopRace,
  } = liveRace;

  // ─── Load route data ────────────────────────────────────────────────

  useEffect(() => {
    if (!eventId) return;

    async function loadRoute() {
      try {
        setLoadingRoute(true);
        const res = await api.get<{
          variants: EventVariantRoute[];
        }>(`/events/${eventId}/route`);

        const variants = res.data.variants;
        // Pick the athlete's variant or the first one
        const picked =
          variants.find((v) => v.variantId === variantId) ?? variants[0];
        setRouteData(picked ?? null);
      } catch {
        setRouteError(t("liveRace.routeLoadError"));
      } finally {
        setLoadingRoute(false);
      }
    }

    loadRoute();
  }, [eventId, variantId, t]);

  // ─── Handlers ───────────────────────────────────────────────────────

  const handleStartRace = useCallback(async () => {
    if (gpsPermission === "denied") {
      Alert.alert(
        t("liveRace.gpsRequired"),
        t("liveRace.gpsRequiredDescription"),
        [{ text: t("common.ok") }]
      );
      return;
    }
    await startRace();
  }, [gpsPermission, startRace, t]);

  const handleStopRace = useCallback(() => {
    Alert.alert(
      t("liveRace.confirmStop"),
      t("liveRace.confirmStopDescription"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("liveRace.stopRace"),
          style: "destructive",
          onPress: () => {
            stopRace();
            router.back();
          },
        },
      ]
    );
  }, [stopRace, router, t]);

  const handleBack = useCallback(() => {
    if (gpsActive) {
      Alert.alert(t("liveRace.raceActive"), t("liveRace.raceActiveLeave"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("liveRace.leaveRace"),
          style: "destructive",
          onPress: () => {
            stopRace();
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  }, [gpsActive, stopRace, router, t]);

  // ─── Render ─────────────────────────────────────────────────────────

  const isRaceActive =
    gpsActive && (raceStatus === "LIVE" || raceStatus === "WARMUP");
  const isFinished = stats.status === "FINISHED" || raceStatus === "FINISHED";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Fixed header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <Radio
              size={16}
              color={isRaceActive ? "#EF4444" : theme.colors.muted}
            />
            <Text style={styles.headerTitle}>{t("liveRace.sectionTitle")}</Text>
          </View>
          {isRaceActive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Map Section */}
          {loadingRoute ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>
                {t("liveRace.loadingRoute")}
              </Text>
            </View>
          ) : routeError ? (
            <View style={styles.errorContainer}>
              <AlertTriangle size={24} color={theme.colors.error} />
              <Text style={styles.errorText}>{routeError}</Text>
            </View>
          ) : (
            <RaceMap
              routePoints={routeData?.routePoints ?? []}
              checkpoints={routeData?.checkpoints ?? []}
              currentPosition={currentPosition}
              otherAthletes={athletes}
              isOffRoute={stats.status === "OFF_ROUTE"}
              height={320}
              followUser={isRaceActive}
            />
          )}

          {/* HUD */}
          <RaceHUD
            stats={stats}
            connected={connected}
            offlineQueueSize={offlineQueueSize}
            syncing={syncing}
            spectatorCount={spectatorCount}
          />

          {/* Error banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* GPS permission denied */}
          {gpsPermission === "denied" && (
            <View style={styles.permissionBanner}>
              <AlertTriangle size={18} color={theme.colors.warning} />
              <Text style={styles.permissionText}>
                {t("liveRace.gpsPermissionDenied")}
              </Text>
            </View>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <View style={styles.leaderboardSection}>
              <RaceLeaderboard
                entries={leaderboard}
                currentUserId={userId}
                maxDisplay={10}
              />
            </View>
          )}

          {/* Checkpoints reached */}
          {stats.checkpointsReached.length > 0 && (
            <View style={styles.checkpointsSection}>
              <Text style={styles.sectionTitle}>
                {t("liveRace.checkpoints")}
              </Text>
              {stats.checkpointsReached.map((cp) => (
                <View key={cp.checkpointId} style={styles.checkpointRow}>
                  <Text style={styles.checkpointName}>{cp.checkpointName}</Text>
                  <Text style={styles.checkpointTime}>
                    {formatSplitTime(cp.splitTimeMs)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Spacer for button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating action button */}
        <View
          style={[styles.fabContainer, { paddingBottom: insets.bottom + 12 }]}
        >
          {!gpsActive && !isFinished ? (
            <TouchableOpacity
              style={[styles.fab, styles.fabStart]}
              onPress={handleStartRace}
              disabled={connecting}
            >
              {connecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Play size={22} color="#fff" />
              )}
              <Text style={styles.fabText}>
                {connecting
                  ? t("liveRace.connecting")
                  : t("liveRace.startTracking")}
              </Text>
            </TouchableOpacity>
          ) : isFinished ? (
            <View style={[styles.fab, styles.fabFinished]}>
              <Text style={styles.fabText}>
                🏆 {t("liveRace.raceComplete")}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.fab, styles.fabStop]}
              onPress={handleStopRace}
            >
              <Square size={18} color="#fff" />
              <Text style={styles.fabText}>{t("liveRace.stopTracking")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatSplitTime(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  liveBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  errorContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
  },
  errorBanner: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: theme.colors.error + "20",
    padding: 10,
    borderRadius: 8,
  },
  errorBannerText: {
    color: theme.colors.error,
    fontSize: 12,
    textAlign: "center",
  },
  permissionBanner: {
    marginHorizontal: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.warning + "20",
    padding: 10,
    borderRadius: 8,
  },
  permissionText: {
    flex: 1,
    color: theme.colors.warning,
    fontSize: 12,
  },
  leaderboardSection: {
    marginTop: 12,
  },
  checkpointsSection: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  checkpointName: {
    fontSize: 13,
    color: theme.colors.text,
  },
  checkpointTime: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
    fontVariant: ["tabular-nums"],
  },
  fabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabStart: {
    backgroundColor: theme.colors.primary,
  },
  fabStop: {
    backgroundColor: theme.colors.error,
  },
  fabFinished: {
    backgroundColor: theme.colors.success,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
