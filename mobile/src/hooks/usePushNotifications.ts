import { useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface PushNotificationData {
  type?: string;
  conversationId?: string;
  messageId?: string;
  eventId?: string;
  eventSlug?: string;
  oldDate?: string;
  newDate?: string;
  screen?: string;
  route?: string;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const router = useRouter();
  const { user } = useAuthStore();

  /**
   * Register for push notifications
   */
  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      setError("Push notifications only work on physical devices");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check/request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setPermissionStatus("denied");
        setError("Permission to receive push notifications was denied");
        return null;
      }

      setPermissionStatus("granted");

      // Get the token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id", // Replace with your Expo project ID
      });

      const token = tokenData.data;
      setExpoPushToken(token);

      // Set up notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("chat-messages", {
          name: "Chat Messages",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
          enableVibrate: true,
        });

        // Event updates channel for date changes, cancellations, etc.
        await Notifications.setNotificationChannelAsync("event-updates", {
          name: "Event Updates",
          description: "Notifications about events you're attending",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#4F46E5",
          sound: "default",
          enableVibrate: true,
        });
      }

      // Register token with backend (if user is logged in)
      if (user && token) {
        await registerTokenWithBackend(token);
      }

      return token;
    } catch (err) {
      console.error("Error registering for push notifications:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to register for push notifications"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Register token with backend API
   */
  async function registerTokenWithBackend(token: string) {
    try {
      const deviceId = await getDeviceId();
      const platform = Platform.OS as "android" | "ios";

      await api.post("/push-tokens", {
        token,
        platform,
        deviceId,
      });

      console.log("Push token registered with backend");
    } catch (err) {
      console.error("Error registering token with backend:", err);
      // Don't throw - token registration failure shouldn't block the app
    }
  }

  /**
   * Deregister push token (e.g., on logout)
   */
  async function deregisterPushToken() {
    if (!expoPushToken) return;

    try {
      await api.delete(`/push-tokens/${expoPushToken}`);
      console.log("Push token deregistered");
      setExpoPushToken(null);
    } catch (err) {
      console.error("Error deregistering token:", err);
    }
  }

  /**
   * Get stable device ID
   */
  async function getDeviceId(): Promise<string | undefined> {
    try {
      // Try to get a stable device identifier
      // Note: This may not work on all devices/platforms
      return (await Device.deviceName) || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Handle notification received in foreground
   */
  const handleNotificationReceived = useCallback(
    (notification: Notifications.Notification) => {
      console.log("Notification received in foreground:", notification);
      setNotification(notification);
    },
    []
  );

  /**
   * Handle notification tapped/clicked
   */
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      console.log("Notification tapped:", response);

      const data = response.notification.request.content
        .data as PushNotificationData;

      // Navigate based on notification data
      if (data.type === "chat_message" && data.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      } else if (data.type === "event_date_change" && data.eventSlug) {
        // Navigate to event page when event date change notification is tapped
        router.push(`/events/${data.eventSlug}`);
      } else if (data.route) {
        router.push(data.route);
      }
    },
    [router]
  );

  /**
   * Set up notification listeners
   */
  useEffect(() => {
    // Listener for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(handleNotificationReceived);

    // Listener for when a notification is tapped/clicked
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [handleNotificationReceived, handleNotificationResponse]);

  /**
   * Register for push notifications when user logs in
   */
  useEffect(() => {
    if (user && !expoPushToken) {
      registerForPushNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Handle last notification that opened the app
   */
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });
  }, [handleNotificationResponse]);

  return {
    expoPushToken,
    notification,
    permissionStatus,
    isLoading,
    error,
    registerForPushNotifications,
    deregisterPushToken,
  };
}
