import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MessageCircle, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useConversations } from "@/src/hooks/useChat";
import { useAuthStore } from "@/src/lib/auth-store";
import { ConversationListItem } from "@/src/components/chat/ConversationListItem";
import { theme } from "@/src/constants/theme";

export default function MessagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: conversations = [],
    isLoading,
    isError,
    refetch,
  } = useConversations(isAuthenticated);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleConversationPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const handleNewConversation = () => {
    // TODO: Implement new conversation modal/screen
    // For now, users can start conversations by going to user profiles
  };

  // Not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <MessageCircle size={48} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>{t("chat.notAuthenticated")}</Text>
          <Text style={styles.emptyDescription}>
            {t("chat.signInRequired")}
          </Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t("common.error")}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <MessageCircle size={48} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>{t("chat.noConversations")}</Text>
          <Text style={styles.emptyDescription}>
            {t("chat.noConversationsDescription")}
          </Text>
          <TouchableOpacity
            style={styles.newConversationButton}
            onPress={handleNewConversation}
          >
            <Plus size={20} color={theme.colors.white} />
            <Text style={styles.newConversationButtonText}>
              {t("chat.newConversationButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Conversations list
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            currentUserId={user.id}
            onPress={() => handleConversationPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={
          conversations.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: "600",
  },
  newConversationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  newConversationButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: "600",
  },
});
