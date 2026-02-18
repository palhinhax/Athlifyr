import React, { useEffect, useCallback } from "react";
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
  Activity,
  Trash2,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useMotionAnalysisStore } from "@/src/lib/motion-analysis-store";
import type { MotionAnalysis } from "@/src/types/motion-analysis";

export default function MotionAnalysesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { analyses, isLoaded, load, remove } = useMotionAnalysisStore();

  useEffect(() => {
    if (!isLoaded) {
      load();
    }
  }, [isLoaded, load]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        t("motionAnalysis.deleteTitle"),
        t("motionAnalysis.deleteConfirm"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.delete"),
            style: "destructive",
            onPress: () => remove(id),
          },
        ]
      );
    },
    [t, remove]
  );

  const handleView = useCallback(
    (id: string) => {
      router.push({
        pathname: "/motion-analysis-view",
        params: { id },
      });
    },
    [router]
  );

  const handleNew = useCallback(() => {
    router.push("/camera");
  }, [router]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: MotionAnalysis }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleView(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardIcon}>
          <Activity size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.label || t("motionAnalysis.analysisLabel")}
          </Text>
          <Text style={styles.cardMeta}>
            {formatDate(item.createdAt)} • {item.poseFrames.length}{" "}
            {t("motionAnalysis.frames")} •{" "}
            {(item.metrics.durationMs / 1000).toFixed(1)}s
          </Text>
          <Text style={styles.cardConfidence}>
            {t("motionAnalysis.confidence")}:{" "}
            {Math.round(item.metrics.avgConfidence * 100)}%
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.deleteBtn}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
          <ChevronRight size={20} color={theme.colors.textTertiary} />
        </View>
      </TouchableOpacity>
    ),
    [handleView, handleDelete, t]
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Activity size={56} color={theme.colors.textTertiary} />
        <Text style={styles.emptyTitle}>{t("motionAnalysis.noAnalyses")}</Text>
        <Text style={styles.emptyDescription}>
          {t("motionAnalysis.noAnalysesDescription")}
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleNew}
          activeOpacity={0.7}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.emptyButtonText}>
            {t("motionAnalysis.newAnalysis")}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [t, handleNew]
  );

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
        <Text style={styles.headerTitle}>{t("motionAnalysis.myAnalyses")}</Text>
        <TouchableOpacity
          onPress={handleNew}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={analyses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          analyses.length === 0 ? styles.emptyList : styles.list
        }
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

  // List
  list: { padding: theme.spacing.md, gap: theme.spacing.sm },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  cardConfidence: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  cardActions: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  deleteBtn: {
    padding: 4,
  },

  // Empty
  emptyList: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing["2xl"],
    gap: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
