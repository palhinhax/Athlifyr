// ============================================================================
// Athlifyr Mobile — Socket.io Provider & Hook
//
// Manages the Socket.io connection to the live server.
// Mirrors the web socket-provider but for React Native.
// ============================================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import { io, type Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { LIVE_SERVER_URL, fetchLiveToken } from "../lib/live";

// ─── Socket Event Types ────────────────────────────────────────────────────

interface ChatClientToServerEvents {
  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:message": (data: { conversationId: string; content: string }) => void;
  "chat:typing": (data: { conversationId: string; isTyping: boolean }) => void;
  "chat:seen": (conversationId: string) => void;
  ping: () => void;
}

interface ChatServerToClientEvents {
  "chat:message": (data: ChatMessageEvent) => void;
  "chat:typing": (data: ChatTypingEvent) => void;
  "chat:seen": (data: ChatSeenEvent) => void;
  "chat:user_online": (data: { userId: string }) => void;
  "chat:user_offline": (data: { userId: string }) => void;
  "chat:error": (data: { message: string; code?: string }) => void;
  "connection:authenticated": (data: { userId: string }) => void;
}

export interface ChatMessageEvent {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  content: string;
  createdAt: string;
}

export interface ChatTypingEvent {
  conversationId: string;
  userId: string;
  userName: string | null;
  isTyping: boolean;
}

export interface ChatSeenEvent {
  conversationId: string;
  userId: string;
  lastSeenAt: string;
}

type TypedSocket = Socket<ChatServerToClientEvents, ChatClientToServerEvents>;

// ─── Context ───────────────────────────────────────────────────────────────

interface SocketContextValue {
  socket: TypedSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,
});

export function useSocket() {
  return useContext(SocketContext);
}

// ─── Provider ──────────────────────────────────────────────────────────────

const AUTH_TOKEN_KEY = "auth-token";
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<TypedSocket | null>(null);
  const tokenRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const connect = useCallback(async () => {
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    const token = await fetchLiveToken();
    if (!token) {
      setIsConnecting(false);
      setError("Failed to obtain live token");
      return;
    }

    const socket: TypedSocket = io(LIVE_SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        setError("Disconnected by server");
      }
    });

    socket.on("connect_error", (err) => {
      setIsConnecting(false);
      setIsConnected(false);
      setError(err.message);
    });

    socket.on("connection:authenticated", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);

    if (tokenRefreshTimerRef.current) {
      clearInterval(tokenRefreshTimerRef.current);
      tokenRefreshTimerRef.current = null;
    }
  }, []);

  // Token refresh loop
  useEffect(() => {
    if (!isConnected || !socketRef.current) return;

    tokenRefreshTimerRef.current = setInterval(async () => {
      const newToken = await fetchLiveToken();
      if (newToken && socketRef.current) {
        socketRef.current.auth = { token: newToken };
      }
    }, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (tokenRefreshTimerRef.current) {
        clearInterval(tokenRefreshTimerRef.current);
        tokenRefreshTimerRef.current = null;
      }
    };
  }, [isConnected]);

  // Connect when authenticated, disconnect on app background
  useEffect(() => {
    let isMounted = true;

    const checkAuthAndConnect = async () => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token && isMounted) {
        connect();
      }
    };

    checkAuthAndConnect();

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          checkAuthAndConnect();
        } else if (nextState === "background") {
          disconnect();
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
      disconnect();
    };
  }, [connect, disconnect]);

  return React.createElement(
    SocketContext.Provider,
    {
      value: {
        socket: socketRef.current,
        isConnected,
        isConnecting,
        error,
      },
    },
    children
  );
}
