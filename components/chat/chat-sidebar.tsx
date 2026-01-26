"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import {
  PlusIcon,
  SearchIcon,
  MessageCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  participants: Array<{
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
}

export function ChatSidebar({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  onStartConversation,
}: ChatSidebarProps) {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.user.id !== currentUserId)
      ?.user;
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
        // Filter out friends we already have conversations with
        const existingUserIds = new Set(
          conversations.flatMap((c) => c.participants.map((p) => p.user.id))
        );
        const availableFriends =
          data.friends?.filter(
            (f: Friend) => !existingUserIds.has(f.id) && f.id !== currentUserId
          ) || [];
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
              <p className="font-medium">No conversations yet</p>
              <p className="text-sm text-muted-foreground">
                Start a new conversation with a friend
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenNewChat}
              className="mt-2"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New chat
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const lastMessage = conversation.messages[0];
              const isSelected = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50 sm:p-4",
                    isSelected && "bg-muted hover:bg-muted"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                    <AvatarImage src={otherUser?.image || undefined} />
                    <AvatarFallback>
                      {getInitials(otherUser?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium sm:text-base">
                        {otherUser?.name || "Unknown User"}
                      </p>
                      {lastMessage && (
                        <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                          {formatDistanceToNow(
                            new Date(lastMessage.createdAt),
                            { addSuffix: false }
                          )}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                        {lastMessage.sender.id === currentUserId ? "You: " : ""}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
