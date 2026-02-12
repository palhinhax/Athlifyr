// Service Worker for Web Push Notifications
/* eslint-disable no-restricted-globals */

// Listen for push events
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
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
    console.error("[SW] Error showing notification:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event.notification.tag);
  event.notification.close();

  const data = event.notification.data || {};
  // Build URL: prefer conversationId for chat, then generic url/route
  let urlToOpen = "/";
  if (data.type === "chat_message" && data.conversationId) {
    urlToOpen = `/pt/chat/${data.conversationId}`;
  } else if (data.url) {
    urlToOpen = data.url;
  } else if (data.route) {
    urlToOpen = data.route;
  }

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
