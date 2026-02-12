import { useEffect } from "react";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";

/**
 * PushNotificationProvider
 * Initializes push notifications when the app starts
 * and handles registration/deregistration based on auth state
 */
export function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { error } = usePushNotifications();

  // Log errors (in production, you might want to send these to an error tracking service)
  useEffect(() => {
    if (error) {
      console.error("Push notification error:", error);
    }
  }, [error]);

  return <>{children}</>;
}
