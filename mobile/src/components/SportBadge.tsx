import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { getSportIcon } from "@/src/lib/event-utils";
import { theme } from "@/src/constants/theme";

interface SportBadgeProps {
  sportType: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function SportBadge({
  sportType,
  size = "md",
  showIcon = true,
}: SportBadgeProps) {
  const { t } = useTranslation();

  const sizeStyles = {
    sm: styles.badgeSm,
    md: styles.badgeMd,
    lg: styles.badgeLg,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  };

  return (
    <View style={[styles.badge, sizeStyles[size]]}>
      {showIcon && <Text style={styles.icon}>{getSportIcon(sportType)}</Text>}
      <Text style={[styles.text, textSizeStyles[size]]}>
        {t(`sports.${sportType}`, { defaultValue: sportType })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
  },
  badgeLg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  icon: {
    fontSize: 14,
    lineHeight: 14,
  },
  text: {
    fontWeight: "600",
    color: theme.colors.accentForeground,
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 12,
  },
  textLg: {
    fontSize: 13,
  },
});
