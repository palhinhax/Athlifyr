import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutChangeEvent,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import { ArrowLeft, Scissors, Check } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { PlaybackControls } from "@/src/components/lift-analysis/PlaybackControls";
import type { PlaybackSpeed } from "@/src/types/lift-analysis";

const HANDLE_WIDTH = 16;
const MIN_TRIM_FRACTION = 0.05; // Minimum 5% of track width between handles

/**
 * LiftEditor – Video trim and preview screen.
 *
 * Receives a video URI from the camera screen or gallery picker.
 * Allows the user to:
 * - Preview the recorded video
 * - Drag handles to set start/end trim points
 * - Toggle slow motion playback (0.25x, 0.5x, 1x)
 * - Confirm and proceed to analysis
 */
export default function LiftEditorScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ videoUri: string }>();
  const videoUri = params.videoUri ?? "";

  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Trim state as fractions 0–1
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const [trackWidth, setTrackWidth] = useState(
    Dimensions.get("window").width - 64
  );
  const [videoDurationMs, setVideoDurationMs] = useState(0);

  const trimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef({ startFraction: 0, endFraction: 1 });

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
  });

  // Try to get video duration
  useEffect(() => {
    const checkDuration = setInterval(() => {
      try {
        const dur = player.duration;
        if (dur > 0) {
          setVideoDurationMs(dur * 1000);
          clearInterval(checkDuration);
        }
      } catch {
        // Player not ready yet
      }
    }, 200);

    return () => {
      clearInterval(checkDuration);
      if (trimTimerRef.current) {
        clearTimeout(trimTimerRef.current);
      }
    };
  }, [player]);

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

  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width - HANDLE_WIDTH * 2);
  }, []);

  // Pan responder for start handle
  const startHandlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartRef.current.startFraction = trimStart;
      },
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const delta = gestureState.dx / trackWidth;
        const newStart = Math.max(
          0,
          Math.min(
            dragStartRef.current.startFraction + delta,
            trimEnd - MIN_TRIM_FRACTION
          )
        );
        setTrimStart(newStart);
      },
      onPanResponderRelease: () => {
        // Seek video to new start position
        if (videoDurationMs > 0) {
          try {
            player.currentTime = (trimStart * videoDurationMs) / 1000;
          } catch {
            // Player may not support seeking
          }
        }
      },
    })
  ).current;

  // Pan responder for end handle
  const endHandlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartRef.current.endFraction = trimEnd;
      },
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const delta = gestureState.dx / trackWidth;
        const newEnd = Math.min(
          1,
          Math.max(
            dragStartRef.current.endFraction + delta,
            trimStart + MIN_TRIM_FRACTION
          )
        );
        setTrimEnd(newEnd);
      },
      onPanResponderRelease: () => {
        // Seek video to near end position for preview
        if (videoDurationMs > 0) {
          try {
            player.currentTime =
              (Math.max(0, trimEnd - 0.02) * videoDurationMs) / 1000;
          } catch {
            // Player may not support seeking
          }
        }
      },
    })
  ).current;

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const startMs = Math.round(trimStart * videoDurationMs);
  const endMs = Math.round(trimEnd * videoDurationMs);

  const handleConfirmTrim = useCallback(() => {
    setIsProcessing(true);

    // Pass through the original URI with trim parameters.
    // Full trim would use the native VideoTrimmer (FFmpegKit).
    trimTimerRef.current = setTimeout(() => {
      setIsProcessing(false);
      router.push({
        pathname: "/lift-analysis/analysis",
        params: {
          videoUri,
          startMs: String(startMs),
          endMs: String(endMs),
        },
      });
    }, 500);
  }, [videoUri, startMs, endMs, router]);

  if (!videoUri) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("liftAnalysis.editor.noVideo")}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>{t("liftAnalysis.editor.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Video Preview */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />
      </View>

      {/* Trim Controls */}
      <View style={styles.trimSection}>
        <View style={styles.trimHeader}>
          <Scissors size={16} color={theme.colors.textSecondary} />
          <Text style={styles.trimLabel}>
            {t("liftAnalysis.editor.trimHint")}
          </Text>
        </View>

        {/* Trim timeline with draggable handles */}
        <View style={styles.trimTimeline} onLayout={handleTrackLayout}>
          {/* Background track */}
          <View style={styles.trimTrack}>
            {/* Dimmed left region (before start) */}
            <View
              style={[styles.trimDimmed, { width: `${trimStart * 100}%` }]}
            />

            {/* Start handle */}
            <View
              style={[
                styles.trimHandleContainer,
                { left: `${trimStart * 100}%` },
              ]}
              {...startHandlePanResponder.panHandlers}
            >
              <View style={[styles.trimHandle, styles.trimHandleStart]} />
            </View>

            {/* Selected range */}
            <View
              style={[
                styles.trimSelectedRange,
                {
                  left: `${trimStart * 100}%`,
                  width: `${(trimEnd - trimStart) * 100}%`,
                },
              ]}
            />

            {/* End handle */}
            <View
              style={[
                styles.trimHandleContainer,
                { left: `${trimEnd * 100}%`, marginLeft: -HANDLE_WIDTH },
              ]}
              {...endHandlePanResponder.panHandlers}
            >
              <View style={[styles.trimHandle, styles.trimHandleEnd]} />
            </View>

            {/* Dimmed right region (after end) */}
            <View
              style={[
                styles.trimDimmed,
                styles.trimDimmedRight,
                { width: `${(1 - trimEnd) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Time labels */}
        {videoDurationMs > 0 && (
          <View style={styles.trimTimeRow}>
            <Text style={styles.trimTimeText}>{formatTime(startMs)}</Text>
            <Text style={styles.trimDurationText}>
              {formatTime(endMs - startMs)}
            </Text>
            <Text style={styles.trimTimeText}>{formatTime(endMs)}</Text>
          </View>
        )}
      </View>

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={handleTogglePlay}
        onSpeedChange={handleSpeedChange}
      />

      {/* Confirm Button */}
      <View style={styles.confirmSection}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmTrim}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <>
              <Check size={20} color={theme.colors.white} />
              <Text style={styles.confirmButtonText}>
                {t("liftAnalysis.editor.analyze")}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  backButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
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
  headerSpacer: {
    width: 32,
  },

  // Video
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },

  // Trim
  trimSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  trimHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  trimLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  trimTimeline: {
    height: 48,
    justifyContent: "center",
  },
  trimTrack: {
    height: 36,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  trimDimmed: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  trimDimmedRight: {
    left: "auto" as unknown as number,
    right: 0,
  },
  trimHandleContainer: {
    position: "absolute",
    top: -4,
    bottom: -4,
    width: HANDLE_WIDTH,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trimHandle: {
    width: HANDLE_WIDTH,
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  trimHandleStart: {
    borderTopLeftRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  trimHandleEnd: {
    borderTopRightRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  trimSelectedRange: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: `${theme.colors.primary}18`,
    borderTopWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: theme.colors.primary,
    zIndex: 2,
  },
  trimTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  trimTimeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  trimDurationText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    fontVariant: ["tabular-nums"],
  },

  // Confirm
  confirmSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
