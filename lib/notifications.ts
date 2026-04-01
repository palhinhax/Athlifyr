import { prisma } from "@/lib/prisma";
import { NotificationType, Prisma } from "@prisma/client";
import { sendPushNotification } from "@/lib/push-notifications";

// ============================================================================
// Notification translations system
// ============================================================================

type SupportedLocale = "en" | "pt" | "es" | "fr" | "de" | "it";

/**
 * Notification translation strings for all supported locales
 */
const notificationTranslations: Record<
  string,
  Record<SupportedLocale, string>
> = {
  // Friend notifications
  "friend.request.title": {
    en: "New Friend Request",
    pt: "Novo Pedido de Amizade",
    es: "Nueva Solicitud de Amistad",
    fr: "Nouvelle Demande d'Amitié",
    de: "Neue Freundschaftsanfrage",
    it: "Nuova Richiesta di Amicizia",
  },
  "friend.request.body": {
    en: "{name} sent you a friend request",
    pt: "{name} enviou-te um pedido de amizade",
    es: "{name} te envió una solicitud de amistad",
    fr: "{name} vous a envoyé une demande d'amitié",
    de: "{name} hat dir eine Freundschaftsanfrage gesendet",
    it: "{name} ti ha inviato una richiesta di amicizia",
  },
  "friend.accepted.title": {
    en: "Friend Request Accepted",
    pt: "Pedido de Amizade Aceite",
    es: "Solicitud de Amistad Aceptada",
    fr: "Demande d'Amitié Acceptée",
    de: "Freundschaftsanfrage Akzeptiert",
    it: "Richiesta di Amicizia Accettata",
  },
  "friend.accepted.body": {
    en: "{name} accepted your friend request",
    pt: "{name} aceitou o teu pedido de amizade",
    es: "{name} aceptó tu solicitud de amistad",
    fr: "{name} a accepté votre demande d'amitié",
    de: "{name} hat deine Freundschaftsanfrage akzeptiert",
    it: "{name} ha accettato la tua richiesta di amicizia",
  },

  // Trial notifications
  "trial.request.title": {
    en: "New Trial Request",
    pt: "Novo Pedido de Aula Experimental",
    es: "Nueva Solicitud de Clase de Prueba",
    fr: "Nouvelle Demande de Cours d'Essai",
    de: "Neue Probetraining-Anfrage",
    it: "Nuova Richiesta di Lezione di Prova",
  },
  "trial.request.body": {
    en: "{name} requested a trial class at {venue}",
    pt: "{name} pediu uma aula experimental em {venue}",
    es: "{name} solicitó una clase de prueba en {venue}",
    fr: "{name} a demandé un cours d'essai à {venue}",
    de: "{name} hat ein Probetraining bei {venue} angefragt",
    it: "{name} ha richiesto una lezione di prova presso {venue}",
  },
  "trial.accepted.title": {
    en: "Trial Accepted! 🎉",
    pt: "Aula Experimental Aceite! 🎉",
    es: "¡Clase de Prueba Aceptada! 🎉",
    fr: "Cours d'Essai Accepté ! 🎉",
    de: "Probetraining Akzeptiert! 🎉",
    it: "Lezione di Prova Accettata! 🎉",
  },
  "trial.accepted.body": {
    en: 'Your trial at {venue} for "{session}" has been accepted',
    pt: 'A tua aula experimental em {venue} para "{session}" foi aceite',
    es: 'Tu clase de prueba en {venue} para "{session}" ha sido aceptada',
    fr: 'Votre cours d\'essai à {venue} pour "{session}" a été accepté',
    de: 'Dein Probetraining bei {venue} für "{session}" wurde akzeptiert',
    it: 'La tua lezione di prova presso {venue} per "{session}" è stata accettata',
  },
  "trial.rejected.title": {
    en: "Trial Not Available",
    pt: "Aula Experimental Indisponível",
    es: "Clase de Prueba No Disponible",
    fr: "Cours d'Essai Non Disponible",
    de: "Probetraining Nicht Verfügbar",
    it: "Lezione di Prova Non Disponibile",
  },
  "trial.rejected.body": {
    en: 'Your trial request at {venue} for "{session}" was not accepted',
    pt: 'O teu pedido de aula experimental em {venue} para "{session}" não foi aceite',
    es: 'Tu solicitud de clase de prueba en {venue} para "{session}" no fue aceptada',
    fr: "Votre demande de cours d'essai à {venue} pour \"{session}\" n'a pas été acceptée",
    de: 'Deine Probetraining-Anfrage bei {venue} für "{session}" wurde nicht akzeptiert',
    it: 'La tua richiesta di lezione di prova presso {venue} per "{session}" non è stata accettata',
  },

  // Event notifications
  "event.dateChange.title": {
    en: "📅 Event Date Changed",
    pt: "📅 Data do Evento Alterada",
    es: "📅 Fecha del Evento Cambiada",
    fr: "📅 Date de l'Événement Modifiée",
    de: "📅 Veranstaltungsdatum Geändert",
    it: "📅 Data dell'Evento Modificata",
  },
  "event.dateChange.body": {
    en: '"{event}" has been rescheduled from {oldDate} to {newDate}',
    pt: '"{event}" foi reagendado de {oldDate} para {newDate}',
    es: '"{event}" ha sido reprogramado de {oldDate} a {newDate}',
    fr: '"{event}" a été reprogrammé du {oldDate} au {newDate}',
    de: '"{event}" wurde von {oldDate} auf {newDate} verschoben',
    it: '"{event}" è stato riprogrammato da {oldDate} a {newDate}',
  },
  "event.cancelled.title": {
    en: "🚫 Event Cancelled",
    pt: "🚫 Evento Cancelado",
    es: "🚫 Evento Cancelado",
    fr: "🚫 Événement Annulé",
    de: "🚫 Veranstaltung Abgesagt",
    it: "🚫 Evento Annullato",
  },
  "event.cancelled.body": {
    en: '"{event}" has been cancelled.',
    pt: '"{event}" foi cancelado.',
    es: '"{event}" ha sido cancelado.',
    fr: '"{event}" a été annulé.',
    de: '"{event}" wurde abgesagt.',
    it: '"{event}" è stato annullato.',
  },
  "event.cancelled.reason": {
    en: "Reason: {reason}",
    pt: "Motivo: {reason}",
    es: "Motivo: {reason}",
    fr: "Raison : {reason}",
    de: "Grund: {reason}",
    it: "Motivo: {reason}",
  },

  // Event invite notifications
  "event.invite.title": {
    en: "🏁 Event Invitation",
    pt: "🏁 Convite para Evento",
    es: "🏁 Invitación al Evento",
    fr: "🏁 Invitation à l'Événement",
    de: "🏁 Veranstaltungseinladung",
    it: "🏁 Invito all'Evento",
  },
  "event.invite.body": {
    en: '{inviter} invited you to participate in "{event}"',
    pt: '{inviter} convidou-te para participar em "{event}"',
    es: '{inviter} te invitó a participar en "{event}"',
    fr: '{inviter} vous a invité à participer à "{event}"',
    de: '{inviter} hat dich eingeladen, an "{event}" teilzunehmen',
    it: '{inviter} ti ha invitato a partecipare a "{event}"',
  },

  // Event community notifications
  "event.newPost.title": {
    en: "📝 New Post in Event",
    pt: "📝 Nova Publicação no Evento",
    es: "📝 Nueva Publicación en el Evento",
    fr: "📝 Nouvelle Publication dans l'Événement",
    de: "📝 Neuer Beitrag im Event",
    it: "📝 Nuovo Post nell'Evento",
  },
  "event.newPost.body": {
    en: '{author} posted in "{event}"',
    pt: '{author} publicou em "{event}"',
    es: '{author} publicó en "{event}"',
    fr: '{author} a publié dans "{event}"',
    de: '{author} hat in "{event}" gepostet',
    it: '{author} ha pubblicato in "{event}"',
  },
  "event.postComment.title": {
    en: "💬 New Comment on Your Post",
    pt: "💬 Novo Comentário na Tua Publicação",
    es: "💬 Nuevo Comentario en Tu Publicación",
    fr: "💬 Nouveau Commentaire sur Votre Publication",
    de: "💬 Neuer Kommentar zu Deinem Beitrag",
    it: "💬 Nuovo Commento al Tuo Post",
  },
  "event.postComment.body": {
    en: '{author} commented on your post in "{event}"',
    pt: '{author} comentou na tua publicação em "{event}"',
    es: '{author} comentó en tu publicación en "{event}"',
    fr: '{author} a commenté votre publication dans "{event}"',
    de: '{author} hat deinen Beitrag in "{event}" kommentiert',
    it: '{author} ha commentato il tuo post in "{event}"',
  },
  "event.postCommentAlso.title": {
    en: "💬 New Comment on a Post You Commented",
    pt: "💬 Novo Comentário numa Publicação que Comentaste",
    es: "💬 Nuevo Comentario en una Publicación que Comentaste",
    fr: "💬 Nouveau Commentaire sur une Publication que Vous Avez Commentée",
    de: "💬 Neuer Kommentar zu einem Beitrag, den Du Kommentiert Hast",
    it: "💬 Nuovo Commento su un Post che Hai Commentato",
  },
  "event.postCommentAlso.body": {
    en: '{author} also commented on a post in "{event}"',
    pt: '{author} também comentou numa publicação em "{event}"',
    es: '{author} también comentó en una publicación en "{event}"',
    fr: '{author} a aussi commenté une publication dans "{event}"',
    de: '{author} hat auch einen Beitrag in "{event}" kommentiert',
    it: '{author} ha anche commentato un post in "{event}"',
  },

  // Venue notifications
  "venue.invite.title": {
    en: "Venue Staff Invitation",
    pt: "Convite para Equipa do Espaço",
    es: "Invitación al Equipo del Espacio",
    fr: "Invitation au Personnel du Lieu",
    de: "Einladung zum Standort-Team",
    it: "Invito allo Staff del Centro",
  },
  "venue.invite.body": {
    en: "{inviter} invited you to join {venue} as {role}",
    pt: "{inviter} convidou-te para te juntares a {venue} como {role}",
    es: "{inviter} te invitó a unirte a {venue} como {role}",
    fr: "{inviter} vous a invité à rejoindre {venue} en tant que {role}",
    de: "{inviter} hat dich eingeladen, {venue} als {role} beizutreten",
    it: "{inviter} ti ha invitato a unirti a {venue} come {role}",
  },

  // Giveaway notifications
  "giveaway.won.title": {
    en: "🎉 You Won a Giveaway!",
    pt: "🎉 Ganhaste um Sorteio!",
    es: "🎉 ¡Ganaste un Sorteo!",
    fr: "🎉 Tu as Gagné un Tirage !",
    de: "🎉 Du hast eine Verlosung Gewonnen!",
    it: "🎉 Hai Vinto un Sorteggio!",
  },
  "giveaway.won.body": {
    en: 'Congratulations! Your ticket #{ticket} won the giveaway for "{event}"',
    pt: 'Parabéns! O teu bilhete #{ticket} ganhou o sorteio de "{event}"',
    es: '¡Felicidades! Tu boleto #{ticket} ganó el sorteo de "{event}"',
    fr: 'Félicitations ! Ton ticket #{ticket} a gagné le tirage de "{event}"',
    de: 'Herzlichen Glückwunsch! Dein Ticket #{ticket} hat die Verlosung von "{event}" gewonnen',
    it: 'Complimenti! Il tuo biglietto #{ticket} ha vinto il sorteggio di "{event}"',
  },
};

/**
 * Get a translated notification string with variable interpolation
 */
function t(key: string, locale: string, vars?: Record<string, string>): string {
  const translations = notificationTranslations[key];
  if (!translations) return key;

  const supportedLocale = (
    ["en", "pt", "es", "fr", "de", "it"].includes(locale) ? locale : "en"
  ) as SupportedLocale;

  let text = translations[supportedLocale] || translations.en;

  if (vars) {
    for (const [varName, value] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${varName}\\}`, "g"), value);
    }
  }

  return text;
}

/**
 * Format a date for display according to locale
 */
function formatDateForLocale(date: Date, locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en-GB",
    pt: "pt-PT",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
  };

  return date.toLocaleDateString(localeMap[locale] || "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Fetch user locale from database
 */
async function getUserLocale(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { locale: true },
  });
  return user?.locale || "en";
}

/**
 * Fetch locales for multiple users, grouped by locale
 */
async function getUsersGroupedByLocale(
  userIds: string[]
): Promise<Map<string, string[]>> {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, locale: true },
  });

  const grouped = new Map<string, string[]>();
  for (const user of users) {
    const locale = user.locale || "en";
    const existing = grouped.get(locale) || [];
    existing.push(user.id);
    grouped.set(locale, existing);
  }

  return grouped;
}

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
    case NotificationType.EVENT_NEW_POST:
    case NotificationType.EVENT_POST_COMMENT:
    case NotificationType.EVENT_INVITE:
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
    case NotificationType.GIVEAWAY_WON:
      return "event-updates";
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
  const locale = await getUserLocale(receiverUserId);

  await createNotification({
    userId: receiverUserId,
    type: NotificationType.FRIEND_REQUEST,
    title: t("friend.request.title", locale),
    body: t("friend.request.body", locale, { name: senderName }),
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
  const locale = await getUserLocale(receiverUserId);

  await createNotification({
    userId: receiverUserId,
    type: NotificationType.FRIEND_ACCEPTED,
    title: t("friend.accepted.title", locale),
    body: t("friend.accepted.body", locale, { name: accepterName }),
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

  const grouped = await getUsersGroupedByLocale(venueOwnerUserIds);

  for (const [locale, userIds] of grouped) {
    await createNotificationsForUsers(userIds, {
      type: NotificationType.TRIAL_REQUEST,
      title: t("trial.request.title", locale),
      body: t("trial.request.body", locale, {
        name: requesterName,
        venue: venueName,
      }),
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
  const locale = await getUserLocale(userId);

  await createNotification({
    userId,
    type: NotificationType.TRIAL_ACCEPTED,
    title: t("trial.accepted.title", locale),
    body: t("trial.accepted.body", locale, {
      venue: venueName,
      session: sessionTitle,
    }),
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
  const locale = await getUserLocale(userId);

  await createNotification({
    userId,
    type: NotificationType.TRIAL_REJECTED,
    title: t("trial.rejected.title", locale),
    body: t("trial.rejected.body", locale, {
      venue: venueName,
      session: sessionTitle,
    }),
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

  // Get all users participating in this event (going OR interested)
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      status: { in: ["going", "interested"] },
    },
    select: {
      userId: true,
    },
  });

  if (participations.length === 0) {
    return { totalCreated: 0, totalPushSent: 0 };
  }

  const userIds = participations.map((p) => p.userId);
  const grouped = await getUsersGroupedByLocale(userIds);

  let totalCreated = 0;
  let totalPushSent = 0;

  for (const [locale, localeUserIds] of grouped) {
    const oldDateStr = formatDateForLocale(oldDate, locale);
    const newDateStr = formatDateForLocale(newDate, locale);

    const result = await createNotificationsForUsers(localeUserIds, {
      type: NotificationType.EVENT_DATE_CHANGE,
      title: t("event.dateChange.title", locale),
      body: t("event.dateChange.body", locale, {
        event: eventTitle,
        oldDate: oldDateStr,
        newDate: newDateStr,
      }),
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

    totalCreated += result.created;
    totalPushSent += result.pushSent;
  }

  console.log(
    `Event date change notification for "${eventTitle}": ${totalCreated} created, ${totalPushSent} push sent`
  );

  return { totalCreated, totalPushSent };
}

/**
 * Notify participants about event cancellation
 */
export async function notifyEventCancelled(params: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  cancellationReason?: string;
}): Promise<{ totalCreated: number; totalPushSent: number }> {
  const { eventId, eventSlug, eventTitle, cancellationReason } = params;

  // Find all users who marked as "going" or "interested" in this event
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      status: { in: ["going", "interested"] },
    },
    select: {
      userId: true,
    },
  });

  const userIds = participations.map((p) => p.userId);

  if (userIds.length === 0) {
    console.log(
      `No participants to notify for cancelled event "${eventTitle}"`
    );
    return { totalCreated: 0, totalPushSent: 0 };
  }

  const grouped = await getUsersGroupedByLocale(userIds);

  let totalCreated = 0;
  let totalPushSent = 0;

  for (const [locale, localeUserIds] of grouped) {
    let body = t("event.cancelled.body", locale, { event: eventTitle });
    if (cancellationReason) {
      body += ` ${t("event.cancelled.reason", locale, { reason: cancellationReason })}`;
    }

    const result = await createNotificationsForUsers(localeUserIds, {
      type: NotificationType.EVENT_CANCELLED,
      title: t("event.cancelled.title", locale),
      body,
      data: {
        eventId,
        eventSlug,
        eventTitle,
        route: `/events/${eventSlug}`,
        screen: "event",
      },
      pushChannelId: "event-updates",
    });

    totalCreated += result.created;
    totalPushSent += result.pushSent;
  }

  console.log(
    `Event cancellation notification for "${eventTitle}": ${totalCreated} created, ${totalPushSent} push sent`
  );

  return { totalCreated, totalPushSent };
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
  const locale = await getUserLocale(userId);

  await createNotification({
    userId,
    type: NotificationType.VENUE_INVITE,
    title: t("venue.invite.title", locale),
    body: t("venue.invite.body", locale, {
      inviter: inviterName,
      venue: venueName,
      role,
    }),
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

/**
 * Send event invite notification to a friend
 */
export async function notifyEventInvite(params: {
  userId: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  inviterName: string;
  inviterImage?: string | null;
  inviterId: string;
}): Promise<void> {
  const {
    userId,
    eventId,
    eventSlug,
    eventTitle,
    inviterName,
    inviterImage,
    inviterId,
  } = params;
  const locale = await getUserLocale(userId);

  await createNotification({
    userId,
    type: NotificationType.EVENT_INVITE,
    title: t("event.invite.title", locale),
    body: t("event.invite.body", locale, {
      inviter: inviterName,
      event: eventTitle,
    }),
    data: {
      eventId,
      eventSlug,
      eventTitle,
      senderId: inviterId,
      senderName: inviterName,
      senderImage: inviterImage ?? undefined,
      route: `/events/${eventSlug}`,
      screen: "event",
    },
  });
}

/**
 * Notify going/interested users about a new post in an event
 */
export async function notifyEventNewPost(params: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  authorId: string;
  authorName: string;
}): Promise<{ totalCreated: number; totalPushSent: number }> {
  const { eventId, eventSlug, eventTitle, authorId, authorName } = params;

  // Get all users going or interested in this event, excluding the post author
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      status: { in: ["going", "interested"] },
      userId: { not: authorId },
    },
    select: {
      userId: true,
    },
  });

  if (participations.length === 0) {
    return { totalCreated: 0, totalPushSent: 0 };
  }

  const userIds = participations.map((p) => p.userId);
  const grouped = await getUsersGroupedByLocale(userIds);

  let totalCreated = 0;
  let totalPushSent = 0;

  for (const [locale, localeUserIds] of grouped) {
    const result = await createNotificationsForUsers(localeUserIds, {
      type: NotificationType.EVENT_NEW_POST,
      title: t("event.newPost.title", locale),
      body: t("event.newPost.body", locale, {
        author: authorName,
        event: eventTitle,
      }),
      data: {
        eventId,
        eventSlug,
        eventTitle,
        senderId: authorId,
        senderName: authorName,
        route: `/events/${eventSlug}`,
        screen: "event",
      },
      pushChannelId: "event-updates",
    });

    totalCreated += result.created;
    totalPushSent += result.pushSent;
  }

  console.log(
    `Event new post notification for "${eventTitle}": ${totalCreated} created, ${totalPushSent} push sent`
  );

  return { totalCreated, totalPushSent };
}

/**
 * Notify post author and other commenters about a new comment on an event post
 */
export async function notifyEventPostComment(params: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  postId: string;
  postAuthorId: string;
  commentAuthorId: string;
  commentAuthorName: string;
}): Promise<{ totalCreated: number; totalPushSent: number }> {
  const {
    eventId,
    eventSlug,
    eventTitle,
    postId,
    postAuthorId,
    commentAuthorId,
    commentAuthorName,
  } = params;

  let totalCreated = 0;
  let totalPushSent = 0;

  // 1. Notify the post author (if they are not the commenter)
  if (postAuthorId !== commentAuthorId) {
    const locale = await getUserLocale(postAuthorId);
    const result = await createNotification({
      userId: postAuthorId,
      type: NotificationType.EVENT_POST_COMMENT,
      title: t("event.postComment.title", locale),
      body: t("event.postComment.body", locale, {
        author: commentAuthorName,
        event: eventTitle,
      }),
      data: {
        eventId,
        eventSlug,
        eventTitle,
        senderId: commentAuthorId,
        senderName: commentAuthorName,
        route: `/events/${eventSlug}`,
        screen: "event",
      },
      pushChannelId: "event-updates",
    });
    totalCreated++;
    if (result.pushSent) totalPushSent++;
  }

  // 2. Notify other users who also commented on this post
  const otherCommenters = await prisma.postComment.findMany({
    where: {
      postId,
      userId: { notIn: [commentAuthorId, postAuthorId] },
    },
    select: {
      userId: true,
    },
    distinct: ["userId"],
  });

  if (otherCommenters.length > 0) {
    const otherUserIds = otherCommenters.map((c) => c.userId);
    const grouped = await getUsersGroupedByLocale(otherUserIds);

    for (const [locale, localeUserIds] of grouped) {
      const result = await createNotificationsForUsers(localeUserIds, {
        type: NotificationType.EVENT_POST_COMMENT,
        title: t("event.postCommentAlso.title", locale),
        body: t("event.postCommentAlso.body", locale, {
          author: commentAuthorName,
          event: eventTitle,
        }),
        data: {
          eventId,
          eventSlug,
          eventTitle,
          senderId: commentAuthorId,
          senderName: commentAuthorName,
          route: `/events/${eventSlug}`,
          screen: "event",
        },
        pushChannelId: "event-updates",
      });

      totalCreated += result.created;
      totalPushSent += result.pushSent;
    }
  }

  console.log(
    `Event post comment notification for "${eventTitle}": ${totalCreated} created, ${totalPushSent} push sent`
  );

  return { totalCreated, totalPushSent };
}

/**
 * Notify giveaway winners — each winner gets a notification in their language
 */
export async function notifyGiveawayWinners(params: {
  giveawayId: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  winners: Array<{ userId: string; ticketNumber: number }>;
}): Promise<{ totalCreated: number; totalPushSent: number }> {
  const { eventId, eventSlug, eventTitle, winners } = params;

  if (winners.length === 0) {
    return { totalCreated: 0, totalPushSent: 0 };
  }

  let totalCreated = 0;
  let totalPushSent = 0;

  // Send individually — each winner has a unique ticket number
  for (const winner of winners) {
    const locale = await getUserLocale(winner.userId);

    const result = await createNotification({
      userId: winner.userId,
      type: NotificationType.GIVEAWAY_WON,
      title: t("giveaway.won.title", locale),
      body: t("giveaway.won.body", locale, {
        ticket: String(winner.ticketNumber),
        event: eventTitle,
      }),
      data: {
        eventId,
        eventSlug,
        eventTitle,
        route: `/events/${eventSlug}`,
        screen: "event",
      },
      pushChannelId: "event-updates",
    });

    if (result.pushSent) totalPushSent++;
    totalCreated++;
  }

  console.log(
    `Giveaway winner notification for "${eventTitle}": ${totalCreated} created, ${totalPushSent} push sent`
  );

  return { totalCreated, totalPushSent };
}
