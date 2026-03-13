import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";

interface MuteToggleProps {
  muted: boolean;
  onChange: (value: boolean) => void;
}

export function MuteToggle({ muted, onChange }: Readonly<MuteToggleProps>) {
  const { t } = useTranslation();

  return (
    <View style={styles.muteCard}>
      <View style={styles.muteLeft}>
        <Text style={styles.muteTitle}>{t("saveActivity.muteActivity")}</Text>
        <Text style={styles.muteDescription}>
          {t("saveActivity.muteDescription")}
        </Text>
      </View>
      <Switch
        value={muted}
        onValueChange={onChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary + "80",
        }}
        thumbColor={muted ? theme.colors.primary : "#f4f3f4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  muteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  muteLeft: {
    flex: 1,
    marginRight: 12,
  },
  muteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  muteDescription: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
});
