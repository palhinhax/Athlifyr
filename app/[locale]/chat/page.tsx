"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { useChatSocket } from "@/hooks/chat/use-chat-socket";
import { Loader2Icon } from "lucide-react";

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
    senderId: string;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  updatedAt: Date;
}

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

export default function ChatPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [socketToken, setSocketToken] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [startWithProcessed, setStartWithProcessed] = useState(false);

  // Get conversation from URL if present
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId && conversationId !== "undefined") {
      setSelectedConversationId(conversationId);
      setShowMobileSidebar(false);
    }
  }, [searchParams]);

  // Handle startWith parameter - create/open conversation with specific user
  useEffect(() => {
    if (status !== "authenticated" || startWithProcessed) return;

    const startWithUserId = searchParams.get("startWith");
    if (!startWithUserId) return;

    const startConversation = async () => {
      try {
        const response = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: startWithUserId }),
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedConversationId(data.conversation.id);
          setShowMobileSidebar(false);

          // Add conversation to list if not already there
          setConversations((prev) => {
            const exists = prev.some((c) => c.id === data.conversation.id);
            if (exists) return prev;
            return [data.conversation, ...prev];
          });
        }
      } catch (error) {
        console.error("Error starting conversation:", error);
      } finally {
        setStartWithProcessed(true);
      }
    };

    startConversation();
  }, [status, searchParams, startWithProcessed]);

  // Fetch socket token
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/socket-token");
        if (!response.ok) throw new Error("Failed to fetch socket token");
        const data = await response.json();
        setSocketToken(data.token);
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
    conversationId: selectedConversationId,
    token: socketToken,
    onNewMessage: handleNewMessage,
  });

  // Load conversations
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadConversations = async () => {
      try {
        const response = await fetch("/api/chat/conversations");
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, [status]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await fetch(
          `/api/chat/conversations/${selectedConversationId}/messages`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversationId]);

  const handleSendMessage = useCallback(
    (content: string) => {
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

      setMessages((prev) => [...prev, optimisticMessage]);

      // Send via socket
      const sent = sendMessage(content);

      if (!sent) {
        console.error("Failed to send message");
        // Optionally remove optimistic message on failure
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id)
        );
      }
    },
    [selectedConversationId, sendMessage, session?.user]
  );

  // Start a new conversation with a friend
  const handleStartConversation = useCallback(
    async (friendId: string): Promise<string | null> => {
      try {
        const response = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: friendId }),
        });

        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }

        const data = await response.json();
        const newConversation = data.conversation;

        // Add the new conversation to the list
        setConversations((prev) => {
          // Check if conversation already exists
          const exists = prev.some((c) => c.id === newConversation.id);
          if (exists) return prev;
          return [newConversation, ...prev];
        });

        return newConversation.id;
      } catch (error) {
        console.error("Error starting conversation:", error);
        return null;
      }
    },
    []
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
          <h1 className="text-2xl font-bold">Not Authenticated</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to access the chat.
          </p>
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
            onSelectConversation={(id) => {
              setSelectedConversationId(id);
              setShowMobileSidebar(false);
            }}
            onStartConversation={handleStartConversation}
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
                Select a conversation
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a conversation from the sidebar to start chatting
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
            Loading conversation...
          </div>
        )}
      </div>
    </div>
  );
}
