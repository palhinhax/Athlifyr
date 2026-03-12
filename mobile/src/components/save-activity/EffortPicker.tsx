import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { PerceivedEffort } from "@/src/lib/free-run-store";

const EFFORT_OPTIONS: { value: PerceivedEffort; emoji: string; key: string }[] =
  [
    { value: 1, emoji: "😌", key: "effortEasy" },
    { value: 2, emoji: "🙂", key: "effortModerate" },
    { value: 3, emoji: "😤", key: "effortHard" },
    { value: 4, emoji: "😰", key: "effortVeryHard" },
    { value: 5, emoji: "🥵", key: "effortMaximal" },
  ];

interface EffortPickerProps {
  perceivedEffort: PerceivedEffort | undefined;
  onChange: (value: PerceivedEffort | undefined) => void;
}

export function EffortPicker({
  perceivedEffort,
  onChange,
}: Readonly<EffortPickerProps>) {
  const { t } = useTranslation();

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>{t("saveActivity.howDidItFeel")}</Text>
      <View style={styles.effortRow}>
        {EFFORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.effortButton,
              perceivedEffort === opt.value && styles.effortButtonSelected,
            ]}
            onPress={() =>
              onChange(perceivedEffort === opt.value ? undefined : opt.value)
            }
          >
            <Text style={styles.effortEmoji}>{opt.emoji}</Text>
            <Text
              style={[
                styles.effortLabel,
                perceivedEffort === opt.value && styles.effortLabelSelected,
              ]}
            >
              {t(`saveActivity.${opt.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  effortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  effortButton: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    flex: 1,
  },
  effortButtonSelected: {
    backgroundColor: theme.colors.primary + "18",
  },
  effortEmoji: {
    fontSize: 24,
  },
  effortLabel: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    marginTop: 2,
    textAlign: "center",
  },
  effortLabelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
