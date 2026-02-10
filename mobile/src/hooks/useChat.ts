import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState, useEffect } from "react";
import {
  fetchConversations,
  fetchMessages,
  pollMessages,
  sendMessage as sendMessageApi,
  createConversation as createConversationApi,
  hideConversation as hideConversationApi,
  type Message,
  type Conversation,
} from "../api/chat";

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
 * Hook for chat messages with polling
 */
export function useChatMessages(
  conversationId: string | null,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  }
) {
  const { pollingInterval = 2000, enabled = true } = options || {};
  const queryClient = useQueryClient();
  const lastMessageIdRef = useRef<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Initial messages fetch
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: enabled && !!conversationId,
    staleTime: 0, // Always consider stale to enable refetch
  });

  // Update lastMessageIdRef when messages load
  useEffect(() => {
    if (messagesQuery.data && messagesQuery.data.length > 0) {
      lastMessageIdRef.current =
        messagesQuery.data[messagesQuery.data.length - 1].id;
    }
  }, [messagesQuery.data]);

  // Polling for new messages
  useQuery({
    queryKey: ["messages-poll", conversationId, lastMessageIdRef.current],
    queryFn: async () => {
      if (!conversationId) return [];
      setIsPolling(true);
      try {
        const newMessages = await pollMessages(
          conversationId,
          lastMessageIdRef.current
        );

        if (newMessages.length > 0) {
          // Update the main messages cache
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return newMessages;

              // Merge, avoiding duplicates
              const existingIds = new Set(old.map((m) => m.id));
              const uniqueNew = newMessages.filter(
                (m) => !existingIds.has(m.id)
              );

              if (uniqueNew.length > 0) {
                // Update lastMessageIdRef
                lastMessageIdRef.current = uniqueNew[uniqueNew.length - 1].id;
                return [...old, ...uniqueNew];
              }
              return old;
            }
          );
        }

        return newMessages;
      } finally {
        setIsPolling(false);
      }
    },
    enabled: enabled && !!conversationId && !!messagesQuery.data,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      if (!conversationId) throw new Error("No conversation selected");
      return sendMessageApi(conversationId, content);
    },
    onSuccess: (newMessage) => {
      // Add the new message to cache
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) => {
          if (!old) return [newMessage];

          // Check if already exists (avoid duplicate)
          const exists = old.some(
            (m) =>
              m.id === newMessage.id ||
              (m.id.startsWith("temp-") &&
                m.content === newMessage.content &&
                m.senderId === newMessage.senderId)
          );

          if (exists) {
            // Replace temp message with real one
            return old.map((m) =>
              m.id.startsWith("temp-") &&
              m.content === newMessage.content &&
              m.senderId === newMessage.senderId
                ? newMessage
                : m
            );
          }

          return [...old, newMessage];
        }
      );

      // Update lastMessageIdRef
      lastMessageIdRef.current = newMessage.id;

      // Also invalidate conversations to update last message preview
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
    isConnected:
      !messagesQuery.isError && (messagesQuery.isSuccess || isPolling),
    error: messagesQuery.error ? String(messagesQuery.error) : null,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    addOptimisticMessage,
    removeOptimisticMessage,
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
      // Add to conversations cache
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
      // Remove from conversations cache
      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
        if (!old) return [];
        return old.filter((c) => c.id !== conversationId);
      });
    },
  });
}
