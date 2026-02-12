import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Calendar, Camera, Settings, Trash2, User } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <View style={styles.settingsHeader}>
        <View style={styles.settingsHeaderSpacer} />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <Settings size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          {user.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
              alt={user.name ?? "User avatar"}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={theme.colors.white} />
            </View>
          )}
        </View>

        <View style={styles.photoButtons}>
          <TouchableOpacity
            style={styles.changePhotoButton}
            activeOpacity={0.7}
          >
            <Camera size={16} color={theme.colors.text} />
            <Text style={styles.changePhotoText}>
              {t("profile.changePhoto")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removePhotoButton}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color={theme.colors.error} />
            <Text style={styles.removePhotoText}>
              {t("profile.removePhoto")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.calendarButton} activeOpacity={0.7}>
            <Calendar size={16} color={theme.colors.text} />
            <Text style={styles.calendarButtonText}>
              {t("profile.calendar")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  settingsHeaderSpacer: {
    flex: 1,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  photoButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
  },
  removePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.error,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  calendarButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
});
