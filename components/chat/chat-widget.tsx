"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useChatSocket } from "@/hooks/chat/use-chat-socket";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socketToken, setSocketToken] = useState<string | null>(null);

  // Fetch or create conversation - wait for session to be ready
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const initConversation = async () => {
      try {
        console.log("Initializing conversation with:", recipientId);
        // Try to create or get existing conversation
        const response = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: recipientId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Conversation data:", data);
          setConversationId(data.conversation.id);

          // Load messages
          const messagesResponse = await fetch(
            `/api/chat/conversations/${data.conversation.id}/messages`
          );
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            console.log("Messages loaded:", messagesData.messages?.length || 0);
            setMessages(messagesData.messages || []);
          } else {
            console.error("Failed to load messages:", messagesResponse.status);
          }
        } else {
          console.error("Failed to create/get conversation:", response.status);
        }
      } catch (error) {
        console.error("Error initializing conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initConversation();
  }, [recipientId, status, session?.user]);

  // Fetch socket token - wait for session
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/socket-token");
        if (response.ok) {
          const data = await response.json();
          setSocketToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching socket token:", error);
      }
    };

    fetchToken();
  }, [status]);

  // Handle new messages from socket
  const handleNewMessage = useCallback((message: Message) => {
    // Avoid duplicates (message might already be added optimistically)
    setMessages((prev) => {
      const exists = prev.some(
        (m) =>
          m.id === message.id ||
          (m.id.startsWith("temp-") &&
            m.content === message.content &&
            m.senderId === message.senderId)
      );
      if (exists) {
        // Replace temp message with real one
        return prev.map((m) =>
          m.id.startsWith("temp-") &&
          m.content === message.content &&
          m.senderId === message.senderId
            ? message
            : m
        );
      }
      return [...prev, message];
    });
  }, []);

  // Initialize socket
  const { isConnected, sendMessage } = useChatSocket({
    conversationId,
    token: socketToken,
    onNewMessage: handleNewMessage,
  });

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!conversationId || !session?.user) return;

      // Add message optimistically (immediately show in UI)
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

      setMessages((prev) => [...prev, optimisticMessage]);

      // Send via socket
      sendMessage(content);
    },
    [conversationId, sendMessage, session?.user]
  );

  if (!session?.user?.id) return null;

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
