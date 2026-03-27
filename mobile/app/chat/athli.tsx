import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import {
  ArrowLeft,
  Bot,
  Plus,
  CalendarDays,
  MapPin,
  Dumbbell,
  Zap,
  History,
  Trash2,
  X,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/src/lib/auth-store";
import { useAthliChat, useAthliConversations } from "@/src/hooks/useAthliChat";
import { AthliMessageBubble } from "@/src/components/chat/AthliMessageBubble";
import { ChatInput } from "@/src/components/chat/ChatInput";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { theme } from "@/src/constants/theme";

const SCROLL_DELAY_MS = 100;

export default function AthliChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { conversationId: paramConversationId } = useLocalSearchParams<{
    conversationId?: string;
  }>();
  const { user, isAuthenticated } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);
  const [showThinking, setShowThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const loadedRef = useRef(false);

  const {
    messages,
    conversationId,
    isLoading,
    isSending,
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation,
  } = useAthliChat();

  const { data: conversations = [], refetch: refetchConversations } =
    useAthliConversations(isAuthenticated);

  // Auto-load conversation on mount — either from param or last conversation
  useEffect(() => {
    if (loadedRef.current) return;
    if (!isAuthenticated) return;

    if (paramConversationId) {
      loadedRef.current = true;
      loadConversation(paramConversationId);
    }
  }, [paramConversationId, isAuthenticated, loadConversation]);

  // If no param was provided, load the most recent conversation once data arrives
  useEffect(() => {
    if (loadedRef.current) return;
    if (paramConversationId) return; // Handled by the param effect
    if (!isAuthenticated) return;
    if (conversations.length > 0) {
      loadedRef.current = true;
      loadConversation(conversations[0].id);
    }
  }, [conversations, paramConversationId, isAuthenticated, loadConversation]);

  // Show thinking indicator when sending
  useEffect(() => {
    setShowThinking(isSending);
  }, [isSending]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, SCROLL_DELAY_MS);
    }
  }, [messages.length, showThinking]);

  const handleSend = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (message: string) => {
      handleSend(message);
    },
    [handleSend]
  );

  const handleNewConversation = useCallback(() => {
    loadedRef.current = true; // Prevent auto-load from kicking in
    startNewConversation();
  }, [startNewConversation]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setShowHistory(false);
      loadedRef.current = true;
      loadConversation(id);
    },
    [loadConversation]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await deleteConversation(id);
      refetchConversations();
    },
    [deleteConversation, refetchConversations]
  );

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Athli AI",
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
        <AuthRequiredView
          icon={Bot}
          titleKey="common.authTitle"
          descriptionKey="common.authDescription"
        />
      </View>
    );
  }

  // Suggestions for welcome screen
  const suggestions = [
    {
      icon: CalendarDays,
      label: t("athli.suggestions.events"),
      message: t("athli.suggestions.eventsMessage"),
    },
    {
      icon: MapPin,
      label: t("athli.suggestions.venues"),
      message: t("athli.suggestions.venuesMessage"),
    },
    {
      icon: Dumbbell,
      label: t("athli.suggestions.training"),
      message: t("athli.suggestions.trainingMessage"),
    },
    {
      icon: Zap,
      label: t("athli.suggestions.workout"),
      message: t("athli.suggestions.workoutMessage"),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Athli AI",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity
                onPress={() => {
                  refetchConversations();
                  setShowHistory(true);
                }}
                style={styles.headerButton}
              >
                <History size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNewConversation}
                style={styles.headerButton}
              >
                <Plus size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* Welcome screen or messages */}
      {messages.length === 0 && !isLoading ? (
        <View style={styles.welcomeContainer}>
          <View style={styles.botAvatarLarge}>
            <Bot size={36} color={theme.colors.white} />
          </View>
          <Text style={styles.welcomeTitle}>{t("athli.welcome")} 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            {t("athli.welcomeDescription")}
          </Text>

          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.label}
                style={styles.suggestionCard}
                onPress={() => handleSuggestion(suggestion.message)}
              >
                <suggestion.icon
                  size={18}
                  color={theme.colors.primary}
                  style={styles.suggestionIcon}
                />
                <Text style={styles.suggestionLabel} numberOfLines={2}>
                  {suggestion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AthliMessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          ListFooterComponent={
            showThinking ? (
              <View style={styles.thinkingContainer}>
                <View style={styles.thinkingBubble}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.thinkingText}>{t("athli.thinking")}</Text>
                </View>
              </View>
            ) : null
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isSending}
        placeholder={t("athli.inputPlaceholder")}
      />

      {/* Conversation History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("athli.history")}</Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                hitSlop={8}
              >
                <X size={22} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {conversations.length === 0 ? (
              <View style={styles.historyEmpty}>
                <Text style={styles.historyEmptyText}>
                  {t("athli.noHistory")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.historyItem,
                      item.id === conversationId && styles.historyItemActive,
                    ]}
                    onPress={() => handleSelectConversation(item.id)}
                  >
                    <View style={styles.historyItemContent}>
                      <Text style={styles.historyItemTitle} numberOfLines={1}>
                        {item.title ||
                          item.messages?.[0]?.content ||
                          "Conversa"}
                      </Text>
                      <Text style={styles.historyItemDate}>
                        {formatDistanceToNow(new Date(item.updatedAt), {
                          addSuffix: true,
                        })}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteConversation(item.id)}
                      hitSlop={8}
                      style={styles.historyDeleteButton}
                    >
                      <Trash2 size={16} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.historySeparator} />
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    paddingRight: 16,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  botAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    maxWidth: 340,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: "47%",
    gap: 8,
  },
  suggestionIcon: {
    flexShrink: 0,
  },
  suggestionLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    flex: 1,
  },
  messagesList: {
    paddingVertical: 8,
  },
  thinkingContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  thinkingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 40,
    gap: 8,
  },
  thinkingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  // Conversation history modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
    color: theme.colors.text,
  },
  historyEmpty: {
    padding: 40,
    alignItems: "center",
  },
  historyEmptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  historyItemActive: {
    backgroundColor: theme.colors.muted,
  },
  historyItemContent: {
    flex: 1,
    marginRight: 12,
  },
  historyItemTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 2,
  },
  historyItemDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  historyDeleteButton: {
    padding: 8,
  },
  historySeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  },
});
