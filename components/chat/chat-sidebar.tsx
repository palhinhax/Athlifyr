"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import {
  PlusIcon,
  SearchIcon,
  MessageCircleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  EyeOffIcon,
  FlagIcon,
  BanIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface Conversation {
  id: string;
  participants: Array<{
    userId: string;
    lastSeenAt: Date | string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    senderId?: string;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  updatedAt: Date;
}

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onStartConversation?: (friendId: string) => Promise<string | null>;
  onHideConversation?: (conversationId: string) => void;
}

type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "INAPPROPRIATE_CONTENT"
  | "FAKE_ACCOUNT"
  | "SCAM"
  | "OTHER";

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function ChatSidebar({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  onStartConversation,
  onHideConversation,
}: ChatSidebarProps) {
  const locale = useLocale();
  const t = useTranslations("chat");
  const { toast } = useToast();
  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [isHidingChat, setIsHidingChat] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingUser, setReportingUser] = useState<{
    id: string;
    name: string | null;
    conversationId: string;
  } | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason | "">("");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockingUser, setBlockingUser] = useState<{
    id: string;
    name: string | null;
    conversationId: string;
  } | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.user.id !== currentUserId)
      ?.user;
  };

  const isUnread = (conversation: Conversation) => {
    const myParticipant = conversation.participants.find(
      (p) => p.user.id === currentUserId
    );
    if (!myParticipant) return false;
    const lastMessage = conversation.messages[0];
    if (!lastMessage) return false;
    // Don't show unread for own messages
    if ((lastMessage.sender?.id ?? lastMessage.senderId) === currentUserId)
      return false;
    return new Date(lastMessage.createdAt) > new Date(myParticipant.lastSeenAt);
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

  const loadFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const response = await fetch("/api/friends");
      if (response.ok) {
        const data = await response.json();
        // API returns an array directly, not { friends: [...] }
        const friendsList: Friend[] = Array.isArray(data)
          ? data
          : (data.friends ?? []);
        // Filter out friends we already have conversations with
        const existingUserIds = new Set(
          conversations.flatMap((c) => c.participants.map((p) => p.user.id))
        );
        const availableFriends = friendsList.filter(
          (f: Friend) => !existingUserIds.has(f.id) && f.id !== currentUserId
        );
        setFriends(availableFriends);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleOpenNewChat = () => {
    setIsNewChatOpen(true);
    loadFriends();
  };

  const handleStartChat = async (friendId: string) => {
    if (!onStartConversation) return;

    setIsStartingChat(friendId);
    try {
      const conversationId = await onStartConversation(friendId);
      if (conversationId) {
        setIsNewChatOpen(false);
        onSelectConversation(conversationId);
      }
    } finally {
      setIsStartingChat(null);
    }
  };

  const handleHideConversation = async (conversationId: string) => {
    setIsHidingChat(conversationId);
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}/hide`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: t("hideSuccess"),
        });
        onHideConversation?.(conversationId);
      } else {
        toast({
          variant: "destructive",
          title: t("hideError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("hideError"),
      });
    } finally {
      setIsHidingChat(null);
    }
  };

  const handleOpenReportDialog = (
    userId: string,
    userName: string | null,
    conversationId: string
  ) => {
    setReportingUser({ id: userId, name: userName, conversationId });
    setReportReason("");
    setReportDetails("");
    setReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingUser || !reportReason) return;

    setIsSubmittingReport(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedId: reportingUser.id,
          reason: reportReason,
          details: reportDetails || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: t("reportSuccess"),
        });
        setReportDialogOpen(false);
      } else {
        const data = await response.json();
        toast({
          variant: "destructive",
          title:
            data.error === "You have already reported this user"
              ? t("alreadyReported")
              : t("reportError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("reportError"),
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleOpenBlockDialog = (
    userId: string,
    userName: string | null,
    conversationId: string
  ) => {
    setBlockingUser({ id: userId, name: userName, conversationId });
    setBlockDialogOpen(true);
  };

  const handleBlockUser = async () => {
    if (!blockingUser) return;

    setIsBlocking(true);
    try {
      const response = await fetch("/api/users/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockedId: blockingUser.id,
        }),
      });

      if (response.ok) {
        toast({
          title: t("blockSuccess"),
          description: t("blockSuccessDesc"),
        });
        setBlockDialogOpen(false);
        // Hide the conversation after blocking
        onHideConversation?.(blockingUser.conversationId);
      } else {
        const data = await response.json();
        toast({
          variant: "destructive",
          title:
            data.error === "User already blocked"
              ? t("alreadyBlocked")
              : t("blockError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("blockError"),
      });
    } finally {
      setIsBlocking(false);
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenNewChat}
              className="h-9 w-9"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">New conversation</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Friends list */}
              <div className="max-h-[300px] overflow-y-auto">
                {isLoadingFriends ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {friends.length === 0
                      ? "No friends available to chat"
                      : "No friends found"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => handleStartChat(friend.id)}
                        disabled={isStartingChat === friend.id}
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={friend.image || undefined} />
                          <AvatarFallback>
                            {getInitials(friend.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {friend.name || "Unknown"}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {friend.email}
                          </p>
                        </div>
                        {isStartingChat === friend.id && (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <MessageCircleIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{t("noConversations")}</p>
              <p className="text-sm text-muted-foreground">
                {t("noConversationsDescription")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenNewChat}
              className="mt-2"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("newConversationButton")}
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const lastMessage = conversation.messages[0];
              const isSelected = conversation.id === selectedConversationId;
              const unread = isUnread(conversation);

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50 sm:p-4",
                    isSelected && "bg-muted hover:bg-muted",
                    unread && !isSelected && "bg-primary/5"
                  )}
                >
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="flex flex-1 items-start gap-3"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 shrink-0 border border-border sm:h-12 sm:w-12">
                        <AvatarImage src={otherUser?.image || undefined} />
                        <AvatarFallback>
                          {getInitials(otherUser?.name || null)}
                        </AvatarFallback>
                      </Avatar>
                      {unread && (
                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm sm:text-base",
                            unread ? "font-bold text-foreground" : "font-medium"
                          )}
                        >
                          {otherUser?.name || t("unknownUser")}
                        </p>
                        {lastMessage && (
                          <span
                            className={cn(
                              "shrink-0 text-[10px] sm:text-xs",
                              unread
                                ? "font-semibold text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatDistanceToNow(
                              new Date(lastMessage.createdAt),
                              { addSuffix: false, locale: dateLocale }
                            )}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p
                          className={cn(
                            "mt-0.5 truncate text-xs sm:text-sm",
                            unread
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {(lastMessage.sender?.id ?? lastMessage.senderId) ===
                          currentUserId
                            ? "You: "
                            : ""}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                        disabled={isHidingChat === conversation.id}
                      >
                        {isHidingChat === conversation.id ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVerticalIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHideConversation(conversation.id);
                        }}
                      >
                        <EyeOffIcon className="mr-2 h-4 w-4" />
                        {t("hideConversation")}
                      </DropdownMenuItem>
                      {otherUser && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReportDialog(
                              otherUser.id,
                              otherUser.name,
                              conversation.id
                            );
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <FlagIcon className="mr-2 h-4 w-4" />
                          {t("reportUser")}
                        </DropdownMenuItem>
                      )}
                      {otherUser && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBlockDialog(
                              otherUser.id,
                              otherUser.name,
                              conversation.id
                            );
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <BanIcon className="mr-2 h-4 w-4" />
                          {t("blockUser")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("reportTitle")}</DialogTitle>
            <DialogDescription>{t("reportDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-reason">{t("reportReason")}</Label>
              <Select
                value={reportReason}
                onValueChange={(value) =>
                  setReportReason(value as ReportReason)
                }
              >
                <SelectTrigger id="report-reason">
                  <SelectValue placeholder={t("reportReason")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPAM">
                    {t("reportReasons.SPAM")}
                  </SelectItem>
                  <SelectItem value="HARASSMENT">
                    {t("reportReasons.HARASSMENT")}
                  </SelectItem>
                  <SelectItem value="INAPPROPRIATE_CONTENT">
                    {t("reportReasons.INAPPROPRIATE_CONTENT")}
                  </SelectItem>
                  <SelectItem value="FAKE_ACCOUNT">
                    {t("reportReasons.FAKE_ACCOUNT")}
                  </SelectItem>
                  <SelectItem value="SCAM">
                    {t("reportReasons.SCAM")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t("reportReasons.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-details">{t("reportDetails")}</Label>
              <Textarea
                id="report-details"
                placeholder={t("reportDetailsPlaceholder")}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
            >
              {t("reportCancel")}
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!reportReason || isSubmittingReport}
              variant="destructive"
            >
              {isSubmittingReport && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("reportSubmit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("blockDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("blockDialog.description", {
                name: blockingUser?.name || t("unknownUser"),
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlockDialogOpen(false)}
              disabled={isBlocking}
            >
              {t("blockDialog.cancel")}
            </Button>
            <Button
              onClick={handleBlockUser}
              disabled={isBlocking}
              variant="destructive"
            >
              {isBlocking && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("blockDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
