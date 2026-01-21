"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionSync() {
  const { data: session } = useSession();

  useEffect(() => {
    // Store user email in localStorage for analytics exclusion
    if (session?.user?.email) {
      localStorage.setItem("userEmail", session.user.email);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [session]);

  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionSync />
      {children}
    </NextAuthSessionProvider>
  );
}
