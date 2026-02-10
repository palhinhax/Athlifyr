import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

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
  try {
    const response = await api.get<NotificationsResponse>("/notifications");
    return response.data;
  } catch {
    return { notifications: [], pendingCount: 0 };
  }
}

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: isAuthenticated,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });

  return {
    notifications: data?.notifications ?? [],
    pendingCount: data?.pendingCount ?? 0,
    isLoading,
    refetch,
  };
}

export function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
}
