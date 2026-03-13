"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

/**
 * Hook for Apple Sign In authentication on the web.
 * Uses NextAuth Apple provider for automatic session management.
 */
export function useAppleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithApple = async (callbackUrl: string = "/") => {
    setIsLoading(true);
    try {
      await signIn("apple", { callbackUrl });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    // isLoading stays true during redirect — reset on page reload
  };

  return {
    signInWithApple,
    isLoading,
  };
}
