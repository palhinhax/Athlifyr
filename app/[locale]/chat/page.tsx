"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [socketToken, setSocketToken] = useState<string | null>(null);

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
    setMessages((prev) => [...prev, message]);
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
      if (!selectedConversationId) return;

      // Send via socket
      const sent = sendMessage(content);

      if (!sent) {
        console.error("Failed to send message");
      }
    },
    [selectedConversationId, sendMessage]
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const otherUser = selectedConversation?.participants.find(
    (p) => p.user.id !== session?.user?.id
  )?.user;

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 shrink-0">
        {isLoadingConversations ? (
          <div className="flex h-full items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <ChatSidebar
            conversations={conversations}
            currentUserId={session?.user?.id || ""}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {!selectedConversationId ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a conversation to start chatting
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
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading conversation...
          </div>
        )}
      </div>
    </div>
  );
}
