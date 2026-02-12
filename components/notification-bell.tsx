"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  GraduationCap,
  CheckCircle2,
  XCircle,
  UserPlus,
  Building2,
  CalendarDays,
  MessageCircle,
  Check,
} from "lucide-react";
import {
  useNotifications,
  type AppNotification,
} from "@/hooks/use-notifications";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/routing";
import { NotificationType } from "@prisma/client";

const localeMap: Record<string, typeof enUS> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

export function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("venues.trialBooking");
  const tNotifications = useTranslations("notifications");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications({
      enabled: !!session,
    });
  const dateLocale = localeMap[locale] || enUS;

  if (!session) return null;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  // Get bookingId from notification data for trial actions
  const getBookingId = (notification: AppNotification): string | null => {
    return notification.data?.bookingId || null;
  };

  // Get senderId from notification data for friend actions
  const getSenderId = (notification: AppNotification): string | null => {
    return notification.data?.senderId || null;
  };

  const handleTrialAccept = async (
    notification: AppNotification,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const bookingId = getBookingId(notification);
    if (!bookingId) return;

    setProcessingId(notification.id);
    try {
      const res = await fetch(`/api/trial-bookings/${bookingId}/accept`, {
        method: "POST",
      });
      if (!res.ok) throw new Error((await res.json()).error);
      markAsRead(notification.id);
      toast({ title: t("accepted"), description: t("acceptSuccess") });
      invalidateNotifications();
    } catch (error) {
      toast({
        title: t("acceptError"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleTrialReject = async (
    notification: AppNotification,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const bookingId = getBookingId(notification);
    if (!bookingId) return;

    setProcessingId(notification.id);
    try {
      const res = await fetch(`/api/trial-bookings/${bookingId}/reject`, {
        method: "POST",
      });
      if (!res.ok) throw new Error((await res.json()).error);
      markAsRead(notification.id);
      toast({ title: t("rejected"), description: t("rejectSuccess") });
      invalidateNotifications();
    } catch (error) {
      toast({
        title: t("rejectError"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleFriendAction = async (
    notification: AppNotification,
    action: "accept" | "reject",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const senderId = getSenderId(notification);
    if (!senderId) return;

    setProcessingId(notification.id);
    try {
      const res = await fetch(`/api/friends/${senderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      markAsRead(notification.id);
      toast({
        title:
          action === "accept"
            ? tNotifications("friendAccepted")
            : tNotifications("friendRejected"),
      });
      invalidateNotifications();
    } catch (error) {
      toast({
        title: tNotifications("actionError"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleInviteAction = async (
    notification: AppNotification,
    accept: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // For venue invites, we need the invite ID which should be stored differently
    // The notification.id is the notification ID, not the invite ID
    // We need to store the invite ID in the notification data
    const inviteId = notification.data?.bookingId; // Re-using bookingId for invite ID
    if (!inviteId) return;

    setProcessingId(notification.id);
    try {
      const res = await fetch(`/api/venues/invites/${inviteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      markAsRead(notification.id);
      toast({
        title: accept
          ? tNotifications("inviteAccepted")
          : tNotifications("inviteDeclined"),
      });
      invalidateNotifications();
    } catch (error) {
      toast({
        title: tNotifications("actionError"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleNotificationClick = (notification: AppNotification) => {
    console.log("[NotificationBell] Clicked notification:", {
      id: notification.id,
      type: notification.type,
      data: notification.data,
    });

    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type and data
    const data = notification.data;

    // Priority: url > deepLink > route > type-specific navigation
    if (data?.url && typeof data.url === "string") {
      console.log("[NotificationBell] Navigating to url:", data.url);
      router.push(data.url);
      return;
    }
    if (data?.deepLink && typeof data.deepLink === "string") {
      console.log("[NotificationBell] Navigating to deepLink:", data.deepLink);
      router.push(data.deepLink);
      return;
    }
    if (data?.route && typeof data.route === "string") {
      console.log("[NotificationBell] Navigating to route:", data.route);
      router.push(data.route);
      return;
    }

    console.log(
      "[NotificationBell] No direct url/deepLink/route, using type-specific navigation"
    );

    // Type-specific navigation fallbacks
    switch (notification.type) {
      case NotificationType.TRIAL_REQUEST:
      case NotificationType.TRIAL_ACCEPTED:
      case NotificationType.TRIAL_REJECTED:
        if (data?.venueSlug && typeof data.venueSlug === "string") {
          router.push(`/venues/${data.venueSlug}`);
        }
        break;
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_ACCEPTED:
        if (data?.senderId && typeof data.senderId === "string") {
          router.push(`/user/${data.senderId}`);
        }
        break;
      case NotificationType.VENUE_INVITE:
      case NotificationType.VENUE_INVITE_ACCEPTED:
        if (data?.venueSlug && typeof data.venueSlug === "string") {
          router.push(`/venues/${data.venueSlug}`);
        }
        break;
      case NotificationType.EVENT_DATE_CHANGE:
      case NotificationType.EVENT_CANCELLED:
        if (data?.eventSlug && typeof data.eventSlug === "string") {
          router.push(`/events/${data.eventSlug}`);
        }
        break;
      case NotificationType.ADMIN_ANNOUNCEMENT:
        // Admin announcements should use url/deepLink/route if provided
        console.log(
          "[NotificationBell] ADMIN_ANNOUNCEMENT fallback to /notifications"
        );
        router.push("/notifications");
        break;
    }
  };

  const getNotificationIcon = (notification: AppNotification) => {
    switch (notification.type) {
      case NotificationType.TRIAL_REQUEST:
        return (
          <GraduationCap className="h-3.5 w-3.5 shrink-0 text-green-600" />
        );
      case NotificationType.TRIAL_ACCEPTED:
        return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />;
      case NotificationType.TRIAL_REJECTED:
        return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />;
      case NotificationType.FRIEND_REQUEST:
        return <UserPlus className="h-3.5 w-3.5 shrink-0 text-blue-600" />;
      case NotificationType.FRIEND_ACCEPTED:
        return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />;
      case NotificationType.VENUE_INVITE:
        return <Building2 className="h-3.5 w-3.5 shrink-0 text-purple-600" />;
      case NotificationType.VENUE_INVITE_ACCEPTED:
        return (
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-purple-600" />
        );
      case NotificationType.EVENT_DATE_CHANGE:
      case NotificationType.EVENT_CANCELLED:
        return (
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-orange-600" />
        );
      case NotificationType.CHAT_MESSAGE:
        return (
          <MessageCircle className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
        );
      case NotificationType.ADMIN_ANNOUNCEMENT:
        return <Bell className="h-3.5 w-3.5 shrink-0 text-primary" />;
      default:
        return <Bell className="h-3.5 w-3.5 shrink-0 text-gray-600" />;
    }
  };

  // Get avatar info from notification data
  const getAvatarInfo = (notification: AppNotification) => {
    const data = notification.data;

    // For admin announcements, show a system/admin icon
    if (notification.type === NotificationType.ADMIN_ANNOUNCEMENT) {
      return {
        image: "/android-chrome-192x192.png", // Use app logo for admin notifications
        name: "Athlifyr",
      };
    }

    return {
      image: data?.senderImage || data?.venueLogo || null,
      name: data?.senderName || data?.venueName || null,
    };
  };

  const renderActions = (notification: AppNotification) => {
    const isProcessing = processingId === notification.id;

    switch (notification.type) {
      case NotificationType.TRIAL_REQUEST:
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleTrialReject(notification, e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {t("reject")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-green-600 text-xs text-white hover:bg-green-700"
              onClick={(e) => handleTrialAccept(notification, e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      case NotificationType.FRIEND_REQUEST:
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleFriendAction(notification, "reject", e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-blue-600 text-xs text-white hover:bg-blue-700"
              onClick={(e) => handleFriendAction(notification, "accept", e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      case NotificationType.VENUE_INVITE:
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleInviteAction(notification, false, e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-purple-600 text-xs text-white hover:bg-purple-700"
              onClick={(e) => handleInviteAction(notification, true, e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      // Informational notifications - no actions
      case NotificationType.TRIAL_ACCEPTED:
      case NotificationType.TRIAL_REJECTED:
      case NotificationType.FRIEND_ACCEPTED:
      case NotificationType.VENUE_INVITE_ACCEPTED:
      case NotificationType.EVENT_DATE_CHANGE:
      case NotificationType.EVENT_CANCELLED:
      case NotificationType.CHAT_MESSAGE:
      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">{tNotifications("notifications")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="space-y-2 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-semibold">
              <Bell className="h-4 w-4" />
              {tNotifications("notifications")}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {unreadCount} {tNotifications("pending")}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-center text-xs"
              onClick={() => markAllAsRead()}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {tNotifications("markAllRead")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="mb-2 h-8 w-8" />
              <p className="text-sm">{tNotifications("noNotifications")}</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const avatarInfo = getAvatarInfo(notification);
              return (
                <DropdownMenuItem
                  key={`${notification.type}-${notification.id}`}
                  className={cn(
                    "flex cursor-default flex-col gap-2 p-3",
                    !notification.read && "bg-primary/5"
                  )}
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex w-full items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={avatarInfo.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(avatarInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification)}
                        <p
                          className={cn(
                            "text-sm",
                            !notification.read && "font-medium"
                          )}
                        >
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.body}
                      </p>
                      <span className="block text-xs text-muted-foreground/70">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  {renderActions(notification) && (
                    <div className="flex w-full justify-end gap-2">
                      {renderActions(notification)}
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link
            href="/notifications"
            className="w-full text-center text-sm font-medium text-primary"
          >
            {tNotifications("viewAll")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
