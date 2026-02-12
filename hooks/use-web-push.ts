"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

// Check if browser supports service workers and push notifications
function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function useWebPush() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update permission status
  useEffect(() => {
    if (isPushSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  // Check if user is already subscribed
  useEffect(() => {
    if (!isPushSupported() || !session?.user) return;

    // Only check subscription status, don't register SW here
    checkSubscription();
  }, [session?.user]);

  // Register the service worker
  async function registerServiceWorker() {
    try {
      // Check if SW is already registered
      const registrations = await navigator.serviceWorker.getRegistrations();
      const swRegistered = registrations.some((r) =>
        r.active?.scriptURL.includes("sw.js")
      );

      if (!swRegistered) {
        // Wait a bit for the page to fully load before registering SW
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          type: "classic",
        });
        console.log("[WebPush] Service worker registered");
        return registration;
      }

      return await navigator.serviceWorker.ready;
    } catch (err) {
      console.error("[WebPush] Failed to register service worker:", err);
      throw err;
    }
  }

  // Check if service worker has an active push subscription
  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  }

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isPushSupported()) {
      setError("Push notifications are not supported in this browser");
      return false;
    }

    if (!session?.user) {
      setError("You must be logged in to enable notifications");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        setError("Notification permission denied");
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();

      await navigator.serviceWorker.ready;

      // Subscribe to push
      const applicationServerKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      );
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      });

      // Send subscription to backend
      const response = await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        throw new Error("Failed to register subscription with server");
      }

      console.log("✅ Successfully subscribed to push notifications");
      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("Error subscribing to push notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to subscribe to push"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!isPushSupported()) return false;

    try {
      setIsLoading(true);
      setError(null);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return true;
      }

      // Unsubscribe from push
      await subscription.unsubscribe();

      // Remove subscription from backend
      await fetch(
        `/api/web-push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`,
        {
          method: "DELETE",
        }
      );

      console.log("✅ Successfully unsubscribed from push notifications");
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error("Error unsubscribing from push notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to unsubscribe from push"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSubscribed,
    permission,
    isLoading,
    error,
    isSupported: isPushSupported(),
    subscribe,
    unsubscribe,
  };
}

// Convert VAPID public key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as Uint8Array;
}
