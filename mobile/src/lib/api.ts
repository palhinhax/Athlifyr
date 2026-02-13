import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { getIntegrityToken } from "@/src/lib/integrity";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";

// Track if a token refresh is already in progress to avoid multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// HTTP methods that require Play Integrity verification
const PROTECTED_METHODS = new Set(["post", "put", "patch", "delete"]);

// Request interceptor for adding auth token and Play Integrity
api.interceptors.request.use(
  async (config) => {
    try {
      // Add auth token
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url} - Token present: YES`
        );
      } else {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url} - Token present: NO`
        );
      }

      // Add Play Integrity token for protected (write) requests
      const method = (config.method || "get").toLowerCase();
      if (PROTECTED_METHODS.has(method)) {
        try {
          const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
          const integrityToken = await getIntegrityToken(method, fullUrl);
          if (integrityToken) {
            config.headers["x-app-integrity"] = integrityToken;
            config.headers["x-client-platform"] = "android";
          }
        } catch (integrityError) {
          // Don't block request if integrity token fails
          console.warn(
            "[api] Failed to attach integrity token:",
            integrityError
          );
        }
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log 401 errors for debugging
    if (error.response?.status === 401) {
      console.error(
        `API 401 Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`
      );
      console.error("Response data:", error.response?.data);
    }

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh or login endpoints to avoid infinite loops
      const url = originalRequest.url || "";
      if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another refresh is in progress - queue this request
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } =
          response.data;

        // Store new tokens
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and logout
        processQueue(refreshError as Error, null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
