import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useVideoPlayer, VideoView } from "expo-video";
import { ArrowLeft, Trash2, Play, Pause } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { BarPathOverlay } from "@/src/components/lift-analysis/BarPathOverlay";
import { LiftMetricsCard } from "@/src/components/lift-analysis/LiftMetricsCard";
import { useLiftAnalysisStore } from "@/src/lib/lift-analysis-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = Math.round(SCREEN_WIDTH * (16 / 9));

export default function LiftAnalysisViewScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ analysisId: string }>();
  const { getById, remove, load, isLoaded } = useLiftAnalysisStore();

  useEffect(() => {
    if (!isLoaded) {
      load();
    }
  }, [isLoaded, load]);

  const analysis = getById(params.analysisId ?? "");
  const videoUri = analysis?.videoUri ?? "";

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTimeMs, setPlaybackTimeMs] = useState(0);
  const [containerLayout, setContainerLayout] = useState({
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  });

  // Track playback time
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      if (player.currentTime !== undefined) {
        setPlaybackTimeMs(Math.round(player.currentTime * 1000));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [player]);

  const togglePlayback = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  }, [player, isPlaying]);

  const handleDelete = useCallback(() => {
    if (!analysis) return;
    Alert.alert(t("common.delete"), t("liftAnalysis.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await remove(analysis.id);
          router.back();
        },
      },
    ]);
  }, [analysis, remove, router, t]);

  if (!analysis) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("liftAnalysis.analysisLabel")}
          </Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("liftAnalysis.notFound")}</Text>
        </View>
      </View>
    );
  }

  const date = new Date(analysis.createdAt);
  const dateStr = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

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
          {analysis.label || t("liftAnalysis.analysisLabel")}
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          activeOpacity={0.7}
          style={styles.deleteBtn}
        >
          <Trash2 size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Video + Overlay */}
        <View
          style={[styles.videoContainer, { height: containerLayout.height }]}
          onLayout={(e) =>
            setContainerLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            nativeControls={false}
          />
          <BarPathOverlay
            path={analysis.barPath}
            width={containerLayout.width}
            height={containerLayout.height}
            currentTimeMs={playbackTimeMs}
            strokeColor="#00FF88"
            strokeWidth={3}
          />

          {/* Play/Pause overlay button */}
          <TouchableOpacity
            style={styles.playOverlay}
            onPress={togglePlayback}
            activeOpacity={0.8}
          >
            {isPlaying ? (
              <Pause size={32} color="#fff" />
            ) : (
              <Play size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Date info */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>
            {dateStr} · {timeStr}
          </Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <LiftMetricsCard metrics={analysis.metrics} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

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
    flex: 1,
    textAlign: "center",
  },
  deleteBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing["2xl"] },

  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  playOverlay: {
    position: "absolute",
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  dateRow: {
    padding: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: "center",
  },

  metricsContainer: {
    padding: theme.spacing.md,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
});
