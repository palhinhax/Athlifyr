"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import {
  useConversations,
  useChatMessages,
  useCreateConversation,
  Message,
} from "@/hooks/chat/use-chat";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations("chat");

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [startWithProcessed, setStartWithProcessed] = useState(false);

  // React Query hooks
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useConversations(status === "authenticated");

  const {
    messages,
    isLoading: isLoadingMessages,
    isConnected,
    sendMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
  } = useChatMessages(selectedConversationId, {
    pollingInterval: 2000,
    enabled: status === "authenticated",
  });

  const createConversation = useCreateConversation();

  // Get conversation from URL if present
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId && conversationId !== "undefined") {
      setSelectedConversationId(conversationId);
      setShowMobileSidebar(false);
      // Mark conversation as seen
      fetch(`/api/chat/conversations/${conversationId}/seen`, {
        method: "POST",
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["chatNotifications"] });
        })
        .catch((error) => {
          console.error("Error marking conversation as seen:", error);
        });
    }
  }, [searchParams, queryClient]);

  // Handle startWith parameter - create/open conversation with specific user
  useEffect(() => {
    if (status !== "authenticated" || startWithProcessed) return;

    const startWithUserId = searchParams.get("startWith");
    if (!startWithUserId) return;

    const startConversation = async () => {
      try {
        const result = await createConversation.mutateAsync(startWithUserId);
        setSelectedConversationId(result.conversation.id);
        setShowMobileSidebar(false);
        // Mark conversation as seen
        await fetch(`/api/chat/conversations/${result.conversation.id}/seen`, {
          method: "POST",
        });
        queryClient.invalidateQueries({ queryKey: ["chatNotifications"] });
      } catch (error) {
        console.error("Error starting conversation:", error);
      } finally {
        setStartWithProcessed(true);
      }
    };

    startConversation();
  }, [
    status,
    searchParams,
    startWithProcessed,
    createConversation,
    queryClient,
  ]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !session?.user) return;

      // Add message optimistically (immediately show in UI)
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversationId,
        senderId: session.user.id,
        content,
        createdAt: new Date(),
        sender: {
          id: session.user.id,
          name: session.user.name || null,
          image: session.user.image || null,
        },
      };

      addOptimisticMessage(optimisticMessage);

      try {
        await sendMessage({ content });
      } catch (error) {
        console.error("Failed to send message:", error);
        removeOptimisticMessage(optimisticMessage.id);
      }
    },
    [
      selectedConversationId,
      session?.user,
      sendMessage,
      addOptimisticMessage,
      removeOptimisticMessage,
    ]
  );

  // Start a new conversation with a friend
  const handleStartConversation = useCallback(
    async (friendId: string): Promise<string | null> => {
      try {
        const result = await createConversation.mutateAsync(friendId);
        return result.conversation.id;
      } catch (error) {
        console.error("Error starting conversation:", error);
        return null;
      }
    },
    [createConversation]
  );

  // Hide a conversation from the list
  const handleHideConversation = useCallback(
    (conversationId: string) => {
      // Update the cache to remove the conversation
      queryClient.setQueryData(
        ["conversations"],
        (old: typeof conversations | undefined) => {
          if (!old) return [];
          return old.filter((c) => c.id !== conversationId);
        }
      );

      // If the hidden conversation was selected, deselect it
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
        setShowMobileSidebar(true);
      }
    },
    [queryClient, selectedConversationId]
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const otherUser = selectedConversation?.participants.find(
    (p) => p.user.id !== session?.user?.id
  )?.user;

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("notAuthenticated")}</h1>
          <p className="mt-2 text-gray-600">{t("signInRequired")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar - Hidden on mobile when conversation selected */}
      <div
        className={`${
          showMobileSidebar ? "flex" : "hidden"
        } w-full flex-col border-r md:flex md:w-80 md:shrink-0 lg:w-96`}
      >
        {isLoadingConversations ? (
          <div className="flex h-full items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChatSidebar
            conversations={conversations}
            currentUserId={session?.user?.id || ""}
            selectedConversationId={selectedConversationId}
            onSelectConversation={async (id) => {
              setSelectedConversationId(id);
              setShowMobileSidebar(false);
              // Mark conversation as seen to clear unread notifications
              try {
                await fetch(`/api/chat/conversations/${id}/seen`, {
                  method: "POST",
                });
                // Invalidate notifications to update the badge
                queryClient.invalidateQueries({
                  queryKey: ["chatNotifications"],
                });
              } catch (error) {
                console.error("Error marking conversation as seen:", error);
              }
            }}
            onStartConversation={handleStartConversation}
            onHideConversation={handleHideConversation}
          />
        )}
      </div>

      {/* Chat Window - Full width on mobile when conversation selected */}
      <div
        className={`${
          showMobileSidebar ? "hidden" : "flex"
        } min-w-0 flex-1 flex-col md:flex`}
      >
        {!selectedConversationId ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-muted/30 p-4 text-center">
            <div className="rounded-full bg-muted p-6">
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {t("selectConversation")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("noConversationsDescription")}
              </p>
            </div>
          </div>
        ) : otherUser ? (
          <ChatWindow
            conversationId={selectedConversationId}
            currentUserId={session?.user?.id || ""}
            otherUser={otherUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
            isLoading={isLoadingMessages}
            onBack={() => setShowMobileSidebar(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
            {t("loadingConversation")}
          </div>
        )}
      </div>
    </div>
  );
}
