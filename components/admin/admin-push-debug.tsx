"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export function AdminPushDebug() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState({
    swRegistered: false,
    swActive: false,
    swControlling: false,
    notificationPermission: "default" as NotificationPermission,
    pushSubscription: null as PushSubscription | null,
    vapidKeyConfigured: false,
    serviceWorkerUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Check all web push components
  const checkSystem = async () => {
    setIsLoading(true);
    const info = { ...debugInfo };

    try {
      // Check VAPID key
      info.vapidKeyConfigured = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      // Check notification permission
      if ("Notification" in window) {
        info.notificationPermission = Notification.permission;
      }

      // Check service worker
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const swReg = registrations.find((r) =>
          r.active?.scriptURL.includes("sw.js")
        );

        if (swReg) {
          info.swRegistered = true;
          info.swActive = !!swReg.active;
          info.serviceWorkerUrl = swReg.active?.scriptURL || "";
          info.swControlling = !!navigator.serviceWorker.controller;

          // Check push subscription
          try {
            const subscription = await swReg.pushManager.getSubscription();
            info.pushSubscription = subscription;
          } catch (err) {
            console.error("Error getting push subscription:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error checking system:", err);
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  // Request notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser doesn't support notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setDebugInfo({ ...debugInfo, notificationPermission: permission });

      if (permission === "granted") {
        setTestResult("✅ Permission granted! Now register service worker.");
      } else {
        setTestResult("❌ Permission denied!");
      }
    } catch (err) {
      console.error("Error requesting permission:", err);
      setTestResult(`❌ Error: ${err}`);
    }
  };

  // Register service worker
  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("This browser doesn't support service workers");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        type: "classic",
      });

      console.log("✅ Service worker registered:", registration);
      setTestResult("✅ Service worker registered successfully!");

      // Wait for it to be ready
      await navigator.serviceWorker.ready;
      await checkSystem();
    } catch (err) {
      console.error("❌ Service worker registration failed:", err);
      setTestResult(`❌ SW registration failed: ${err}`);
    }
  };

  // Subscribe to push
  const subscribeToPush = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        setTestResult("❌ VAPID key not configured!");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      // Convert VAPID key
      const vapidKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey as BufferSource,
      });

      console.log("✅ Push subscription:", subscription);

      // Send to backend
      const response = await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      setTestResult("✅ Push subscription successful!");
      await checkSystem();
    } catch (err) {
      console.error("❌ Push subscription failed:", err);
      setTestResult(`❌ Push subscription failed: ${err}`);
    }
  };

  // Send test notification
  const sendTestNotification = async () => {
    if (!session?.user?.id) {
      setTestResult("❌ User not logged in!");
      return;
    }

    try {
      const response = await fetch("/api/admin/notifications/push/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          title: "🧪 Test Push Notification",
          message: "This is a test notification from the debug panel",
          data: {
            url: "/notifications",
            type: "test",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Backend error: ${response.status} - ${errorData.error || "Unknown error"}`
        );
      }

      const result = await response.json();
      console.log("✅ Push notification result:", result);

      setTestResult(
        `✅ Test notification sent! Sent: ${result.data?.sent || 0}, Failed: ${result.data?.failed || 0}`
      );
    } catch (err) {
      console.error("❌ Test notification failed:", err);
      setTestResult(`❌ Test failed: ${err}`);
    }
  };

  // Show browser notification directly (bypass push)
  const showBrowserNotification = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported");
      return;
    }

    if (Notification.permission !== "granted") {
      alert("Permission not granted. Click 'Request Permission' first.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification("🧪 Direct Browser Test", {
        body: "This is a direct notification test",
        icon: "/android-chrome-192x192.png",
        badge: "/android-chrome-192x192.png",
        tag: "test",
        requireInteraction: false,
        data: { url: "/notifications", type: "test" },
      });

      setTestResult("✅ Direct notification shown!");
    } catch (err) {
      console.error("❌ Direct notification failed:", err);
      setTestResult(`❌ Direct notification failed: ${err}`);
    }
  };

  useEffect(() => {
    checkSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Web Push Debug Panel
          <Button
            size="sm"
            variant="outline"
            onClick={checkSystem}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">System Status</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <StatusItem
              label="VAPID Key"
              status={debugInfo.vapidKeyConfigured}
            />
            <StatusItem
              label="Service Worker Registered"
              status={debugInfo.swRegistered}
            />
            <StatusItem
              label="Service Worker Active"
              status={debugInfo.swActive}
            />
            <StatusItem
              label="Service Worker Controlling"
              status={debugInfo.swControlling}
            />
            <StatusItem
              label="Push Subscription"
              status={!!debugInfo.pushSubscription}
            />
            <StatusItem
              label="Notification Permission"
              status={debugInfo.notificationPermission === "granted"}
              value={debugInfo.notificationPermission}
            />
          </div>
          {debugInfo.serviceWorkerUrl && (
            <p className="text-xs text-muted-foreground">
              SW URL: {debugInfo.serviceWorkerUrl}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <h3 className="font-semibold">Debug Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={requestPermission}
              disabled={debugInfo.notificationPermission === "granted"}
            >
              1️⃣ Request Permission
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={registerServiceWorker}
              disabled={debugInfo.swRegistered}
            >
              2️⃣ Register Service Worker
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={subscribeToPush}
              disabled={!debugInfo.swActive || !!debugInfo.pushSubscription}
            >
              3️⃣ Subscribe to Push
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={showBrowserNotification}
              disabled={debugInfo.notificationPermission !== "granted"}
            >
              🧪 Test Direct Notification
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={sendTestNotification}
              disabled={!debugInfo.pushSubscription}
            >
              🚀 Test Push Notification
            </Button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <strong>Result:</strong> {testResult}
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
          <strong className="text-amber-700 dark:text-amber-400">
            📝 How to test:
          </strong>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
            <li>
              Click &quot;Request Permission&quot; and allow notifications
            </li>
            <li>Click &quot;Register Service Worker&quot;</li>
            <li>Click &quot;Subscribe to Push&quot;</li>
            <li>
              Click &quot;Test Direct Notification&quot; (should show
              immediately)
            </li>
            <li>
              Click &quot;Test Push Notification&quot; (goes through backend +
              service worker)
            </li>
          </ol>
        </div>

        {/* Console Instructions */}
        <div className="rounded-md border p-3 text-sm">
          <strong>🔧 Console Debugging:</strong>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
            <li>Open Browser DevTools (F12)</li>
            <li>Go to &quot;Console&quot; tab - look for [SW] logs</li>
            <li>
              Go to &quot;Application&quot; tab → &quot;Service Workers&quot;
            </li>
            <li>Check if service worker is running</li>
            <li>
              Go to &quot;Application&quot; tab → &quot;Push Messaging&quot;
            </li>
            <li>Check subscription details</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusItem({
  label,
  status,
  value,
}: {
  label: string;
  status: boolean;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {status ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">
        {label}
        {value && (
          <Badge variant="outline" className="ml-2">
            {value}
          </Badge>
        )}
      </span>
    </div>
  );
}

// Helper function
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
