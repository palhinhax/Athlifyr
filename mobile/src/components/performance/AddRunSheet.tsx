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
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useToast } from "@/src/hooks/useToast";
import { Toast } from "@/src/components/ui/Toast";
import {
  usePerformance,
  parseTimeToSeconds,
  type CreateRunEntry,
} from "@/src/hooks/usePerformance";

const noop = () => {};

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
  const { toast, showToast, hideToast } = useToast();

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
      showToast(t("performance.run.invalidDistance"), "error");
      return;
    }

    const timeSeconds = parseTimeToSeconds(time);
    if (!timeSeconds || timeSeconds <= 0) {
      showToast(t("performance.run.invalidTime"), "error");
      return;
    }

    const elevationGainM = elevation ? parseInt(elevation, 10) : undefined;

    try {
      const entry: CreateRunEntry = {
        type: "RUN",
        distanceKm,
        timeSeconds,
        performedAt: new Date().toISOString(),
        ...(elevationGainM !== undefined && { elevationGainM }),
      };

      // If trail, we still use type "RUN" with elevation (API uses same type for both)
      // The backend differentiates by having elevationGainM > 0
      if (isTrail && elevationGainM === undefined) {
        entry.elevationGainM = 0;
      }

      await createEntry(entry);
      showToast(t("performance.run.savedSuccess"), "success");
      resetForm();
      onClose();
    } catch {
      showToast(t("performance.run.saveFailed"), "error");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdropPressable} onPress={onClose}>
          <Pressable style={styles.card} onPress={noop}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {t("performance.run.addTitle")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={12}
                activeOpacity={0.7}
              >
                <X size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Distance */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  {t("performance.run.distance")} *
                </Text>
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
                <Text style={styles.label}>
                  {t("performance.run.time")} *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="45:30"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={time}
                  onChangeText={setTime}
                />
                <Text style={styles.hint}>
                  {t("performance.run.timeFormat")}
                </Text>
              </View>

              {/* Elevation */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  {t("performance.run.elevation")}
                </Text>
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
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>
                  {t("performance.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isCreating && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isCreating}
                activeOpacity={0.7}
              >
                {isCreating ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.white}
                  />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {t("performance.save")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>

      {/* Toast notifications */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  backdropPressable: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    paddingTop: 24,
    paddingBottom: 20,
    ...theme.shadows.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 24,
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
    backgroundColor: theme.colors.background,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: 24,
    paddingTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
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
