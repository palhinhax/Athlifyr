"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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

interface Notification {
  id: string;
  message: Message;
  read: boolean;
  createdAt: Date;
}

interface UseChatNotificationsOptions {
  enabled?: boolean;
  onNewMessage?: (message: Message) => void;
}

export function useChatNotifications({
  enabled = true,
  onNewMessage,
}: UseChatNotificationsOptions = {}) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const tokenRef = useRef<string | null>(null);

  // Request browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Fetch socket token
  useEffect(() => {
    if (status !== "authenticated" || !enabled) return;

    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/socket-token");
        if (response.ok) {
          const data = await response.json();
          tokenRef.current = data.token;
        }
      } catch (error) {
        console.error("Error fetching socket token:", error);
      }
    };

    fetchToken();
  }, [status, enabled]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch {
      // Ignore errors
    }
  }, []);

  // Initialize global socket connection for notifications
  useEffect(() => {
    if (!enabled || status !== "authenticated") return;

    // Wait for token
    const initSocket = () => {
      if (!tokenRef.current) {
        setTimeout(initSocket, 500);
        return;
      }

      const socket = io({
        path: "/api/socket",
        auth: {
          token: tokenRef.current,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Notification socket connected");
        setIsConnected(true);

        // Join all user's conversations for notifications
        socket.emit("join_user_notifications");
      });

      socket.on("disconnect", () => {
        console.log("Notification socket disconnected");
        setIsConnected(false);
      });

      // Listen for new messages globally
      socket.on("new_message_notification", (message: Message) => {
        // Don't notify for own messages
        if (message.senderId === session?.user?.id) return;

        console.log("New message notification:", message);

        // Add to notifications
        const notification: Notification = {
          id: `notif-${message.id}`,
          message,
          read: false,
          createdAt: new Date(),
        };

        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        setUnreadCount((prev) => prev + 1);

        // Callback
        onNewMessage?.(message);

        // Show browser notification if page is not focused
        if (document.hidden && "Notification" in window) {
          if (Notification.permission === "granted") {
            const senderName = message.sender.name || "Someone";
            const notif = new window.Notification(`${senderName}`, {
              body: message.content.slice(0, 100),
              icon: message.sender.image || "/icon-192x192.png",
              tag: message.conversationId,
            });

            notif.onclick = () => {
              window.focus();
              window.location.href = `/chat?conversation=${message.conversationId}`;
              notif.close();
            };

            // Auto close after 5 seconds
            setTimeout(() => notif.close(), 5000);
          }
        }

        // Play notification sound
        playNotificationSound();
      });
    };

    initSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [enabled, status, session?.user?.id, onNewMessage, playNotificationSound]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
