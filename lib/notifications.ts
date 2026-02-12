import { prisma } from "@/lib/prisma";
import { NotificationType, Prisma } from "@prisma/client";
import { sendPushNotification } from "@/lib/push-notifications";

/**
 * Data stored in the notification JSON field
 */
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

  // Chat-related
  conversationId?: string;
  messageId?: string;

  // Navigation
  route?: string;
  screen?: string;
}

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: NotificationData;
  sendPush?: boolean;
  pushChannelId?: string;
}

/**
 * Create a notification in the database and optionally send a push notification
 */
export async function createNotification(
  params: CreateNotificationParams
): Promise<{ notificationId: string; pushSent: boolean }> {
  const {
    userId,
    type,
    title,
    body,
    data,
    sendPush = true,
    pushChannelId,
  } = params;

  // Create notification record in database
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data: data ? (data as Prisma.InputJsonValue) : undefined,
    },
  });

  let pushSent = false;

  // Send push notification if enabled
  if (sendPush) {
    try {
      const result = await sendPushNotification({
        userId,
        title,
        body,
        data: data
          ? {
              type: type.toString(),
              notificationId: notification.id,
              ...(data.route && { route: data.route }),
              ...(data.screen && { screen: data.screen }),
              ...(data.eventId && { eventId: data.eventId }),
              ...(data.eventSlug && { eventSlug: data.eventSlug }),
              ...(data.venueId && { venueId: data.venueId }),
              ...(data.venueSlug && { venueSlug: data.venueSlug }),
              ...(data.conversationId && {
                conversationId: data.conversationId,
              }),
              ...(data.messageId && { messageId: data.messageId }),
              ...(data.senderId && { senderId: data.senderId }),
            }
          : undefined,
        channelId: pushChannelId ?? getDefaultChannelId(type),
      });

      pushSent = result.sent > 0;
    } catch (error) {
      console.error("Failed to send push notification:", error);
    }
  }

  return { notificationId: notification.id, pushSent };
}

/**
 * Create notifications for multiple users
 */
export async function createNotificationsForUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
): Promise<{ created: number; pushSent: number }> {
  let created = 0;
  let pushSent = 0;

  for (const userId of userIds) {
    const result = await createNotification({ ...params, userId });
    created++;
    if (result.pushSent) pushSent++;
  }

  return { created, pushSent };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
      data: { read: true },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });
  return result.count;
}

/**
 * Delete old read notifications (cleanup)
 */
export async function deleteOldNotifications(
  daysOld: number = 30
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.notification.deleteMany({
    where: {
      read: true,
      createdAt: { lt: cutoffDate },
    },
  });
  return result.count;
}

/**
 * Get the default push notification channel for a notification type
 */
function getDefaultChannelId(type: NotificationType): string {
  switch (type) {
    case NotificationType.CHAT_MESSAGE:
      return "chat-messages";
    case NotificationType.EVENT_DATE_CHANGE:
    case NotificationType.EVENT_CANCELLED:
      return "event-updates";
    case NotificationType.FRIEND_REQUEST:
    case NotificationType.FRIEND_ACCEPTED:
      return "social";
    case NotificationType.TRIAL_REQUEST:
    case NotificationType.TRIAL_ACCEPTED:
    case NotificationType.TRIAL_REJECTED:
    case NotificationType.VENUE_INVITE:
    case NotificationType.VENUE_INVITE_ACCEPTED:
      return "venue-updates";
    default:
      return "default";
  }
}

// ============================================================================
// Specialized notification creators
// ============================================================================

/**
 * Send friend request notification
 */
export async function notifyFriendRequest(params: {
  receiverUserId: string;
  senderUserId: string;
  senderName: string;
  senderImage?: string | null;
}): Promise<void> {
  const { receiverUserId, senderUserId, senderName, senderImage } = params;

  await createNotification({
    userId: receiverUserId,
    type: NotificationType.FRIEND_REQUEST,
    title: "New Friend Request",
    body: `${senderName} sent you a friend request`,
    data: {
      senderId: senderUserId,
      senderName,
      senderImage: senderImage ?? undefined,
      route: "/friends",
      screen: "friends",
    },
  });
}

/**
 * Notify friend request accepted
 */
export async function notifyFriendAccepted(params: {
  receiverUserId: string;
  accepterUserId: string;
  accepterName: string;
  accepterImage?: string | null;
}): Promise<void> {
  const { receiverUserId, accepterUserId, accepterName, accepterImage } =
    params;

  await createNotification({
    userId: receiverUserId,
    type: NotificationType.FRIEND_ACCEPTED,
    title: "Friend Request Accepted",
    body: `${accepterName} accepted your friend request`,
    data: {
      senderId: accepterUserId,
      senderName: accepterName,
      senderImage: accepterImage ?? undefined,
      route: `/profile/${accepterUserId}`,
      screen: "profile",
    },
  });
}

/**
 * Send trial booking request notification to venue owners/admins
 */
export async function notifyTrialRequest(params: {
  venueOwnerUserIds: string[];
  bookingId: string;
  requesterName: string;
  requesterImage?: string | null;
  venueName: string;
  venueSlug: string;
  sessionTitle: string;
  sessionStartsAt: Date;
}): Promise<void> {
  const {
    venueOwnerUserIds,
    bookingId,
    requesterName,
    requesterImage,
    venueName,
    venueSlug,
    sessionTitle,
    sessionStartsAt,
  } = params;

  await createNotificationsForUsers(venueOwnerUserIds, {
    type: NotificationType.TRIAL_REQUEST,
    title: "New Trial Request",
    body: `${requesterName} requested a trial class at ${venueName}`,
    data: {
      bookingId,
      senderName: requesterName,
      senderImage: requesterImage ?? undefined,
      venueName,
      venueSlug,
      sessionTitle,
      sessionStartsAt: sessionStartsAt.toISOString(),
      route: `/venues/${venueSlug}/clients`,
      screen: "venue-clients",
    },
  });
}

/**
 * Notify user when their trial is accepted
 */
export async function notifyTrialAccepted(params: {
  userId: string;
  venueName: string;
  venueSlug: string;
  venueLogo?: string | null;
  sessionTitle: string;
  sessionStartsAt: Date;
}): Promise<void> {
  const {
    userId,
    venueName,
    venueSlug,
    venueLogo,
    sessionTitle,
    sessionStartsAt,
  } = params;

  await createNotification({
    userId,
    type: NotificationType.TRIAL_ACCEPTED,
    title: "Trial Accepted! 🎉",
    body: `Your trial at ${venueName} for "${sessionTitle}" has been accepted`,
    data: {
      venueName,
      venueSlug,
      venueLogo: venueLogo ?? undefined,
      sessionTitle,
      sessionStartsAt: sessionStartsAt.toISOString(),
      route: `/venues/${venueSlug}`,
      screen: "venue",
    },
  });
}

/**
 * Notify user when their trial is rejected
 */
export async function notifyTrialRejected(params: {
  userId: string;
  venueName: string;
  venueSlug: string;
  venueLogo?: string | null;
  sessionTitle: string;
}): Promise<void> {
  const { userId, venueName, venueSlug, venueLogo, sessionTitle } = params;

  await createNotification({
    userId,
    type: NotificationType.TRIAL_REJECTED,
    title: "Trial Not Available",
    body: `Your trial request at ${venueName} for "${sessionTitle}" was not accepted`,
    data: {
      venueName,
      venueSlug,
      venueLogo: venueLogo ?? undefined,
      sessionTitle,
      route: `/venues/${venueSlug}`,
      screen: "venue",
    },
  });
}

/**
 * Send event date change notifications to all participants
 */
export async function notifyEventDateChange(params: {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  oldDate: Date;
  newDate: Date;
}): Promise<{ totalCreated: number; totalPushSent: number }> {
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
    return { totalCreated: 0, totalPushSent: 0 };
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

  const result = await createNotificationsForUsers(userIds, {
    type: NotificationType.EVENT_DATE_CHANGE,
    title: "📅 Event Date Changed",
    body: `"${eventTitle}" has been rescheduled from ${oldDateStr} to ${newDateStr}`,
    data: {
      eventId,
      eventSlug,
      eventTitle,
      oldDate: oldDate.toISOString(),
      newDate: newDate.toISOString(),
      route: `/events/${eventSlug}`,
      screen: "event",
    },
    pushChannelId: "event-updates",
  });

  console.log(
    `Event date change notification for "${eventTitle}": ${result.created} created, ${result.pushSent} push sent`
  );

  return { totalCreated: result.created, totalPushSent: result.pushSent };
}

/**
 * Send venue invite notification
 */
export async function notifyVenueInvite(params: {
  userId: string;
  venueName: string;
  venueSlug: string;
  venueLogo?: string | null;
  inviterName: string;
  role: string;
}): Promise<void> {
  const { userId, venueName, venueSlug, venueLogo, inviterName, role } = params;

  await createNotification({
    userId,
    type: NotificationType.VENUE_INVITE,
    title: "Venue Staff Invitation",
    body: `${inviterName} invited you to join ${venueName} as ${role}`,
    data: {
      venueName,
      venueSlug,
      venueLogo: venueLogo ?? undefined,
      senderName: inviterName,
      route: `/venues/${venueSlug}`,
      screen: "venue",
    },
  });
}
