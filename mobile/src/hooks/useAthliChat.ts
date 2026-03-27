// ============================================================================
// Athlifyr Mobile — Athli AI Chat Hook
//
// Manages Athli AI conversation state: messages, conversations list,
// sending messages, loading history. Uses React Query for caching.
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import {
  fetchAthliConversations,
  fetchAthliMessages,
  sendAthliMessage,
  deleteAthliConversation,
  type AthliMessage,
} from "../api/athli";

/**
 * Hook for fetching Athli AI conversations list
 */
export function useAthliConversations(enabled = true) {
  return useQuery({
    queryKey: ["athli-conversations"],
    queryFn: fetchAthliConversations,
    enabled,
    staleTime: 30_000,
  });
}

/**
 * Main hook for Athli AI chat — manages a single conversation session.
 */
export function useAthliChat() {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AthliMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locationRef = useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  // Request location permission and get current position on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        locationRef.current = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      } catch {
        // Location unavailable — will send messages without coordinates
      }
    })();
  }, []);

  // Load messages for a specific conversation
  const loadConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const msgs = await fetchAthliMessages(id);
      setConversationId(id);
      setMessages(msgs);
    } catch (error) {
      console.error("[AthliChat] Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a new conversation (reset state)
  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: sendAthliMessage,
    onSuccess: (data) => {
      setConversationId(data.conversationId);

      // Add the assistant response
      const assistantMsg: AthliMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message.content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["athli-conversations"] });
    },
  });

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || sendMutation.isPending) return;

      // Add optimistic user message
      const userMsg: AthliMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      await sendMutation.mutateAsync({
        message: content.trim(),
        conversationId,
        locale: i18n.language,
        userLatitude: locationRef.current?.latitude,
        userLongitude: locationRef.current?.longitude,
      });
    },
    [conversationId, i18n.language, sendMutation]
  );

  // Delete a conversation
  const deleteConversationFn = useCallback(
    async (id: string) => {
      try {
        await deleteAthliConversation(id);
        queryClient.invalidateQueries({ queryKey: ["athli-conversations"] });
        if (conversationId === id) {
          startNewConversation();
        }
      } catch (error) {
        console.error("[AthliChat] Failed to delete conversation:", error);
      }
    },
    [conversationId, startNewConversation, queryClient]
  );

  return {
    messages,
    conversationId,
    isLoading: isLoading || sendMutation.isPending,
    isSending: sendMutation.isPending,
    error: sendMutation.error,
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation: deleteConversationFn,
  };
}
