"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
} from "lucide-react";
import {
  useNotifications,
  type AppNotification,
} from "@/hooks/use-notifications";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/routing";

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
  const locale = useLocale();
  const t = useTranslations("venues.trialBooking");
  const tNotifications = useTranslations("notifications");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { notifications, pendingCount } = useNotifications({
    enabled: !!session,
  });
  const dateLocale = localeMap[locale] || enUS;

  if (!session) return null;

  const getInitials = (name: string | null) => {
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

  const handleTrialAccept = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProcessingId(id);
    try {
      const res = await fetch(`/api/trial-bookings/${id}/accept`, {
        method: "POST",
      });
      if (!res.ok) throw new Error((await res.json()).error);
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
      setProcessingId(id);
      setProcessingId(null);
    }
  };

  const handleTrialReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProcessingId(id);
    try {
      const res = await fetch(`/api/trial-bookings/${id}/reject`, {
        method: "POST",
      });
      if (!res.ok) throw new Error((await res.json()).error);
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
    id: string,
    action: "accept" | "reject",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setProcessingId(id);
    try {
      const res = await fetch(`/api/friends/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
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
    id: string,
    accept: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setProcessingId(id);
    try {
      const res = await fetch(`/api/venues/invites/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
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

  const getNotificationIcon = (notification: AppNotification) => {
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return (
          <GraduationCap className="h-3.5 w-3.5 shrink-0 text-green-600" />
        );
      case "TRIAL_ACCEPTED":
        return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />;
      case "TRIAL_REJECTED":
        return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />;
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPTED":
        return <UserPlus className="h-3.5 w-3.5 shrink-0 text-blue-600" />;
      case "VENUE_INVITE":
      case "VENUE_INVITE_ACCEPTED":
        return <Building2 className="h-3.5 w-3.5 shrink-0 text-purple-600" />;
      default:
        return <Bell className="h-3.5 w-3.5 shrink-0" />;
    }
  };

  const getNotificationTitle = (notification: AppNotification) => {
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return t("requestFrom", {
          name: notification.data?.senderName || "?",
        });
      case "TRIAL_ACCEPTED":
        return tNotifications("trialAcceptedTitle", {
          venue: notification.data?.venueName || "?",
        });
      case "TRIAL_REJECTED":
        return tNotifications("trialRejectedTitle", {
          venue: notification.data?.venueName || "?",
        });
      case "FRIEND_REQUEST":
        return tNotifications("friendRequestFrom", {
          name: notification.data?.senderName || "?",
        });
      case "VENUE_INVITE":
        return tNotifications("venueInviteFrom", {
          venue: notification.data?.venueName || "?",
        });
      default:
        return notification.title;
    }
  };

  const getNotificationSubtitle = (notification: AppNotification) => {
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return `${notification.data?.venueName || ""} — ${notification.data?.sessionTitle || ""}`;
      case "TRIAL_ACCEPTED":
      case "TRIAL_REJECTED":
        return notification.data?.sessionTitle || "";
      case "FRIEND_REQUEST":
        return tNotifications("wantsToBeYourFriend");
      case "VENUE_INVITE":
        return tNotifications("invitedAsRole", {
          role: notification.data?.role || "COACH",
        });
      default:
        return notification.body;
    }
  };

  const renderActions = (notification: AppNotification) => {
    const isProcessing = processingId === notification.id;

    switch (notification.type) {
      case "TRIAL_REQUEST":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleTrialReject(notification.id, e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {t("reject")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-green-600 text-xs text-white hover:bg-green-700"
              onClick={(e) => handleTrialAccept(notification.id, e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      case "FRIEND_REQUEST":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleFriendAction(notification.id, "reject", e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-blue-600 text-xs text-white hover:bg-blue-700"
              onClick={(e) => handleFriendAction(notification.id, "accept", e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      case "VENUE_INVITE":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => handleInviteAction(notification.id, false, e)}
              disabled={isProcessing}
            >
              <XCircle className="h-3.5 w-3.5" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 bg-purple-600 text-xs text-white hover:bg-purple-700"
              onClick={(e) => handleInviteAction(notification.id, true, e)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("accept")}
            </Button>
          </>
        );
      case "TRIAL_ACCEPTED":
      case "TRIAL_REJECTED":
        // No actions for trial responses — informational only
        return null;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
          <span className="sr-only">{tNotifications("notifications")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="flex items-center gap-2 font-semibold">
            <Bell className="h-4 w-4" />
            {tNotifications("notifications")}
          </h3>
          {pendingCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {pendingCount} {tNotifications("pending")}
            </span>
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
            notifications.map((notification) => (
              <DropdownMenuItem
                key={`${notification.type}-${notification.id}`}
                className="flex cursor-default flex-col gap-2 p-3"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex w-full items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage
                      src={
                        notification.data?.senderImage ||
                        notification.data?.venueLogo ||
                        undefined
                      }
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(
                        notification.data?.senderName ||
                          notification.data?.venueName ||
                          null
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification)}
                      <p className="text-sm font-medium">
                        {getNotificationTitle(notification)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getNotificationSubtitle(notification)}
                    </p>
                    {(notification.type === "TRIAL_REQUEST" ||
                      notification.type === "TRIAL_ACCEPTED" ||
                      notification.type === "TRIAL_REJECTED") &&
                      notification.data?.sessionStartsAt && (
                        <p className="text-xs text-muted-foreground">
                          {t("requestedFor", {
                            date: format(
                              new Date(notification.data.sessionStartsAt),
                              "d MMM",
                              { locale: dateLocale }
                            ),
                            time: format(
                              new Date(notification.data.sessionStartsAt),
                              "HH:mm"
                            ),
                          })}
                        </p>
                      )}
                    <span className="block text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </span>
                  </div>
                </div>
                {renderActions(notification) && (
                  <div className="flex w-full justify-end gap-2">
                    {renderActions(notification)}
                  </div>
                )}
              </DropdownMenuItem>
            ))
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
