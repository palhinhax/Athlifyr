"use client";

import { useQuery } from "@tanstack/react-query";

interface TrialNotification {
  id: string;
  type: "TRIAL_REQUEST";
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  venueId: string;
  venueName: string;
  venueSlug: string;
  venueLogo: string | null;
  sessionId: string;
  sessionTitle: string;
  sessionStartsAt: string;
  sessionEndsAt: string;
  createdAt: string;
}

interface TrialNotificationsResponse {
  notifications: TrialNotification[];
  pendingCount: number;
}

async function fetchTrialNotifications(): Promise<TrialNotificationsResponse> {
  const response = await fetch("/api/notifications/trial-bookings");
  if (!response.ok) {
    return { notifications: [], pendingCount: 0 };
  }
  return response.json();
}

interface UseTrialNotificationsOptions {
  enabled?: boolean;
}

export function useTrialNotifications(
  options: UseTrialNotificationsOptions = {}
) {
  const { enabled = true } = options;

  const { data, isLoading } = useQuery({
    queryKey: ["trial-notifications"],
    queryFn: fetchTrialNotifications,
    enabled,
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });

  return {
    notifications: data?.notifications || [],
    pendingCount: data?.pendingCount || 0,
    isLoading,
  };
}
