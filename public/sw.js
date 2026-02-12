// Service Worker for Web Push Notifications
/* eslint-disable no-restricted-globals */

// Listen for push events
self.addEventListener("push", (event) => {
  if (!event.data) {
    console.warn("[SW] Push event received but no data");
    return;
  }

  // Log raw data for debugging
  console.log("[SW] Raw push data type:", typeof event.data);
  console.log("[SW] Can get text:", typeof event.data.text === "function");
  console.log("[SW] Can get json:", typeof event.data.json === "function");

  try {
    // Try to parse as JSON first
    let data;
    try {
      data = event.data.json();
      console.log("[SW] ✅ Successfully parsed as JSON");
    } catch (jsonError) {
      // If JSON parsing fails, try to get as text
      console.warn("[SW] ⚠️ Failed to parse as JSON:", jsonError.message);
      const text = event.data.text();
      console.log("[SW] 📝 Received as text:", text);

      // Create a fallback notification
      data = {
        title: "Nova Notificação",
        body: text || "Tens uma nova mensagem",
      };
    }

    console.log("[SW] Push notification received:", data);

    const options = {
      body: data.body || "You have a new notification",
      icon: data.icon || "/android-chrome-192x192.png",
      badge: "/android-chrome-192x192.png",
      image: data.image,
      tag: data.tag || "notification",
      requireInteraction: false,
      data: data.data || {},
      actions: data.actions || [],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Athlifyr", options)
    );
  } catch (error) {
    console.error("[SW] ❌ Error showing notification:", error);

    // Even if there's an error, try to show a basic notification
    event.waitUntil(
      self.registration.showNotification("Athlifyr", {
        body: "Tens uma nova notificação",
        icon: "/android-chrome-192x192.png",
      })
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log(
    "[SW] Notification click:",
    event.notification.tag,
    event.notification.data
  );
  event.notification.close();

  const data = event.notification.data || {};

  // Build URL: prioritize data.url, then conversationId for chat, then generic fallback
  let urlToOpen = "/";

  if (data.url) {
    urlToOpen = data.url;
  } else if (
    data.type === "admin_announcement" ||
    data.type === "admin_broadcast"
  ) {
    urlToOpen = data.url || "/pt/notifications";
  } else if (data.type === "chat_message" && data.conversationId) {
    urlToOpen = `/pt/chat/${data.conversationId}`;
  } else if (data.route) {
    urlToOpen = data.route;
  }

  // Ensure URL has locale prefix (default to /pt/)
  if (
    urlToOpen &&
    !urlToOpen.startsWith("http") &&
    !urlToOpen.startsWith("/pt/") &&
    !urlToOpen.startsWith("/en/") &&
    !urlToOpen.startsWith("/es/") &&
    !urlToOpen.startsWith("/fr/") &&
    !urlToOpen.startsWith("/de/") &&
    !urlToOpen.startsWith("/it/")
  ) {
    // Remove leading slash if present
    const path = urlToOpen.startsWith("/") ? urlToOpen.substring(1) : urlToOpen;
    urlToOpen = `/pt/${path}`;
  }

  console.log("[SW] Opening URL:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window/tab open with this site
        for (const client of windowClients) {
          if (
            new URL(client.url).origin === self.location.origin &&
            "focus" in client
          ) {
            // Navigate to the target URL within the existing window
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification closed:", event.notification.tag);
});

// Install event
self.addEventListener("install", () => {
  console.log("[SW] Service Worker installing");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activating");
  event.waitUntil(clients.claim());
});
