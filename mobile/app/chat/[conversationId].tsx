import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { isSameDay, startOfDay } from "date-fns";
import { useChatMessages, useConversations } from "@/src/hooks/useChat";
import { useAuthStore } from "@/src/lib/auth-store";
import { ChatMessage } from "@/src/components/chat/ChatMessage";
import { ChatInput } from "@/src/components/chat/ChatInput";
import { DateSeparator } from "@/src/components/chat/DateSeparator";
import { theme } from "@/src/constants/theme";
import type { Message } from "@/src/api/chat";

type MessageItem =
  | { type: "message"; data: Message }
  | { type: "date"; data: Date };

// Delay before auto-scrolling to allow layout to settle
const SCROLL_DELAY_MS = 100;

export default function ChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const { data: conversations = [] } = useConversations(!!user);
  const conversation = conversations.find((c) => c.id === conversationId);

  const {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    isSending,
    addOptimisticMessage,
    removeOptimisticMessage,
  } = useChatMessages(conversationId || null, {
    enabled: !!conversationId && !!user,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, SCROLL_DELAY_MS);
    }
  }, [messages.length]);

  // Group messages with date separators
  const messageItems = useMemo<MessageItem[]>(() => {
    const items: MessageItem[] = [];
    let lastDate: Date | null = null;

    messages.forEach((message) => {
      const messageDate = startOfDay(new Date(message.createdAt));

      // Add date separator if date changed
      if (!lastDate || !isSameDay(lastDate, messageDate)) {
        items.push({ type: "date", data: messageDate });
        lastDate = messageDate;
      }

      items.push({ type: "message", data: message });
    });

    return items;
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !conversationId) return;

    // Add optimistic message
    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        image: user.image || null,
      },
    };

    addOptimisticMessage(tempMessage);

    try {
      await sendMessage({ content });
    } catch {
      // Remove optimistic message on failure
      removeOptimisticMessage(tempMessage.id);
    }
  };

  const getOtherUser = () => {
    if (!conversation) return null;
    return conversation.participants.find((p) => p.user.id !== user?.id)?.user;
  };

  const otherUser = getOtherUser();

  // Not authenticated
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{t("chat.notAuthenticated")}</Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <Stack.Screen
          options={{
            title: t("chat.loadingConversation"),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Error state
  if (error) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <Stack.Screen
          options={{
            title: t("chat.title"),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{t("common.error")}</Text>
          <Text style={styles.errorDescription}>{error}</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          title: otherUser?.name || t("chat.unknownUser"),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Connection status */}
      {!isConnected && (
        <View style={styles.connectionBanner}>
          <ActivityIndicator
            size="small"
            color={theme.colors.white}
            style={styles.connectionSpinner}
          />
          <Text style={styles.connectionText}>{t("chat.connecting")}</Text>
        </View>
      )}

      {/* Messages list */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t("chat.noMessages")}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messageItems}
          keyExtractor={(item, index) =>
            item.type === "message"
              ? item.data.id
              : `date-${item.data.getTime()}-${index}`
          }
          renderItem={({ item }) => {
            if (item.type === "date") {
              return <DateSeparator date={item.data} />;
            }
            return (
              <ChatMessage
                message={item.data}
                isOwnMessage={item.data.senderId === user.id}
              />
            );
          }}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isConnected || isSending}
        placeholder={t("chat.typeMessage")}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  backButton: {
    paddingRight: 16,
  },
  connectionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  connectionSpinner: {
    marginRight: 8,
  },
  connectionText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
  },
  messagesList: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
