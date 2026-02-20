import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react-native";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { theme } from "@/src/constants/theme";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { VideoTrimmer, type TrimRange } from "@/src/components/ui/VideoTrimmer";
import * as LegacyFS from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Paths, File as FSFile } from "expo-file-system";
import { saveMotionAnalysisToCloud } from "@/src/lib/analysis-cloud";
import {
  analyzeMotion,
  type MotionAnalysisResult,
  type MotionAnalysisProgress,
} from "@/src/lib/motion-api";
import { useMotionAnalysisStore } from "@/src/lib/motion-analysis-store";
import { useAuthStore } from "@/src/lib/auth-store";
import type { MotionAnalysis } from "@/src/types/motion-analysis";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const VIDEO_HEIGHT = Math.min(
  Math.round(SCREEN_WIDTH * (16 / 9)),
  Math.round(SCREEN_HEIGHT * 0.45)
);

type Phase = "trim" | "preview" | "uploading" | "results";

const MAX_ANALYSIS_DURATION_SEC = 30;

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
  const { isAuthenticated, token } = useAuthStore();

  // Pending save payload — preserved while user goes to login and comes back
  const pendingSaveRef = useRef<{
    analysis: MotionAnalysis;
    analysisResult: MotionAnalysisResult;
  } | null>(null);

  // Track whether we already did the initial duration check (avoid re-triggering trim)
  const didInitialDurationCheckRef = useRef(false);

  // Abort controller for cancelling in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  // ─── State ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("preview");
  const [videoDurationMs, setVideoDurationMs] = useState<number>(
    providedDuration ?? 5000
  );

  // Trim range — set when user trims, null means no trimming needed
  const [trimRange, setTrimRange] = useState<TrimRange | null>(null);

  // Upload/processing progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<"uploading" | "processing">(
    "uploading"
  );

  // Server results
  const [analysisResult, setAnalysisResult] =
    useState<MotionAnalysisResult | null>(null);
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

  // Export video modal (backend composition)
  const [isExporting, setIsExporting] = useState(false);

  // ─── Video player (preview) ─────────────────────────────────
  const player = useVideoPlayer(videoUri, (p) => {
    if (!videoUri) return;
    p.loop = true;
    p.muted = true;
  });

  // Detect video duration and switch to trim phase if too long
  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (payload) => {
      console.log("[MotionAnalysis] Player status:", payload.status);
      if (payload.status === "readyToPlay") {
        const dur = player.duration;
        console.log("[MotionAnalysis] Video duration (sec):", dur);
        if (dur && dur > 0) {
          setVideoDurationMs(Math.round(dur * 1000));
          // If video is too long, switch to trim phase — but only ONCE
          if (
            dur > MAX_ANALYSIS_DURATION_SEC &&
            !didInitialDurationCheckRef.current
          ) {
            didInitialDurationCheckRef.current = true;
            console.log(
              "[MotionAnalysis] Video too long, switching to trim phase. Duration:",
              dur,
              "Max:",
              MAX_ANALYSIS_DURATION_SEC
            );
            setPhase((prev) => (prev === "preview" ? "trim" : prev));
          }
        }
      }
    });

    return () => sub.remove();
  }, [player]);

  // ─── Start server analysis ──────────────────────────────────
  const handleStartAnalysis = useCallback(async () => {
    setPhase("uploading");
    setUploadProgress(0);
    setUploadStep("uploading");

    // Cancel any previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const result = await analyzeMotion(
        videoUri,
        (p: MotionAnalysisProgress) => {
          setUploadProgress(p.progress);
          setUploadStep(p.step);
        },
        trimRange ?? undefined
      );

      setAnalysisResult(result);
      setPhase("results");
    } catch (error) {
      console.error("Motion analysis error:", error);
      setPhase("preview");
      setModalConfig({
        visible: true,
        type: "error",
        title: t("motionAnalysis.analysisError"),
        message:
          error instanceof Error
            ? error.message
            : t("motionAnalysis.analysisError"),
      });
    }
  }, [videoUri, t, trimRange]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // ─── Save ───────────────────────────────────────────────────
  /**
   * Save flow:
   * 1. Build the MotionAnalysis object from server results
   * 2. If not authenticated → show login gate modal; store payload in ref
   * 3. If authenticated → upload video + JSON to cloud, then also save locally
   * 4. After login, `useEffect` detects `isAuthenticated` became true and
   *    retries the pending save automatically.
   */
  const handleSave = useCallback(async () => {
    console.log("💾 Save button pressed");
    if (!analysisResult) return;
    setIsSaving(true);

    try {
      const id = Crypto.randomUUID();

      // Build a MotionAnalysis record from the server response.
      // We map server pose data into the local PoseMetrics shape.
      const durationMs = Math.round(
        (analysisResult.pose.durationSec ?? 0) * 1000
      );

      const analysis: MotionAnalysis = {
        id,
        videoUri,
        createdAt: new Date().toISOString(),
        segment: { startMs: 0, endMs: durationMs },
        sampleFps: 0, // server-side — no sample FPS
        poseFrames: [], // server processes frames; we don't store raw MoveNet frames
        metrics: {
          durationMs,
          avgConfidence: analysisResult.pose.detectionRate ?? 0,
          maxKneeFlexion:
            analysisResult.pose.averageAngles?.leftKnee ??
            analysisResult.pose.averageAngles?.rightKnee ??
            null,
          torsoAngleRange: analysisResult.pose.averageAngles?.torsoInclination
            ? [
                analysisResult.pose.averageAngles.torsoInclination,
                analysisResult.pose.averageAngles.torsoInclination,
              ]
            : null,
        },
      };

      if (!isAuthenticated || !token) {
        // Not logged in — store payload and prompt login
        pendingSaveRef.current = { analysis, analysisResult };
        setIsSaving(false);
        setModalConfig({
          visible: true,
          type: "error",
          title: t("motionAnalysis.loginToSaveAnalysis"),
          message: t("motionAnalysis.loginToSaveAnalysisMessage"),
          onDismiss: () => {},
          loginAction: true,
        });
        return;
      }

      // Authenticated → upload to cloud (Mode 1: full analysisData with skeletonFrames)
      const authToken =
        token ?? (await SecureStore.getItemAsync("auth-token")) ?? "";
      await saveMotionAnalysisToCloud(
        {
          localId: id,
          videoUri,
          analysisResult: analysisResult,
        },
        authToken
      );

      // Also save locally (offline access)
      await saveAnalysis(analysis);

      setModalConfig({
        visible: true,
        type: "success",
        title: t("motionAnalysis.savedCloud"),
        message: t("motionAnalysis.savedCloudMessage"),
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
    analysisResult,
    videoUri,
    isAuthenticated,
    token,
    saveAnalysis,
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
        await saveMotionAnalysisToCloud(
          {
            localId: pending.analysis.id,
            videoUri: pending.analysis.videoUri,
            analysisResult: pending.analysisResult,
          },
          authToken
        );
        await saveAnalysis(pending.analysis);
        setModalConfig({
          visible: true,
          type: "success",
          title: t("motionAnalysis.savedCloud"),
          message: t("motionAnalysis.savedCloudMessage"),
          onDismiss: () => router.back(),
        });
      } catch (error) {
        console.error("Error retrying motion analysis save:", error);
        setModalConfig({
          visible: true,
          type: "error",
          title: t("common.error"),
          message: t("motionAnalysis.saveError"),
        });
      } finally {
        setIsSaving(false);
      }
    };

    retry();
  }, [isAuthenticated, token, saveAnalysis, t, router]);

  // ─── Export video ──────────────────────────────────────────
  const handleExportVideo = useCallback(async () => {
    if (!analysisResult?.videoUrl) return;
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return;
    setIsExporting(true);
    try {
      const dest = new FSFile(Paths.cache, `athlifyr_export_${Date.now()}.mp4`);
      const result = await LegacyFS.downloadAsync(
        analysisResult.videoUrl,
        dest.uri
      );
      if (result.status !== 200)
        throw new Error(`Download failed (${result.status})`);
      await Sharing.shareAsync(dest.uri, {
        mimeType: "video/mp4",
        dialogTitle: "Athlifyr Motion Analysis",
        UTI: "public.movie",
      });
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: t("common.error"),
        message: err instanceof Error ? err.message : "Export failed",
      });
    } finally {
      setIsExporting(false);
    }
  }, [analysisResult, t]);

  // ─── Helper: format angle value ─────────────────────────────
  const formatAngle = (val: number | null | undefined): string => {
    if (val == null) return "—";
    return `${Math.round(val)}°`;
  };

  // ─── Render ──────────────────────────────────────────────────

  console.log("[MotionAnalysis] ── RENDER ──", {
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
              setPhase("preview");
              // Resume the player so the preview screen shows video, not a black screen
              if (player) {
                const seekTo = range ? range.startSec : 0;
                player.currentTime = seekTo;
                player.play();
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
          {/* Header */}
          <SafeAreaView edges={["top"]} style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                abortRef.current?.abort();
                router.back();
              }}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {phase === "preview"
                ? t("motionAnalysis.trimTitle")
                : phase === "uploading"
                  ? t("motionAnalysis.analyzingTitle")
                  : t("motionAnalysis.resultsTitle")}
            </Text>
            <View style={{ width: 40 }} />
          </SafeAreaView>

          {/* ── Phase: Preview ───────────────────────────────────── */}
          {phase === "preview" && (
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

              {/* Instructions */}
              <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
                <View style={styles.infoRow}>
                  <Upload size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.instruction}>
                    {t("motionAnalysis.serverAnalysisInstruction")}
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

          {/* ── Phase: Uploading / Processing ────────────────────── */}
          {phase === "uploading" && (
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

              {/* Progress UI */}
              <View style={styles.progressContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primary}
                  style={{ marginBottom: theme.spacing.md }}
                />
                <Text style={styles.progressTitle}>
                  {uploadStep === "uploading"
                    ? t("motionAnalysis.uploadingVideo")
                    : t("motionAnalysis.processingServer")}
                </Text>
                <Text style={styles.progressSubtitle}>
                  {uploadStep === "uploading"
                    ? t("motionAnalysis.uploadingVideoDesc")
                    : t("motionAnalysis.processingServerDesc")}
                </Text>

                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(uploadProgress, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPct}>
                  {Math.round(uploadProgress)}%
                </Text>
              </View>
            </View>
          )}

          {/* ── Phase: Results ───────────────────────────────────── */}
          {phase === "results" && analysisResult && (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Processed video from server */}
              {analysisResult.videoUrl && (
                <View style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}>
                  <ResultVideoPlayer url={analysisResult.videoUrl} />
                </View>
              )}

              {/* Pose stats */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>
                  {t("motionAnalysis.resultsTitle")}
                </Text>

                {/* Detection overview */}
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {analysisResult.pose.framesProcessed}
                    </Text>
                    <Text style={styles.statLabel}>
                      {t("motionAnalysis.framesProcessed")}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {analysisResult.pose.framesWithPose}
                    </Text>
                    <Text style={styles.statLabel}>
                      {t("motionAnalysis.framesWithPose")}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {Math.round(
                        (analysisResult.pose.detectionRate ?? 0) * 100
                      )}
                      %
                    </Text>
                    <Text style={styles.statLabel}>
                      {t("motionAnalysis.detectionRate")}
                    </Text>
                  </View>
                </View>

                {/* Average angles */}
                {analysisResult.pose.averageAngles && (
                  <View style={styles.anglesSection}>
                    <Text style={styles.anglesSectionTitle}>
                      {t("motionAnalysis.averageAngles")}
                    </Text>

                    <View style={styles.anglesGrid}>
                      <AngleRow
                        label={t("motionAnalysis.angles.leftKnee")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.leftKnee
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.rightKnee")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.rightKnee
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.leftHip")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.leftHip
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.rightHip")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.rightHip
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.leftElbow")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.leftElbow
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.rightElbow")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.rightElbow
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.leftShoulder")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.leftShoulder
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.rightShoulder")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.rightShoulder
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.leftAnkle")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.leftAnkle
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.rightAnkle")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.rightAnkle
                        )}
                      />
                      <AngleRow
                        label={t("motionAnalysis.angles.torsoInclination")}
                        value={formatAngle(
                          analysisResult.pose.averageAngles.torsoInclination
                        )}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Save + Export buttons */}
              <SafeAreaView edges={["bottom"]} style={styles.phaseContent}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.exportButton}
                    onPress={handleExportVideo}
                    activeOpacity={0.7}
                    disabled={isExporting || !analysisResult?.videoUrl}
                  >
                    {isExporting ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.textSecondary}
                      />
                    ) : (
                      <Share2 size={20} color={theme.colors.textSecondary} />
                    )}
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
            actions={
              modalConfig.loginAction
                ? [
                    {
                      label: t("motionAnalysis.loginAndReturn"),
                      variant: "primary",
                      onPress: () => {
                        setModalConfig((prev) => ({ ...prev, visible: false }));
                        router.push("/login");
                      },
                    },
                    {
                      label: t("common.cancel"),
                      variant: "outline",
                      onPress: () => {
                        pendingSaveRef.current = null;
                        setModalConfig((prev) => ({ ...prev, visible: false }));
                      },
                    },
                  ]
                : [
                    {
                      label: "OK",
                      variant: "primary",
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

// ─── Sub-components ──────────────────────────────────────────────

/** Plays the processed video URL returned by the server */
function ResultVideoPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.muted = false;
  });

  return (
    <VideoView player={player} style={StyleSheet.absoluteFill} nativeControls />
  );
}

/** A single row showing a joint angle label + value */
function AngleRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.angleRow}>
      <Text style={styles.angleLabel}>{label}</Text>
      <Text style={styles.angleValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  trimContainer: { flex: 1, backgroundColor: "#000" },
  innerContainer: { flex: 1 },

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

  // Main content (no scroll for preview/uploading)
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  // Progress
  progressContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  progressTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: "center",
  },
  progressSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: theme.colors.muted,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressPct: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  // Stats
  statsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  // Angles
  anglesSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  anglesSectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  anglesGrid: {
    gap: 2,
  },
  angleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  angleLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  angleValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
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
