import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const TOKEN_KEY = "auth-token";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from SecureStore:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        // The auth store will handle the logout and redirect
      } catch (e) {
        console.error("Error clearing token:", e);
      }
    }
    return Promise.reject(error);
  }
);
