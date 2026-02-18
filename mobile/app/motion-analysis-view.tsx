import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Trash2, Share2 } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { PoseResultTabs } from "@/src/components/motion-analysis/PoseResultTabs";
import { useMotionAnalysisStore } from "@/src/lib/motion-analysis-store";
import type { MotionAnalysis } from "@/src/types/motion-analysis";

export default function MotionAnalysisViewScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { load, isLoaded, getById, remove } = useMotionAnalysisStore();
  const [analysis, setAnalysis] = useState<MotionAnalysis | undefined>();

  useEffect(() => {
    if (!isLoaded) {
      load().then(() => {
        if (params.id) {
          setAnalysis(useMotionAnalysisStore.getState().getById(params.id));
        }
      });
    } else if (params.id) {
      setAnalysis(getById(params.id));
    }
  }, [isLoaded, load, getById, params.id]);

  const handleDelete = useCallback(() => {
    if (!analysis) return;
    Alert.alert(
      t("motionAnalysis.deleteTitle"),
      t("motionAnalysis.deleteConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await remove(analysis.id);
            router.back();
          },
        },
      ]
    );
  }, [analysis, remove, router, t]);

  const handleExportJSON = useCallback(async () => {
    if (!analysis) return;

    const exportData = {
      id: analysis.id,
      video: {
        uri: analysis.videoUri,
        startMs: analysis.segment.startMs,
        endMs: analysis.segment.endMs,
        sampleFps: analysis.sampleFps,
      },
      frames: analysis.poseFrames.map((f) => ({
        t: f.t,
        keypoints: f.keypoints.map((kp) => ({
          name: kp.name,
          x: kp.x,
          y: kp.y,
          score: kp.score,
        })),
      })),
    };

    // For now, log it — a Share sheet or file export can be added later
    console.log("Motion Analysis Export:", JSON.stringify(exportData));
    Alert.alert(
      t("motionAnalysis.exported"),
      t("motionAnalysis.exportedMessage")
    );
  }, [analysis, t]);

  if (!analysis) {
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
            {t("motionAnalysis.analysisLabel")}
          </Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t("motionAnalysis.notFound")}</Text>
        </View>
      </View>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {analysis.label || t("motionAnalysis.analysisLabel")}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleExportJSON}
            activeOpacity={0.7}
            style={styles.headerActionBtn}
          >
            <Share2 size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            style={styles.headerActionBtn}
          >
            <Trash2 size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date info */}
        <Text style={styles.dateText}>{formatDate(analysis.createdAt)}</Text>

        {/* Pose result tabs with playback */}
        <PoseResultTabs
          videoUri={analysis.videoUri}
          startMs={analysis.segment.startMs}
          endMs={analysis.segment.endMs}
          poseFrames={analysis.poseFrames}
          metrics={analysis.metrics}
        />
      </ScrollView>
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
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  // Content
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing["2xl"] },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: "center",
    paddingVertical: theme.spacing.sm,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing["2xl"],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
});
