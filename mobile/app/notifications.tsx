import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  GraduationCap,
  CheckCircle,
  XCircle,
  UserPlus,
  Building2,
  User,
  CalendarDays,
  Ban,
  MessageCircle,
  CheckCheck,
} from "lucide-react-native";
import {
  useNotifications,
  useInvalidateNotifications,
  type AppNotification,
} from "@/src/hooks/useNotifications";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "@/src/constants/theme";

// ─── Notification Icon ─────────────────────────────────────────

function NotificationIcon({ notification }: { notification: AppNotification }) {
  switch (notification.type) {
    case "TRIAL_REQUEST":
      return <GraduationCap size={16} color="#16a34a" />;
    case "TRIAL_ACCEPTED":
      return <CheckCircle size={16} color="#16a34a" />;
    case "TRIAL_REJECTED":
      return <XCircle size={16} color={colors.error} />;
    case "TRIAL_RESPONSE":
      return notification.responseStatus === "BOOKED" ? (
        <CheckCircle size={16} color="#16a34a" />
      ) : (
        <XCircle size={16} color={colors.error} />
      );
    case "FRIEND_REQUEST":
      return <UserPlus size={16} color={colors.info} />;
    case "FRIEND_ACCEPTED":
      return <CheckCircle size={16} color={colors.info} />;
    case "VENUE_INVITE":
      return <Building2 size={16} color="#9333ea" />;
    case "VENUE_INVITE_ACCEPTED":
      return <CheckCircle size={16} color="#9333ea" />;
    case "EVENT_DATE_CHANGE":
      return <CalendarDays size={16} color="#ea580c" />;
    case "EVENT_CANCELLED":
      return <Ban size={16} color={colors.error} />;
    case "CHAT_MESSAGE":
      return <MessageCircle size={16} color="#4f46e5" />;
    default:
      return <Bell size={16} color={colors.textSecondary} />;
  }
}

// ─── Avatar ────────────────────────────────────────────────────

function NotificationAvatar({
  image,
  name,
}: {
  image: string | null;
  name: string | null;
}) {
  if (image) {
    return (
      <Image source={{ uri: image }} style={styles.avatar} alt={name ?? ""} />
    );
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View style={styles.avatarPlaceholder}>
      {initials === "?" ? (
        <User size={18} color={colors.white} />
      ) : (
        <Text style={styles.avatarText}>{initials}</Text>
      )}
    </View>
  );
}

// ─── Time Ago ──────────────────────────────────────────────────

function timeAgo(dateStr: string, t: (key: string) => string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return t("notifications.justNow");
  if (diffMin < 60) return `${diffMin}${t("notifications.minuteShort")}`;
  if (diffHours < 24) return `${diffHours}${t("notifications.hourShort")}`;
  if (diffDays < 7) return `${diffDays}${t("notifications.dayShort")}`;
  return date.toLocaleDateString();
}

// ─── Notification Item ─────────────────────────────────────────

function NotificationItem({
  notification,
  onAction,
  onPress,
  processingId,
}: {
  notification: AppNotification;
  onAction: (type: string, id: string, action: "accept" | "reject") => void;
  onPress: (notification: AppNotification) => void;
  processingId: string | null;
}) {
  const { t } = useTranslation();
  const isProcessing = processingId === notification.id;

  const getTitle = (): string => {
    // Use the title from the API if available (all notification types have it)
    if (notification.title) return notification.title;

    // Fallback for legacy compatibility
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return t("notifications.trialRequestFrom", {
          name: notification.userName ?? "?",
        });
      case "TRIAL_ACCEPTED":
      case "TRIAL_RESPONSE":
        return notification.responseStatus === "BOOKED"
          ? t("notifications.trialAcceptedTitle", {
              venue: notification.venueName ?? "?",
            })
          : t("notifications.trialRejectedTitle", {
              venue: notification.venueName ?? "?",
            });
      case "TRIAL_REJECTED":
        return t("notifications.trialRejectedTitle", {
          venue: notification.venueName ?? "?",
        });
      case "FRIEND_REQUEST":
        return t("notifications.friendRequestFrom", {
          name: notification.userName ?? "?",
        });
      case "VENUE_INVITE":
        return t("notifications.venueInviteFrom", {
          venue: notification.venueName ?? "?",
        });
      default:
        return "";
    }
  };

  const getSubtitle = (): string => {
    // Use the body from the API if available
    if (notification.body) return notification.body;

    // Fallback for legacy compatibility
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return `${notification.venueName} — ${notification.sessionTitle}`;
      case "TRIAL_ACCEPTED":
      case "TRIAL_REJECTED":
      case "TRIAL_RESPONSE":
        return notification.sessionTitle ?? "";
      case "FRIEND_REQUEST":
        return t("notifications.wantsToBeYourFriend");
      case "VENUE_INVITE":
        return t("notifications.invitedAsRole", {
          role: notification.role ?? "COACH",
        });
      default:
        return "";
    }
  };

  const hasActions =
    notification.type === "TRIAL_REQUEST" ||
    notification.type === "FRIEND_REQUEST" ||
    notification.type === "VENUE_INVITE";

  // Get avatar info: prefer data fields from the API, fall back to top-level fields
  const avatarImage =
    notification.data?.senderImage ??
    notification.data?.venueLogo ??
    notification.userImage;
  const avatarName =
    notification.data?.senderName ??
    notification.data?.venueName ??
    notification.userName;

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationItemUnread,
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <NotificationAvatar image={avatarImage} name={avatarName} />

      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <NotificationIcon notification={notification} />
          <Text
            style={[
              styles.notificationTitle,
              !notification.read && styles.notificationTitleUnread,
            ]}
            numberOfLines={2}
          >
            {getTitle()}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>

        {getSubtitle() ? (
          <Text style={styles.notificationSubtitle} numberOfLines={2}>
            {getSubtitle()}
          </Text>
        ) : null}

        {(notification.type === "TRIAL_REQUEST" ||
          notification.type === "TRIAL_ACCEPTED" ||
          notification.type === "TRIAL_REJECTED" ||
          notification.type === "TRIAL_RESPONSE") &&
          (notification.sessionStartsAt ||
            notification.data?.sessionStartsAt) && (
            <Text style={styles.sessionDate}>
              {t("notifications.scheduledFor", {
                date: new Date(
                  notification.sessionStartsAt ??
                    notification.data?.sessionStartsAt ??
                    ""
                ).toLocaleDateString(),
                time: new Date(
                  notification.sessionStartsAt ??
                    notification.data?.sessionStartsAt ??
                    ""
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })}
            </Text>
          )}

        <Text style={styles.timeAgo}>{timeAgo(notification.createdAt, t)}</Text>

        {hasActions && !notification.read && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.rejectButton,
                isProcessing && styles.buttonDisabled,
              ]}
              onPress={() =>
                onAction(notification.type, notification.id, "reject")
              }
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <XCircle size={14} color={colors.error} />
              <Text style={styles.rejectButtonText}>
                {t("notifications.decline")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.acceptButton,
                notification.type === "FRIEND_REQUEST" && {
                  backgroundColor: colors.info,
                },
                notification.type === "VENUE_INVITE" && {
                  backgroundColor: "#9333ea",
                },
                isProcessing && styles.buttonDisabled,
              ]}
              onPress={() =>
                onAction(notification.type, notification.id, "accept")
              }
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <CheckCircle size={14} color={colors.white} />
                  <Text style={styles.acceptButtonText}>
                    {t("notifications.accept")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty State ───────────────────────────────────────────────

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Bell size={48} color={colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>
        {t("notifications.noNotifications")}
      </Text>
      <Text style={styles.emptyDescription}>
        {t("notifications.emptyDescription")}
      </Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const {
    notifications,
    unreadCount,
    isLoading,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const invalidate = useInvalidateNotifications();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleAction = useCallback(
    async (type: string, id: string, action: "accept" | "reject") => {
      setProcessingId(id);
      try {
        switch (type) {
          case "TRIAL_REQUEST":
            await api.post(
              `/trial-bookings/${id}/${action === "accept" ? "accept" : "reject"}`
            );
            break;
          case "FRIEND_REQUEST":
            await api.patch(`/friends/${id}`, { action });
            break;
          case "VENUE_INVITE":
            await api.post(`/venues/invites/${id}/respond`, {
              accept: action === "accept",
            });
            break;
        }

        const successKey =
          type === "TRIAL_REQUEST"
            ? action === "accept"
              ? "notifications.trialAccepted"
              : "notifications.trialRejected"
            : type === "FRIEND_REQUEST"
              ? action === "accept"
                ? "notifications.friendAccepted"
                : "notifications.friendRejected"
              : action === "accept"
                ? "notifications.inviteAccepted"
                : "notifications.inviteDeclined";

        Alert.alert(t(successKey));
        invalidate();
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : t("notifications.actionError");
        Alert.alert(t("notifications.actionError"), message);
      } finally {
        setProcessingId(null);
      }
    },
    [t, invalidate]
  );

  /**
   * Handle notification tap - mark as read and navigate
   */
  const handleNotificationPress = useCallback(
    (notification: AppNotification) => {
      // Mark as read if unread
      if (!notification.read) {
        markAsRead(notification.id);
      }

      // Navigate based on notification type/data
      const data = notification.data;
      if (data?.route) {
        // Use route from notification data
        if (data.route.startsWith("/events/")) {
          router.push(`/events/${data.eventSlug ?? ""}`);
        } else if (data.route.startsWith("/chat/")) {
          router.push(data.route);
        }
      } else if (
        notification.type === "EVENT_CANCELLED" ||
        notification.type === "EVENT_DATE_CHANGE"
      ) {
        if (data?.eventSlug) {
          router.push(`/events/${data.eventSlug}`);
        }
      }
    },
    [markAsRead, router]
  );

  // Not authenticated → go to login
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("notifications.notifications")}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Bell size={48} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>
            {t("notifications.signInRequired")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("notifications.notifications")}
        </Text>
        {unreadCount > 0 ? (
          <TouchableOpacity
            style={styles.markAllReadButton}
            onPress={() => markAllAsRead()}
            activeOpacity={0.7}
          >
            <CheckCheck size={14} color={colors.primary} />
            <Text style={styles.markAllReadText}>
              {t("notifications.markAllRead")}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Content */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onAction={handleAction}
              onPress={handleNotificationPress}
              processingId={processingId}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  headerBadge: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  headerBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    color: colors.primary,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  listContent: {
    paddingVertical: spacing.sm,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },

  // Notification item
  notificationItem: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  notificationItemUnread: {
    backgroundColor: `${colors.primary}08`,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
  },
  notificationContent: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  notificationTitle: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  notificationTitleUnread: {
    fontWeight: "700",
  },
  notificationSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sessionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  timeAgo: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  rejectButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: "600",
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#16a34a",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  acceptButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.fontSize.sm * 1.5,
  },

  // Unread dot
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 4,
  },

  // Mark all read button
  markAllReadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  markAllReadText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    color: colors.primary,
  },
});
