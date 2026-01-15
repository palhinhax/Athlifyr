"use client";

import { createContext, useContext, ReactNode } from "react";

type Locale = "pt" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  messages: Record<string, unknown>;
}

export function LocaleProvider({
  children,
  initialLocale = "pt",
  messages,
}: LocaleProviderProps) {
  const locale = initialLocale;

  const setLocale = async (newLocale: Locale) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Update in database if user is logged in
    try {
      await fetch("/api/user/locale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
    } catch (error) {
      console.error("Failed to update locale:", error);
    }

    // Reload page
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[k];
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
