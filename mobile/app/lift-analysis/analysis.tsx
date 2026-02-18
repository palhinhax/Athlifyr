import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  ArrowLeft,
  Save,
  Info,
  Share2,
  AlertTriangle,
} from "lucide-react-native";
import * as Sharing from "expo-sharing";
import { theme } from "@/src/constants/theme";
import { PlaybackControls } from "@/src/components/lift-analysis/PlaybackControls";
import { OverlayToggles } from "@/src/components/lift-analysis/OverlayToggles";
import { AnalysisOverlay } from "@/src/components/lift-analysis/AnalysisOverlay";
import {
  PoseAnalysisWebView,
  type PoseAnalysisHandle,
} from "@/src/components/lift-analysis/PoseAnalysisWebView";
import { buildAnalysisResult } from "@/src/modules/real-analysis";
import { generateMockAnalysis } from "@/src/modules/mock-analysis";
import { useAnalysisStorage } from "@/src/hooks/useAnalysisStorage";
import type {
  PlaybackSpeed,
  OverlayVisibility,
  AnalysisStatus,
  LiftAnalysisResult,
} from "@/src/types/lift-analysis";

/**
 * LiftAnalysis – Analysis results screen with overlay visualization.
 *
 * Receives the video URI and trim parameters. Runs a real analysis
 * pipeline: frame extraction → MediaPipe pose estimation → joint
 * angle computation. Falls back to mock data if MediaPipe is
 * unavailable (no network, WebView error).
 */
export default function LiftAnalysisScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { saveAnalysis } = useAnalysisStorage();
  const params = useLocalSearchParams<{
    videoUri: string;
    startMs: string;
    endMs: string;
  }>();

  const videoUri = params.videoUri ?? "";

  const poseWebViewRef = useRef<PoseAnalysisHandle>(null);
  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [analysisResult, setAnalysisResult] =
    useState<LiftAnalysisResult | null>(null);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [videoLayoutSize, setVideoLayoutSize] = useState({
    width: 0,
    height: 0,
  });
  const [overlayVisibility, setOverlayVisibility] = useState<OverlayVisibility>(
    {
      barPath: true,
      skeleton: true,
      angles: true,
    }
  );
  const [videoDurationMs, setVideoDurationMs] = useState<number>(0);
  const [poseEngineReady, setPoseEngineReady] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
  });

  // Get actual video duration from the player
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const dur = player.duration;
        if (dur > 0) {
          setVideoDurationMs(dur * 1000);
          clearInterval(interval);
        }
      } catch {
        // Player may not be ready yet
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player]);

  // Track current playback position for overlay sync.
  // Uses a 16ms interval (≈60fps polling) when playing for smooth overlay;
  // clears it when paused to avoid wasted work.
  useEffect(() => {
    if (isPlaying && analysisResult) {
      playbackTimerRef.current = setInterval(() => {
        try {
          setCurrentTimeMs(player.currentTime * 1000);
        } catch {
          // Player may not be ready yet
        }
      }, 16); // ~60fps – smooth overlay tracking
    } else if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
      // Sync one last time after pause so overlay stays at the paused frame
      try {
        setCurrentTimeMs(player.currentTime * 1000);
      } catch {
        // ignore
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, [isPlaying, analysisResult, player]);

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  const handleVideoLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setVideoLayoutSize({ width, height });
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);

  const handleSpeedChange = useCallback(
    (newSpeed: PlaybackSpeed) => {
      setSpeed(newSpeed);
      player.playbackRate = newSpeed;
    },
    [player]
  );

  const handleToggleOverlay = useCallback((key: keyof OverlayVisibility) => {
    setOverlayVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleSaveAnalysis = useCallback(async () => {
    if (!analysisResult) return;
    setIsSaving(true);
    try {
      await saveAnalysis(analysisResult);
      Alert.alert(
        t("liftAnalysis.analysis.saveSuccess"),
        t("liftAnalysis.analysis.saveSuccessDescription")
      );
    } catch (error) {
      console.error("Failed to save analysis:", error);
      Alert.alert(t("common.error"), t("liftAnalysis.analysis.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }, [t, analysisResult, saveAnalysis]);

  const handleExportVideo = useCallback(async () => {
    if (!videoUri) return;
    setIsExporting(true);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          t("common.error"),
          t("liftAnalysis.analysis.sharingUnavailable")
        );
        return;
      }
      await Sharing.shareAsync(videoUri, {
        mimeType: "video/mp4",
        dialogTitle: t("liftAnalysis.analysis.exportTitle"),
      });
    } catch (error) {
      console.error("Failed to export video:", error);
      Alert.alert(t("common.error"), t("liftAnalysis.analysis.exportFailed"));
    } finally {
      setIsExporting(false);
    }
  }, [videoUri, t]);

  const handleRunAnalysis = useCallback(async () => {
    setAnalysisStatus("estimating_pose");
    setAnalysisProgress(0);
    setIsMockData(false);

    try {
      const duration = videoDurationMs > 0 ? videoDurationMs : 4000;
      const startMs = Number(params.startMs) || 0;
      const endMs = Number(params.endMs) > 0 ? Number(params.endMs) : duration;

      // Run pose estimation + Hough Circle plate detection entirely inside
      // the WebView – the video is seeked frame-by-frame without any base64
      // transfer over the JS bridge (10-100× faster than the old approach).
      if (!poseEngineReady || !poseWebViewRef.current) {
        throw new Error("Pose engine not available");
      }

      const poseResults = await poseWebViewRef.current.startAnalysis(
        videoUri,
        startMs,
        endMs,
        12, // 12 fps – good balance of detail vs speed
        (pct: number) => {
          setAnalysisProgress(Math.round(pct * 0.9)); // 0–90%
        }
      );

      // Compute joint angles and build the final result
      setAnalysisStatus("computing_angles");
      setAnalysisProgress(92);

      const result = buildAnalysisResult(videoUri, duration, poseResults);
      setAnalysisResult(result);
      setAnalysisStatus("complete");
      setAnalysisProgress(100);
    } catch (error) {
      // Fall back to mock data if real analysis fails
      console.warn("Real analysis failed, using mock data:", error);
      setIsMockData(true);
      const result = generateMockAnalysis(
        videoUri,
        videoDurationMs > 0 ? videoDurationMs : undefined
      );
      setAnalysisResult(result);
      setAnalysisStatus("complete");
      setAnalysisProgress(100);
    }
  }, [
    videoUri,
    videoDurationMs,
    poseEngineReady,
    params.startMs,
    params.endMs,
  ]);

  const getStatusMessage = (status: AnalysisStatus): string => {
    switch (status) {
      case "idle":
        return t("liftAnalysis.analysis.statusIdle");
      case "extracting_frames":
        return t("liftAnalysis.analysis.statusEstimatingPose"); // no longer used, fallback
      case "tracking_bar":
        return t("liftAnalysis.analysis.statusTrackingBar");
      case "estimating_pose":
        return t("liftAnalysis.analysis.statusEstimatingPose");
      case "computing_angles":
        return t("liftAnalysis.analysis.statusComputingAngles");
      case "complete":
        return t("liftAnalysis.analysis.statusComplete");
      case "error":
        return t("liftAnalysis.analysis.statusError");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("liftAnalysis.analysis.title")}
        </Text>
        <View style={styles.headerActions}>
          {/* Export button */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleExportVideo}
            disabled={isExporting || analysisStatus !== "complete"}
            activeOpacity={0.7}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Share2
                size={20}
                color={
                  analysisStatus === "complete"
                    ? theme.colors.primary
                    : theme.colors.border
                }
              />
            )}
          </TouchableOpacity>
          {/* Save button */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSaveAnalysis}
            disabled={isSaving || analysisStatus !== "complete"}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Save
                size={22}
                color={
                  analysisStatus === "complete"
                    ? theme.colors.primary
                    : theme.colors.border
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video with overlays */}
        <View style={styles.videoContainer} onLayout={handleVideoLayout}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
          />

          {/* SVG overlay rendering */}
          {analysisStatus === "complete" &&
            analysisResult &&
            videoLayoutSize.width > 0 && (
              <View style={styles.overlayContainer} pointerEvents="none">
                <AnalysisOverlay
                  width={videoLayoutSize.width}
                  height={videoLayoutSize.height}
                  currentTimeMs={currentTimeMs}
                  durationMs={analysisResult.endMs}
                  barPath={analysisResult.barPath}
                  poseData={analysisResult.pose}
                  angleData={analysisResult.angles}
                  visibility={overlayVisibility}
                />
              </View>
            )}
        </View>

        {/* Analysis status with progress */}
        {analysisStatus !== "idle" && analysisStatus !== "complete" && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <View style={styles.statusContent}>
              <Text style={styles.statusText}>
                {getStatusMessage(analysisStatus)}
              </Text>
              {analysisProgress > 0 && (
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${analysisProgress}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {analysisStatus === "complete" && (
          <View style={styles.completeCard}>
            <Info size={16} color={theme.colors.success} />
            <Text style={styles.completeText}>
              {getStatusMessage(analysisStatus)}
            </Text>
          </View>
        )}

        {/* Demo banner (only visible when using mock fallback data) */}
        {analysisStatus === "complete" && isMockData && (
          <View style={styles.demoBanner}>
            <AlertTriangle size={16} color={theme.colors.warning} />
            <View style={styles.demoBannerContent}>
              <Text style={styles.demoBannerTitle}>
                {t("liftAnalysis.analysis.demoBanner")}
              </Text>
              <Text style={styles.demoBannerText}>
                {t("liftAnalysis.analysis.demoBannerDescription")}
              </Text>
            </View>
          </View>
        )}

        {/* Run Analysis button (when idle) */}
        {analysisStatus === "idle" && (
          <View style={styles.analyzeSection}>
            <Text style={styles.analyzeDescription}>
              {t("liftAnalysis.analysis.description")}
            </Text>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleRunAnalysis}
              activeOpacity={0.7}
            >
              <Text style={styles.analyzeButtonText}>
                {t("liftAnalysis.analysis.runAnalysis")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Overlay toggles (visible when analysis complete) */}
        {analysisStatus === "complete" && (
          <OverlayToggles
            visibility={overlayVisibility}
            onToggle={handleToggleOverlay}
          />
        )}

        {/* Export button (visible when analysis complete) */}
        {analysisStatus === "complete" && (
          <View style={styles.exportSection}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportVideo}
              disabled={isExporting}
              activeOpacity={0.7}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <Share2 size={18} color={theme.colors.primary} />
                  <Text style={styles.exportButtonText}>
                    {t("liftAnalysis.analysis.exportVideo")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Playback controls (always visible) */}
      <View style={styles.controlsContainer}>
        <PlaybackControls
          isPlaying={isPlaying}
          speed={speed}
          onTogglePlay={handleTogglePlay}
          onSpeedChange={handleSpeedChange}
        />
      </View>

      {/* Hidden WebView for MediaPipe pose estimation */}
      <PoseAnalysisWebView
        ref={poseWebViewRef}
        onReady={() => setPoseEngineReady(true)}
        onError={(msg) => console.warn("Pose engine error:", msg)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },

  // Video
  videoContainer: {
    height: 300,
    backgroundColor: "#000",
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  // Status
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
  },
  statusContent: {
    flex: 1,
    gap: 6,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: `${theme.colors.primary}30`,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  completeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.success}15`,
    borderRadius: theme.borderRadius.md,
  },
  completeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Demo banner
  demoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.warning}15`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: `${theme.colors.warning}30`,
  },
  demoBannerContent: {
    flex: 1,
    gap: 4,
  },
  demoBannerTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.bold,
  },
  demoBannerText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // Analyze section
  analyzeSection: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  analyzeDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  analyzeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  analyzeButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Export
  exportSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  exportButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  // Controls
  controlsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
});
