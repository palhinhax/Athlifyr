"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export type GoogleAuthMethod = "nextauth" | "rest-api";

/**
 * Hook for Google OAuth authentication
 * Supports two methods:
 * 1. NextAuth (default) - automatic session management
 * 2. REST API - direct endpoint with JWT tokens
 */
export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  // Choose authentication method via environment variable
  // Default to "nextauth" if not set
  const authMethod: GoogleAuthMethod =
    (process.env.NEXT_PUBLIC_GOOGLE_AUTH_METHOD as GoogleAuthMethod) ||
    "nextauth";

  /**
   * Authenticate with Google using NextAuth
   */
  const signInWithNextAuth = async (callbackUrl: string = "/") => {
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("NextAuth Google sign-in error:", error);
      throw new Error("Failed to sign in with Google");
    }
  };

  /**
   * Authenticate with Google using REST API endpoint
   */
  const signInWithRestAPI = async () => {
    try {
      // Get auth URL from backend
      const response = await fetch("/api/auth/google-web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuthUrl" }),
      });

      if (!response.ok) {
        throw new Error("Failed to get Google auth URL");
      }

      const { authUrl } = await response.json();

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("REST API Google sign-in error:", error);
      throw new Error("Failed to sign in with Google");
    }
  };

  /**
   * Main sign-in function that uses the configured method
   */
  const signInWithGoogle = async (callbackUrl: string = "/") => {
    setIsLoading(true);
    try {
      if (authMethod === "rest-api") {
        await signInWithRestAPI();
      } else {
        await signInWithNextAuth(callbackUrl);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    // Note: isLoading stays true during redirect
    // It will be reset on page reload
  };

  return {
    signInWithGoogle,
    isLoading,
    authMethod, // Expose for debugging/display
  };
}
