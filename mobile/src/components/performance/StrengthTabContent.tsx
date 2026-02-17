import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { TrendingUp, Dumbbell } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { type PerformanceSummary } from "@/src/hooks/usePerformance";
import { PerformanceEntriesList } from "./PerformanceEntriesList";

interface StrengthTabContentProps {
  summary: PerformanceSummary;
}

export function StrengthTabContent({ summary }: StrengthTabContentProps) {
  const { t } = useTranslation();
  const { strength, entries } = summary;
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    strength.exercises.length > 0 ? strength.exercises[0].exerciseId : null
  );

  if (strength.totalEntries === 0) {
    return null;
  }

  const selectedExercise = strength.exercises.find(
    (ex) => ex.exerciseId === selectedExerciseId
  );

  return (
    <View style={styles.container}>
      {/* Exercise Selector */}
      {strength.exercises.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.exerciseTabs}
          contentContainerStyle={styles.exerciseTabsContent}
        >
          {strength.exercises.map((ex) => (
            <TouchableOpacity
              key={ex.exerciseId}
              style={[
                styles.exerciseTab,
                selectedExerciseId === ex.exerciseId &&
                  styles.exerciseTabActive,
              ]}
              onPress={() => setSelectedExerciseId(ex.exerciseId)}
            >
              <Text
                style={[
                  styles.exerciseTabText,
                  selectedExerciseId === ex.exerciseId &&
                    styles.exerciseTabTextActive,
                ]}
                numberOfLines={1}
              >
                {ex.exerciseName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* E1RM Prediction */}
      {selectedExercise?.e1rmPrediction && (
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>
            🏋️ {t("performance.strength.estimatedE1rm")}
          </Text>
          <Text style={styles.predictionValue}>
            {selectedExercise.e1rmPrediction.currentE1rmKg.toFixed(1)} kg
          </Text>
          <Text style={styles.predictionMeta}>
            {t(
              `performance.confidence.${selectedExercise.e1rmPrediction.confidence.toLowerCase()}`
            )}{" "}
            ·{" "}
            {t("performance.strength.basedOn", {
              count: selectedExercise.e1rmPrediction.inputsUsedCount,
            })}
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{strength.totalEntries}</Text>
          <Text style={styles.statLabel}>
            {t("performance.strength.totalSets")}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Dumbbell size={18} color={theme.colors.primary} />
          <Text style={styles.statValue}>{strength.exercises.length}</Text>
          <Text style={styles.statLabel}>
            {t("performance.strength.exercisesTracked")}
          </Text>
        </View>
      </View>

      {/* Entries List */}
      <PerformanceEntriesList entries={entries} type="STRENGTH" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  exerciseTabs: {
    maxHeight: 44,
  },
  exerciseTabsContent: {
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.md,
  },
  exerciseTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  exerciseTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  exerciseTabTextActive: {
    color: theme.colors.white,
  },
  predictionCard: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  predictionValue: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  predictionMeta: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.textTertiary,
    textAlign: "center",
  },
});
