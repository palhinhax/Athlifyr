import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import { ArrowLeft, Save, Info } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { PlaybackControls } from "@/src/components/lift-analysis/PlaybackControls";
import { OverlayToggles } from "@/src/components/lift-analysis/OverlayToggles";
import type {
  PlaybackSpeed,
  OverlayVisibility,
  AnalysisStatus,
} from "@/src/types/lift-analysis";

/**
 * LiftAnalysis – Analysis results screen with overlay visualization.
 *
 * Receives the video URI and trim parameters. Runs analysis pipeline
 * (bar tracking + pose estimation) and displays the results with
 * interactive overlays on the video.
 *
 * NOTE: Full analysis requires native modules (OpenCV + MediaPipe).
 * Currently shows the video with controls and placeholder analysis state.
 * The overlay rendering will use Skia or SVG once native data is available.
 */
export default function LiftAnalysisScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    videoUri: string;
    startMs: string;
    endMs: string;
  }>();

  const videoUri = params.videoUri ?? "";

  const analysisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [overlayVisibility, setOverlayVisibility] = useState<OverlayVisibility>(
    {
      barPath: true,
      skeleton: true,
      angles: true,
    }
  );

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
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
    setIsSaving(true);
    try {
      // In a full implementation, this would save the complete analysis result
      // with bar path, pose data, and angle calculations.
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
  }, [t]);

  const handleRunAnalysis = useCallback(() => {
    // Placeholder: In a full implementation, this triggers the native analysis pipeline.
    setAnalysisStatus("extracting_frames");

    // Simulate analysis progress
    const steps: AnalysisStatus[] = [
      "extracting_frames",
      "tracking_bar",
      "estimating_pose",
      "computing_angles",
      "complete",
    ];
    let stepIndex = 0;

    analysisIntervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setAnalysisStatus(steps[stepIndex]);
      } else {
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
          analysisIntervalRef.current = null;
        }
      }
    }, 1500);
  }, []);

  const getStatusMessage = (status: AnalysisStatus): string => {
    switch (status) {
      case "idle":
        return t("liftAnalysis.analysis.statusIdle");
      case "extracting_frames":
        return t("liftAnalysis.analysis.statusExtractingFrames");
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video with overlays */}
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
          />

          {/* Overlay rendering area (placeholder) */}
          {analysisStatus === "complete" && (
            <View style={styles.overlayContainer} pointerEvents="none">
              {overlayVisibility.barPath && (
                <View style={styles.overlayPlaceholder}>
                  <Text style={styles.overlayPlaceholderText}>
                    {t("liftAnalysis.overlays.barPath")}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Analysis status */}
        {analysisStatus !== "idle" && analysisStatus !== "complete" && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.statusText}>
              {getStatusMessage(analysisStatus)}
            </Text>
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
            <Text style={styles.nativeNote}>
              {t("liftAnalysis.analysis.nativeNote")}
            </Text>
          </View>
        )}

        {/* Overlay toggles (visible when analysis complete) */}
        {analysisStatus === "complete" && (
          <OverlayToggles
            visibility={overlayVisibility}
            onToggle={handleToggleOverlay}
          />
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
    justifyContent: "center",
    alignItems: "center",
  },
  overlayPlaceholder: {
    backgroundColor: `${theme.colors.primary}33`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  overlayPlaceholderText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
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
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
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
  nativeNote: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Controls
  controlsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
});
