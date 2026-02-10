"use client";

import { useQuery } from "@tanstack/react-query";

export interface AppNotification {
  id: string;
  type: "TRIAL_REQUEST" | "FRIEND_REQUEST" | "VENUE_INVITE" | "TRIAL_RESPONSE";
  userName: string | null;
  userImage: string | null;
  venueName: string | null;
  venueSlug: string | null;
  role?: string;
  responseStatus?: "BOOKED" | "REJECTED";
  sessionTitle: string | null;
  sessionStartsAt: string | null;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: AppNotification[];
  pendingCount: number;
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await fetch("/api/notifications");
  if (!response.ok) {
    return { notifications: [], pendingCount: 0 };
  }
  return response.json();
}

interface UseNotificationsOptions {
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true } = options;

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });

  return {
    notifications: data?.notifications || [],
    pendingCount: data?.pendingCount || 0,
    isLoading,
  };
}
