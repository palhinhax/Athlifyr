import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Dumbbell,
  Globe,
  Bookmark,
  Play,
  User,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { CachedAvatar } from "@/src/components/CachedImage";
import type { WorkoutItem } from "@/src/hooks/useWorkouts";
import { useToggleSaveWorkout } from "@/src/hooks/useWorkouts";
import { useAuthStore } from "@/src/lib/auth-store";

// Block type colors
const BLOCK_TYPE_COLORS: Record<string, string> = {
  WARMUP: "#10b981",
  STRENGTH: "#ef4343",
  AMRAP: "#f59e0b",
  EMOM: "#8b5cf6",
  FOR_TIME: "#3b82f6",
  TABATA: "#ec4899",
  CHIPPER: "#f97316",
  REST: "#6b7280",
  COOLDOWN: "#06b6d4",
  SKILL: "#14b8a6",
};

interface WorkoutCardProps {
  workout: WorkoutItem;
  canSave?: boolean;
  onPress?: () => void;
}

export function WorkoutCard({
  workout,
  canSave = false,
  onPress,
}: WorkoutCardProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleSave = useToggleSaveWorkout();
  const [isSaved, setIsSaved] = useState(workout.isSaved);

  const totalExercises = workout.blocks.reduce(
    (sum, block) => sum + block.exercises.length,
    0
  );

  const blockTypes = [...new Set(workout.blocks.map((b) => b.type))];

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      Alert.alert(
        t("workouts.loginToSave"),
        t("workouts.loginToSaveDescription")
      );
      return;
    }

    const newSaved = !isSaved;
    setIsSaved(newSaved);

    toggleSave.mutate(
      { workoutId: workout.id, currentlySaved: isSaved },
      {
        onError: () => {
          setIsSaved(isSaved); // revert
          Alert.alert(t("workouts.errors.saveFailed"));
        },
      }
    );
  };

  const difficultyColors = [
    theme.colors.success, // 1 - Easy
    theme.colors.success, // 2 - Easy
    "#f59e0b", // 3 - Moderate
    theme.colors.error, // 4 - Hard
    theme.colors.error, // 5 - Elite
  ];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {workout.name}
          </Text>
          {workout.description && (
            <Text style={styles.description} numberOfLines={2}>
              {workout.description}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          {canSave && (
            <TouchableOpacity
              onPress={handleSaveToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.saveButton}
            >
              <Bookmark
                size={20}
                color={
                  isSaved ? theme.colors.accent : theme.colors.textSecondary
                }
                fill={isSaved ? theme.colors.accent : "none"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Block Type Badges */}
      {blockTypes.length > 0 && (
        <View style={styles.badgeContainer}>
          {blockTypes.map((type) => (
            <View
              key={type}
              style={[
                styles.badge,
                {
                  backgroundColor: `${BLOCK_TYPE_COLORS[type] || theme.colors.muted}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      BLOCK_TYPE_COLORS[type] || theme.colors.textSecondary,
                  },
                ]}
              >
                {t(`workouts.blocks.${type}`)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {workout.estimatedTime != null && workout.estimatedTime > 0 && (
          <View style={styles.stat}>
            <Clock size={14} color={theme.colors.info} />
            <Text style={styles.statText}>{workout.estimatedTime} min</Text>
          </View>
        )}
        <View style={styles.stat}>
          <Dumbbell size={14} color={theme.colors.primary} />
          <Text style={styles.statText}>
            {totalExercises}{" "}
            {totalExercises === 1
              ? t("workouts.exercise")
              : t("workouts.exercisesLabel")}
          </Text>
        </View>
        {workout.isPublic && (
          <View style={styles.stat}>
            <Globe size={14} color={theme.colors.accent} />
          </View>
        )}
      </View>

      {/* Difficulty */}
      {workout.difficulty != null && workout.difficulty > 0 && (
        <View style={styles.difficultyRow}>
          <View style={styles.difficultyBars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.difficultyBar,
                  {
                    backgroundColor:
                      i < workout.difficulty!
                        ? difficultyColors[workout.difficulty! - 1]
                        : theme.colors.muted,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.difficultyText}>
            {t(`workouts.difficultyLevels.${workout.difficulty}`)}
          </Text>
        </View>
      )}

      {/* Tags */}
      {workout.tags && workout.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {workout.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {workout.tags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{workout.tags.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Creator Info */}
      {workout.isPublic && workout.createdBy && (
        <View style={styles.creatorRow}>
          {workout.createdBy.image ? (
            <CachedAvatar
              uri={workout.createdBy.image}
              style={styles.creatorAvatar}
              alt={workout.createdBy.name || "User avatar"}
              size={20}
            />
          ) : (
            <View style={styles.creatorAvatarPlaceholder}>
              <User size={10} color={theme.colors.textSecondary} />
            </View>
          )}
          <Text style={styles.creatorText}>
            {t("workouts.createdBy")}{" "}
            <Text style={styles.creatorName}>
              {workout.createdBy.name || "?"}
            </Text>
          </Text>
        </View>
      )}

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
        <Play size={16} color={theme.colors.white} fill={theme.colors.white} />
        <Text style={styles.startButtonText}>{t("workouts.startWorkout")}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  saveButton: {
    padding: 4,
  },

  // Badges
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  // Difficulty
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  difficultyBars: {
    flexDirection: "row",
    gap: 3,
  },
  difficultyBar: {
    width: 16,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // Tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // Creator
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  creatorAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  creatorText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  creatorName: {
    fontWeight: "600",
    color: theme.colors.text,
  },

  // Start Button
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    marginTop: theme.spacing.xs,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
