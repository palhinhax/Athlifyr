import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Trophy, Plus } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { usePerformance } from "@/src/hooks/usePerformance";
import { EmptyState } from "./EmptyState";
import { RunTabContent } from "../performance/RunTabContent";
import { TrailTabContent } from "../performance/TrailTabContent";
import { StrengthTabContent } from "../performance/StrengthTabContent";
import { HyroxTabContent } from "../performance/HyroxTabContent";
import { AddRunSheet } from "../performance/AddRunSheet";
import { AddStrengthSheet } from "../performance/AddStrengthSheet";
import { AddHyroxSheet } from "../performance/AddHyroxSheet";

type SportType = "RUNNING" | "TRAIL" | "STRENGTH" | "HYROX";

export function PerformanceSection() {
  const { t } = useTranslation();
  const { summary, isLoading } = usePerformance();
  const [selectedSport, setSelectedSport] = useState<SportType>("RUNNING");

  // Add sheet visibility states
  const [showAddRun, setShowAddRun] = useState(false);
  const [showAddTrail, setShowAddTrail] = useState(false);
  const [showAddStrength, setShowAddStrength] = useState(false);
  const [showAddHyrox, setShowAddHyrox] = useState(false);

  const sportTabs: { key: SportType; label: string }[] = [
    { key: "RUNNING", label: t("sports.RUNNING") },
    { key: "TRAIL", label: t("sports.TRAIL") },
    { key: "STRENGTH", label: t("profile.strength") },
    { key: "HYROX", label: t("sports.HYROX") },
  ];

  const handleAdd = () => {
    switch (selectedSport) {
      case "RUNNING":
        setShowAddRun(true);
        break;
      case "TRAIL":
        setShowAddTrail(true);
        break;
      case "STRENGTH":
        setShowAddStrength(true);
        break;
      case "HYROX":
        setShowAddHyrox(true);
        break;
    }
  };

  const hasDataForTab = (): boolean => {
    if (!summary) return false;
    switch (selectedSport) {
      case "RUNNING":
        return summary.run.totalEntries > 0;
      case "TRAIL":
        return summary.trail.totalEntries > 0;
      case "STRENGTH":
        return summary.strength.totalEntries > 0;
      case "HYROX":
        return summary.hyrox.totalEntries > 0;
      default:
        return false;
    }
  };

  const getEmptyTitle = (): string => {
    switch (selectedSport) {
      case "RUNNING":
        return t("performance.run.noData");
      case "TRAIL":
        return t("performance.trail.noData");
      case "STRENGTH":
        return t("performance.strength.noData");
      case "HYROX":
        return t("performance.hyrox.noData");
      default:
        return "";
    }
  };

  const getEmptyDescription = (): string => {
    switch (selectedSport) {
      case "RUNNING":
        return t("performance.run.noDataDesc");
      case "TRAIL":
        return t("performance.trail.noDataDesc");
      case "STRENGTH":
        return t("performance.strength.noDataDesc");
      case "HYROX":
        return t("performance.hyrox.noDataDesc");
      default:
        return "";
    }
  };

  const renderTabContent = () => {
    if (!summary) return null;

    switch (selectedSport) {
      case "RUNNING":
        return <RunTabContent summary={summary} />;
      case "TRAIL":
        return <TrailTabContent summary={summary} />;
      case "STRENGTH":
        return <StrengthTabContent summary={summary} />;
      case "HYROX":
        return <HyroxTabContent summary={summary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.section}>
      {/* Header with Add button */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <Trophy size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>{t("profile.performance")}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.7}
        >
          <Plus size={18} color={theme.colors.white} />
          <Text style={styles.addButtonText}>{t("performance.add")}</Text>
        </TouchableOpacity>
      </View>

      {/* Sport Tabs */}
      <View style={styles.sportTabs}>
        {sportTabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.sportTab,
              selectedSport === tab.key && styles.sportTabActive,
            ]}
            onPress={() => setSelectedSport(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.sportTabText,
                selectedSport === tab.key && styles.sportTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("performance.loading")}</Text>
        </View>
      ) : hasDataForTab() ? (
        renderTabContent()
      ) : (
        <EmptyState
          icon={<Trophy size={48} color={theme.colors.textSecondary} />}
          title={getEmptyTitle()}
          description={getEmptyDescription()}
        />
      )}

      {/* Add Sheets */}
      <AddRunSheet visible={showAddRun} onClose={() => setShowAddRun(false)} />
      <AddRunSheet
        visible={showAddTrail}
        onClose={() => setShowAddTrail(false)}
        isTrail
      />
      <AddStrengthSheet
        visible={showAddStrength}
        onClose={() => setShowAddStrength(false)}
      />
      <AddHyroxSheet
        visible={showAddHyrox}
        onClose={() => setShowAddHyrox(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
  sportTabs: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  sportTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  sportTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sportTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  sportTabTextActive: {
    color: theme.colors.white,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
});
