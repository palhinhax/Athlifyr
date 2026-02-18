import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  ArrowLeft,
  Save,
  Scissors,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { theme } from "@/src/constants/theme";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { ExportVideoModal } from "@/src/components/motion-analysis/ExportVideoModal";
import type { ExportMotionPayload } from "@/src/lib/analysis-export";
import { TrimSlider } from "@/src/components/motion-analysis/TrimSlider";
import { AnalysisProgress } from "@/src/components/motion-analysis/AnalysisProgress";
import { PoseResultTabs } from "@/src/components/motion-analysis/PoseResultTabs";
import { PoseWebViewRunner } from "@/src/components/motion-analysis/PoseWebViewRunner";
import { ErrorBoundary } from "@/src/components/motion-analysis/ErrorBoundary";
import { computePoseMetrics, smoothPoseFrames } from "@/src/lib/pose-utils";
import { useMotionAnalysisStore } from "@/src/lib/motion-analysis-store";
import type {
  PoseFrame,
  PoseMetrics,
  PoseVideoMeta,
  MotionAnalysis,
} from "@/src/types/motion-analysis";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const VIDEO_HEIGHT = Math.min(
  Math.round(SCREEN_WIDTH * (16 / 9)),
  Math.round(SCREEN_HEIGHT * 0.45)
);

type Phase = "trim" | "analyzing" | "results";

export default function MotionAnalysisScreen() {
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

  const saveAnalysis = useMotionAnalysisStore((s) => s.save);

  // ─── Refs ────────────────────────────────────────────────────
  // (reserved for future use)

  // ─── State ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("trim");
  const [videoDurationMs, setVideoDurationMs] = useState<number>(
    providedDuration ?? 5000
  );

  // Trim
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(providedDuration ?? 5000);

  // Analysis
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeStatus, setAnalyzeStatus] = useState<
    "loading_model" | "analyzing" | "computing"
  >("loading_model");
  const [runAnalysis, setRunAnalysis] = useState(false);

  // Results
  const [poseFrames, setPoseFrames] = useState<PoseFrame[]>([]);
  const [metrics, setMetrics] = useState<PoseMetrics | null>(null);
  const [videoMeta, setVideoMeta] = useState<PoseVideoMeta | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state (replaces native Alert)
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onDismiss?: () => void;
  }>({ visible: false, type: "success", title: "", message: "" });

  // Export video modal (backend composition)
  const [exportPayload, setExportPayload] =
    useState<ExportMotionPayload | null>(null);

  // ─── Video player (trim preview) ────────────────────────────
  // CRITICAL: Release the native player when entering results phase.
  // expo-video crashes Android if two native players exist simultaneously.
  // PoseResultTabs creates its own player, so the parent must release first.
  const playerUri = phase === "results" ? "" : videoUri;
  const player = useVideoPlayer(playerUri, (p) => {
    if (!playerUri) return;
    p.loop = true;
    p.muted = true;
  });

  // Detect duration
  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (payload) => {
      if (
        payload.status === "readyToPlay" &&
        player.duration &&
        player.duration > 0
      ) {
        const dur = Math.round(player.duration * 1000);
        setVideoDurationMs(dur);
        if (!providedDuration) {
          setTrimEnd(dur);
        }
      }
    });

    return () => sub.remove();
  }, [player, providedDuration]);

  // ─── Trim handlers ──────────────────────────────────────────
  const handleTrimChange = useCallback(
    (start: number, end: number) => {
      setTrimStart(start);
      setTrimEnd(end);
      // Seek video to trim start
      if (player) {
        player.currentTime = start / 1000;
      }
    },
    [player]
  );

  // ─── Start analysis ─────────────────────────────────────────
  const handleStartAnalysis = useCallback(() => {
    setPhase("analyzing");
    setAnalyzeProgress(0);
    setAnalyzeStatus("loading_model");
    setRunAnalysis(true);
  }, []);

  // ─── WebView callbacks ──────────────────────────────────────
  const handleModelReady = useCallback(() => {
    setAnalyzeStatus("analyzing");
  }, []);

  const handleProgress = useCallback((pct: number) => {
    setAnalyzeProgress(pct);
  }, []);

  const handleResult = useCallback(
    (frames: PoseFrame[], meta: PoseVideoMeta) => {
      setAnalyzeStatus("computing");
      setAnalyzeProgress(100);

      // Smooth keypoints across frames to reduce jitter
      const smoothed = smoothPoseFrames(frames);
      const computed = computePoseMetrics(smoothed);
      setPoseFrames(smoothed);
      setMetrics(computed);
      setVideoMeta(meta);

      // Short delay for UX
      setTimeout(() => {
        setPhase("results");
        setRunAnalysis(false);
      }, 500);
    },
    []
  );

  const handleError = useCallback(
    (message: string) => {
      setRunAnalysis(false);
      setPhase("trim");
      setModalConfig({
        visible: true,
        type: "error",
        title: t("motionAnalysis.analysisError"),
        message,
      });
    },
    [t]
  );

  // ─── Save ───────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    console.log("💾 Save button pressed");
    if (poseFrames.length === 0 || !metrics) return;
    setIsSaving(true);

    try {
      const id = Crypto.randomUUID();

      const analysis: MotionAnalysis = {
        id,
        videoUri,
        createdAt: new Date().toISOString(),
        segment: { startMs: trimStart, endMs: trimEnd },
        sampleFps: 12,
        poseFrames,
        metrics,
        videoMeta: videoMeta ?? undefined,
      };

      await saveAnalysis(analysis);
      setModalConfig({
        visible: true,
        type: "success",
        title: t("motionAnalysis.saved"),
        message: t("motionAnalysis.savedMessage"),
        onDismiss: () => router.back(),
      });
    } catch (error) {
      console.error("Error saving motion analysis:", error);
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: t("motionAnalysis.saveError"),
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    poseFrames,
    metrics,
    videoMeta,
    videoUri,
    trimStart,
    trimEnd,
    saveAnalysis,
    t,
    router,
  ]);

  // ─── Export snapshot (frame + overlay + watermark) ──────────
  const handleExportVideo = useCallback(() => {
    if (!poseFrames.length || !metrics || !videoMeta) return;
    setExportPayload({
      type: "motion",
      videoUri,
      segment: { startMs: trimStart, endMs: trimEnd },
      videoMeta,
      poseFrames,
      metrics,
    });
  }, [poseFrames, metrics, videoMeta, videoUri, trimStart, trimEnd]);

  // ─── Memoize PoseResultTabs props to prevent re-renders ─────
  const resultTabsProps = useMemo(() => {
    // Only create props object when we're actually in results phase
    if (phase !== "results" || !metrics || poseFrames.length === 0) {
      return null;
    }
    return {
      videoUri,
      startMs: trimStart,
      endMs: trimEnd,
      poseFrames,
      metrics,
      videoAspectRatio:
        videoMeta && videoMeta.videoWidth > 0 && videoMeta.videoHeight > 0
          ? videoMeta.videoWidth / videoMeta.videoHeight
          : undefined,
    };
  }, [phase, videoUri, trimStart, trimEnd, poseFrames, metrics, videoMeta]);

  // ─── Render ──────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Hidden WebView for pose estimation */}
      {runAnalysis && (
        <PoseWebViewRunner
          videoUri={videoUri}
          startMs={trimStart}
          endMs={trimEnd}
          sampleFps={12}
          onModelReady={handleModelReady}
          onProgress={handleProgress}
          onResult={handleResult}
          onError={handleError}
        />
      )}

      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {phase === "trim"
            ? t("motionAnalysis.trimTitle")
            : phase === "analyzing"
              ? t("motionAnalysis.analyzingTitle")
              : t("motionAnalysis.resultsTitle")}
        </Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* ── Phase: Trim ──────────────────────────────────────── */}
      {phase === "trim" && (
        <View style={styles.mainContent}>
          {/* Video preview */}
          <View
            style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}
            pointerEvents="none"
          >
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              nativeControls={false}
            />
          </View>

          {/* Trim slider */}
          <TrimSlider
            durationMs={videoDurationMs}
            startMs={trimStart}
            endMs={trimEnd}
            onChange={handleTrimChange}
          />

          {/* Instructions */}
          <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
            <View style={styles.trimInfoRow}>
              <Scissors size={18} color={theme.colors.textSecondary} />
              <Text style={styles.instruction}>
                {t("motionAnalysis.trimInstruction")}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleStartAnalysis}
              activeOpacity={0.7}
            >
              <Sparkles size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>
                {t("motionAnalysis.analyzeButton")}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      )}

      {/* ── Phase: Analyzing ─────────────────────────────────── */}
      {phase === "analyzing" && (
        <View style={styles.mainContent}>
          <View
            style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}
            pointerEvents="none"
          >
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              nativeControls={false}
            />
          </View>

          <AnalysisProgress progress={analyzeProgress} status={analyzeStatus} />
        </View>
      )}

      {/* ── Phase: Results ───────────────────────────────────── */}
      {phase === "results" && resultTabsProps && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <ErrorBoundary key="pose-results-error-boundary">
            <PoseResultTabs
              key={`pose-results-${videoUri}`}
              {...resultTabsProps}
            />
          </ErrorBoundary>

          {/* Save + Export buttons */}
          <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExportVideo}
                activeOpacity={0.7}
              >
                <Share2 size={20} color={theme.colors.textSecondary} />
                <Text style={styles.exportButtonText}>
                  {t("motionAnalysis.exportVideo")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Save size={20} color="#fff" />
                    <Text style={styles.analyzeButtonText}>
                      {t("motionAnalysis.saveAnalysis")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      )}

      {/* Feedback Modal */}
      <ConfirmModal
        visible={modalConfig.visible}
        onClose={() => {
          const cb = modalConfig.onDismiss;
          setModalConfig((prev) => ({ ...prev, visible: false }));
          cb?.();
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
        actions={[
          {
            label: "OK",
            variant: "primary",
            onPress: () => {
              const cb = modalConfig.onDismiss;
              setModalConfig((prev) => ({ ...prev, visible: false }));
              cb?.();
            },
          },
        ]}
      />

      {/* Export Video Modal — backend composition (upload → FFmpeg → share) */}
      <ExportVideoModal
        visible={exportPayload !== null}
        payload={exportPayload}
        onDone={() => setExportPayload(null)}
        onError={(msg) => {
          setExportPayload(null);
          setModalConfig({
            visible: true,
            type: "error",
            title: t("common.error"),
            message: msg,
          });
        }}
      />
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

  // Main content (no scroll for trim/analyzing)
  mainContent: { flex: 1 },

  // Scroll (results only)
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing["2xl"] },

  // Video
  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },

  // Phase content
  phaseContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  instruction: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  trimInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  // Buttons
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  exportButton: {
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
  exportButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.success,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
});
