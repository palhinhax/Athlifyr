"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

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

interface ChatSidebarProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatSidebar({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
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

  return (
    <div className="flex h-full flex-col border-r bg-gray-50">
      <div className="border-b bg-white p-4">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
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
                  className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-100 ${
                    isSelected ? "bg-blue-50 hover:bg-blue-100" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={otherUser?.image || undefined} />
                    <AvatarFallback>
                      {getInitials(otherUser?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-medium">
                        {otherUser?.name || "Unknown User"}
                      </p>
                      {lastMessage && (
                        <span className="shrink-0 text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(lastMessage.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="truncate text-sm text-gray-600">
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
