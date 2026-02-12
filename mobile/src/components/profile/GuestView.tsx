import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

export function GuestView() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.guestContainer}>
      <View style={styles.guestIcon}>
        <User size={48} color={theme.colors.primary} />
      </View>
      <Text style={styles.guestTitle}>{t("profile.signInTitle")}</Text>
      <Text style={styles.guestDescription}>
        {t("profile.signInDescription")}
      </Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push("/login")}
        activeOpacity={0.8}
      >
        <Text style={styles.signInButtonText}>{t("profile.signInButton")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  guestIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  guestDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  signInButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
