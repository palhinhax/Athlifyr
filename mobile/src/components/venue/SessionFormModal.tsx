import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "@/src/constants/theme";
import { api } from "@/src/lib/api";
import { useToast } from "@/src/hooks/useToast";
import { Toast } from "@/src/components/ui/Toast";
import type { VenueSession } from "@/src/hooks/useVenueSessions";
import { format } from "date-fns";

// ── Props ──────────────────────────────────────────────────────────────

interface SessionFormModalProps {
  visible: boolean;
  onClose: () => void;
  venueId: string;
  session?: VenueSession | null; // null = create mode
  defaultDate?: Date;
  onSuccess: () => void;
}

// ── Component ──────────────────────────────────────────────────────────

export function SessionFormModal({
  visible,
  onClose,
  venueId,
  session,
  defaultDate,
  onSuccess,
}: SessionFormModalProps) {
  const { t } = useTranslation();
  const { toast, showToast, hideToast } = useToast();
  const isEditing = !!session;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionType, setSessionType] = useState<"CLASS" | "APPOINTMENT">(
    "CLASS"
  );
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [capacity, setCapacity] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  // Date picker visibility (Android needs explicit show/hide)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (session) {
      setTitle(session.title);
      setDescription(session.description || "");
      setSessionType(session.type);
      const start = new Date(session.startsAt);
      const end = new Date(session.endsAt);
      setDate(start);
      setStartTime(start);
      setEndTime(end);
      setCapacity(session.capacity?.toString() || "");
      setTags(session.tags?.join(", ") || "");
    } else {
      const d = defaultDate || new Date();
      setTitle("");
      setDescription("");
      setSessionType("CLASS");
      setDate(d);
      // Default start: next round hour
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      setStartTime(now);
      const endDefault = new Date(now);
      endDefault.setHours(endDefault.getHours() + 1);
      setEndTime(endDefault);
      setCapacity("");
      setTags("");
    }
  }, [session, defaultDate, visible]);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast(t("sessions.title") + " required", "error");
      return;
    }

    setLoading(true);
    try {
      // Build start/end ISO strings
      const startsAt = new Date(date);
      startsAt.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
      const endsAt = new Date(date);
      endsAt.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        type: sessionType,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        capacity: capacity ? parseInt(capacity, 10) : null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing && session) {
        await api.put(`/venues/${venueId}/sessions/${session.id}`, payload);
        showToast(t("sessions.updateSuccess"), "success");
      } else {
        await api.post(`/venues/${venueId}/sessions`, payload);
        showToast(t("sessions.createSuccess"), "success");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving session:", error);
      showToast(t("sessions.saveError"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing
                ? t("sessions.editSession")
                : t("sessions.createSession")}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <Text style={styles.label}>{t("sessions.title")}</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={t("sessions.title")}
              placeholderTextColor={theme.colors.textTertiary}
            />

            {/* Session Type */}
            <Text style={styles.label}>{t("sessions.sessionType")}</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  sessionType === "CLASS" && styles.typeOptionActive,
                ]}
                onPress={() => setSessionType("CLASS")}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    sessionType === "CLASS" && styles.typeOptionTextActive,
                  ]}
                >
                  {t("sessions.class")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  sessionType === "APPOINTMENT" && styles.typeOptionActive,
                ]}
                onPress={() => setSessionType("APPOINTMENT")}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    sessionType === "APPOINTMENT" &&
                      styles.typeOptionTextActive,
                  ]}
                >
                  {t("sessions.appointment")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Date */}
            <Text style={styles.label}>{t("sessions.date")}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {format(date, "dd/MM/yyyy")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, d) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (d) setDate(d);
                }}
              />
            )}

            {/* Start Time */}
            <Text style={styles.label}>{t("sessions.startTime")}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {format(startTime, "HH:mm")}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, d) => {
                  setShowStartPicker(Platform.OS === "ios");
                  if (d) setStartTime(d);
                }}
              />
            )}

            {/* End Time */}
            <Text style={styles.label}>{t("sessions.endTime")}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {format(endTime, "HH:mm")}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, d) => {
                  setShowEndPicker(Platform.OS === "ios");
                  if (d) setEndTime(d);
                }}
              />
            )}

            {/* Capacity */}
            <Text style={styles.label}>{t("sessions.maxCapacity")}</Text>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="20"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="number-pad"
            />

            {/* Description */}
            <Text style={styles.label}>{t("sessions.description")}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={t("sessions.description")}
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
            />

            {/* Tags */}
            <Text style={styles.label}>{t("sessions.tags")}</Text>
            <TextInput
              style={styles.input}
              value={tags}
              onChangeText={setTags}
              placeholder="WOD, CrossFit, ..."
              placeholderTextColor={theme.colors.textTertiary}
            />

            {/* Spacer */}
            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Save button */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>{t("sessions.save")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

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

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  typeOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  typeOptionTextActive: {
    color: theme.colors.primary,
  },
  dateButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  actionBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
