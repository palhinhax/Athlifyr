import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X, Search, Plus } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { API_URL } from "@/src/lib/api";
import { useToast } from "@/src/hooks/useToast";
import * as SecureStore from "expo-secure-store";
import { usePerformance } from "@/src/hooks/usePerformance";

interface Exercise {
  id: string;
  name: string;
  category: string;
  isGlobal: boolean;
}

interface AddStrengthSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function AddStrengthSheet({ visible, onClose }: AddStrengthSheetProps) {
  const { t } = useTranslation();
  const { createEntry, isCreating } = usePerformance();
  const { showToast } = useToast();

  const [exerciseQuery, setExerciseQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchExercises = useCallback(async (query: string) => {
    if (query.length < 1) {
      setExercises([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = await SecureStore.getItemAsync("auth-token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${API_URL}/api/profile/performance/exercises?q=${encodeURIComponent(query)}&limit=10`,
        { headers }
      );
      if (response.ok) {
        const data = (await response.json()) as Exercise[];
        setExercises(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Error searching exercises:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (exerciseQuery && !selectedExercise) {
      searchTimeoutRef.current = setTimeout(() => {
        searchExercises(exerciseQuery);
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [exerciseQuery, selectedExercise, searchExercises]);

  const resetForm = () => {
    setExerciseQuery("");
    setSelectedExercise(null);
    setReps("");
    setWeight("");
    setExercises([]);
    setShowDropdown(false);
  };

  const handleCreateExercise = async () => {
    if (!exerciseQuery.trim()) return;
    setIsSearching(true);
    try {
      const token = await SecureStore.getItemAsync("auth-token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${API_URL}/api/profile/performance/exercises`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ name: exerciseQuery.trim() }),
        }
      );
      if (response.ok) {
        const newExercise = (await response.json()) as Exercise;
        setSelectedExercise(newExercise);
        setExerciseQuery(newExercise.name);
        setShowDropdown(false);
        showToast(t("performance.strength.exerciseCreated"), "success");
      }
    } catch {
      showToast(t("performance.strength.exerciseCreateFailed"), "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!selectedExercise) {
      showToast(t("performance.strength.selectExercise"), "error");
      return;
    }

    const repsNum = parseInt(reps, 10);
    if (!repsNum || repsNum <= 0) {
      showToast(t("performance.strength.invalidReps"), "error");
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < 0) {
      showToast(t("performance.strength.invalidWeight"), "error");
      return;
    }

    try {
      await createEntry({
        type: "STRENGTH",
        exerciseId: selectedExercise.id,
        reps: repsNum,
        weightKg: weightNum || 0,
        performedAt: new Date().toISOString(),
      });
      showToast(t("performance.strength.savedSuccess"), "success");
      resetForm();
      onClose();
    } catch {
      showToast(t("performance.strength.saveFailed"), "error");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("performance.strength.addTitle")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Exercise Search */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {t("performance.strength.exercise")} *
            </Text>
            <View style={styles.searchContainer}>
              <Search
                size={18}
                color={theme.colors.textTertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t("performance.strength.searchExercise")}
                placeholderTextColor={theme.colors.textTertiary}
                value={exerciseQuery}
                onChangeText={(text) => {
                  setExerciseQuery(text);
                  if (selectedExercise) setSelectedExercise(null);
                }}
                onFocus={() => {
                  if (exercises.length > 0) setShowDropdown(true);
                }}
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                  style={styles.searchSpinner}
                />
              )}
            </View>

            {/* Dropdown */}
            {showDropdown && !selectedExercise && (
              <View style={styles.dropdown}>
                {exercises.length > 0 ? (
                  <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedExercise(item);
                          setExerciseQuery(item.name);
                          setShowDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  exerciseQuery.length > 0 &&
                  !isSearching && (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={handleCreateExercise}
                    >
                      <Plus size={16} color={theme.colors.primary} />
                      <Text style={styles.createText}>
                        {t("performance.strength.createExercise", {
                          name: exerciseQuery,
                        })}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>

          {/* Reps */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.strength.reps")} *</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="number-pad"
              value={reps}
              onChangeText={setReps}
            />
          </View>

          {/* Weight */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {t("performance.strength.weight")} *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="80"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.hint}>
              {t("performance.strength.weightHint")}
            </Text>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            disabled={isCreating}
          >
            <Text style={styles.cancelBtnText}>{t("performance.cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, isCreating && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>{t("performance.save")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  field: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  searchIcon: {
    marginLeft: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  searchSpinner: {
    marginRight: theme.spacing.md,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    maxHeight: 200,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  createText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
