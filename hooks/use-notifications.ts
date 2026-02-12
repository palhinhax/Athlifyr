"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@prisma/client";

export interface NotificationData {
  // Friend-related
  senderId?: string;
  senderName?: string;
  senderImage?: string;

  // Event-related
  eventId?: string;
  eventSlug?: string;
  eventTitle?: string;
  oldDate?: string;
  newDate?: string;

  // Venue-related
  venueId?: string;
  venueSlug?: string;
  venueName?: string;
  venueLogo?: string;
  role?: string;
  inviterName?: string;
  token?: string;

  // Session/Booking-related
  bookingId?: string;
  sessionId?: string;
  sessionTitle?: string;
  sessionStartsAt?: string;

  // Navigation
  route?: string;
  screen?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: NotificationData | null;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  pendingCount: number; // backward compat
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await fetch("/api/notifications");
  if (!response.ok) {
    return { notifications: [], unreadCount: 0, pendingCount: 0 };
  }
  return response.json();
}

async function markAsRead(params: {
  notificationId?: string;
  markAll?: boolean;
}): Promise<void> {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
}

interface UseNotificationsOptions {
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    pendingCount: data?.pendingCount || 0,
    isLoading,
    markAsRead: (notificationId: string) =>
      markAsReadMutation.mutate({ notificationId }),
    markAllAsRead: () => markAsReadMutation.mutate({ markAll: true }),
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}
