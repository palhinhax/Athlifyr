import { create } from "zustand";
import { api } from "./api";
import { flushPendingActivities } from "./activity-sync-queue";
import {
  getSecureItem,
  setSecureItem,
  deleteSecureItem,
} from "./token-storage";

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const PUSH_TOKEN_KEY = "push-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pushToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setPushToken: (pushToken: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  pushToken: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: async (token) => {
    if (token) {
      await setSecureItem(TOKEN_KEY, token);
    } else {
      await deleteSecureItem(TOKEN_KEY);
    }
    set({ token, isAuthenticated: !!token });
  },

  setPushToken: async (pushToken) => {
    if (pushToken) {
      await setSecureItem(PUSH_TOKEN_KEY, pushToken);
    } else {
      await deleteSecureItem(PUSH_TOKEN_KEY);
    }
    set({ pushToken });
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      // Clear any previous session tokens before logging in
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(REFRESH_TOKEN_KEY);
      await deleteSecureItem(TOKEN_EXPIRY_KEY);

      const response = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });
      const { token, refreshToken, user } = response.data;

      // Store tokens
      await setSecureItem(TOKEN_KEY, token);
      if (refreshToken) {
        await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Update state
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Sync any activities recorded while logged out
      flushPendingActivities().catch(() => {});
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Deregister push token from backend before logout
      const pushToken = get().pushToken;
      if (pushToken) {
        try {
          await api.delete(`/push-tokens/${encodeURIComponent(pushToken)}`);
          console.log("Push token deregistered on logout");
        } catch (pushError: unknown) {
          console.error("Failed to deregister push token:", pushError);
        }
      }

      // Call logout endpoint
      await api.post("/auth/logout");
    } catch (error: unknown) {
      // Continue with local logout even if API call fails
      console.error("Logout API error:", error);
    } finally {
      // Clear tokens
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(REFRESH_TOKEN_KEY);
      await deleteSecureItem(PUSH_TOKEN_KEY);
      await deleteSecureItem(TOKEN_EXPIRY_KEY);

      // Clear state
      set({
        user: null,
        token: null,
        pushToken: null,
        isAuthenticated: false,
      });
    }
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });

      const token = await getSecureItem(TOKEN_KEY);
      const storedPushToken = await getSecureItem(PUSH_TOKEN_KEY);

      if (token) {
        // Verify token with API
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        set({
          token,
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          pushToken: storedPushToken,
        });

        // Sync any activities recorded while logged out
        flushPendingActivities().catch(() => {});
      } else {
        set({ isLoading: false });
      }
    } catch {
      // Token invalid or expired
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(TOKEN_EXPIRY_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await getSecureItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", { refreshToken });
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      // Store new tokens
      await setSecureItem(TOKEN_KEY, newToken);
      if (newRefreshToken) {
        await setSecureItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }

      set({ token: newToken });
    } catch {
      // Refresh failed - logout user
      await get().logout();
      throw new Error("Token refresh failed");
    }
  },
}));
