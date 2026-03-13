// ============================================================================
// Athlifyr Mobile — Free Run Screen
//
// Solo GPS run — Strava-style activity recording without a Live Race.
// Reuses RaceMap for the live track display and FreeRunHUD for stats.
// On completion, saves the activity locally and navigates to activity detail.
// ============================================================================

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Play, Square, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { useFreeRun } from "@/src/hooks/useFreeRun";
import { useFreeRunSession } from "@/src/lib/free-run-session-store";
import { FreeRunHUD } from "@/src/components/free-run/FreeRunHUD";
import { RaceMap } from "@/src/components/live-race/RaceMap";

export default function FreeRunScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
    gpsPermission,
    gpsActive,
    currentPosition,
    stats,
    finished,
    savedActivityId,
    trackPoints,
    startRun,
    stopRun,
  } = useFreeRun();

  // Build live track polyline from the global store (already computed)
  // trackPoints comes directly from useFreeRun now

  // ─── Handlers ───────────────────────────────────────────────────────

  const handleStart = useCallback(async () => {
    if (gpsPermission === "denied") {
      Alert.alert(
        t("freeRun.gpsRequired"),
        t("freeRun.gpsRequiredDescription"),
        [{ text: t("common.ok") }]
      );
      return;
    }
    try {
      await startRun();
    } catch {
      Alert.alert(
        t("freeRun.gpsRequired"),
        t("freeRun.gpsRequiredDescription"),
        [{ text: t("common.ok") }]
      );
    }
  }, [gpsPermission, startRun, t]);

  const handleStop = useCallback(() => {
    Alert.alert(t("freeRun.confirmStop"), t("freeRun.confirmStopDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("freeRun.stopRun"),
        style: "destructive",
        onPress: () => {
          void stopRun().then((activityId) => {
            if (activityId) {
              router.replace({
                pathname: "/activity-detail",
                params: { activityId },
              });
            }
          });
        },
      },
    ]);
  }, [stopRun, router, t]);

  const handleBack = useCallback(() => {
    // Allow navigating back freely — the run continues in the background
    // via the global Zustand store. The floating banner will show on other screens.
    router.back();
  }, [router]);

  const handleViewActivity = useCallback(() => {
    if (savedActivityId) {
      router.replace({
        pathname: "/activity-detail",
        params: { activityId: savedActivityId },
      });
    }
  }, [savedActivityId, router]);

  const handleDismissTooShort = useCallback(() => {
    useFreeRunSession.getState().reset();
  }, []);

  const renderFab = () => {
    if (!gpsActive && !finished) {
      return (
        <TouchableOpacity
          style={[styles.fab, styles.fabStart]}
          onPress={handleStart}
        >
          <Play size={22} color="#fff" />
          <Text style={styles.fabText}>{t("freeRun.startRun")}</Text>
        </TouchableOpacity>
      );
    }
    if (finished) {
      if (savedActivityId) {
        return (
          <TouchableOpacity
            style={[styles.fab, styles.fabFinished]}
            onPress={handleViewActivity}
          >
            <Text style={styles.fabText}>🏃 {t("freeRun.viewActivity")}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={[styles.fab, styles.fabFinished]}
          onPress={handleDismissTooShort}
        >
          <Text style={styles.fabText}>{t("freeRun.runTooShort")}</Text>
          <Text style={styles.fabSubtext}>{t("freeRun.tapToRetry")}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.fab, styles.fabStop]}
        onPress={handleStop}
      >
        <Square size={18} color="#fff" />
        <Text style={styles.fabText}>{t("freeRun.stopRun")}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: true }} />
      <StatusBar barStyle="light-content" />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <MapPin
              size={16}
              color={gpsActive ? theme.colors.primary : theme.colors.muted}
            />
            <Text style={styles.headerTitle}>{t("freeRun.sectionTitle")}</Text>
          </View>
          {gpsActive && (
            <View style={styles.recordingBadge}>
              <Text style={styles.recordingText}>REC</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Map — shows the recorded track in real time */}
          <RaceMap
            routePoints={trackPoints}
            checkpoints={[]}
            currentPosition={currentPosition}
            otherAthletes={[]}
            isOffRoute={false}
            height={320}
            followUser={gpsActive}
          />

          {/* Stats HUD */}
          <FreeRunHUD stats={stats} finished={finished} />

          {/* GPS permission warning */}
          {gpsPermission === "denied" && (
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionText}>
                {t("freeRun.gpsPermissionDenied")}
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FAB */}
        <View
          style={[styles.fabContainer, { paddingBottom: insets.bottom + 12 }]}
        >
          {renderFab()}
        </View>
      </View>
    </>
  );
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
  recordingBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recordingText: {
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
  permissionBanner: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: theme.colors.warning + "20",
    padding: 10,
    borderRadius: 8,
  },
  permissionText: {
    color: theme.colors.warning,
    fontSize: 12,
    textAlign: "center",
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
  fabSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "500",
  },
});
