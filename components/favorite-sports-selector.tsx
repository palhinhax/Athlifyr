"use client";

import { useState } from "react";
import { SportType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sportTypeLabels, sportTypeIcons } from "@/lib/event-utils";
import { cn } from "@/lib/utils";

interface FavoriteSportsSelectorProps {
  initialFavorites: SportType[];
}

export function FavoriteSportsSelector({
  initialFavorites,
}: FavoriteSportsSelectorProps) {
  const allSports = Object.keys(SportType) as SportType[];

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
        title: "Desportos favoritos guardados!",
        description: "As tuas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao guardar",
        description: "Não foi possível guardar as tuas preferências.",
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
      <p className="text-sm text-muted-foreground">
        Seleciona os desportos que te interessam. Verás eventos destes desportos
        em destaque na página inicial.
      </p>

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
              {sportTypeLabels[sport]}
            </span>
            {selectedSports.includes(sport) && (
              <span className="text-xs text-primary">✓ Selecionado</span>
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
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "A guardar..." : "Guardar Preferências"}
          </Button>
        </div>
      )}

      {selectedSports.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum desporto selecionado. Seleciona pelo menos um para personalizar
          a tua experiência.
        </p>
      )}
    </div>
  );
}
