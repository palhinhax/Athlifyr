"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  Minus,
  MessageCircleIcon,
  Loader2Icon,
  ExternalLinkIcon,
} from "lucide-react";
import { ChatWindow } from "./chat-window";
import {
  useChatMessages,
  useCreateConversation,
  Message,
} from "@/hooks/chat/use-chat";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface ChatWidgetProps {
  recipientId: string;
  recipientName: string | null;
  recipientImage: string | null;
  onClose: () => void;
}

export function ChatWidget({
  recipientId,
  recipientName,
  recipientImage,
  onClose,
}: ChatWidgetProps) {
  const { data: session, status } = useSession();
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const createConversation = useCreateConversation();

  // Initialize conversation
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const initConversation = async () => {
      try {
        const result = await createConversation.mutateAsync(recipientId);
        setConversationId(result.conversation.id);
      } catch (error) {
        console.error("Error initializing conversation:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initConversation();
  }, [recipientId, status, session?.user, createConversation]);

  // Use React Query for messages
  const {
    messages,
    isLoading: isLoadingMessages,
    isConnected,
    sendMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
  } = useChatMessages(conversationId, {
    pollingInterval: 2000,
    enabled: status === "authenticated" && !isMinimized && !!conversationId,
  });

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !session?.user) return;

      // Add message optimistically
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
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
      conversationId,
      session?.user,
      sendMessage,
      addOptimisticMessage,
      removeOptimisticMessage,
    ]
  );

  if (!session?.user?.id) return null;

  const isLoading = isInitializing || isLoadingMessages;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 hidden md:flex",
        "flex-col overflow-hidden rounded-lg border bg-background shadow-2xl",
        "transition-all duration-200 ease-in-out",
        isMinimized ? "h-14 w-72" : "h-[500px] w-96"
      )}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b bg-primary px-3 text-primary-foreground">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-foreground/20">
            {recipientImage ? (
              <Image
                src={recipientImage}
                alt={recipientName || "User"}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {recipientName?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <span className="truncate font-medium">
            {recipientName || "Unknown User"}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <Link href={`/user/${recipientId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              title="Ver perfil"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat content - hidden when minimized */}
      {!isMinimized && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ChatWindow
              conversationId={conversationId || ""}
              currentUserId={session.user.id}
              otherUser={{
                id: recipientId,
                name: recipientName,
                image: recipientImage,
              }}
              messages={messages}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
              isLoading={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Button to open chat widget
interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export function ChatButton({ onClick, className }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn("gap-2", className)}
    >
      <MessageCircleIcon className="h-4 w-4" />
      Mensagem
    </Button>
  );
}
