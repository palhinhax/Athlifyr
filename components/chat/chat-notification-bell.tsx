"use client";

import { useState } from "react";
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
import { MessageCircleIcon, CheckCheckIcon } from "lucide-react";
import { useChatNotifications } from "@/hooks/chat/use-chat-notifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useLocale } from "next-intl";

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function ChatNotificationBell() {
  const router = useRouter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useChatNotifications();
  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNotificationClick = (
    notificationId: string,
    conversationId: string
  ) => {
    markAsRead(notificationId);
    setIsOpen(false);
    router.push(`/chat?conversation=${conversationId}`);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircleIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Chat notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold">Messages</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs"
            >
              <CheckCheckIcon className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessageCircleIcon className="mb-2 h-8 w-8" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 p-3",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() =>
                  handleNotificationClick(
                    notification.id,
                    notification.message.conversationId
                  )
                }
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src={notification.message.sender.image || undefined}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(notification.message.sender.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">
                      {notification.message.sender.name || "Unknown"}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {notification.message.content}
                  </p>
                  <span className="block text-xs text-muted-foreground/70">
                    {formatDistanceToNow(
                      new Date(notification.message.createdAt),
                      {
                        addSuffix: true,
                        locale: dateLocale,
                      }
                    )}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary"
              onClick={() => {
                setIsOpen(false);
                router.push("/chat");
              }}
            >
              View all messages
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
