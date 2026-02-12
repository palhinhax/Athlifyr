import { useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import axios from "axios";

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === "expo";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
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

  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  const router = useRouter();
  const { user, pushToken: storedPushToken, setPushToken } = useAuthStore();

  /**
   * Register for push notifications
   */
  async function registerForPushNotifications() {
    // Skip push notifications in Expo Go (SDK 53+)
    if (isExpoGo) {
      console.log(
        "Push notifications are not available in Expo Go. Use a development build or production APK."
      );
      setError("Push notifications require a development build");
      return null;
    }

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
      console.log("🎫 Getting Expo push token...");
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas?.projectId ??
          "d8beface-ad76-4676-ba16-5779e1c7672e",
      });

      const token = tokenData.data;
      console.log("✅ Got Expo push token:", token.substring(0, 30) + "...");
      setExpoPushToken(token);

      // Persist token in auth store (available for logout deregistration)
      await setPushToken(token);

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
        console.log("👤 User is logged in, registering with backend...", {
          userId: user.id,
          userName: user.name,
        });
        await registerTokenWithBackend(token);
      } else {
        console.warn("⚠️ Cannot register push token with backend:", {
          hasUser: !!user,
          hasToken: !!token,
          reason: !user ? "User not logged in" : "Token not available",
        });
        console.warn(
          "📝 Token will be registered automatically when user logs in"
        );
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
      const deviceName = Device.deviceName || undefined;
      const platform = Platform.OS as "android" | "ios";

      // Check if user is authenticated before attempting registration
      const authToken = await SecureStore.getItemAsync("auth-token");

      console.log("📲 Registering push token with backend:", {
        platform,
        deviceName,
        deviceId,
        hasToken: !!token,
        hasAuthToken: !!authToken,
        authTokenPrefix: authToken?.substring(0, 20),
      });

      if (!authToken) {
        console.warn(
          "⚠️ No auth token found - skipping push token registration"
        );
        console.warn(
          "User must be logged in to register for push notifications"
        );
        return;
      }

      await api.post("/push-tokens", {
        token,
        platform,
        deviceId,
        deviceName,
      });

      console.log("✅ Push token registered with backend");
    } catch (err: unknown) {
      console.error("❌ Error registering token with backend:", err);
      if (axios.isAxiosError(err)) {
        console.error("Response status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        console.error("Request URL:", err.config?.url);
        console.error("Request method:", err.config?.method);
      }
      // Don't throw - token registration failure shouldn't block the app
    }
  }

  /**
   * Verify stored token is still current and re-register if Expo rotated it
   */
  async function verifyAndRefreshToken(storedToken: string) {
    try {
      if (!Device.isDevice) return;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas?.projectId ??
          "d8beface-ad76-4676-ba16-5779e1c7672e",
      });

      const currentToken = tokenData.data;

      // Token changed (reinstall, Expo rotation, etc.) — re-register
      if (currentToken !== storedToken) {
        console.log("🔄 Push token changed, updating...", {
          oldTokenPrefix: storedToken.substring(0, 30),
          newTokenPrefix: currentToken.substring(0, 30),
        });
        setExpoPushToken(currentToken);
        await setPushToken(currentToken);

        // Only register with backend if user is logged in
        if (user) {
          console.log(
            "✅ User is logged in, re-registering push token with backend"
          );
          await registerTokenWithBackend(currentToken);
        } else {
          console.warn(
            "⚠️ Push token changed but user not logged in - skipping backend registration"
          );
          console.warn("📝 Token will be registered when user logs in");
        }
      }
    } catch (err) {
      console.error("Error verifying push token:", err);
    }
  }

  /**
   * Deregister push token (e.g., on logout)
   */
  async function deregisterPushToken() {
    const tokenToDeregister = expoPushToken || storedPushToken;
    if (!tokenToDeregister) return;

    try {
      await api.delete(`/push-tokens/${encodeURIComponent(tokenToDeregister)}`);
      console.log("Push token deregistered");
      setExpoPushToken(null);
      await setPushToken(null);
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

      // Normalize type to uppercase (backend sends Prisma enum format: EVENT_CANCELLED)
      const notificationType = data.type?.toUpperCase();

      // Navigate based on notification data
      if (notificationType === "CHAT_MESSAGE" && data.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      } else if (
        (notificationType === "EVENT_DATE_CHANGE" ||
          notificationType === "EVENT_CANCELLED") &&
        data.eventSlug
      ) {
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
    // Skip in Expo Go
    if (isExpoGo) {
      return;
    }

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
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [handleNotificationReceived, handleNotificationResponse]);

  /**
   * Register for push notifications when user logs in
   */
  useEffect(() => {
    // Skip in Expo Go
    if (isExpoGo) {
      console.log("⚠️ Skipping push notifications - running in Expo Go");
      return;
    }

    console.log("🔍 Push notifications effect:", {
      hasUser: !!user,
      hasExpoPushToken: !!expoPushToken,
      hasStoredPushToken: !!storedPushToken,
    });

    // Only register if user is logged in and we don't already have a token
    // storedPushToken comes from SecureStore (survives app restart)
    // expoPushToken comes from local state (current session)
    if (user && !expoPushToken) {
      if (storedPushToken) {
        // Restore token from SecureStore and re-register with backend
        console.log("♻️ Restoring push token from SecureStore");
        setExpoPushToken(storedPushToken);
        // Re-register with backend in case user just logged in
        console.log("📲 Re-registering push token with backend after login");
        registerTokenWithBackend(storedPushToken);
        // Also verify the token is still current (Expo may have rotated it)
        verifyAndRefreshToken(storedPushToken);
      } else {
        // First time — generate token and register with backend
        console.log("🆕 Registering for push notifications (first time)");
        registerForPushNotifications();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Handle last notification that opened the app
   */
  useEffect(() => {
    // Skip in Expo Go
    if (isExpoGo) {
      return;
    }

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
