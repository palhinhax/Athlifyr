import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react-native";
import { useRouter } from "expo-router";
import { theme } from "@/src/constants/theme";
import { CachedAvatar } from "@/src/components/CachedImage";
import type { VenueMember } from "@/src/hooks/useVenueDetail";

interface VenueTeamTabProps {
  members: VenueMember[];
}

function getRoleColor(role: string): string {
  switch (role) {
    case "OWNER":
      return "#f59e0b";
    case "ADMIN":
      return "#8b5cf6";
    case "COACH":
      return "#3b82f6";
    default:
      return theme.colors.textSecondary;
  }
}

export function VenueTeamTab({ members }: VenueTeamTabProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // Filter to only show staff (non-clients)
  const staffMembers = members.filter((m) => m.role !== "CLIENT");

  if (staffMembers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Users size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>{t("venueDetail.noTeamMembers")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {staffMembers.map((member) => (
        <TouchableOpacity
          key={member.id}
          style={styles.memberCard}
          activeOpacity={0.7}
          onPress={() => router.push(`/user/${member.user.id}`)}
        >
          <View style={styles.memberRow}>
            {member.user.image ? (
              <CachedAvatar
                uri={member.user.image}
                style={styles.avatar}
                alt={member.user.name || "User"}
                size={48}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {member.user.name?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.user.name}</Text>
              <View style={styles.roleRow}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(member.role) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      { color: getRoleColor(member.role) },
                    ]}
                  >
                    {t(
                      `venues.roles.${member.role.toLowerCase()}` as
                        | "venues.roles.owner"
                        | "venues.roles.admin"
                        | "venues.roles.coach"
                        | "venues.roles.client",
                      { defaultValue: member.role }
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  memberCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  roleRow: {
    flexDirection: "row",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
