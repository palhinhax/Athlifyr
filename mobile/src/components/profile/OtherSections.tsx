import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { ImagePlus, Users, Activity } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { EmptyState } from "./EmptyState";

interface OtherSectionsProps {
  friendsCount: number;
}

export function OtherSections({ friendsCount }: OtherSectionsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      {/* Lift Analysis Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Activity size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>{t("profile.liftAnalysis")}</Text>
        </View>
        <View style={styles.emptyCard}>
          <Activity size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyCardTitle}>
            {t("profile.analyzeLiftTitle")}
          </Text>
          <Text style={styles.emptyCardText}>
            {t("profile.analyzeLiftDescription")}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            activeOpacity={0.7}
            onPress={() => router.push("/lift-analysis/history")}
          >
            <Activity size={16} color={theme.colors.white} />
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
              {t("profile.startAnalysis")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gallery Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ImagePlus size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("profile.galleryCount", { count: 0 })}
          </Text>
        </View>
        <View style={styles.emptyCard}>
          <ImagePlus size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyCardTitle}>{t("profile.noPhotosYet")}</Text>
          <Text style={styles.emptyCardText}>
            {t("profile.shareYourMoments")}
          </Text>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <ImagePlus size={16} color={theme.colors.text} />
            <Text style={styles.actionButtonText}>
              {t("profile.publishPhoto")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Friends Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("profile.friendsCount", { count: friendsCount })}
          </Text>
        </View>
        {friendsCount === 0 && (
          <EmptyState
            icon={<Users size={48} color={theme.colors.textSecondary} />}
            title={t("profile.noFriends")}
            description={t("profile.noFriendsDescription")}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing["2xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyCardText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
});
