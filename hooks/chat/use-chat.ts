"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Conversation {
  id: string;
  participants: Array<{
    user: {
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  updatedAt: Date;
}

const LIVE_SERVER_URL = process.env.NEXT_PUBLIC_LIVE_URL;
const LIVE_CHAT_BASE = LIVE_SERVER_URL
  ? `${LIVE_SERVER_URL.replace(/\/$/, "")}/api/chat`
  : null;

interface LiveFetchOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
}

async function fetchLiveToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/live-token");
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

async function liveFetch<T>(
  path: string,
  options: LiveFetchOptions = {}
): Promise<T> {
  if (!LIVE_CHAT_BASE) {
    throw new Error("Live server URL not configured");
  }

  const token = await fetchLiveToken();
  if (!token) {
    throw new Error("Failed to obtain live token");
  }

  try {
    const response = await fetch(`${LIVE_CHAT_BASE}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error("Live chat request failed");
    }
    return (await response.json()) as T;
  } catch {
    throw new Error("Live chat request failed");
  }
}

// Fetch conversations list
async function fetchConversations(): Promise<Conversation[]> {
  const liveData = await liveFetch<{ conversations: Conversation[] }>(
    "/conversations"
  );
  return liveData.conversations || [];
}

// Fetch messages for a conversation (initial load only)
async function fetchMessages(conversationId: string): Promise<Message[]> {
  const liveData = await liveFetch<{ messages: Message[] }>(
    `/conversations/${conversationId}/messages`
  );
  return liveData.messages || [];
}

// Send a message via REST API (fallback when Socket.io is unavailable)
async function sendMessageApi(
  conversationId: string,
  content: string
): Promise<Message> {
  const liveData = await liveFetch<{ message: Message }>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: { content },
    }
  );

  return liveData.message;
}

// Create or get conversation
async function createConversation(
  otherUserId: string
): Promise<{ conversation: Conversation }> {
  return liveFetch<{ conversation: Conversation }>("/conversations", {
    method: "POST",
    body: { otherUserId },
  });
}

// Hook for conversations list
export function useConversations(enabled = true) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for chat messages — initial fetch via REST, real-time updates via Socket.io.
 *
 * New messages are pushed into the query cache by useSocketChat (from socket-provider).
 * No polling is used — the live server broadcasts events in real-time.
 */
export function useChatMessages(
  conversationId: string | null,
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};
  const queryClient = useQueryClient();

  // Initial messages fetch (one-time load)
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: enabled && !!conversationId,
    staleTime: Infinity, // Don't re-fetch — Socket.io handles updates
    retry: 1,
  });

  // Send message mutation (REST fallback — Socket.io is primary via useSocketChat)
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

          // Check if already exists (avoid duplicate from Socket.io)
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

      // Update conversations list
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
    isConnected: !messagesQuery.isError && messagesQuery.isSuccess,
    error: messagesQuery.error?.message || null,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    addOptimisticMessage,
    removeOptimisticMessage,
  };
}

// Hook to create/get a conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
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
