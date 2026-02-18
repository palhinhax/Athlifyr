import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
} from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";
import type {
  WorkoutItem,
  WorkoutBlock,
  WorkoutBlockExercise,
} from "@/src/hooks/useWorkouts";

// ============================================================================
// Block type colors
// ============================================================================

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

// ============================================================================
// Helpers
// ============================================================================

function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatPrescription(ex: WorkoutBlockExercise): string {
  const parts: string[] = [];

  if (ex.prescribedSets && ex.prescribedSets > 1) {
    parts.push(`${ex.prescribedSets}x`);
  }

  if (ex.prescribedReps) {
    parts.push(`${ex.prescribedReps} reps`);
  }

  if (ex.prescribedWeight) {
    parts.push(`@ ${ex.prescribedWeight}kg`);
  }

  if (ex.prescribedDistance) {
    parts.push(
      ex.prescribedDistance >= 1000
        ? `${ex.prescribedDistance / 1000}km`
        : `${ex.prescribedDistance}m`
    );
  }

  if (ex.prescribedTime) {
    if (ex.prescribedTime >= 60) {
      const mins = Math.floor(ex.prescribedTime / 60);
      const secs = ex.prescribedTime % 60;
      parts.push(
        secs > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${mins} min`
      );
    } else {
      parts.push(`${ex.prescribedTime}s`);
    }
  }

  if (ex.prescribedCalories) {
    parts.push(`${ex.prescribedCalories} cal`);
  }

  return parts.join(" ") || "";
}

function formatBlockHeader(
  block: WorkoutBlock,
  t: (key: string) => string
): string {
  const parts: string[] = [];
  const typeKey = `workouts.blocks.${block.type}`;
  const translated = t(typeKey);
  parts.push(translated !== typeKey ? translated : block.type);

  if (block.rounds && block.rounds > 1) {
    parts.push(`x${block.rounds}`);
  }
  if (block.timeCap) {
    const mins = Math.floor(block.timeCap / 60);
    parts.push(`(${mins} min)`);
  }
  return parts.join(" ");
}

// ============================================================================
// Main Component
// ============================================================================

export default function WorkoutRunnerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // State
  const [workout, setWorkout] = useState<WorkoutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer state
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Block expand/collapse state
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  // Finish modal state
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  // ── Fetch workout data ─────────────────────────────────────────────────
  const fetchWorkout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync("auth-token");
      if (!token) {
        setError("Not authenticated");
        return;
      }
      const response = await fetch(`${API_URL}/api/workouts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to load workout");
      const data = await response.json();
      setWorkout(data);
      // Expand all blocks initially
      const blockIds = new Set<string>(
        (data.blocks || []).map((b: WorkoutBlock) => b.id)
      );
      setExpandedBlocks(blockIds);
    } catch (err) {
      console.error("Error fetching workout:", err);
      setError("Failed to load workout");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWorkout();
    }
  }, [id, fetchWorkout]);

  // ── Timer logic ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    if (!hasStarted) {
      startTimeRef.current = new Date();
      setHasStarted(true);
    }
    setIsRunning(true);
    Vibration.vibrate(50);
  }, [hasStarted]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    Vibration.vibrate(50);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setHasStarted(false);
    startTimeRef.current = null;
    Vibration.vibrate([0, 50, 50, 50]);
  }, []);

  const handleFinish = useCallback(() => {
    setIsRunning(false);
    Vibration.vibrate([0, 100, 50, 100]);
    setShowFinishModal(true);
  }, []);

  // ── Submit workout log ─────────────────────────────────────────────────
  const handleSubmitLog = useCallback(async () => {
    if (!workout) return;
    setSubmitting(true);

    try {
      const token = await SecureStore.getItemAsync("auth-token");
      if (!token) throw new Error("Not authenticated");

      const body = {
        workoutId: workout.id,
        performedAt:
          startTimeRef.current?.toISOString() || new Date().toISOString(),
        feeling: selectedFeeling || undefined,
        notes: undefined,
        blockResults: workout.blocks.map((block) => ({
          blockId: block.id,
          exerciseResults: block.exercises.map((ex) => ({
            blockExerciseId: ex.id,
            exerciseId: ex.exercise.id,
          })),
        })),
      };

      const response = await fetch(`${API_URL}/api/workouts/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to submit workout log");
      }

      setFinished(true);
      setShowFinishModal(false);

      // Invalidate history query so it refreshes
      queryClient.invalidateQueries({ queryKey: ["workout-history"] });

      // Small delay then show success
      Vibration.vibrate([0, 100, 100, 200]);
    } catch (err) {
      console.error("Error submitting log:", err);
      Alert.alert(t("common.error"), t("workouts.runner.submitError"));
    } finally {
      setSubmitting(false);
    }
  }, [workout, selectedFeeling, queryClient, t]);

  // ── Toggle block expand ────────────────────────────────────────────────
  const toggleBlock = useCallback((blockId: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  }, []);

  // ── Back handler ───────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (hasStarted && !finished) {
      // Warn user about losing progress
      Alert.alert(
        t("workouts.runner.exitTitle"),
        t("workouts.runner.exitMessage"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("workouts.runner.exitConfirm"),
            style: "destructive",
            onPress: () => {
              if (timerRef.current) clearInterval(timerRef.current);
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  }, [hasStarted, finished, router, t]);

  // ── Feeling emoji map ──────────────────────────────────────────────────
  const feelingEmojis = useMemo(
    () => [
      { value: 1, emoji: "😫", label: t("workouts.feelingLevels.1") },
      { value: 2, emoji: "😕", label: t("workouts.feelingLevels.2") },
      { value: 3, emoji: "😐", label: t("workouts.feelingLevels.3") },
      { value: 4, emoji: "😊", label: t("workouts.feelingLevels.4") },
      { value: 5, emoji: "🔥", label: t("workouts.feelingLevels.5") },
    ],
    [t]
  );

  // ── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>{error || "Workout not found"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWorkout}>
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Success State ──────────────────────────────────────────────────────
  if (finished) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <Trophy size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.successTitle}>
            {t("workouts.runner.completedTitle")}
          </Text>
          <Text style={styles.successSubtitle}>
            {t("workouts.runner.completedSubtitle")}
          </Text>
          <Text style={styles.successTime}>{formatTime(elapsed)}</Text>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => router.back()}
          >
            <Text style={styles.successButtonText}>
              {t("workouts.runner.backToWorkouts")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalExercises = workout.blocks.reduce(
    (sum, block) => sum + block.exercises.length,
    0
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {workout.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {totalExercises}{" "}
            {totalExercises === 1
              ? t("workouts.exercise")
              : t("workouts.exercisesLabel")}
            {workout.estimatedTime ? ` • ~${workout.estimatedTime} min` : ""}
          </Text>
        </View>
      </View>

      {/* ── Timer Section ───────────────────────────────────────────────── */}
      <View style={styles.timerSection}>
        <Text style={[styles.timerText, isRunning && styles.timerTextRunning]}>
          {formatTime(elapsed)}
        </Text>

        <View style={styles.timerControls}>
          {!hasStarted ? (
            <TouchableOpacity
              style={styles.timerButtonPrimary}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Play
                size={24}
                color={theme.colors.white}
                fill={theme.colors.white}
              />
              <Text style={styles.timerButtonText}>
                {t("workouts.runner.start")}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {isRunning ? (
                <TouchableOpacity
                  style={styles.timerButtonSecondary}
                  onPress={handlePause}
                  activeOpacity={0.8}
                >
                  <Pause size={20} color={theme.colors.text} />
                  <Text style={styles.timerButtonSecondaryText}>
                    {t("workouts.runner.pause")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.timerButtonPrimary}
                  onPress={handleStart}
                  activeOpacity={0.8}
                >
                  <Play
                    size={20}
                    color={theme.colors.white}
                    fill={theme.colors.white}
                  />
                  <Text style={styles.timerButtonText}>
                    {t("workouts.runner.resume")}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.timerButtonOutline}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <RotateCcw size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timerButtonFinish}
                onPress={handleFinish}
                activeOpacity={0.8}
              >
                <CheckCircle size={20} color={theme.colors.white} />
                <Text style={styles.timerButtonText}>
                  {t("workouts.runner.finish")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* ── Workout Blocks ──────────────────────────────────────────────── */}
      <ScrollView
        style={styles.blocksList}
        contentContainerStyle={styles.blocksContent}
        showsVerticalScrollIndicator={false}
      >
        {workout.blocks
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((block) => {
            const isExpanded = expandedBlocks.has(block.id);
            const color =
              BLOCK_TYPE_COLORS[block.type] || theme.colors.textSecondary;

            return (
              <View
                key={block.id}
                style={[styles.blockCard, { borderLeftColor: color }]}
              >
                {/* Block Header */}
                <TouchableOpacity
                  style={styles.blockHeader}
                  onPress={() => toggleBlock(block.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.blockHeaderLeft}>
                    <View
                      style={[
                        styles.blockBadge,
                        { backgroundColor: `${color}20` },
                      ]}
                    >
                      <Text style={[styles.blockBadgeText, { color }]}>
                        {formatBlockHeader(block, t)}
                      </Text>
                    </View>
                    {block.name && (
                      <Text style={styles.blockName} numberOfLines={1}>
                        {block.name}
                      </Text>
                    )}
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={18} color={theme.colors.textSecondary} />
                  ) : (
                    <ChevronDown size={18} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>

                {/* Block Notes */}
                {isExpanded && block.notes && (
                  <Text style={styles.blockNotes}>{block.notes}</Text>
                )}

                {/* Exercises */}
                {isExpanded &&
                  block.exercises
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((ex, index) => (
                      <View key={ex.id} style={styles.exerciseRow}>
                        <View style={styles.exerciseIndex}>
                          <Text style={styles.exerciseIndexText}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.exerciseContent}>
                          <Text style={styles.exerciseName}>
                            {ex.exercise.name}
                          </Text>
                          {formatPrescription(ex) !== "" && (
                            <Text style={styles.exercisePrescription}>
                              {formatPrescription(ex)}
                            </Text>
                          )}
                          {ex.notes && (
                            <Text style={styles.exerciseNotes}>{ex.notes}</Text>
                          )}
                        </View>
                      </View>
                    ))}
              </View>
            );
          })}

        {/* Bottom spacer */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>

      {/* ── Finish Modal ────────────────────────────────────────────────── */}
      <Modal
        visible={showFinishModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowFinishModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.title}>
              {t("workouts.runner.finishTitle")}
            </Text>
            <Text style={modalStyles.message}>
              {t("workouts.runner.finishMessage")}
            </Text>
            <Text style={modalStyles.time}>⏱ {formatTime(elapsed)}</Text>

            {/* Feeling selector */}
            <View style={modalStyles.feelingContainer}>
              <Text style={modalStyles.feelingLabel}>
                {t("workouts.runner.howDidYouFeel")}
              </Text>
              <View style={modalStyles.feelingRow}>
                {feelingEmojis.map((f) => (
                  <TouchableOpacity
                    key={f.value}
                    style={[
                      modalStyles.feelingButton,
                      selectedFeeling === f.value &&
                        modalStyles.feelingButtonSelected,
                    ]}
                    onPress={() => setSelectedFeeling(f.value)}
                  >
                    <Text style={modalStyles.feelingEmoji}>{f.emoji}</Text>
                    <Text
                      style={[
                        modalStyles.feelingButtonLabel,
                        selectedFeeling === f.value &&
                          modalStyles.feelingButtonLabelSelected,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action buttons */}
            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={modalStyles.buttonOutline}
                onPress={() => setShowFinishModal(false)}
              >
                <Text style={modalStyles.buttonOutlineText}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.buttonPrimary,
                  submitting && modalStyles.buttonDisabled,
                ]}
                onPress={handleSubmitLog}
                disabled={submitting}
              >
                <Text style={modalStyles.buttonPrimaryText}>
                  {submitting
                    ? t("workouts.runner.submitting")
                    : t("workouts.runner.submitResults")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    color: theme.colors.white,
    fontWeight: "600",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  // ── Timer ──
  timerSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timerText: {
    fontSize: 56,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    color: theme.colors.text,
    letterSpacing: 2,
  },
  timerTextRunning: {
    color: theme.colors.primary,
  },
  timerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  timerButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
  },
  timerButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  timerButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
  },
  timerButtonSecondaryText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  timerButtonOutline: {
    padding: 12,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timerButtonFinish: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
  },

  // ── Blocks ──
  blocksList: {
    flex: 1,
  },
  blocksContent: {
    padding: 16,
    gap: 12,
  },
  blockCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    padding: 12,
    ...theme.shadows.sm,
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  blockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  blockBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  blockName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  blockNotes: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 8,
    paddingHorizontal: 4,
  },

  // ── Exercises ──
  exerciseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  exerciseIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  exerciseIndexText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  exercisePrescription: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  exerciseNotes: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },

  // ── Success State ──
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  successIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  successTime: {
    fontSize: 40,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    color: theme.colors.primary,
    marginTop: 24,
    letterSpacing: 2,
  },
  successButton: {
    marginTop: 32,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.full,
  },
  successButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});

// Split to avoid TS inference limit on StyleSheet
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  time: {
    fontSize: 28,
    fontWeight: "300",
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  buttonOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  buttonOutlineText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.success,
    alignItems: "center",
  },
  buttonPrimaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  feelingContainer: {
    marginTop: 16,
  },
  feelingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  feelingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  feelingButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 56,
  },
  feelingButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  feelingEmoji: {
    fontSize: 24,
  },
  feelingButtonLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  feelingButtonLabelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
