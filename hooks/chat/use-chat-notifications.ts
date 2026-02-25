"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";

interface ChatNotification {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  content: string;
  createdAt: Date;
  read: boolean;
}

interface NotificationsResponse {
  notifications: ChatNotification[];
  unreadCount: number;
}

// Fetch notifications from API (initial load)
async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await fetch("/api/chat/notifications");
  if (!response.ok) {
    return { notifications: [], unreadCount: 0 };
  }
  return response.json();
}

// Mark notification as read
async function markNotificationAsRead(notificationId: string): Promise<void> {
  const response = await fetch(
    `/api/chat/notifications/${notificationId}/read`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
}

// Mark all notifications as read
async function markAllNotificationsAsRead(): Promise<void> {
  const response = await fetch("/api/chat/notifications/read-all", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
}

interface UseChatNotificationsOptions {
  enabled?: boolean;
}

/**
 * Chat notifications hook — initial fetch via REST, real-time updates via Socket.io.
 *
 * The useSocketChat hook invalidates the "chat-notifications" query key when
 * a new message arrives for a conversation that isn't currently active,
 * so this hook stays up-to-date without polling.
 */
export function useChatNotifications(
  options: UseChatNotificationsOptions = {}
) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  // Query for notifications — NO polling, Socket.io handles updates
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat-notifications"],
    queryFn: fetchNotifications,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Listen for incoming messages on any conversation (for notification badge)
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = () => {
      // Invalidate notifications to re-fetch unread count
      queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket, isConnected, queryClient]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
    },
  });

  const markAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate(notificationId);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    error: error?.message || null,
    markAsRead,
    markAllAsRead,
  };
}
