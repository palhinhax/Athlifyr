import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Sharing from "expo-sharing";
import { Paths, File as FSFile } from "expo-file-system";
import {
  ArrowLeft,
  Save,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { theme } from "@/src/constants/theme";
import { BarPathOverlay } from "@/src/components/lift-analysis/BarPathOverlay";
import { LiftMetricsCard } from "@/src/components/lift-analysis/LiftMetricsCard";
import { computeMetrics } from "@/src/lib/bar-path-utils";
import { trackPlate, type TrackingProgress } from "@/src/lib/plate-tracker";
import { useLiftAnalysisStore } from "@/src/lib/lift-analysis-store";
import type { BarPathPoint, LiftAnalysis } from "@/src/types/lift-analysis";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;
/** Cap video height to 45% of screen to always leave room for controls */
const VIDEO_HEIGHT = Math.min(
  Math.round(SCREEN_WIDTH * (16 / 9)),
  Math.round(SCREEN_HEIGHT * 0.45)
);

type Phase = "seed" | "tracking" | "playback";

export default function LiftAnalysisScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    videoUri: string;
    durationMs?: string;
  }>();

  const videoUri = params.videoUri ?? "";
  const providedDuration = params.durationMs
    ? parseInt(params.durationMs, 10)
    : null;

  const saveAnalysis = useLiftAnalysisStore((s) => s.save);

  // ─── State ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("seed");
  const [videoDurationMs, setVideoDurationMs] = useState<number>(
    providedDuration ?? 5000
  );
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // Result
  const [barPath, setBarPath] = useState<BarPathPoint[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-tracking progress
  const [trackingProgress, setTrackingProgress] =
    useState<TrackingProgress | null>(null);

  // Video container layout
  const [containerLayout, setContainerLayout] = useState({
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  });

  // Playback time for animated overlay
  const [playbackTimeMs, setPlaybackTimeMs] = useState(0);

  // Track whether the video is ready (first frame visible)
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Current scrub position in seed phase (in seconds)
  const [scrubTime, setScrubTime] = useState(0);
  // Track for the scrubber bar
  const scrubBarRef = useRef<View>(null);
  const scrubBarWidth = useRef(0);

  // ─── Video player (expo-video) ───────────────────────────────
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = false;
    p.muted = true;
    // Start playing so the decoder loads a frame
    p.play();
  });

  // Get video duration once status loads; pause to show first frame (ONCE)
  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (payload) => {
      if (payload.status === "readyToPlay") {
        if (player.duration && player.duration > 0) {
          setVideoDurationMs(Math.round(player.duration * 1000));
        }
        // Only do this ONCE on first ready — don't keep resetting
        setIsVideoReady((prev) => {
          if (!prev && phase === "seed") {
            setTimeout(() => {
              player.pause();
              player.currentTime = 0;
            }, 150);
          }
          return true;
        });
      }
    });

    return () => sub.remove();
  }, [player, phase]);

  // ─── Seed scrubbing controls ─────────────────────────────────

  const durationSec = videoDurationMs / 1000;

  /** Jump forward/backward by a given number of seconds */
  const seekBy = useCallback(
    (deltaSec: number) => {
      if (!player) return;
      const dur = (videoDurationMs || 5000) / 1000;
      const current = player.currentTime ?? 0;
      const newTime = Math.max(0, Math.min(dur, current + deltaSec));
      player.currentTime = newTime;
      player.pause();
      setScrubTime(newTime);
    },
    [player, videoDurationMs]
  );

  /** Scrub bar touch handler — called on touch start + move */
  const handleScrubBarTouch = useCallback(
    (evt: GestureResponderEvent) => {
      if (!player || scrubBarWidth.current <= 0) return;
      const locationX = evt.nativeEvent.locationX;
      const dur = (videoDurationMs || 5000) / 1000;
      const ratio = Math.max(0, Math.min(1, locationX / scrubBarWidth.current));
      const newTime = ratio * dur;
      player.currentTime = newTime;
      player.pause();
      setScrubTime(newTime);
    },
    [player, videoDurationMs]
  );

  /** Format seconds as m:ss */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Playback time tracking for overlay animation
  useEffect(() => {
    if (phase !== "playback" || !player) return;

    const interval = setInterval(() => {
      if (player.currentTime !== undefined) {
        setPlaybackTimeMs(Math.round(player.currentTime * 1000));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase, player]);

  // ─── Phase: Seed ─────────────────────────────────────────────

  const handleSeedTap = useCallback(
    (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
      if (phase !== "seed") return;

      const nx = evt.nativeEvent.locationX / containerLayout.width;
      const ny = evt.nativeEvent.locationY / containerLayout.height;
      setSeedPoint({ x: nx, y: ny });
    },
    [phase, containerLayout]
  );

  const confirmSeed = useCallback(async () => {
    if (!seedPoint) return;

    // Switch to tracking phase and run automatic CV tracking
    setPhase("tracking");
    setTrackingProgress({ current: 0, total: 1, step: "extracting" });

    try {
      const result = await trackPlate(
        videoUri,
        seedPoint,
        videoDurationMs,
        (p) => setTrackingProgress(p)
      );

      setBarPath(result.barPath);
      setPhase("playback");
      setTrackingProgress(null);

      // Start playback from beginning
      if (player) {
        player.currentTime = 0;
        player.play();
      }
    } catch (err) {
      console.error("[LiftAnalysis] Tracking failed:", err);
      const isNativeModuleError =
        err instanceof Error &&
        (err.message.includes("not linked") ||
          err.message.includes("not available") ||
          err.message.includes("react-native-fast-opencv"));
      Alert.alert(
        t("common.error"),
        isNativeModuleError
          ? "O tracking de placas requer uma development build. Esta funcionalidade não está disponível no Expo Go."
          : t("liftAnalysis.trackingError")
      );
      setPhase("seed");
      setTrackingProgress(null);
    }
  }, [seedPoint, videoDurationMs, videoUri, player, t]);

  // ─── Phase: Playback ────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (barPath.length < 2 || !seedPoint) return;
    setIsSaving(true);

    try {
      const id = Crypto.randomUUID();
      const metrics = computeMetrics(barPath);

      const analysis: LiftAnalysis = {
        id,
        videoUri,
        createdAt: new Date().toISOString(),
        durationMs: videoDurationMs,
        fpsSample:
          barPath.length > 1
            ? Math.round(1000 / (barPath[1].t - barPath[0].t || 250))
            : 4,
        seedPoint,
        barPath,
        metrics,
      };

      await saveAnalysis(analysis);
      Alert.alert(t("liftAnalysis.saved"), t("liftAnalysis.savedMessage"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving lift analysis:", error);
      Alert.alert(t("common.error"), t("liftAnalysis.saveError"));
    } finally {
      setIsSaving(false);
    }
  }, [barPath, seedPoint, videoUri, videoDurationMs, saveAnalysis, t, router]);

  // ─── Export video ─────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);

  const handleExportVideo = useCallback(async () => {
    if (!videoUri) return;
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(t("common.error"), t("liftAnalysis.shareNotAvailable"));
      return;
    }
    setIsExporting(true);
    try {
      // If the URI is a content:// URI (Android), copy it to a cache file first
      let shareUri = videoUri;
      if (videoUri.startsWith("content://")) {
        const dest = new FSFile(Paths.cache, `athlifyr_lift_${Date.now()}.mp4`);
        const src = new FSFile(videoUri);
        src.copy(dest);
        shareUri = dest.uri;
      }
      await Sharing.shareAsync(shareUri, {
        mimeType: "video/mp4",
        dialogTitle: "Exportar vídeo de Lift Analysis",
        UTI: "public.movie",
      });
    } catch (err) {
      console.error("[LiftAnalysis] Export failed:", err);
      Alert.alert(t("common.error"), t("liftAnalysis.exportError"));
    } finally {
      setIsExporting(false);
    }
  }, [videoUri, t]);

  // ─── Metrics (computed lazily) ───────────────────────────────
  const metrics = barPath.length >= 2 ? computeMetrics(barPath) : null;

  // ─── Render ──────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {phase === "seed"
            ? t("liftAnalysis.seedTitle")
            : t("liftAnalysis.playbackTitle")}
        </Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* Main content — flex layout, no scroll for seed/tracking */}
      {phase === "playback" ? (
        <View style={styles.mainContent}>
          {/* Video + Overlay Container */}
          <View
            style={[styles.videoContainer, { height: containerLayout.height }]}
            onLayout={(e) => {
              setContainerLayout({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              });
            }}
          >
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              nativeControls={false}
            />

            {/* Bar path overlay (playback) */}
            {barPath.length >= 2 && (
              <BarPathOverlay
                path={barPath}
                width={containerLayout.width}
                height={containerLayout.height}
                currentTimeMs={playbackTimeMs}
                strokeColor="#00FF88"
                strokeWidth={3}
              />
            )}
          </View>

          {metrics && (
            <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
              <LiftMetricsCard metrics={metrics} />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleExportVideo}
                  activeOpacity={0.7}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.textSecondary}
                    />
                  ) : (
                    <>
                      <Share2 size={20} color={theme.colors.textSecondary} />
                      <Text style={styles.secondaryButtonText}>
                        {t("liftAnalysis.exportVideo")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Save size={20} color="#fff" />
                      <Text style={styles.primaryButtonText}>
                        {t("liftAnalysis.saveAnalysis")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}
        </View>
      ) : (
        <View style={styles.mainContent}>
          {/* Video + Overlay Container */}
          <View
            style={[styles.videoContainer, { height: containerLayout.height }]}
            onLayout={(e) => {
              setContainerLayout({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              });
            }}
          >
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              nativeControls={false}
            />

            {/* Loading overlay while video is not yet decoded */}
            {!isVideoReady && phase === "seed" && (
              <View style={styles.videoLoadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.videoLoadingText}>
                  {t("common.loading")}
                </Text>
              </View>
            )}

            {/* Tap area for seed */}
            {phase === "seed" && (
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={handleSeedTap}
              />
            )}

            {/* Tap hint overlay for seed (before user taps) */}
            {phase === "seed" && !seedPoint && isVideoReady && (
              <View style={styles.tapHintOverlay} pointerEvents="none">
                <View style={styles.tapHintCircle}>
                  <Text style={styles.tapHintIcon}>👆</Text>
                </View>
              </View>
            )}

            {/* Seed point indicator */}
            {phase === "seed" && seedPoint && (
              <View
                style={[
                  styles.seedDot,
                  {
                    left: seedPoint.x * containerLayout.width - 12,
                    top: seedPoint.y * containerLayout.height - 12,
                  },
                ]}
              />
            )}

            {/* Tracking progress overlay */}
            {phase === "tracking" && (
              <View style={styles.trackingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color="#00FF88" />
                <Text style={styles.trackingOverlayText}>
                  {trackingProgress?.step === "extracting"
                    ? t("liftAnalysis.extractingFrames")
                    : t("liftAnalysis.trackingObject")}
                </Text>
              </View>
            )}
          </View>

          {/* Phase controls — always visible below video */}
          {phase === "seed" && (
            <View style={styles.phaseContent}>
              {/* Video scrubber — navigate to the right frame */}
              {isVideoReady && (
                <View style={styles.scrubberSection}>
                  {/* Time row */}
                  <View style={styles.scrubTimeRow}>
                    <Text style={styles.scrubTimeText}>
                      {formatTime(scrubTime)}
                    </Text>
                    <Text style={styles.scrubTimeText}>
                      {formatTime(durationSec)}
                    </Text>
                  </View>

                  {/* Scrub bar */}
                  <View
                    ref={scrubBarRef}
                    style={styles.scrubBarTrack}
                    onLayout={(e) => {
                      scrubBarWidth.current = e.nativeEvent.layout.width;
                    }}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={handleScrubBarTouch}
                    onResponderMove={handleScrubBarTouch}
                  >
                    <View
                      style={[
                        styles.scrubBarFill,
                        {
                          width:
                            durationSec > 0
                              ? `${(scrubTime / durationSec) * 100}%`
                              : "0%",
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.scrubThumb,
                        {
                          left:
                            durationSec > 0
                              ? `${(scrubTime / durationSec) * 100}%`
                              : "0%",
                        },
                      ]}
                    />
                  </View>

                  {/* Skip buttons */}
                  <View style={styles.scrubButtonsRow}>
                    <TouchableOpacity
                      style={styles.scrubBtn}
                      onPress={() => seekBy(-1)}
                      activeOpacity={0.7}
                    >
                      <SkipBack size={18} color={theme.colors.text} />
                      <Text style={styles.scrubBtnText}>-1s</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.scrubBtn}
                      onPress={() => seekBy(-0.1)}
                      activeOpacity={0.7}
                    >
                      <ChevronLeft size={18} color={theme.colors.text} />
                      <Text style={styles.scrubBtnText}>
                        {t("liftAnalysis.prevFrame")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.scrubBtn}
                      onPress={() => seekBy(0.1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.scrubBtnText}>
                        {t("liftAnalysis.nextFrame")}
                      </Text>
                      <ChevronRight size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.scrubBtn}
                      onPress={() => seekBy(1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.scrubBtnText}>+1s</Text>
                      <SkipForward size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <Text style={styles.instruction}>
                {t("liftAnalysis.seedInstruction")}
              </Text>
              {seedPoint && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={confirmSeed}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryButtonText}>
                    {t("liftAnalysis.confirmSeed")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {phase === "tracking" && (
            <View style={styles.phaseContent}>
              <Text style={styles.instruction}>
                {trackingProgress?.step === "extracting"
                  ? t("liftAnalysis.extractingFrames")
                  : t("liftAnalysis.trackingObject")}
              </Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${trackingProgress ? (trackingProgress.current / Math.max(trackingProgress.total, 1)) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {trackingProgress
                    ? `${trackingProgress.current} / ${trackingProgress.total}`
                    : "…"}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },

  // Main content (all phases — no scroll)
  mainContent: { flex: 1 },

  // Video
  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    gap: 12,
  },
  videoLoadingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  tapHintOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  tapHintCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  tapHintIcon: {
    fontSize: 28,
  },

  // Seed dot
  seedDot: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#00FF88",
    backgroundColor: "rgba(0,255,136,0.3)",
  },

  // Crosshair
  crosshairContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  crosshairText: {
    fontSize: 32,
    color: "rgba(255,255,255,0.3)",
    fontWeight: "300",
  },

  // Phase content
  phaseContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  // Scrubber (seed phase)
  scrubberSection: {
    gap: 8,
  },
  scrubTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrubTimeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  scrubBarTrack: {
    height: 28,
    justifyContent: "center",
    position: "relative",
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "visible",
  },
  scrubBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryLight,
  },
  scrubThumb: {
    position: "absolute",
    top: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  scrubButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  scrubBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.sm,
  },
  scrubBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },

  instruction: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    minWidth: 50,
    textAlign: "right",
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.muted,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  saveButton: {
    marginTop: theme.spacing.sm,
  },
  trackingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  trackingOverlayText: {
    color: "#fff",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
