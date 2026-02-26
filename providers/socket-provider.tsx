"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

// ─── Socket Event Types (mirrored from live/src/types) ─────────────────────

/** Client → Server events */
interface ChatClientToServerEvents {
  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:message": (data: { conversationId: string; content: string }) => void;
  "chat:typing": (data: { conversationId: string; isTyping: boolean }) => void;
  "chat:seen": (conversationId: string) => void;
  ping: () => void;
}

/** Server → Client events */
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

// ─── Typed Socket ──────────────────────────────────────────────────────────

type TypedSocket = Socket<ChatServerToClientEvents, ChatClientToServerEvents>;

// ─── Context ───────────────────────────────────────────────────────────────

interface SocketContextValue {
  /** The socket instance (null if not connected or not authenticated) */
  socket: TypedSocket | null;
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** Whether we're in the process of connecting */
  isConnecting: boolean;
  /** Connection error message, if any */
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

const LIVE_SERVER_URL =
  process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:4000";

/** How often to refresh the live token (5 minutes) */
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000;

interface SocketProviderProps {
  children: ReactNode;
}

async function fetchLiveToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/live-token");
    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    return null;
  }
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<TypedSocket | null>(null);
  const tokenRef = useRef<string | null>(null);
  const tokenRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Connect to live server
  const connect = useCallback(async () => {
    // Don't reconnect if already connected
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    const token = await fetchLiveToken();
    if (!token) {
      setIsConnecting(false);
      setError("Failed to obtain live token");
      return;
    }

    tokenRef.current = token;

    const socket: TypedSocket = io(LIVE_SERVER_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
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
        // Server disconnected us — possibly token expired, try reconnect
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

  // Disconnect from live server
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
        tokenRef.current = newToken;
        // Update auth for next reconnection attempt
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

  // Connect/disconnect based on session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      connect();
    } else if (status === "unauthenticated") {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [status, session?.user, connect, disconnect]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        isConnecting,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
