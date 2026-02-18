import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import { Play, Pause, Gauge, Eye, PersonStanding } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { StickmanRenderer } from "@/src/components/motion-analysis/StickmanRenderer";
import { findClosestFrameIndex } from "@/src/lib/pose-utils";
import { WatermarkLogo } from "@/src/components/WatermarkLogo";
import type { PoseFrame, PoseMetrics } from "@/src/types/motion-analysis";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const VIDEO_HEIGHT = Math.min(
  Math.round(SCREEN_WIDTH * (16 / 9)),
  Math.round(SCREEN_HEIGHT * 0.5)
);

const SPEED_OPTIONS = [0.25, 0.5, 1] as const;

type Tab = "overlay" | "replay";

interface PoseResultTabsProps {
  /** Video URI for overlay tab */
  videoUri: string;
  /** Start of segment in ms */
  startMs: number;
  /** End of segment in ms */
  endMs: number;
  /** Detected pose frames */
  poseFrames: PoseFrame[];
  /** Computed metrics */
  metrics: PoseMetrics;
  /** Original video aspect ratio (width/height) for correct coordinate mapping */
  videoAspectRatio?: number;
}

const PoseResultTabsComponent = ({
  videoUri,
  startMs,
  endMs,
  poseFrames,
  metrics,
  videoAspectRatio,
}: PoseResultTabsProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("overlay");
  const [speedIdx, setSpeedIdx] = useState(2); // default 1x
  const speed = SPEED_OPTIONS[speedIdx];

  // ── Playback state ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const currentTimeMsRef = useRef(0);
  const replayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Video player for overlay ──
  // CRITICAL: useVideoPlayer creates a native player. Multiple calls cause crashes.
  // Delay player creation until after mount to avoid race conditions with parent player.
  const [shouldCreatePlayer, setShouldCreatePlayer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldCreatePlayer(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const player = useVideoPlayer(shouldCreatePlayer ? videoUri : "", (p) => {
    if (!shouldCreatePlayer) return;
    p.loop = true;
    p.muted = true;
    p.currentTime = startMs / 1000;
  });

  // Track video playback time
  useEffect(() => {
    if (tab !== "overlay" || !player || !shouldCreatePlayer) return;

    const interval = setInterval(() => {
      try {
        if (player.currentTime !== undefined) {
          const relTime = Math.round(player.currentTime * 1000) - startMs;
          const clamped = Math.max(0, relTime);
          currentTimeMsRef.current = clamped;
          setCurrentTimeMs(clamped);
        }
      } catch {
        // Ignore player access errors
      }
    }, 33); // ~30fps

    return () => clearInterval(interval);
  }, [tab, player, startMs, shouldCreatePlayer]);

  // ── Replay animation ──
  useEffect(() => {
    if (tab !== "replay") {
      if (replayTimerRef.current) {
        clearInterval(replayTimerRef.current);
        replayTimerRef.current = null;
      }
      return;
    }

    if (isPlaying && poseFrames.length > 0) {
      const segmentDuration = endMs - startMs;
      const intervalMs = 33; // ~30fps
      const startTime = Date.now() - currentTimeMsRef.current / speed;

      replayTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) * speed;
        const looped = elapsed % segmentDuration;
        const rounded = Math.round(looped);
        currentTimeMsRef.current = rounded;
        setCurrentTimeMs(rounded);
      }, intervalMs);
    } else {
      if (replayTimerRef.current) {
        clearInterval(replayTimerRef.current);
        replayTimerRef.current = null;
      }
    }

    return () => {
      if (replayTimerRef.current) {
        clearInterval(replayTimerRef.current);
        replayTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isPlaying, speed, poseFrames, endMs, startMs]);

  // Get current frame
  const currentFrameIdx = findClosestFrameIndex(poseFrames, currentTimeMs);
  const currentFrame =
    currentFrameIdx >= 0 ? poseFrames[currentFrameIdx] : null;

  // ── Controls ──
  const togglePlay = useCallback(() => {
    if (tab === "overlay" && player && shouldCreatePlayer) {
      try {
        if (isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      } catch {
        // Ignore player errors
      }
    }
    setIsPlaying((prev) => !prev);
  }, [tab, player, isPlaying, shouldCreatePlayer]);

  const cycleSpeed = useCallback(() => {
    const nextIdx = (speedIdx + 1) % SPEED_OPTIONS.length;
    setSpeedIdx(nextIdx);
    if (tab === "overlay" && player && shouldCreatePlayer) {
      try {
        player.playbackRate = SPEED_OPTIONS[nextIdx];
      } catch {
        // Ignore player errors
      }
    }
  }, [speedIdx, tab, player, shouldCreatePlayer]);

  // ── Video container layout ──
  const [containerLayout, setContainerLayout] = useState({
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  });

  // ── Handle tab switch ──
  // When switching back to overlay, re-seek the player to avoid black screen
  const handleTabChange = useCallback(
    (newTab: Tab) => {
      if (newTab === tab) return;

      if (newTab === "overlay" && player && shouldCreatePlayer) {
        // Stop replay timer
        setIsPlaying(false);
        // Re-seek player to current position to ensure video is visible
        try {
          player.currentTime = (startMs + currentTimeMsRef.current) / 1000;
        } catch {
          // Ignore player errors
        }
      }

      if (newTab === "replay") {
        // Pause the video player when going to replay
        setIsPlaying(false);
        try {
          if (player && shouldCreatePlayer) {
            player.pause();
          }
        } catch {
          // Ignore player errors
        }
      }

      setTab(newTab);
    },
    [tab, player, shouldCreatePlayer, startMs]
  );

  // ── Scrub slider ──
  const segmentDuration = endMs - startMs;
  const scrubProgress =
    segmentDuration > 0 ? currentTimeMs / segmentDuration : 0;

  const handleScrub = useCallback(
    (evt: { nativeEvent: { locationX: number } }) => {
      const frac = evt.nativeEvent.locationX / (SCREEN_WIDTH - 32);
      const newTime = Math.round(
        Math.max(0, Math.min(1, frac)) * segmentDuration
      );
      currentTimeMsRef.current = newTime;
      setCurrentTimeMs(newTime);
      if (tab === "overlay" && player && shouldCreatePlayer) {
        try {
          player.currentTime = (startMs + newTime) / 1000;
        } catch {
          // Ignore player errors
        }
      }
    },
    [segmentDuration, tab, player, startMs, shouldCreatePlayer]
  );

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "overlay" && styles.tabActive]}
          onPress={() => handleTabChange("overlay")}
          activeOpacity={0.7}
        >
          <Eye
            size={16}
            color={
              tab === "overlay"
                ? theme.colors.primary
                : theme.colors.textTertiary
            }
          />
          <Text
            style={[styles.tabText, tab === "overlay" && styles.tabTextActive]}
          >
            {t("motionAnalysis.overlayTab")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "replay" && styles.tabActive]}
          onPress={() => handleTabChange("replay")}
          activeOpacity={0.7}
        >
          <PersonStanding
            size={16}
            color={
              tab === "replay"
                ? theme.colors.primary
                : theme.colors.textTertiary
            }
          />
          <Text
            style={[styles.tabText, tab === "replay" && styles.tabTextActive]}
          >
            {t("motionAnalysis.replayTab")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Viewport */}
      <View
        style={[styles.viewport, { height: containerLayout.height }]}
        onLayout={(e) =>
          setContainerLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        {tab === "overlay" ? (
          <>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <VideoView
                player={player}
                style={StyleSheet.absoluteFill}
                nativeControls={false}
              />
            </View>
            {currentFrame && (
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <StickmanRenderer
                  frame={currentFrame}
                  width={containerLayout.width}
                  height={containerLayout.height}
                  mode="overlay"
                  videoAspectRatio={videoAspectRatio}
                  boneColor="#00FF88"
                  boneWidth={2}
                  jointRadius={4}
                  boneOpacity={0.6}
                  jointOpacity={0.7}
                />
              </View>
            )}
          </>
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.replayBg]}>
            {currentFrame && (
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <StickmanRenderer
                  frame={currentFrame}
                  width={containerLayout.width}
                  height={containerLayout.height}
                  mode="replay"
                  boneColor="#00FF88"
                  boneWidth={4}
                  jointRadius={7}
                  jointColor="#FFFFFF"
                  boneOpacity={0.95}
                  jointOpacity={0.95}
                />
              </View>
            )}
          </View>
        )}
        {/* Watermark — always visible over the viewport */}
        <WatermarkLogo />
      </View>

      {/* Scrub bar */}
      <Pressable style={styles.scrubContainer} onPress={handleScrub}>
        <View style={styles.scrubTrack}>
          <View
            style={[styles.scrubFill, { width: `${scrubProgress * 100}%` }]}
          />
        </View>
      </Pressable>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={togglePlay}
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Pause size={24} color={theme.colors.text} />
          ) : (
            <Play size={24} color={theme.colors.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.speedButton}
          onPress={cycleSpeed}
          activeOpacity={0.7}
        >
          <Gauge size={16} color={theme.colors.textSecondary} />
          <Text style={styles.speedText}>{speed}x</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics summary */}
      <View style={styles.metricsCard}>
        <Text style={styles.metricsTitle}>
          {t("motionAnalysis.metricsTitle")}
        </Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>
              {t("motionAnalysis.confidence")}
            </Text>
            <Text style={styles.metricValue}>
              {Math.round(metrics.avgConfidence * 100)}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>
              {t("motionAnalysis.duration")}
            </Text>
            <Text style={styles.metricValue}>
              {(metrics.durationMs / 1000).toFixed(1)}s
            </Text>
          </View>
          {metrics.maxKneeFlexion !== null && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>
                {t("motionAnalysis.kneeFlexion")}
              </Text>
              <Text style={styles.metricValue}>
                {metrics.maxKneeFlexion.toFixed(0)}°
              </Text>
            </View>
          )}
          {metrics.torsoAngleRange !== null && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>
                {t("motionAnalysis.torsoRange")}
              </Text>
              <Text style={styles.metricValue}>
                {metrics.torsoAngleRange[0].toFixed(0)}°–
                {metrics.torsoAngleRange[1].toFixed(0)}°
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },

  // Tabs
  tabRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginHorizontal: theme.spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  // Viewport
  viewport: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  replayBg: {
    backgroundColor: "#1a1a2e",
  },

  // Scrub
  scrubContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  scrubTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  scrubFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  // Controls
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  speedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.muted,
  },
  speedText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  // Metrics
  metricsCard: {
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
  },
  metricsTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  metricItem: {
    minWidth: "45%",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
});

// Export memoized version to prevent unnecessary re-renders
// which cause multiple video player instances and crashes
export const PoseResultTabs = React.memo(
  PoseResultTabsComponent,
  (prevProps, nextProps) =>
    prevProps.videoUri === nextProps.videoUri &&
    prevProps.startMs === nextProps.startMs &&
    prevProps.endMs === nextProps.endMs &&
    prevProps.poseFrames === nextProps.poseFrames &&
    prevProps.metrics === nextProps.metrics &&
    prevProps.videoAspectRatio === nextProps.videoAspectRatio
);
