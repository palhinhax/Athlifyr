"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

/**
 * Hook for Facebook Sign In authentication on the web.
 * Uses NextAuth Facebook provider for automatic session management.
 */
export function useFacebookAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithFacebook = async (callbackUrl: string = "/") => {
    setIsLoading(true);
    try {
      await signIn("facebook", { callbackUrl });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    // isLoading stays true during redirect — reset on page reload
  };

  return {
    signInWithFacebook,
    isLoading,
  };
}
