import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { LucideIcon } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

interface AuthRequiredViewProps {
  /** Icon component from lucide-react-native */
  icon: LucideIcon;
  /** Translation key for the title (e.g., "feed.authTitle") */
  titleKey: string;
  /** Translation key for the description (e.g., "feed.authDescription") */
  descriptionKey: string;
}

export function AuthRequiredView({
  icon: Icon,
  titleKey,
  descriptionKey,
}: AuthRequiredViewProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={64} color={theme.colors.primary} style={{ opacity: 0.8 }} />
      </View>
      <Text style={styles.title}>{t(titleKey)}</Text>
      <Text style={styles.description}>{t(descriptionKey)}</Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push("/login")}
        activeOpacity={0.8}
      >
        <Text style={styles.signInButtonText}>{t("common.signInButton")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  signInButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
