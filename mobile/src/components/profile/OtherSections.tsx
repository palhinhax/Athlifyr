import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { EmptyState } from "./EmptyState";
import { ProfileGallery } from "./ProfileGallery";

interface OtherSectionsProps {
  friendsCount: number;
}

export function OtherSections({ friendsCount }: OtherSectionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Gallery Section */}
      <ProfileGallery />

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
});
