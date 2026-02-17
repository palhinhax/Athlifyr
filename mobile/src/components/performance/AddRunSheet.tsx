import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  usePerformance,
  parseTimeToSeconds,
  type CreateRunEntry,
} from "@/src/hooks/usePerformance";

interface AddRunSheetProps {
  visible: boolean;
  onClose: () => void;
  isTrail?: boolean;
}

export function AddRunSheet({
  visible,
  onClose,
  isTrail = false,
}: AddRunSheetProps) {
  const { t } = useTranslation();
  const { createEntry, isCreating } = usePerformance();

  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [elevation, setElevation] = useState("");

  const resetForm = () => {
    setDistance("");
    setTime("");
    setElevation("");
  };

  const handleSave = async () => {
    const distanceKm = parseFloat(distance);
    if (!distanceKm || distanceKm <= 0) {
      Alert.alert(t("performance.error"), t("performance.run.invalidDistance"));
      return;
    }

    const timeSeconds = parseTimeToSeconds(time);
    if (!timeSeconds || timeSeconds <= 0) {
      Alert.alert(t("performance.error"), t("performance.run.invalidTime"));
      return;
    }

    const elevationGainM = elevation ? parseInt(elevation, 10) : undefined;

    // Validate elevation for trail runs
    if (isTrail && (!elevationGainM || elevationGainM <= 0)) {
      Alert.alert(
        t("performance.error"),
        t("performance.run.invalidElevation")
      );
      return;
    }

    try {
      const entry: CreateRunEntry = {
        type: "RUN",
        distanceKm,
        timeSeconds,
        performedAt: new Date().toISOString(),
        ...(elevationGainM !== undefined && { elevationGainM }),
      };

      await createEntry(entry);
      Alert.alert(t("performance.success"), t("performance.run.savedSuccess"));
      resetForm();
      onClose();
    } catch {
      Alert.alert(t("performance.error"), t("performance.run.saveFailed"));
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
          <Text style={styles.title}>{t("performance.run.addTitle")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Distance */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.run.distance")} *</Text>
            <TextInput
              style={styles.input}
              placeholder="10.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={distance}
              onChangeText={setDistance}
            />
          </View>

          {/* Time */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.run.time")} *</Text>
            <TextInput
              style={styles.input}
              placeholder="45:30"
              placeholderTextColor={theme.colors.textTertiary}
              value={time}
              onChangeText={setTime}
            />
            <Text style={styles.hint}>{t("performance.run.timeFormat")}</Text>
          </View>

          {/* Elevation */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.run.elevation")}</Text>
            <TextInput
              style={styles.input}
              placeholder="500"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="number-pad"
              value={elevation}
              onChangeText={setElevation}
            />
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isCreating}
          >
            <Text style={styles.cancelButtonText}>
              {t("performance.cancel")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isCreating && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>{t("performance.save")}</Text>
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
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
