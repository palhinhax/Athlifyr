import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  GestureResponderEvent,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import {
  ArrowLeft,
  Save,
  SkipForward,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { theme } from "@/src/constants/theme";
import { LiftMetricsCard } from "@/src/components/lift-analysis/LiftMetricsCard";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { VideoTrimmer, type TrimRange } from "@/src/components/ui/VideoTrimmer";
import { computeMetrics } from "@/src/lib/bar-path-utils";
import {
  trackBarbell,
  detectDisc,
  type TrackingProgress,
  type DebugDetectResult,
} from "@/src/lib/barbell-api";
import { useAuthStore } from "@/src/lib/auth-store";
import { saveLiftAnalysisToCloud } from "@/src/lib/analysis-cloud";
import * as LegacyFS from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Paths, File as FSFile } from "expo-file-system";
import type { BarPathPoint, LiftAnalysis } from "@/src/types/lift-analysis";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;
/** Cap video height to 45% of screen to always leave room for controls */
const VIDEO_HEIGHT = Math.min(
  Math.round(SCREEN_WIDTH * (16 / 9)),
  Math.round(SCREEN_HEIGHT * 0.45)
);

type Phase = "trim" | "seed" | "tracking" | "playback";

const MAX_ANALYSIS_DURATION_SEC = 30;

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

  const { isAuthenticated, token } = useAuthStore();

  // Pending save payload — preserved while user goes to login and comes back
  const pendingSaveRef = useRef<LiftAnalysis | null>(null);

  // Track whether we already did the initial duration check (avoid re-triggering trim)
  const didInitialDurationCheckRef = useRef(false);

  // ─── State ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("seed");
  const [videoDurationMs, setVideoDurationMs] = useState<number>(
    providedDuration ?? 5000
  );
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  // Trim range — set when user trims, null means no trimming needed
  const [trimRange, setTrimRange] = useState<TrimRange | null>(null);

  // Result
  const [barPath, setBarPath] = useState<BarPathPoint[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state (replaces native Alert)
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onDismiss?: () => void;
    /** When true, render "Sign in" + "Cancel" action buttons */
    loginAction?: boolean;
  }>({ visible: false, type: "success", title: "", message: "" });

  // Auto-tracking progress
  const [trackingProgress, setTrackingProgress] =
    useState<TrackingProgress | null>(null);

  // URL of the processed video returned by the Railway API (with bar overlay)
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );

  // Disc detection feedback state
  const [detectResult, setDetectResult] = useState<DebugDetectResult | null>(
    null
  );
  const [detectLoading, setDetectLoading] = useState(false);

  // Show body skeleton overlay toggle (sent to Railway API)
  const [showBody, setShowBody] = useState(true);

  // Video container layout
  const [containerLayout, setContainerLayout] = useState({
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  });

  // Track whether the video surface has rendered its first frame.
  // We use the VideoView's `onFirstFrameRender` callback (the official
  // expo-video signal) instead of listening to player status changes, which
  // can be unreliable after the VideoView is unmounted/remounted (e.g. when
  // returning from the trim phase on Android).
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Natural video dimensions (width × height) for accurate "contain" mapping
  const [naturalVideoSize, setNaturalVideoSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Current scrub position in seed phase (in seconds)
  const [scrubTime, setScrubTime] = useState(0);
  // Track for the scrubber bar
  const scrubBarRef = useRef<View>(null);
  const scrubBarWidth = useRef(0);

  // ─── Video player (expo-video) ───────────────────────────────
  // localPlayer: used for seed/scrubbing (local file URI)
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = false;
    p.muted = true;
    // Start playing so the decoder loads a frame
    p.play();
  });

  // processedPlayer: used in playback phase with the Railway-processed video.
  // Falls back to the local file if the API didn't return a video URL.
  const processedPlayer = useVideoPlayer(processedVideoUrl ?? videoUri, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Get video duration once status loads; pause to show first frame (ONCE)
  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (payload) => {
      console.log("[LiftAnalysis] Player status:", payload.status);
      if (payload.status === "readyToPlay") {
        const dur = player.duration;
        console.log("[LiftAnalysis] Video duration (sec):", dur);
        if (dur && dur > 0) {
          const durMs = Math.round(dur * 1000);
          setVideoDurationMs(durMs);

          // Capture natural video dimensions for accurate contain-fit mapping
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const size = (player as any).videoSize;
            if (size && size.width > 0 && size.height > 0) {
              console.log(
                "[LiftAnalysis] Video natural size:",
                size.width,
                "x",
                size.height
              );
              setNaturalVideoSize({ width: size.width, height: size.height });
            }
          } catch {
            /* expo-video may not expose videoSize on all platforms */
          }

          // If video is too long, switch to trim phase — but only ONCE
          if (
            dur > MAX_ANALYSIS_DURATION_SEC &&
            !didInitialDurationCheckRef.current
          ) {
            didInitialDurationCheckRef.current = true;
            console.log(
              "[LiftAnalysis] Video too long, switching to trim phase. Duration:",
              dur,
              "Max:",
              MAX_ANALYSIS_DURATION_SEC
            );
            setPhase((prev) => (prev === "seed" ? "trim" : prev));
          }
        }
        // Pause so the user can see the first frame
        player.pause();
      }
    });

    return () => {
      sub.remove();
    };
  }, [player]);

  // Fallback: if videoSize wasn't captured from player, use a thumbnail to get dimensions
  useEffect(() => {
    if (naturalVideoSize || !videoUri) return;
    VideoThumbnails.getThumbnailAsync(videoUri, { time: 0 })
      .then((thumb) => {
        if (thumb.width > 0 && thumb.height > 0) {
          console.log(
            "[LiftAnalysis] Video size from thumbnail:",
            thumb.width,
            "x",
            thumb.height
          );
          setNaturalVideoSize({ width: thumb.width, height: thumb.height });
        }
      })
      .catch(() => {
        /* ignore — we'll fall back to container dimensions */
      });
  }, [videoUri, naturalVideoSize]);

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

  // ─── Phase: Seed ─────────────────────────────────────────────

  /**
   * Compute the rendered video rect inside the container when using
   * contentFit="contain".  If we don't know the natural size, fall back
   * to the full container (previous behaviour).
   */
  const getVideoRect = useCallback(() => {
    const cw = containerLayout.width;
    const ch = containerLayout.height;

    if (!naturalVideoSize) return { x: 0, y: 0, w: cw, h: ch };

    const vAspect = naturalVideoSize.width / naturalVideoSize.height;
    const cAspect = cw / ch;

    let w: number, h: number;
    if (vAspect > cAspect) {
      // Video is wider than container → pillarbox (black on top/bottom)
      w = cw;
      h = cw / vAspect;
    } else {
      // Video is taller than container → letterbox (black on left/right)
      h = ch;
      w = ch * vAspect;
    }

    return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
  }, [containerLayout, naturalVideoSize]);

  const handleSeedTap = useCallback(
    (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
      if (phase !== "seed") return;

      const { x: ox, y: oy, w: vw, h: vh } = getVideoRect();
      const tapX = evt.nativeEvent.locationX;
      const tapY = evt.nativeEvent.locationY;

      // Ignore taps outside the actual video area (letterbox/pillarbox)
      if (tapX < ox || tapX > ox + vw || tapY < oy || tapY > oy + vh) return;

      // Normalise to 0..1 within the real video area
      const nx = (tapX - ox) / vw;
      const ny = (tapY - oy) / vh;

      // Set tap point immediately for visual feedback
      setSeedPoint({ x: nx, y: ny });

      // Call debug/detect API for disc detection feedback
      setDetectResult(null);
      setDetectLoading(true);
      detectDisc(videoUri, { x: nx, y: ny }, scrubTime)
        .then((result) => setDetectResult(result))
        .catch(() => {
          /* silently ignore — detection is optional feedback */
        })
        .finally(() => setDetectLoading(false));
    },
    [phase, getVideoRect, videoUri, scrubTime]
  );

  const confirmSeed = useCallback(async () => {
    if (!seedPoint) return;

    // Switch to tracking phase and send video to external API
    setPhase("tracking");
    setTrackingProgress({ current: 0, total: 2, step: "uploading" });

    try {
      // Use the real rendered video dimensions (not the container)
      // so percentage-based seed coordinates map correctly
      const vr = getVideoRect();
      const videoW = vr.w;
      const videoH = vr.h;

      const result = await trackBarbell(
        videoUri,
        seedPoint,
        videoW,
        videoH,
        (p: TrackingProgress) => {
          setTrackingProgress(p);
        },
        trimRange ?? undefined,
        showBody
      );

      setBarPath(result.barPath);
      setProcessedVideoUrl(result.processedVideoUrl ?? null);
      setPhase("playback");
      setTrackingProgress(null);

      // Start playback on the processed video player from the beginning.
      // processedPlayer will auto-update its source when processedVideoUrl changes
      // because useVideoPlayer is keyed to the URL. Give it a tick to initialise.
      setTimeout(() => {
        try {
          processedPlayer.currentTime = 0;
          processedPlayer.play();
        } catch {
          // ignore — player may not be ready yet
        }
      }, 100);
    } catch (err) {
      console.error("[LiftAnalysis] Tracking failed:", err);
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: t("liftAnalysis.trackingError"),
      });
      setPhase("seed");
      setTrackingProgress(null);

      // Re-show the video after tracking fails — reload the source so the
      // VideoView surface re-attaches and `onFirstFrameRender` fires again.
      if (player) {
        setIsVideoReady(false);
        player.replace(videoUri);
      }
    }
  }, [
    seedPoint,
    videoUri,
    player,
    processedPlayer,
    t,
    getVideoRect,
    trimRange,
    showBody,
  ]);

  // ─── Phase: Playback ────────────────────────────────────────

  /**
   * Save flow:
   * 1. Build the LiftAnalysis object
   * 2. If not authenticated → show login gate modal; store payload in ref
   * 3. If authenticated → upload video + JSON to cloud
   * 4. After login, `useEffect` detects `isAuthenticated` became true and
   *    retries the pending save automatically.
   */
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

      if (!isAuthenticated || !token) {
        // Not logged in — store payload and prompt login
        pendingSaveRef.current = analysis;
        setIsSaving(false);
        setModalConfig({
          visible: true,
          type: "error",
          title: t("liftAnalysis.loginToSaveAnalysis"),
          message: t("liftAnalysis.loginToSaveAnalysisMessage"),
          onDismiss: () => {},
          loginAction: true,
        });
        return;
      }

      // Authenticated → upload to cloud
      const authToken =
        token ?? (await SecureStore.getItemAsync("auth-token")) ?? "";
      await saveLiftAnalysisToCloud(
        {
          localId: id,
          videoUri,
          processedVideoUrl,
          durationMs: videoDurationMs,
          fpsSample: analysis.fpsSample,
          seedPoint,
          barPath,
          metrics,
        },
        authToken
      );

      setModalConfig({
        visible: true,
        type: "success",
        title: t("liftAnalysis.savedCloud"),
        message: t("liftAnalysis.savedCloudMessage"),
        onDismiss: () => router.back(),
      });
    } catch (error) {
      console.error("Error saving lift analysis:", error);
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: t("liftAnalysis.saveError"),
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    barPath,
    seedPoint,
    videoUri,
    processedVideoUrl,
    videoDurationMs,
    isAuthenticated,
    token,
    t,
    router,
  ]);

  // ─── Retry pending save after login ─────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token || !pendingSaveRef.current) return;

    const pending = pendingSaveRef.current;
    pendingSaveRef.current = null;

    const retry = async () => {
      setIsSaving(true);
      try {
        const authToken =
          token ?? (await SecureStore.getItemAsync("auth-token")) ?? "";
        await saveLiftAnalysisToCloud(
          {
            localId: pending.id,
            videoUri: pending.videoUri,
            durationMs: pending.durationMs,
            fpsSample: pending.fpsSample,
            seedPoint: pending.seedPoint,
            barPath: pending.barPath,
            metrics: pending.metrics,
          },
          authToken
        );
        setModalConfig({
          visible: true,
          type: "success",
          title: t("liftAnalysis.savedCloud"),
          message: t("liftAnalysis.savedCloudMessage"),
          onDismiss: () => router.back(),
        });
      } catch (error) {
        console.error("Error retrying lift analysis save:", error);
        setModalConfig({
          visible: true,
          type: "error",
          title: t("common.error"),
          message: t("liftAnalysis.saveError"),
        });
      } finally {
        setIsSaving(false);
      }
    };

    retry();
  }, [isAuthenticated, token, t, router]);

  // ─── Export video ─────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);

  const handleExportVideo = useCallback(async () => {
    if (!processedVideoUrl) return;

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: "Sharing is not available on this device",
      });
      return;
    }

    setIsExporting(true);
    try {
      const destFile = new FSFile(
        Paths.cache,
        `athlifyr_export_${Date.now()}.mp4`
      );
      const result = await LegacyFS.downloadAsync(
        processedVideoUrl,
        destFile.uri
      );
      if (result.status !== 200) {
        throw new Error(`Download failed with status ${result.status}`);
      }
      await Sharing.shareAsync(destFile.uri, {
        mimeType: "video/mp4",
        dialogTitle: "Athlifyr Lift Analysis",
        UTI: "public.movie",
      });
    } catch (err) {
      console.error("Export video error:", err);
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: t("liftAnalysis.exportError"),
      });
    } finally {
      setIsExporting(false);
    }
  }, [processedVideoUrl, t]);

  // ─── Metrics (computed lazily) ───────────────────────────────
  const metrics = barPath.length >= 2 ? computeMetrics(barPath) : null;

  // ─── Render ──────────────────────────────────────────────────

  console.log("[LiftAnalysis] ── RENDER ──", {
    phase,
    videoUri: videoUri ? videoUri.substring(0, 60) + "…" : "(empty)",
    videoDurationMs,
    trimRange,
    playerExists: !!player,
  });

  return (
    <View style={styles.container}>
      {/* ─── Trim Phase ──────────────────────────────────────── */}
      {phase === "trim" ? (
        <SafeAreaView style={styles.trimContainer} edges={["top", "bottom"]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("videoTrimmer.title")}</Text>
            <View style={{ width: 40 }} />
          </View>
          <VideoTrimmer
            videoUri={videoUri}
            durationMs={videoDurationMs}
            onConfirm={(range) => {
              setTrimRange(range);
              const seekTo = range ? range.startSec : 0;
              setScrubTime(seekTo);
              // Show loading overlay until the VideoView renders its first
              // frame (handled by `onFirstFrameRender` on the VideoView).
              setIsVideoReady(false);
              setPhase("seed");
              // Force the player to fully reload the source so it goes through
              // the idle → loading → readyToPlay cycle again. This guarantees
              // that the newly mounted VideoView will get a fresh surface
              // attached and `onFirstFrameRender` will fire.
              if (player) {
                player.replace(videoUri);
              }
            }}
            onCancel={() => router.back()}
            confirmLabel={t("videoTrimmer.confirm")}
            cancelLabel={t("common.cancel")}
            trimLabel={t("videoTrimmer.duration")}
            tooLongLabel={t("videoTrimmer.tooLong")}
            maxDurationLabel={t("videoTrimmer.maxDuration", {
              seconds: MAX_ANALYSIS_DURATION_SEC,
            })}
            resetLabel={t("videoTrimmer.reset")}
          />
        </SafeAreaView>
      ) : (
        <View style={styles.innerContainer}>
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
                style={[
                  styles.videoContainer,
                  { height: containerLayout.height },
                ]}
                onLayout={(e) => {
                  setContainerLayout({
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height,
                  });
                }}
              >
                <VideoView
                  player={processedPlayer}
                  style={StyleSheet.absoluteFill}
                  contentFit="contain"
                  nativeControls
                />
              </View>

              {metrics && (
                <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
                  <LiftMetricsCard metrics={metrics} />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={handleExportVideo}
                      activeOpacity={0.7}
                      disabled={isExporting || !processedVideoUrl}
                    >
                      {isExporting ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.textSecondary}
                        />
                      ) : (
                        <Share2 size={20} color={theme.colors.textSecondary} />
                      )}
                      <Text style={styles.secondaryButtonText}>
                        {t("liftAnalysis.exportVideo")}
                      </Text>
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
                style={[
                  styles.videoContainer,
                  { height: containerLayout.height },
                ]}
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
                  contentFit="contain"
                  nativeControls={false}
                  onFirstFrameRender={() => {
                    // The native surface has rendered a frame — the video is
                    // visible.  Seek to the trim start (or 0) and pause so the
                    // user can see the frame and tap on the barbell.
                    console.log("[LiftAnalysis] onFirstFrameRender (seed)");
                    const seekTo = trimRange ? trimRange.startSec : 0;
                    player.pause();
                    player.currentTime = seekTo;
                    setScrubTime(seekTo);
                    setIsVideoReady(true);
                  }}
                />

                {/* Loading overlay while video is not yet decoded */}
                {!isVideoReady && phase === "seed" && (
                  <View style={styles.videoLoadingOverlay}>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
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

                {/* Seed point indicator — hide when disc detection circle is shown */}
                {phase === "seed" &&
                  seedPoint &&
                  !(detectResult?.detected && detectResult.circle) &&
                  (() => {
                    const vr = getVideoRect();
                    return (
                      <View
                        style={[
                          styles.seedDot,
                          {
                            left: vr.x + seedPoint.x * vr.w - 12,
                            top: vr.y + seedPoint.y * vr.h - 12,
                          },
                        ]}
                      />
                    );
                  })()}

                {/* Detected circle overlay (green ring from debug/detect API) */}
                {phase === "seed" &&
                  detectResult?.detected &&
                  detectResult.circle &&
                  (() => {
                    const vr = getVideoRect();
                    const maxDim = Math.max(vr.w, vr.h);
                    const radiusPx =
                      (detectResult.circle.radius_pct / 100) * maxDim;
                    return (
                      <View
                        style={[
                          styles.detectCircle,
                          {
                            left:
                              vr.x +
                              (detectResult.circle.center_x_pct / 100) * vr.w -
                              radiusPx,
                            top:
                              vr.y +
                              (detectResult.circle.center_y_pct / 100) * vr.h -
                              radiusPx,
                            width: radiusPx * 2,
                            height: radiusPx * 2,
                          },
                        ]}
                      />
                    );
                  })()}

                {/* Detection loading spinner (top-right) */}
                {phase === "seed" && detectLoading && (
                  <View style={styles.detectLoadingBadge} pointerEvents="none">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.detectLoadingText}>
                      {t("liftAnalysis.detecting")}
                    </Text>
                  </View>
                )}

                {/* Tracking progress overlay */}
                {phase === "tracking" && (
                  <View style={styles.trackingOverlay} pointerEvents="none">
                    <ActivityIndicator size="large" color="#00FF88" />
                    <Text style={styles.trackingOverlayText}>
                      {trackingProgress?.step === "uploading"
                        ? t("liftAnalysis.uploadingVideo")
                        : t("liftAnalysis.processingTracking")}
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

                  {/* Detection feedback */}
                  {seedPoint && !detectLoading && detectResult && (
                    <View
                      style={[
                        styles.detectFeedback,
                        detectResult.detected
                          ? styles.detectFeedbackSuccess
                          : styles.detectFeedbackError,
                      ]}
                    >
                      {detectResult.detected ? (
                        <CheckCircle2 size={16} color={theme.colors.success} />
                      ) : (
                        <AlertCircle size={16} color={theme.colors.error} />
                      )}
                      <Text
                        style={[
                          styles.detectFeedbackText,
                          detectResult.detected
                            ? styles.detectFeedbackTextSuccess
                            : styles.detectFeedbackTextError,
                        ]}
                      >
                        {detectResult.detected && detectResult.circle
                          ? `${t("liftAnalysis.discDetected")} · ${t("liftAnalysis.confidence")}: ${Math.round(detectResult.circle.confidence * 100)}%`
                          : t("liftAnalysis.discNotDetected")}
                      </Text>
                    </View>
                  )}

                  {seedPoint && (
                    <View style={styles.toggleRow}>
                      <View style={styles.toggleLabelContainer}>
                        <Text style={styles.toggleLabel}>
                          {t("liftAnalysis.showBody")}
                        </Text>
                        <Text style={styles.toggleDescription}>
                          {t("liftAnalysis.showBodyDescription")}
                        </Text>
                      </View>
                      <Switch
                        value={showBody}
                        onValueChange={setShowBody}
                        trackColor={{
                          false: theme.colors.border,
                          true: theme.colors.primaryLight,
                        }}
                        thumbColor={
                          showBody ? theme.colors.primary : theme.colors.muted
                        }
                      />
                    </View>
                  )}

                  {seedPoint && (
                    <TouchableOpacity
                      style={[styles.primaryButton, { flex: undefined }]}
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
                    {trackingProgress?.step === "uploading"
                      ? t("liftAnalysis.uploadingVideo")
                      : t("liftAnalysis.processingTracking")}
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
                        ? `${Math.round((trackingProgress.current / Math.max(trackingProgress.total, 1)) * 100)}%`
                        : "…"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Feedback Modal */}
          <ConfirmModal
            visible={modalConfig.visible}
            onClose={() => {
              if (!modalConfig.loginAction) {
                const cb = modalConfig.onDismiss;
                setModalConfig((prev) => ({ ...prev, visible: false }));
                cb?.();
              }
            }}
            title={modalConfig.title}
            message={modalConfig.message}
            icon={
              modalConfig.type === "success" ? (
                <CheckCircle2 size={28} color={theme.colors.success} />
              ) : (
                <AlertCircle size={28} color={theme.colors.error} />
              )
            }
            actions={
              modalConfig.loginAction
                ? [
                    {
                      label: t("liftAnalysis.loginAndReturn"),
                      variant: "primary" as const,
                      onPress: () => {
                        setModalConfig((prev) => ({ ...prev, visible: false }));
                        router.push("/login");
                      },
                    },
                    {
                      label: t("common.cancel"),
                      variant: "outline" as const,
                      onPress: () => {
                        pendingSaveRef.current = null;
                        setModalConfig((prev) => ({ ...prev, visible: false }));
                      },
                    },
                  ]
                : [
                    {
                      label: "OK",
                      variant: "primary" as const,
                      onPress: () => {
                        const cb = modalConfig.onDismiss;
                        setModalConfig((prev) => ({ ...prev, visible: false }));
                        cb?.();
                      },
                    },
                  ]
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  innerContainer: { flex: 1 },
  trimContainer: { flex: 1, backgroundColor: "#000" },

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

  // Detected circle overlay (green ring from API)
  detectCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#4ade80",
    backgroundColor: "rgba(74,222,128,0.12)",
  },

  // Detection loading badge (top-right spinner)
  detectLoadingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detectLoadingText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },

  // Detection feedback banner (below video controls)
  detectFeedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  detectFeedbackSuccess: {
    backgroundColor: "rgba(74,222,128,0.1)",
    borderColor: "rgba(74,222,128,0.3)",
  },
  detectFeedbackError: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  detectFeedbackText: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  detectFeedbackTextSuccess: {
    color: "#4ade80",
  },
  detectFeedbackTextError: {
    color: "#ef4444",
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

  // Show body toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  toggleDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
