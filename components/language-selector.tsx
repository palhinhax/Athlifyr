"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getTranslations } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLocale: string;
  userId?: string;
}

export function LanguageSelector({
  currentLocale,
  userId,
}: LanguageSelectorProps) {
  const [locale, setLocale] = useState(currentLocale);
  const [isLoading, setIsLoading] = useState(false);
  const t = getTranslations(locale);

  const handleLanguageChange = async (newLocale: string) => {
    setLocale(newLocale);
    setIsLoading(true);

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

      // Set cookie for non-authenticated users
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

      // Reload page to apply new locale
      window.location.reload();
    } catch (error) {
      console.error("Error updating language:", error);
      alert("Failed to update language preference");
      setLocale(currentLocale); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="language">{t("settings.language")}</Label>
        <p className="text-sm text-muted-foreground">
          {t("settings.languageDescription")}
        </p>
      </div>

      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        disabled={isLoading}
      >
        <SelectTrigger id="language" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt">
            <span className="flex items-center gap-2">
              🇵🇹 {t("settings.portuguese")}
            </span>
          </SelectItem>
          <SelectItem value="en">
            <span className="flex items-center gap-2">
              🇬🇧 {t("settings.english")}
            </span>
          </SelectItem>
          <SelectItem value="es">
            <span className="flex items-center gap-2">
              🇪🇸 {t("settings.spanish")}
            </span>
          </SelectItem>
          <SelectItem value="fr">
            <span className="flex items-center gap-2">
              🇫🇷 {t("settings.french")}
            </span>
          </SelectItem>
          <SelectItem value="de">
            <span className="flex items-center gap-2">
              🇩🇪 {t("settings.german")}
            </span>
          </SelectItem>
          <SelectItem value="it">
            <span className="flex items-center gap-2">
              🇮🇹 {t("settings.italian")}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {locale === "pt"
              ? "A aplicar alterações..."
              : locale === "es"
                ? "Aplicando cambios..."
                : locale === "fr"
                  ? "Application des modifications..."
                  : locale === "de"
                    ? "Änderungen werden angewendet..."
                    : locale === "it"
                      ? "Applicazione delle modifiche..."
                      : "Applying changes..."}
          </span>
        </div>
      )}
    </div>
  );
}
