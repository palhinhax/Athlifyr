// ============================================================================
// Athlifyr Mobile — Chat Hooks
//
// NO POLLING — all real-time updates come via Socket.io (useSocketChat).
// These hooks handle initial data fetching and mutations only.
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchConversations,
  fetchMessages,
  sendMessage as sendMessageApi,
  createConversation as createConversationApi,
  hideConversation as hideConversationApi,
  type Message,
  type Conversation,
} from "../api/chat";
import { useSocketChat } from "./useSocketChat";

/**
 * Hook for fetching conversations list
 */
export function useConversations(enabled = true) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for chat messages with Socket.io real-time updates.
 * Initial messages are fetched via REST; subsequent messages arrive via socket.
 */
export function useChatMessages(
  conversationId: string | null,
  options?: {
    enabled?: boolean;
    currentUserId?: string;
  }
) {
  const { enabled = true, currentUserId } = options || {};
  const queryClient = useQueryClient();

  // Initial messages fetch (one-time, REST)
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: enabled && !!conversationId,
    staleTime: 60 * 1000, // 1 minute — socket keeps it fresh
  });

  // Socket.io real-time layer
  const {
    isConnected,
    typingUsers,
    sendMessage: socketSendMessage,
    setTyping,
    markSeen,
    onlineUsers,
  } = useSocketChat({
    conversationId,
    currentUserId,
  });

  // Send message — prefer socket, fallback to REST
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!conversationId) throw new Error("No conversation selected");

      if (isConnected) {
        // Send via socket (live server broadcasts to all participants)
        socketSendMessage(content);
        // Return a temporary message for optimistic UI
        return {
          id: `temp-${Date.now()}`,
          conversationId,
          senderId: currentUserId || "",
          content,
          createdAt: new Date(),
          sender: undefined,
        } satisfies Message;
      }

      // Fallback to REST when socket is down
      return sendMessageApi(conversationId, content);
    },
    onSuccess: (newMessage) => {
      if (!isConnected) {
        // Only update cache manually for REST fallback.
        // Socket messages are handled by useSocketChat.
        queryClient.setQueryData<Message[]>(
          ["messages", conversationId],
          (old) => {
            if (!old) return [newMessage];
            const exists = old.some((m) => m.id === newMessage.id);
            if (exists) return old;
            return [...old, newMessage];
          }
        );
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Add optimistic message
  const addOptimisticMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) => {
          if (!old) return [message];
          return [...old, message];
        }
      );
    },
    [queryClient, conversationId]
  );

  // Remove optimistic message on failure
  const removeOptimisticMessage = useCallback(
    (tempId: string) => {
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) => {
          if (!old) return [];
          return old.filter((m) => m.id !== tempId);
        }
      );
    },
    [queryClient, conversationId]
  );

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    isConnected,
    error: messagesQuery.error ? String(messagesQuery.error) : null,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    addOptimisticMessage,
    removeOptimisticMessage,
    typingUsers,
    setTyping,
    markSeen,
    onlineUsers,
  };
}

/**
 * Hook to create/get a conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: (data) => {
      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
        if (!old) return [data.conversation];
        const exists = old.some((c) => c.id === data.conversation.id);
        if (exists) return old;
        return [data.conversation, ...old];
      });
    },
  });
}

/**
 * Hook to hide a conversation
 */
export function useHideConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hideConversationApi,
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
        if (!old) return [];
        return old.filter((c) => c.id !== conversationId);
      });
    },
  });
}
