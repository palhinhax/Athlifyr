// ============================================================================
// Athlifyr Mobile — Socket.io Chat Hook
//
// Bridges the Socket.io connection with react-query cache for real-time
// chat updates (messages, typing, seen, presence).
// Mirrors the web use-socket-chat.ts but for React Native.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSocket,
  type ChatMessageEvent,
  type ChatTypingEvent,
} from "./useSocket";
import type { Message } from "../api/chat";

interface TypingUser {
  userId: string;
  userName: string | null;
}

interface UseSocketChatOptions {
  conversationId: string | null;
  currentUserId?: string;
}

interface UseSocketChatReturn {
  isConnected: boolean;
  typingUsers: TypingUser[];
  sendMessage: (content: string) => void;
  setTyping: (isTyping: boolean) => void;
  markSeen: () => void;
  onlineUsers: Set<string>;
}

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

  // Join / Leave conversation room
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    if (joinedRoomRef.current && joinedRoomRef.current !== conversationId) {
      socket.emit("chat:leave", joinedRoomRef.current);
    }

    socket.emit("chat:join", conversationId);
    joinedRoomRef.current = conversationId;

    return () => {
      if (joinedRoomRef.current) {
        socket.emit("chat:leave", joinedRoomRef.current);
        joinedRoomRef.current = null;
      }
    };
  }, [socket, isConnected, conversationId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (data: ChatMessageEvent) => {
      if (data.conversationId !== conversationId) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
        return;
      }

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

          const exists = old.some(
            (m) =>
              m.id === newMessage.id ||
              (m.id.startsWith("temp-") &&
                m.content === newMessage.content &&
                m.senderId === newMessage.senderId)
          );

          if (exists) {
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

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.senderId));
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket, isConnected, conversationId, queryClient]);

  // Listen for typing indicators
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTyping = (data: ChatTypingEvent) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === currentUserId) return;

      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        });

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

  // Listen for presence (online/offline)
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOnline = (data: { userId: string }) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
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

  // Send message via Socket.io
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit("chat:message", { conversationId, content });
    },
    [socket, isConnected, conversationId]
  );

  // Typing indicator
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !isConnected || !conversationId) return;
      socket.emit("chat:typing", { conversationId, isTyping });
    },
    [socket, isConnected, conversationId]
  );

  // Mark conversation as seen
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
