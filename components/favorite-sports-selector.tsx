"use client";

import { useState } from "react";
import { SportType } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sportTypeIcons } from "@/lib/event-utils";
import { cn } from "@/lib/utils";

interface FavoriteSportsSelectorProps {
  initialFavorites: SportType[];
  locale?: string;
}

export function FavoriteSportsSelector({
  initialFavorites,
  locale = "pt",
}: FavoriteSportsSelectorProps) {
  const allSports = Object.keys(SportType) as SportType[];
  const t = useTranslations();

  // If no favorites are set, default to all sports
  const [selectedSports, setSelectedSports] = useState<SportType[]>(
    initialFavorites.length > 0 ? initialFavorites : allSports
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const toggleSport = (sport: SportType) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/favorite-sports", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteSports: selectedSports,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title:
          locale === "pt"
            ? "Desportos favoritos guardados!"
            : "Favorite sports saved!",
        description:
          locale === "pt"
            ? "As tuas preferências foram atualizadas com sucesso."
            : "Your preferences have been successfully updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: locale === "pt" ? "Erro ao guardar" : "Error saving",
        description:
          locale === "pt"
            ? "Não foi possível guardar as tuas preferências."
            : "Unable to save your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify([...selectedSports].sort()) !==
    JSON.stringify([...initialFavorites].sort());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {allSports.map((sport) => (
          <button
            key={sport}
            onClick={() => toggleSport(sport)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-accent",
              selectedSports.includes(sport)
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <span className="text-2xl">{sportTypeIcons[sport]}</span>
            <span className="text-center text-sm font-medium">
              {t(`sports.${sport}`)}
            </span>
            {selectedSports.includes(sport) && (
              <span className="text-xs text-primary">
                ✓ {locale === "pt" ? "Selecionado" : "Selected"}
              </span>
            )}
          </button>
        ))}
      </div>

      {hasChanges && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedSports(initialFavorites)}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? locale === "pt"
                ? "A guardar..."
                : "Saving..."
              : locale === "pt"
                ? "Guardar Preferências"
                : "Save Preferences"}
          </Button>
        </div>
      )}

      {selectedSports.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {locale === "pt"
            ? "Nenhum desporto selecionado. Seleciona pelo menos um para personalizar a tua experiência."
            : "No sport selected. Select at least one to personalize your experience."}
        </p>
      )}
    </div>
  );
}
