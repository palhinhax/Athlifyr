"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Globe } from "lucide-react";
import { Language } from "@prisma/client";

export interface VariantTranslation {
  language: Language;
  name: string;
  description: string;
}

export interface VariantFormData {
  id?: string;
  name: string;
  distanceKm: string;
  startDate: string;
  startTime: string;
  translations: Record<Language, VariantTranslation>;
}

interface EventVariantsManagerProps {
  variants: VariantFormData[];
  onVariantChange: (
    index: number,
    field: "name" | "distanceKm" | "startDate" | "startTime",
    value: string
  ) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onVariantTranslationChange: (
    variantIndex: number,
    language: Language,
    field: keyof VariantTranslation,
    value: string
  ) => void;
}

const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export function EventVariantsManager({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  onVariantTranslationChange,
}: EventVariantsManagerProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>Variantes / Distâncias</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddVariant}
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </div>
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nome (ex: 21km, Singles Pro)"
                value={variant.name}
                onChange={(e) => onVariantChange(index, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="km"
                value={variant.distanceKm}
                onChange={(e) =>
                  onVariantChange(index, "distanceKm", e.target.value)
                }
                className="w-20"
                type="number"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveVariant(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">
                  Data (opcional)
                </Label>
                <Input
                  type="date"
                  value={variant.startDate}
                  onChange={(e) =>
                    onVariantChange(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="w-24">
                <Label className="text-xs text-muted-foreground">
                  Hora (opcional)
                </Label>
                <Input
                  type="time"
                  value={variant.startTime}
                  onChange={(e) =>
                    onVariantChange(index, "startTime", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Variant Translations */}
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                <Globe className="mr-1 inline h-3 w-3" />
                Traduções desta variante
              </summary>
              <div className="mt-2 space-y-2 rounded-md bg-muted/50 p-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div key={lang.code} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{lang.flag}</span>
                    <Input
                      placeholder={`Nome em ${lang.name}`}
                      value={variant.translations[lang.code]?.name || ""}
                      onChange={(e) =>
                        onVariantTranslationChange(
                          index,
                          lang.code,
                          "name",
                          e.target.value
                        )
                      }
                      className="flex-1 text-sm"
                    />
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
