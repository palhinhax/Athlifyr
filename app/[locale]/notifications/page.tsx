"use client";

import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import {
  useNotifications,
  type AppNotification,
} from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  UserPlus,
  Building2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { PageContainer } from "@/components/page-container";

const localeMap: Record<string, typeof enUS> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useTranslations("venues.trialBooking");
  const tNotifications = useTranslations("notifications");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { notifications, pendingCount, isLoading } = useNotifications({
    enabled: !!session,
  });
  const dateLocale = localeMap[locale] || enUS;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarInfo = (notification: AppNotification) => {
    if (notification.type === "ADMIN_ANNOUNCEMENT") {
      return {
        image: "/android-chrome-192x192.png",
        name: "Athlifyr",
      };
    }
    return {
      image:
        notification.data?.senderImage ||
        notification.data?.venueLogo ||
        undefined,
      name:
        notification.data?.senderName || notification.data?.venueName || null,
    };
  };

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleTrialAccept = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/trial-bookings/${bookingId}/accept`, {
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
      setProcessingId(null);
    }
  };

  const handleTrialReject = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/trial-bookings/${bookingId}/reject`, {
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
    action: "accept" | "reject"
  ) => {
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

  const handleInviteAction = async (id: string, accept: boolean) => {
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
        return <GraduationCap className="h-4 w-4 shrink-0 text-green-600" />;
      case "TRIAL_ACCEPTED":
        return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />;
      case "TRIAL_REJECTED":
        return <XCircle className="h-4 w-4 shrink-0 text-red-600" />;
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPTED":
        return <UserPlus className="h-4 w-4 shrink-0 text-blue-600" />;
      case "VENUE_INVITE":
      case "VENUE_INVITE_ACCEPTED":
        return <Building2 className="h-4 w-4 shrink-0 text-purple-600" />;
      case "ADMIN_ANNOUNCEMENT":
        return <Bell className="h-4 w-4 shrink-0 text-primary" />;
      default:
        return <Bell className="h-4 w-4 shrink-0" />;
    }
  };

  const getNotificationTitle = (notification: AppNotification) => {
    switch (notification.type) {
      case "TRIAL_REQUEST":
        return t("requestFrom", { name: notification.data?.senderName || "?" });
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
      case "FRIEND_ACCEPTED":
        return tNotifications("friendAccepted");
      case "VENUE_INVITE":
        return tNotifications("venueInviteFrom", {
          venue: notification.data?.venueName || "?",
        });
      case "ADMIN_ANNOUNCEMENT":
        return notification.title;
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
      case "ADMIN_ANNOUNCEMENT":
        return notification.body;
      default:
        return notification.body;
    }
  };

  const renderActions = (notification: AppNotification) => {
    const isProcessing = processingId === notification.id;

    switch (notification.type) {
      case "TRIAL_REQUEST":
        return (
          <div className="mt-3 flex justify-end gap-2 border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={() => handleTrialReject(notification.id)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4" />
              {t("reject")}
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-green-600 text-white hover:bg-green-700"
              onClick={() => handleTrialAccept(notification.id)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("accept")}
            </Button>
          </div>
        );
      case "FRIEND_REQUEST":
        return (
          <div className="mt-3 flex justify-end gap-2 border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={() => handleFriendAction(notification.id, "reject")}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => handleFriendAction(notification.id, "accept")}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("accept")}
            </Button>
          </div>
        );
      case "VENUE_INVITE":
        return (
          <div className="mt-3 flex justify-end gap-2 border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={() => handleInviteAction(notification.id, false)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4" />
              {tNotifications("decline")}
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => handleInviteAction(notification.id, true)}
              disabled={isProcessing}
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("accept")}
            </Button>
          </div>
        );
      case "TRIAL_ACCEPTED":
      case "TRIAL_REJECTED":
      default:
        return null;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <PageContainer className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Bell className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          {tNotifications("noNotifications")}
        </p>
        <Link href="/auth/signin">
          <Button>{tNotifications("notifications")}</Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="sm" maxWidth="max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/feed">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold sm:text-2xl">
            {tNotifications("notifications")}
          </h1>
          {pendingCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {pendingCount} {tNotifications("pending")}
            </p>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
            <Bell className="mb-3 h-12 w-12" />
            <p className="text-base font-medium">
              {tNotifications("noNotifications")}
            </p>
            <p className="mt-1 text-sm">{tNotifications("emptyDescription")}</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const avatarInfo = getAvatarInfo(notification);
            return (
              <div
                key={`${notification.type}-${notification.id}`}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={avatarInfo.image} />
                    <AvatarFallback className="text-xs">
                      {getInitials(avatarInfo.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification)}
                      <p className="text-sm font-semibold">
                        {getNotificationTitle(notification)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getNotificationSubtitle(notification)}
                    </p>
                    {(notification.type === "TRIAL_REQUEST" ||
                      notification.type === "TRIAL_ACCEPTED" ||
                      notification.type === "TRIAL_REJECTED") &&
                      notification.data?.sessionStartsAt && (
                        <p className="text-sm text-muted-foreground">
                          {t("requestedFor", {
                            date: format(
                              new Date(notification.data.sessionStartsAt),
                              "d MMM yyyy",
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

                {renderActions(notification)}
              </div>
            );
          })
        )}
      </div>
    </PageContainer>
  );
}
