import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "TRIAL_REQUEST"
  | "TRIAL_ACCEPTED"
  | "TRIAL_REJECTED"
  | "EVENT_DATE_CHANGE"
  | "EVENT_CANCELLED"
  | "VENUE_INVITE"
  | "VENUE_INVITE_ACCEPTED"
  | "CHAT_MESSAGE";

/** Keep backward-compat alias for TRIAL_RESPONSE mapped to TRIAL_ACCEPTED/REJECTED */
export type LegacyNotificationType = NotificationType | "TRIAL_RESPONSE";

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
  type: LegacyNotificationType;
  title: string;
  body: string;
  data: NotificationData | null;
  read: boolean;
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
  unreadCount: number;
  pendingCount: number;
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  try {
    const response = await api.get<NotificationsResponse>("/notifications");
    return response.data;
  } catch {
    return { notifications: [], unreadCount: 0, pendingCount: 0 };
  }
}

async function markAsReadApi(params: {
  notificationId?: string;
  markAll?: boolean;
}): Promise<void> {
  await api.post("/notifications", params);
}

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000, // 5 minutes — push notifications handle real-time
    refetchIntervalInBackground: false,
    staleTime: 2 * 60 * 1000, // consider data fresh for 2 minutes
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    pendingCount: data?.pendingCount ?? 0,
    isLoading,
    refetch,
    markAsRead: (notificationId: string) =>
      markAsReadMutation.mutate({ notificationId }),
    markAllAsRead: () => markAsReadMutation.mutate({ markAll: true }),
  };
}

export function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
}
