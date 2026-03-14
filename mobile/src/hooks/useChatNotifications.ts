import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";
import { fetchChatNotifications } from "../api/chat";

/**
 * Hook for chat unread count — initial fetch via REST, real-time via Socket.io.
 * The live server emits chat:message to user rooms, so this stays up-to-date
 * even when the user is not on the chat screen.
 */
export function useChatNotifications(enabled = true) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["chat-notifications"],
    queryFn: fetchChatNotifications,
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Listen for incoming messages to refresh unread count
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["chat-notifications"] });
    };

    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [socket, isConnected, queryClient]);

  return {
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
  };
}
