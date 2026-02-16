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
import { X, ChevronDown } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { usePerformance, parseTimeToSeconds } from "@/src/hooks/usePerformance";

const HYROX_CATEGORIES = [
  { value: "OPEN_MEN", key: "openMen" },
  { value: "OPEN_WOMEN", key: "openWomen" },
  { value: "PRO_MEN", key: "proMen" },
  { value: "PRO_WOMEN", key: "proWomen" },
  { value: "ELITE_15_MEN", key: "elite15Men" },
  { value: "ELITE_15_WOMEN", key: "elite15Women" },
  { value: "DOUBLES_MEN", key: "doublesMen" },
  { value: "DOUBLES_WOMEN", key: "doublesWomen" },
  { value: "DOUBLES_MIXED", key: "doublesMixed" },
  { value: "RELAY_MEN", key: "relayMen" },
  { value: "RELAY_WOMEN", key: "relayWomen" },
  { value: "RELAY_MIXED", key: "relayMixed" },
  { value: "ADAPTIVE", key: "adaptive" },
] as const;

interface AddHyroxSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function AddHyroxSheet({ visible, onClose }: AddHyroxSheetProps) {
  const { t } = useTranslation();
  const { createEntry, isCreating } = usePerformance();

  const [category, setCategory] = useState("OPEN_MEN");
  const [time, setTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const resetForm = () => {
    setCategory("OPEN_MEN");
    setTime("");
    setEventName("");
    setLocation("");
    setShowCategoryPicker(false);
  };

  const getCategoryLabel = (value: string): string => {
    const cat = HYROX_CATEGORIES.find((c) => c.value === value);
    if (!cat) return value;
    return t(`performance.hyrox.categories.${cat.key}`);
  };

  const handleSave = async () => {
    const timeSeconds = parseTimeToSeconds(time);
    if (!timeSeconds || timeSeconds <= 0) {
      Alert.alert(t("performance.error"), t("performance.hyrox.invalidTime"));
      return;
    }

    try {
      await createEntry({
        type: "HYROX",
        hyroxCategory: category,
        timeSeconds,
        performedAt: new Date().toISOString(),
        ...(eventName.trim() && { eventName: eventName.trim() }),
        ...(location.trim() && { location: location.trim() }),
      });
      Alert.alert(
        t("performance.success"),
        t("performance.hyrox.savedSuccess")
      );
      resetForm();
      onClose();
    } catch {
      Alert.alert(t("performance.error"), t("performance.hyrox.saveFailed"));
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
          <Text style={styles.title}>{t("performance.hyrox.addTitle")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Picker */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {t("performance.hyrox.category")} *
            </Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {getCategoryLabel(category)}
              </Text>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.categoryList}>
                <ScrollView nestedScrollEnabled style={styles.categoryScroll}>
                  {HYROX_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryItem,
                        category === cat.value && styles.categoryItemActive,
                      ]}
                      onPress={() => {
                        setCategory(cat.value);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryItemText,
                          category === cat.value &&
                            styles.categoryItemTextActive,
                        ]}
                      >
                        {t(`performance.hyrox.categories.${cat.key}`)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Time */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.hyrox.time")} *</Text>
            <TextInput
              style={styles.input}
              placeholder="1:15:30"
              placeholderTextColor={theme.colors.textTertiary}
              value={time}
              onChangeText={setTime}
            />
            <Text style={styles.hint}>{t("performance.hyrox.timeFormat")}</Text>
          </View>

          {/* Event Name */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.hyrox.eventName")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("performance.hyrox.eventNamePlaceholder")}
              placeholderTextColor={theme.colors.textTertiary}
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("performance.hyrox.location")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("performance.hyrox.locationPlaceholder")}
              placeholderTextColor={theme.colors.textTertiary}
              value={location}
              onChangeText={setLocation}
            />
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
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  categoryList: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
  },
  categoryScroll: {
    maxHeight: 200,
  },
  categoryItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryItemActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  categoryItemText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  categoryItemTextActive: {
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
