"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface LanguageSelectorProps {
  currentLocale: string;
  userId?: string;
}

export function LanguageSelector({
  currentLocale,
  userId,
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocale] = useState(currentLocale);
  const t = useTranslations("settings");

  const handleLanguageChange = async (newLocale: string) => {
    setLocale(newLocale);

    try {
      // Update user preference in database if logged in
      if (userId) {
        const response = await fetch("/api/user/locale", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: newLocale }),
        });

        if (!response.ok) {
          throw new Error("Failed to update language preference");
        }
      }

      // Use next-intl's router to navigate to the new locale
      startTransition(() => {
        router.replace(pathname, {
          locale: newLocale as "pt" | "en" | "es" | "fr" | "de" | "it",
        });
      });
    } catch (error) {
      console.error("Error updating language:", error);
      alert("Failed to update language preference");
      setLocale(currentLocale); // Revert on error
    }
  };

  return (
    <Select
      value={locale}
      onValueChange={handleLanguageChange}
      disabled={isPending}
    >
      <SelectTrigger id="language" className="w-full">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pt">
          <span className="flex items-center gap-2">🇵🇹 {t("portuguese")}</span>
        </SelectItem>
        <SelectItem value="en">
          <span className="flex items-center gap-2">🇬🇧 {t("english")}</span>
        </SelectItem>
        <SelectItem value="es">
          <span className="flex items-center gap-2">🇪🇸 {t("spanish")}</span>
        </SelectItem>
        <SelectItem value="fr">
          <span className="flex items-center gap-2">🇫🇷 {t("french")}</span>
        </SelectItem>
        <SelectItem value="de">
          <span className="flex items-center gap-2">🇩🇪 {t("german")}</span>
        </SelectItem>
        <SelectItem value="it">
          <span className="flex items-center gap-2">🇮🇹 {t("italian")}</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
