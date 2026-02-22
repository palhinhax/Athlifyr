"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";

function SessionSync() {
  const { data: session } = useSession();

  useEffect(() => {
    // Store user email in localStorage for analytics exclusion
    if (session?.user?.email) {
      localStorage.setItem("userEmail", session.user.email);
    } else {
      localStorage.removeItem("userEmail");
    }

    // Set Sentry user context: only attach pseudonymous id, never email by default
    if (session?.user?.id) {
      Sentry.setUser({ id: session.user.id });
    } else {
      Sentry.setUser(null);
    }
  }, [session]);

  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextAuthSessionProvider>
        <SessionSync />
        {children}
      </NextAuthSessionProvider>
    </QueryClientProvider>
  );
}
