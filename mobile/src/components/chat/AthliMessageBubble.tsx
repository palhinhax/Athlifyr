import React, { useCallback } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { format } from "date-fns";
import { Bot } from "lucide-react-native";
import { useRouter } from "expo-router";
import Markdown from "react-native-markdown-display";
import { theme } from "@/src/constants/theme";
import type { AthliMessage } from "@/src/api/athli";

/** Matches athlifyr.com links and extracts the internal path (events/slug, venues/slug) */
const ATHLIFYR_LINK_RE =
  /^https?:\/\/(?:www\.)?athlifyr\.com\/[a-z]{2}\/(events|venues|v)\/([^/?#]+)/;

interface AthliMessageBubbleProps {
  message: AthliMessage;
}

export function AthliMessageBubble({ message }: AthliMessageBubbleProps) {
  const isUser = message.role === "user";
  const router = useRouter();

  const formatMessageTime = (date: string) => {
    return format(new Date(date), "HH:mm");
  };

  const handleLinkPress = useCallback(
    (url: string) => {
      const match = url.match(ATHLIFYR_LINK_RE);
      if (match) {
        const [, type, slug] = match;
        const route = type === "v" ? "venues" : type;
        router.push(`/${route}/${slug}`);
      } else {
        Linking.openURL(url);
      }
      return false;
    },
    [router]
  );

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {/* Bot avatar for assistant messages */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.botAvatar}>
            <Bot size={18} color={theme.colors.white} />
          </View>
        </View>
      )}

      {/* Message bubble */}
      <View style={styles.messageContent}>
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          {isUser ? (
            <Text style={[styles.messageText, styles.userText]}>
              {message.content}
            </Text>
          ) : (
            <Markdown style={markdownTheme} onLinkPress={handleLinkPress}>
              {message.content}
            </Markdown>
          )}
        </View>
        <Text
          style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  assistantContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContent: {
    maxWidth: "78%",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.muted,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  userText: {
    color: theme.colors.white,
  },
  aiText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userTimestamp: {
    textAlign: "right",
    color: theme.colors.textSecondary,
  },
  aiTimestamp: {
    textAlign: "left",
    color: theme.colors.textSecondary,
  },
});

const markdownTheme = {
  body: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
    color: theme.colors.text,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 6,
  },
  heading1: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  heading2: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: theme.colors.text,
    marginTop: 6,
    marginBottom: 3,
  },
  heading3: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: theme.colors.text,
    marginTop: 6,
    marginBottom: 2,
  },
  strong: {
    fontWeight: "700" as const,
    color: theme.colors.text,
  },
  em: {
    fontStyle: "italic" as const,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: "underline" as const,
  },
  list_item: {
    marginBottom: 2,
  },
  ordered_list: {
    marginBottom: 4,
  },
  bullet_list: {
    marginBottom: 4,
  },
  hr: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: 8,
  },
};
