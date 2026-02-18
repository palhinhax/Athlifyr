import React, { useEffect } from "react";
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
  Plus,
  Trash2,
  Activity,
  Clock,
  ArrowUpDown,
  ArrowLeftRight,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useLiftAnalysisStore } from "@/src/lib/lift-analysis-store";
import type { LiftAnalysis } from "@/src/types/lift-analysis";

export default function LiftAnalysesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { analyses, isLoaded, load, remove } = useLiftAnalysisStore();

  useEffect(() => {
    if (!isLoaded) {
      load();
    }
  }, [isLoaded, load]);

  const handleDelete = (id: string) => {
    Alert.alert(t("common.delete"), t("liftAnalysis.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => remove(id),
      },
    ]);
  };

  const handleView = (analysis: LiftAnalysis) => {
    router.push({
      pathname: "/lift-analysis-view",
      params: { analysisId: analysis.id },
    });
  };

  const renderItem = ({ item }: { item: LiftAnalysis }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handleView(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Activity size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              {item.label || t("liftAnalysis.analysisLabel")}
            </Text>
            <Text style={styles.cardDate}>
              {dateStr} · {timeStr}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteBtn}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Clock size={14} color={theme.colors.textTertiary} />
            <Text style={styles.metricText}>
              {(item.metrics.durationMs / 1000).toFixed(1)}s
            </Text>
          </View>
          <View style={styles.metricItem}>
            <ArrowUpDown size={14} color={theme.colors.textTertiary} />
            <Text style={styles.metricText}>
              {(item.metrics.totalVerticalTravel * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <ArrowLeftRight size={14} color={theme.colors.textTertiary} />
            <Text style={styles.metricText}>
              {(item.metrics.maxHorizontalDrift * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>{t("liftAnalysis.myAnalyses")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/record-lift")}
          activeOpacity={0.7}
          style={styles.addBtn}
        >
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={analyses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Activity size={48} color={theme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>
              {t("liftAnalysis.noAnalyses")}
            </Text>
            <Text style={styles.emptyDescription}>
              {t("liftAnalysis.noAnalysesDescription")}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/record-lift")}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>
                {t("liftAnalysis.recordLift")}
              </Text>
            </TouchableOpacity>
          </View>
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
  addBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  list: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  // Card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  cardDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  // Metrics row
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  // Empty state
  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
