import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { theme } from "@/src/constants/theme";
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

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onPress}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {otherUser?.image ? (
          <Image source={{ uri: otherUser.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(otherUser?.name || null)}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName} numberOfLines={1}>
            {otherUser?.name || "Unknown User"}
          </Text>
          {lastMessage && (
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(lastMessage.createdAt), {
                addSuffix: false,
              })}
            </Text>
          )}
        </View>
        {lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
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
  avatarContainer: {
    marginRight: 12,
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
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  lastMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
