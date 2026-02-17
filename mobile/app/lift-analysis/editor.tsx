import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import { ArrowLeft, Scissors, Check } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { PlaybackControls } from "@/src/components/lift-analysis/PlaybackControls";
import type { PlaybackSpeed } from "@/src/types/lift-analysis";

/**
 * LiftEditor – Video trim and preview screen.
 *
 * Receives a video URI from the camera screen or gallery picker.
 * Allows the user to:
 * - Preview the recorded video
 * - Set start/end trim points
 * - Toggle slow motion playback (0.25x, 0.5x, 1x)
 * - Confirm and proceed to analysis
 *
 * NOTE: Full trim functionality requires the native VideoTrimmer module
 * (FFmpegKit). Currently shows the preview and playback controls.
 */
export default function LiftEditorScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ videoUri: string }>();
  const videoUri = params.videoUri ?? "";

  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const startMs = 0;
  const endMs = 0;
  const trimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (trimTimerRef.current) {
        clearTimeout(trimTimerRef.current);
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

  const handleConfirmTrim = useCallback(() => {
    setIsProcessing(true);

    // In a full implementation, this would use the native VideoTrimmer
    // to create a trimmed video file. For now, pass through the original URI.
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

      {/* Trim Controls (placeholder) */}
      <View style={styles.trimSection}>
        <View style={styles.trimHeader}>
          <Scissors size={16} color={theme.colors.textSecondary} />
          <Text style={styles.trimLabel}>
            {t("liftAnalysis.editor.trimHint")}
          </Text>
        </View>

        {/* Trim timeline placeholder */}
        <View style={styles.trimTimeline}>
          <View style={styles.trimTrack}>
            <View style={styles.trimHandle} />
            <View style={styles.trimSelectedRange} />
            <View style={[styles.trimHandle, styles.trimHandleEnd]} />
          </View>
        </View>
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
    height: 44,
    justifyContent: "center",
  },
  trimTrack: {
    height: 32,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  trimHandle: {
    width: 12,
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  trimHandleEnd: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  trimSelectedRange: {
    flex: 1,
    height: "100%",
    backgroundColor: `${theme.colors.primary}20`,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.primary,
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
