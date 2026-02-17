import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  ChevronRight,
  Activity,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "@/src/constants/theme";
import { useAnalysisStorage } from "@/src/hooks/useAnalysisStorage";
import type { LiftAnalysisResult } from "@/src/types/lift-analysis";

type AnalysisSummary = Pick<
  LiftAnalysisResult,
  "id" | "createdAt" | "videoUriTrimmed"
>;

/**
 * AnalysisHistory – List of past lift analyses.
 *
 * Shows all saved analysis results with the option to reopen or delete them.
 * Also provides a button to start a new analysis recording.
 */
export default function AnalysisHistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { listAnalyses, deleteAnalysis } = useAnalysisStorage();

  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);

  const loadAnalyses = useCallback(async () => {
    const results = await listAnalyses();
    setAnalyses(results);
  }, [listAnalyses]);

  useEffect(() => {
    loadAnalyses();
  }, [loadAnalyses]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        t("liftAnalysis.history.deleteTitle"),
        t("liftAnalysis.history.deleteConfirm"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.delete"),
            style: "destructive",
            onPress: async () => {
              await deleteAnalysis(id);
              await loadAnalyses();
            },
          },
        ]
      );
    },
    [deleteAnalysis, loadAnalyses, t]
  );

  const handleNewRecording = useCallback(() => {
    router.push("/lift-analysis/camera");
  }, [router]);

  const handleUploadVideo = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        videoMaxDuration: 120,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        router.push({
          pathname: "/lift-analysis/editor",
          params: { videoUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      console.error("Failed to pick video:", error);
      Alert.alert(t("common.error"), t("liftAnalysis.history.uploadFailed"));
    }
  }, [router, t]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAnalysisItem = ({ item }: { item: AnalysisSummary }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() =>
          router.push({
            pathname: "/lift-analysis/analysis",
            params: { videoUri: item.videoUriTrimmed },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardIcon}>
          <Activity size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            {t("liftAnalysis.history.analysisLabel")}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <ChevronRight size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        activeOpacity={0.7}
      >
        <Trash2 size={16} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Activity size={48} color={theme.colors.border} />
      <Text style={styles.emptyTitle}>
        {t("liftAnalysis.history.emptyTitle")}
      </Text>
      <Text style={styles.emptyDescription}>
        {t("liftAnalysis.history.emptyDescription")}
      </Text>
    </View>
  );

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
          {t("liftAnalysis.history.title")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* New Recording CTA */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.newRecordingButton}
          onPress={handleNewRecording}
          activeOpacity={0.7}
        >
          <Camera size={20} color={theme.colors.white} />
          <Text style={styles.newRecordingText}>
            {t("liftAnalysis.history.newRecording")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadVideo}
          activeOpacity={0.7}
        >
          <Upload size={20} color={theme.colors.primary} />
          <Text style={styles.uploadButtonText}>
            {t("liftAnalysis.history.uploadVideo")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Analysis List */}
      <FlatList
        data={analyses}
        keyExtractor={(item) => item.id}
        renderItem={renderAnalysisItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  headerSpacer: {
    width: 32,
  },

  // New recording & upload
  actionButtons: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  newRecordingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  newRecordingText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  uploadButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },

  // List
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing["2xl"],
    flexGrow: 1,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  cardDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: theme.spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingTop: theme.spacing["3xl"],
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
    lineHeight: 20,
  },
});
