"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
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

interface UseChatSocketOptions {
  conversationId: string | null;
  token: string | null;
  onNewMessage?: (message: Message) => void;
}

export function useChatSocket({
  conversationId,
  token,
  onNewMessage,
}: UseChatSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const socket = io({
      path: "/api/socket",
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("error", (err: { message: string }) => {
      console.error("Socket error:", err);
      setError(err.message);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat server");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Join/leave conversation
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected || !conversationId) return;

    // Join the conversation room
    socket.emit("join_conversation", conversationId);

    // Listen for new messages
    const handleMessage = (message: Message) => {
      console.log("New message received:", message);
      onNewMessage?.(message);
    };

    socket.on("message_received", handleMessage);

    return () => {
      socket.emit("leave_conversation", conversationId);
      socket.off("message_received", handleMessage);
    };
  }, [conversationId, isConnected, onNewMessage]);

  // Send message function
  const sendMessage = useCallback(
    (content: string) => {
      const socket = socketRef.current;
      if (!socket || !isConnected || !conversationId) {
        console.error("Cannot send message: socket not connected");
        return false;
      }

      socket.emit("send_message", {
        conversationId,
        content,
      });

      return true;
    },
    [conversationId, isConnected]
  );

  return {
    isConnected,
    error,
    sendMessage,
  };
}
