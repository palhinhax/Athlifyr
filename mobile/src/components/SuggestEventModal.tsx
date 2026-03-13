import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X, CheckCircle2, ChevronDown, Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "@/src/constants/theme";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";

const SPORT_TYPES = [
  "RUNNING",
  "TRAIL",
  "WALKING",
  "CROSSFIT",
  "OCR",
  "BTT",
  "CYCLING",
  "SURF",
  "TRIATHLON",
  "SWIMMING",
  "OTHER",
] as const;

interface SuggestEventModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuggestEventModal({
  visible,
  onClose,
}: Readonly<SuggestEventModalProps>) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    location: "",
    sportType: "",
    url: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      location: "",
      sportType: "",
      url: "",
    });
    setIsSuccess(false);
    setShowSportPicker(false);
    setShowDatePicker(false);
    setSelectedDate(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    formData.title.trim().length >= 2 && formData.message.trim().length >= 5;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await api.post("/event-suggestions", {
        title: formData.title.trim(),
        message: formData.message.trim(),
        location: formData.location.trim() || undefined,
        date: selectedDate
          ? selectedDate.toLocaleDateString("pt-PT")
          : undefined,
        sportType: formData.sportType || undefined,
        url: formData.url.trim() || undefined,
      });
      setIsSuccess(true);
    } catch {
      Alert.alert("Error", t("events.suggest.errorSubmitting"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backdrop} onPress={handleClose}>
            <Pressable style={styles.card} onPress={() => {}}>
              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={12}
                activeOpacity={0.7}
              >
                <X size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>

              {isSuccess ? (
                <View style={styles.successContainer}>
                  <View style={styles.iconContainer}>
                    <CheckCircle2 size={32} color={theme.colors.success} />
                  </View>
                  <Text style={styles.title}>
                    {t("events.suggest.thankYouTitle")}
                  </Text>
                  <Text style={styles.message}>
                    {t("events.suggest.thankYouDesc")}
                  </Text>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.buttonPrimary}
                      onPress={handleClose}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.buttonTextPrimary}>
                        {t("events.suggest.close")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  {/* Title & Description */}
                  <Text style={styles.title}>{t("events.suggest.title")}</Text>
                  <Text style={styles.message}>
                    {t("events.suggest.description")}
                  </Text>

                  {/* Event Name */}
                  <Text style={styles.label}>
                    {t("events.suggest.eventName")} *
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(v) =>
                      setFormData((f) => ({ ...f, title: v }))
                    }
                    placeholder={t("events.suggest.eventNamePlaceholder")}
                    placeholderTextColor={theme.colors.textTertiary}
                    maxLength={200}
                  />

                  {/* Date & Sport row */}
                  <View style={styles.row}>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>
                        {t("events.suggest.date")}
                      </Text>
                      <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.selectText,
                            !selectedDate && styles.placeholderText,
                          ]}
                          numberOfLines={1}
                        >
                          {selectedDate
                            ? selectedDate.toLocaleDateString("pt-PT")
                            : "dd/mm/aaaa"}
                        </Text>
                        <Calendar size={16} color={theme.colors.textTertiary} />
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={selectedDate || new Date()}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          onChange={(_, d) => {
                            setShowDatePicker(Platform.OS === "ios");
                            if (d) setSelectedDate(d);
                          }}
                        />
                      )}
                    </View>
                    <View style={styles.halfField}>
                      <Text style={styles.label}>
                        {t("events.suggest.sport")}
                      </Text>
                      <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => setShowSportPicker(!showSportPicker)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.selectText,
                            !formData.sportType && styles.placeholderText,
                          ]}
                          numberOfLines={1}
                        >
                          {formData.sportType
                            ? t(`sports.${formData.sportType}`)
                            : t("events.suggest.sportPlaceholder")}
                        </Text>
                        <ChevronDown
                          size={16}
                          color={theme.colors.textTertiary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Sport Picker Dropdown */}
                  {showSportPicker && (
                    <View style={styles.sportPicker}>
                      {SPORT_TYPES.map((sport) => (
                        <TouchableOpacity
                          key={sport}
                          style={[
                            styles.sportOption,
                            formData.sportType === sport &&
                              styles.sportOptionActive,
                          ]}
                          onPress={() => {
                            setFormData((f) => ({ ...f, sportType: sport }));
                            setShowSportPicker(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.sportOptionText,
                              formData.sportType === sport &&
                                styles.sportOptionTextActive,
                            ]}
                          >
                            {t(`sports.${sport}`)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Location */}
                  <Text style={styles.label}>
                    {t("events.suggest.location")}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(v) =>
                      setFormData((f) => ({ ...f, location: v }))
                    }
                    placeholder={t("events.suggest.locationPlaceholder")}
                    placeholderTextColor={theme.colors.textTertiary}
                    maxLength={200}
                  />

                  {/* Website */}
                  <Text style={styles.label}>
                    {t("events.suggest.website")}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.url}
                    onChangeText={(v) => setFormData((f) => ({ ...f, url: v }))}
                    placeholder={t("events.suggest.websitePlaceholder")}
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="url"
                    autoCapitalize="none"
                    maxLength={500}
                  />

                  {/* Message */}
                  <Text style={styles.label}>
                    {t("events.suggest.message")} *
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.message}
                    onChangeText={(v) =>
                      setFormData((f) => ({ ...f, message: v }))
                    }
                    placeholder={t("events.suggest.messagePlaceholder")}
                    placeholderTextColor={theme.colors.textTertiary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    maxLength={2000}
                  />

                  {/* Submit */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonPrimary,
                        !isFormValid && styles.buttonDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={isSubmitting || !isFormValid}
                      activeOpacity={0.7}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.white}
                        />
                      ) : (
                        <Text style={styles.buttonTextPrimary}>
                          {t("events.suggest.submit")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Pressable>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backdrop: {
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    ...theme.shadows.xl,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
    zIndex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 8,
    paddingRight: 28,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  iconContainer: {
    marginBottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
    paddingTop: 8,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 72,
    paddingTop: theme.spacing.sm + 2,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  selectButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.textTertiary,
  },
  sportPicker: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.xs,
    overflow: "hidden",
  },
  sportOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sportOptionActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  sportOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  sportOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  actionsContainer: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  buttonPrimary: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextPrimary: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
});
