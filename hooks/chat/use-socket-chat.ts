"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSocket,
  type ChatMessageEvent,
  type ChatTypingEvent,
} from "@/providers/socket-provider";
import type { Message } from "./use-chat";

// ─── Types ─────────────────────────────────────────────────────────────────

interface TypingUser {
  userId: string;
  userName: string | null;
}

interface UseSocketChatOptions {
  /** Conversation ID to join */
  conversationId: string | null;
  /** Current authenticated user ID (to exclude own typing events) */
  currentUserId?: string;
}

interface UseSocketChatReturn {
  /** Whether the socket is connected to the live server */
  isConnected: boolean;
  /** Users currently typing in this conversation */
  typingUsers: TypingUser[];
  /** Send a message via Socket.io (real-time) */
  sendMessage: (content: string) => void;
  /** Start/stop typing indicator */
  setTyping: (isTyping: boolean) => void;
  /** Mark conversation as seen */
  markSeen: () => void;
  /** Online user IDs */
  onlineUsers: Set<string>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Hook that bridges the Socket.io connection with the @tanstack/react-query
 * cache for real-time chat updates (messages, typing, seen, presence).
 *
 * It does NOT replace the initial message fetch — that still happens via REST.
 * It replaces the polling for NEW messages with Socket.io events.
 */
export function useSocketChat({
  conversationId,
  currentUserId,
}: UseSocketChatOptions): UseSocketChatReturn {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const joinedRoomRef = useRef<string | null>(null);
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // ── Join / Leave conversation room ─────────────────────────────────────

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    // Leave previous room if switching conversations
    if (joinedRoomRef.current && joinedRoomRef.current !== conversationId) {
      socket.emit("chat:leave", joinedRoomRef.current);
    }

    // Join new room
    socket.emit("chat:join", conversationId);
    joinedRoomRef.current = conversationId;

    return () => {
      if (joinedRoomRef.current) {
        socket.emit("chat:leave", joinedRoomRef.current);
        joinedRoomRef.current = null;
      }
    };
  }, [socket, isConnected, conversationId]);

  // ── Listen for incoming messages ───────────────────────────────────────

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (data: ChatMessageEvent) => {
      // Only process messages for the current conversation
      if (data.conversationId !== conversationId) {
        // Message for another conversation — invalidate conversations list
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
        return;
      }

      // Convert socket event to Message format and add to cache
      const newMessage: Message = {
        id: data.id,
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        createdAt: new Date(data.createdAt),
        sender: {
          id: data.senderId,
          name: data.senderName,
          image: data.senderImage,
        },
      };

      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) => {
          if (!old) return [newMessage];

          // Avoid duplicates (message may already exist from optimistic update)
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

      // Update conversations list (last message preview)
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Remove sender from typing users
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.senderId));
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket, isConnected, conversationId, queryClient]);

  // ── Listen for typing indicators ──────────────────────────────────────

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTyping = (data: ChatTypingEvent) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === currentUserId) return; // Ignore own typing

      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        });

        // Auto-clear after 5 seconds (safety net)
        const existing = typingTimeoutsRef.current.get(data.userId);
        if (existing) clearTimeout(existing);

        const timeout = setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== data.userId)
          );
          typingTimeoutsRef.current.delete(data.userId);
        }, 5000);

        typingTimeoutsRef.current.set(data.userId, timeout);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        const existing = typingTimeoutsRef.current.get(data.userId);
        if (existing) {
          clearTimeout(existing);
          typingTimeoutsRef.current.delete(data.userId);
        }
      }
    };

    socket.on("chat:typing", handleTyping);

    return () => {
      socket.off("chat:typing", handleTyping);
    };
  }, [socket, isConnected, conversationId, currentUserId]);

  // ── Listen for seen events ────────────────────────────────────────────

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleSeen = () => {
      // Invalidate notifications when someone sees a conversation
      queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
    };

    socket.on("chat:seen", handleSeen);

    return () => {
      socket.off("chat:seen", handleSeen);
    };
  }, [socket, isConnected, queryClient]);

  // ── Listen for presence events ────────────────────────────────────────

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOnline = (data: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleOffline = (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.userId);
        return next;
      });
    };

    socket.on("chat:user_online", handleOnline);
    socket.on("chat:user_offline", handleOffline);

    return () => {
      socket.off("chat:user_online", handleOnline);
      socket.off("chat:user_offline", handleOffline);
    };
  }, [socket, isConnected]);

  // ── Clean up typing timeouts on unmount ───────────────────────────────

  useEffect(() => {
    const timeouts = typingTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit("chat:message", { conversationId, content });
    },
    [socket, isConnected, conversationId]
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit("chat:typing", { conversationId, isTyping });
    },
    [socket, isConnected, conversationId]
  );

  const markSeen = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit("chat:seen", conversationId);
  }, [socket, isConnected, conversationId]);

  return {
    isConnected,
    typingUsers,
    sendMessage,
    setTyping,
    markSeen,
    onlineUsers,
  };
}
