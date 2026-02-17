import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Play, Pause } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { PlaybackSpeed } from "@/src/types/lift-analysis";

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onTogglePlay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 1];

/**
 * PlaybackControls – Play/pause button and speed selector for video playback.
 * Used in both LiftEditor and LiftAnalysis screens.
 */
export function PlaybackControls({
  isPlaying,
  speed,
  onTogglePlay,
  onSpeedChange,
}: PlaybackControlsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Play/Pause button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={onTogglePlay}
        activeOpacity={0.7}
        accessibilityLabel={
          isPlaying
            ? t("liftAnalysis.playback.pause")
            : t("liftAnalysis.playback.play")
        }
      >
        {isPlaying ? (
          <Pause size={24} color={theme.colors.white} />
        ) : (
          <Play size={24} color={theme.colors.white} />
        )}
      </TouchableOpacity>

      {/* Speed selector */}
      <View style={styles.speedContainer}>
        {SPEEDS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.speedButton, speed === s && styles.speedButtonActive]}
            onPress={() => onSpeedChange(s)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.speedText,
                speed === s && styles.speedTextActive,
              ]}
            >
              {s === 1 ? "1x" : `${s}x`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  speedContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: 2,
  },
  speedButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  speedButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  speedText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  speedTextActive: {
    color: theme.colors.white,
  },
});
