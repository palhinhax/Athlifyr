"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, Loader2Icon, ArrowLeftIcon, CircleIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  // Nested sender object (from Next.js API / GET messages)
  sender?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  // Flat sender fields (from live server ChatMessageEvent / POST message)
  senderName?: string | null;
  senderImage?: string | null;
}

/** Safely extract sender info from a message (handles both nested and flat formats) */
function getSender(message: Message) {
  return {
    name: message.sender?.name ?? message.senderName ?? null,
    image: message.sender?.image ?? message.senderImage ?? null,
  };
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  messages: Message[];
  onSendMessage: (content: string) => void;
  isConnected: boolean;
  isLoading?: boolean;
  onBack?: () => void;
}

export function ChatWindow({
  conversationId: _conversationId,
  currentUserId,
  otherUser,
  messages,
  onSendMessage,
  isConnected,
  isLoading = false,
  onBack,
}: Readonly<ChatWindowProps>) {
  const t = useTranslations("chat");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !isConnected) return;

    onSendMessage(messageText.trim());
    setMessageText("");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background px-3 py-3 shadow-sm sm:gap-3 sm:px-4 sm:py-4">
        {/* Back button - Mobile only */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        )}

        {/* User avatar and info - clickable to go to profile */}
        <Link
          href={`/user/${otherUser.id}`}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md transition-colors hover:bg-muted/50 sm:gap-3"
        >
          <Avatar className="h-9 w-9 shrink-0 sm:h-10 sm:w-10">
            <AvatarImage src={otherUser.image || undefined} />
            <AvatarFallback className="text-sm">
              {getInitials(otherUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold sm:text-base">
              {otherUser.name || t("unknownUser")}
            </h3>
            {/* Connection status - shows YOUR connection to chat server, not other user's online status */}
            {!isConnected && (
              <div className="flex items-center gap-1.5">
                <CircleIcon className="h-2 w-2 fill-current text-amber-500" />
                <p className="text-xs text-muted-foreground">
                  {t("connecting")}
                </p>
              </div>
            )}
          </div>
        </Link>
      </header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <div className="rounded-full bg-muted p-4">
              <SendIcon className="h-6 w-6" />
            </div>
            <p className="text-sm sm:text-base">{t("noMessages")}</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              const sender = getSender(message);
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar - Hidden for own messages on mobile to save space */}
                  <Avatar
                    className={cn(
                      "h-7 w-7 shrink-0 sm:h-8 sm:w-8",
                      isOwnMessage && "hidden sm:flex"
                    )}
                  >
                    <AvatarImage
                      src={sender.image || undefined}
                      alt={sender.name || "User"}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(sender.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex max-w-[85%] flex-col sm:max-w-[70%]",
                      isOwnMessage ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5",
                        isOwnMessage
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <span className="mt-1 px-1 text-[10px] text-muted-foreground sm:text-xs">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Sticky bottom */}
      <footer className="sticky bottom-0 shrink-0 border-t bg-background p-3 sm:p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={t("typeMessage")}
              disabled={!isConnected}
              className="flex-1 rounded-full bg-muted/50 px-4 text-sm focus-visible:ring-1 sm:text-base"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={!messageText.trim() || !isConnected}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full"
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">{t("send")}</span>
            </Button>
          </div>
          {!isConnected && (
            <p className="mt-2 text-center text-xs text-destructive sm:text-sm">
              {t("connectionError")}
            </p>
          )}
        </form>
      </footer>
    </div>
  );
}
