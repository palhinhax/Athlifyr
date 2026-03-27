import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bot } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { theme } from "@/src/constants/theme";
import type { AthliConversation } from "@/src/api/athli";

interface AthliConversationItemProps {
  lastConversation: AthliConversation | null;
  subtitle: string;
  onPress: () => void;
}

/**
 * Renders an Athli AI entry in the conversations list.
 * Looks identical to ConversationListItem but with a bot avatar.
 */
export function AthliConversationItem({
  lastConversation,
  subtitle,
  onPress,
}: AthliConversationItemProps) {
  const lastMessage = lastConversation?.messages?.[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Bot Avatar — same size/position as user avatars */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, styles.botAvatar]}>
          <Bot size={22} color={theme.colors.white} />
        </View>
      </View>

      {/* Content — mirrors ConversationListItem layout */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName} numberOfLines={1}>
            Athli AI
          </Text>
          {lastConversation && (
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(lastConversation.updatedAt), {
                addSuffix: false,
              })}
            </Text>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage?.content || subtitle}
        </Text>
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
  avatarContainer: {
    marginRight: 12,
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  botAvatar: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
