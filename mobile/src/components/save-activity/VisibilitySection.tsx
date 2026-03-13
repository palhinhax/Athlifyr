import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Globe, Lock, ChevronDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { ActivityVisibility } from "@/src/lib/free-run-store";

interface VisibilitySectionProps {
  visibility: ActivityVisibility;
  onToggle: () => void;
}

export function VisibilitySection({
  visibility,
  onToggle,
}: Readonly<VisibilitySectionProps>) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.detailCard} onPress={onToggle}>
      <View style={styles.visibilityRow}>
        <View style={styles.visibilityLeft}>
          {visibility === "everyone" ? (
            <Globe size={18} color={theme.colors.primary} />
          ) : (
            <Lock size={18} color={theme.colors.textSecondary} />
          )}
          <View>
            <Text style={styles.detailLabel}>
              {t("saveActivity.whoCanSee")}
            </Text>
            <Text style={styles.visibilityValue}>
              {visibility === "everyone"
                ? t("saveActivity.everyone")
                : t("saveActivity.onlyMe")}
            </Text>
          </View>
        </View>
        <ChevronDown size={18} color={theme.colors.textTertiary} />
      </View>
    </TouchableOpacity>
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
  visibilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  visibilityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  visibilityValue: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
