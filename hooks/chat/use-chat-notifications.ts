"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

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

// Fetch notifications from API
async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await fetch("/api/chat/notifications");
  if (!response.ok) {
    // Return empty if not found or error
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

export function useChatNotifications(
  options: UseChatNotificationsOptions = {}
) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  // Query for notifications with polling
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat-notifications"],
    queryFn: fetchNotifications,
    enabled,
    refetchInterval: 10000, // Poll every 10 seconds for notifications
    refetchIntervalInBackground: true,
    staleTime: 5000,
  });

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
