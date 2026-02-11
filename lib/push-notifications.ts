import { prisma } from "@/lib/prisma";

interface PushNotificationMessage {
  to: string; // Expo push token
  title?: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;
  priority?: "default" | "normal" | "high";
}

interface SendNotificationParams {
  userId: string;
  title?: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;
}

interface ExpoPushTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: Record<string, unknown>;
}

interface ExpoPushResponse {
  data: ExpoPushTicket[];
}

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

/**
 * Send push notification to a specific user
 */
export async function sendPushNotification(
  params: SendNotificationParams
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const { userId, title, body, data, sound, badge, channelId } = params;

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pushNotificationsEnabled: true },
    });

    if (!user || !user.pushNotificationsEnabled) {
      console.log(
        `Push notifications disabled for user ${userId}, skipping...`
      );
      return { success: true, sent: 0, failed: 0 };
    }

    // Get all active push tokens for the user
    const tokens = await prisma.pushToken.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (tokens.length === 0) {
      console.log(`No active push tokens found for user ${userId}`);
      return { success: true, sent: 0, failed: 0 };
    }

    // Prepare messages for Expo Push API
    const messages: PushNotificationMessage[] = tokens.map((token) => ({
      to: token.token,
      title,
      body,
      data,
      sound: sound ?? "default",
      badge,
      channelId: channelId ?? "chat-messages",
      priority: "high",
    }));

    // Send notifications to Expo Push API
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      console.error(
        `Expo Push API error: ${response.status} ${response.statusText}`
      );
      return { success: false, sent: 0, failed: tokens.length };
    }

    const result: ExpoPushResponse = await response.json();

    // Process tickets and handle invalid tokens
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < result.data.length; i++) {
      const ticket = result.data[i];
      const token = tokens[i];

      if (ticket.status === "error") {
        failed++;
        console.error(
          `Failed to send push notification to token ${token.id}:`,
          ticket.message
        );

        // Deactivate token if it's invalid
        if (
          ticket.message?.includes("DeviceNotRegistered") ||
          ticket.message?.includes("InvalidCredentials")
        ) {
          await prisma.pushToken.update({
            where: { id: token.id },
            data: { isActive: false },
          });
          console.log(`Deactivated invalid token ${token.id}`);
        }
      } else {
        sent++;
      }
    }

    console.log(
      `Push notification sent to user ${userId}: ${sent} sent, ${failed} failed`
    );

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, sent: 0, failed: 0 };
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  params: Omit<SendNotificationParams, "userId">
): Promise<{ success: boolean; totalSent: number; totalFailed: number }> {
  let totalSent = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification({ ...params, userId });
    totalSent += result.sent;
    totalFailed += result.failed;
  }

  return { success: true, totalSent, totalFailed };
}

/**
 * Send chat message notification
 */
export async function sendChatMessageNotification(params: {
  recipientUserId: string;
  senderName: string;
  messageContent: string;
  conversationId: string;
  messageId: string;
}): Promise<void> {
  const {
    recipientUserId,
    senderName,
    messageContent,
    conversationId,
    messageId,
  } = params;

  // Truncate message content for preview (max 80 chars)
  const preview =
    messageContent.length > 80
      ? `${messageContent.substring(0, 80)}...`
      : messageContent;

  await sendPushNotification({
    userId: recipientUserId,
    title: `New message from ${senderName}`,
    body: preview,
    data: {
      type: "chat_message",
      conversationId,
      messageId,
      screen: "chat",
      route: `/chat/${conversationId}`,
    },
    sound: "default",
    channelId: "chat-messages",
  });
}

/**
 * Send event date change notification to all participating users
 */
export async function sendEventDateChangeNotification(params: {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  oldDate: Date;
  newDate: Date;
}): Promise<{ success: boolean; totalSent: number; totalFailed: number }> {
  const { eventId, eventTitle, eventSlug, oldDate, newDate } = params;

  // Get all users participating in this event
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      status: "going",
    },
    select: {
      userId: true,
    },
  });

  if (participations.length === 0) {
    console.log(`No participants found for event ${eventId}`);
    return { success: true, totalSent: 0, totalFailed: 0 };
  }

  const userIds = participations.map((p) => p.userId);

  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const oldDateStr = formatDate(oldDate);
  const newDateStr = formatDate(newDate);

  // Send notifications to all participants
  const result = await sendPushNotificationToUsers(userIds, {
    title: "📅 Event Date Changed",
    body: `The event "${eventTitle}" has been rescheduled from ${oldDateStr} to ${newDateStr}`,
    data: {
      type: "event_date_change",
      eventId,
      eventSlug,
      oldDate: oldDate.toISOString(),
      newDate: newDate.toISOString(),
      screen: "event",
      route: `/events/${eventSlug}`,
    },
    sound: "default",
    channelId: "event-updates",
  });

  console.log(
    `Event date change notification for "${eventTitle}": ${result.totalSent} sent, ${result.totalFailed} failed`
  );

  return result;
}
