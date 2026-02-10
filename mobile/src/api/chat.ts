import { api } from "../lib/api";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date | string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface Conversation {
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
    createdAt: Date | string;
    senderId: string;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  updatedAt: Date | string;
}

export interface CreateConversationResponse {
  conversation: Conversation;
}

/**
 * Fetch all conversations for the current user
 */
export async function fetchConversations(): Promise<Conversation[]> {
  const response = await api.get<{ conversations: Conversation[] }>(
    "/chat/conversations"
  );
  return response.data.conversations || [];
}

/**
 * Fetch messages for a specific conversation
 */
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const response = await api.get<{ messages: Message[] }>(
    `/chat/conversations/${conversationId}/messages`
  );
  return response.data.messages || [];
}

/**
 * Poll for new messages after a given message ID
 */
export async function pollMessages(
  conversationId: string,
  afterMessageId: string | null
): Promise<Message[]> {
  const params = new URLSearchParams();
  if (afterMessageId) {
    params.set("after", afterMessageId);
  }

  const response = await api.get<{ messages: Message[] }>(
    `/chat/conversations/${conversationId}/messages/poll?${params.toString()}`
  );
  return response.data.messages || [];
}

/**
 * Send a message to a conversation
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const response = await api.post<{ message: Message }>(
    `/chat/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data.message;
}

/**
 * Create or get a conversation with another user
 */
export async function createConversation(
  otherUserId: string
): Promise<CreateConversationResponse> {
  const response = await api.post<CreateConversationResponse>(
    "/chat/conversations",
    { otherUserId }
  );
  return response.data;
}

/**
 * Hide a conversation
 */
export async function hideConversation(conversationId: string): Promise<void> {
  await api.post(`/chat/conversations/${conversationId}/hide`);
}
