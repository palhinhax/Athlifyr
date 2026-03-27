// ============================================================================
// Athlifyr Mobile — Athli AI Chat API
//
// Communicates with /api/athli/chat endpoints on the Next.js backend.
// Uses the same authenticated API instance as other mobile API calls.
// ============================================================================

import { api } from "../lib/api";

export interface AthliMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AthliConversation {
  id: string;
  title: string | null;
  updatedAt: string;
  messages: { content: string }[];
}

export interface AthliChatResponse {
  conversationId: string;
  message: {
    role: "assistant";
    content: string;
  };
}

/**
 * Fetch all Athli AI conversations for the current user.
 */
export async function fetchAthliConversations(): Promise<AthliConversation[]> {
  const { data } = await api.get<{ conversations: AthliConversation[] }>(
    "/athli/chat"
  );
  return data.conversations || [];
}

/**
 * Fetch messages for a specific Athli AI conversation.
 */
export async function fetchAthliMessages(
  conversationId: string
): Promise<AthliMessage[]> {
  const { data } = await api.get<{
    conversation: { id: string; title: string; messages: AthliMessage[] };
  }>(`/athli/chat/${conversationId}`);
  return data.conversation.messages || [];
}

/**
 * Send a message to Athli AI and get a response.
 */
export async function sendAthliMessage(params: {
  message: string;
  conversationId?: string | null;
  locale: string;
  userLatitude?: number | null;
  userLongitude?: number | null;
}): Promise<AthliChatResponse> {
  const { data } = await api.post<AthliChatResponse>(
    "/athli/chat",
    {
      message: params.message,
      conversationId: params.conversationId,
      locale: params.locale,
      userLatitude: params.userLatitude ?? undefined,
      userLongitude: params.userLongitude ?? undefined,
    },
    { timeout: 120_000 }
  );
  return data;
}

/**
 * Delete an Athli AI conversation.
 */
export async function deleteAthliConversation(
  conversationId: string
): Promise<void> {
  await api.delete(`/athli/chat/${conversationId}`);
}
