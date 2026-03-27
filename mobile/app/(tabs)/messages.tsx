import React, { useState, useEffect, useMemo } from "react";
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
import { useConversations, useCreateConversation } from "@/src/hooks/useChat";
import { useAthliConversations } from "@/src/hooks/useAthliChat";
import { useAuthStore } from "@/src/lib/auth-store";
import { ConversationListItem } from "@/src/components/chat/ConversationListItem";
import { AthliConversationItem } from "@/src/components/chat/AthliConversationItem";
import { NewConversationModal } from "@/src/components/chat/NewConversationModal";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { theme } from "@/src/constants/theme";
import { useSocket } from "@/src/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

export default function MessagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const createConversation = useCreateConversation();

  const {
    data: conversations = [],
    isLoading,
    isError,
    refetch,
  } = useConversations(isAuthenticated);

  const { data: athliConversations = [] } =
    useAthliConversations(isAuthenticated);
  const lastAthliConversation = athliConversations[0] ?? null;

  // Extract user IDs that already have a conversation with the current user
  const existingUserIds = useMemo(() => {
    if (!user) return [];
    return conversations.flatMap((c) =>
      c.participants.filter((p) => p.userId !== user.id).map((p) => p.userId)
    );
  }, [conversations, user]);

  const handleSelectFriend = async (friendId: string) => {
    try {
      const result = await createConversation.mutateAsync(friendId);
      setShowNewConversation(false);
      router.push(`/chat/${result.conversation.id}`);
    } catch (err) {
      console.error("[Messages] Failed to create conversation:", err);
    }
  };

  // Listen for incoming messages to refresh conversations list in real-time
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket, isConnected, queryClient]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: ["athli-conversations"] }),
    ]);
    setRefreshing(false);
  };

  const handleConversationPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const handleAthliPress = () => {
    if (lastAthliConversation) {
      router.push(`/chat/athli?conversationId=${lastAthliConversation.id}`);
    } else {
      router.push("/chat/athli");
    }
  };

  // Not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <AuthRequiredView
          icon={MessageCircle}
          titleKey="common.authTitle"
          descriptionKey="common.authDescription"
        />
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

  // Empty state — still show Athli AI as a conversation
  if (conversations.length === 0) {
    return (
      <View style={styles.container}>
        <AthliConversationItem
          lastConversation={lastAthliConversation}
          subtitle={t("athli.subtitle")}
          onPress={handleAthliPress}
        />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <MessageCircle size={48} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>{t("chat.noConversations")}</Text>
          <Text style={styles.emptyDescription}>
            {t("chat.noConversationsDescription")}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowNewConversation(true)}
        >
          <Plus size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <NewConversationModal
          visible={showNewConversation}
          onClose={() => setShowNewConversation(false)}
          onSelectFriend={handleSelectFriend}
          existingUserIds={existingUserIds}
        />
      </View>
    );
  }

  // Conversations list
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <AthliConversationItem
            lastConversation={lastAthliConversation}
            subtitle={t("athli.subtitle")}
            onPress={handleAthliPress}
          />
        }
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowNewConversation(true)}
      >
        <Plus size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <NewConversationModal
        visible={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onSelectFriend={handleSelectFriend}
        existingUserIds={existingUserIds}
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
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
    fontSize: theme.typography.fontSize.sm,
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
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
