import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { theme } from "@/src/constants/theme";
import { CachedAvatar } from "@/src/components/CachedImage";
import type { Conversation } from "@/src/api/chat";

interface ConversationListItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: () => void;
  isSelected?: boolean;
}

export function ConversationListItem({
  conversation,
  currentUserId,
  onPress,
  isSelected = false,
}: ConversationListItemProps) {
  const getOtherUser = () => {
    return conversation.participants.find((p) => p.user.id !== currentUserId)
      ?.user;
  };

  const isUnread = (): boolean => {
    const lastMessage = conversation.messages[0];
    if (!lastMessage) return false;
    if (lastMessage.senderId === currentUserId) return false;
    const myParticipant = conversation.participants.find(
      (p) => p.user.id === currentUserId
    );
    if (!myParticipant?.lastSeenAt) return true;
    return (
      new Date(lastMessage.createdAt).getTime() >
      new Date(myParticipant.lastSeenAt).getTime()
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const otherUser = getOtherUser();
  const lastMessage = conversation.messages[0];
  const unread = isUnread();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        unread && !isSelected && styles.containerUnread,
      ]}
      onPress={onPress}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {otherUser?.image ? (
          <CachedAvatar
            uri={otherUser.image}
            style={styles.avatar}
            alt={otherUser.name || "User"}
            size={48}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(otherUser?.name || null)}
            </Text>
          </View>
        )}
        {unread && <View style={styles.unreadDot} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.userName, unread && styles.userNameUnread]}
            numberOfLines={1}
          >
            {otherUser?.name || "Unknown User"}
          </Text>
          {lastMessage && (
            <Text style={[styles.timestamp, unread && styles.timestampUnread]}>
              {formatDistanceToNow(new Date(lastMessage.createdAt), {
                addSuffix: false,
              })}
            </Text>
          )}
        </View>
        {lastMessage && (
          <Text
            style={[styles.lastMessage, unread && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {lastMessage.senderId === currentUserId ? "You: " : ""}
            {lastMessage.content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  containerSelected: {
    backgroundColor: theme.colors.muted,
  },
  containerUnread: {
    backgroundColor: `${theme.colors.primary}08`,
  },
  avatarContainer: {
    marginRight: 12,
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text,
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  userNameUnread: {
    fontWeight: "800",
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  timestampUnread: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  lastMessageUnread: {
    color: theme.colors.text,
    fontWeight: "600",
  },
});
