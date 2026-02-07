"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Loader2 } from "lucide-react";
import { Language } from "@prisma/client";
import { useTranslations } from "next-intl";

export interface EventTranslation {
  language: Language;
  title: string;
  description: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
}

interface EventTranslationsEditorProps {
  translations: Record<Language, EventTranslation>;
  activeTab: Language;
  isLoading: boolean;
  onTranslationChange: (
    language: Language,
    field: keyof EventTranslation,
    value: string
  ) => void;
  onTabChange: (language: Language) => void;
}

const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export function EventTranslationsEditor({
  translations,
  activeTab,
  isLoading,
  onTranslationChange,
  onTabChange,
}: EventTranslationsEditorProps) {
  const t = useTranslations("admin.events");

  return (
    <div className="grid gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-p-info" />
        <h4 className="font-medium">{t("translationsTitle")}</h4>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {t("translationsDescription")}
      </p>

      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as Language)}>
        <TabsList className="grid w-full grid-cols-6">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
              <span className="mr-1">{lang.flag}</span>
              <span className="hidden sm:inline">
                {lang.code.toUpperCase()}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {SUPPORTED_LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code}>
            <div className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor={`title-${lang.code}`}>
                  Título ({lang.name})
                </Label>
                <Input
                  id={`title-${lang.code}`}
                  value={translations[lang.code]?.title || ""}
                  onChange={(e) =>
                    onTranslationChange(lang.code, "title", e.target.value)
                  }
                  placeholder={`Título em ${lang.name}`}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`description-${lang.code}`}>
                  Descrição ({lang.name})
                </Label>
                <textarea
                  id={`description-${lang.code}`}
                  value={translations[lang.code]?.description || ""}
                  onChange={(e) =>
                    onTranslationChange(
                      lang.code,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder={`Descrição em ${lang.name}`}
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`city-${lang.code}`}>
                  Cidade ({lang.name})
                </Label>
                <Input
                  id={`city-${lang.code}`}
                  value={translations[lang.code]?.city || ""}
                  onChange={(e) =>
                    onTranslationChange(lang.code, "city", e.target.value)
                  }
                  placeholder={`Nome da cidade em ${lang.name}`}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`metaTitle-${lang.code}`}>
                  Meta Title SEO ({lang.name})
                </Label>
                <Input
                  id={`metaTitle-${lang.code}`}
                  value={translations[lang.code]?.metaTitle || ""}
                  onChange={(e) =>
                    onTranslationChange(lang.code, "metaTitle", e.target.value)
                  }
                  placeholder={`Meta title para SEO em ${lang.name}`}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`metaDescription-${lang.code}`}>
                  Meta Description SEO ({lang.name})
                </Label>
                <Input
                  id={`metaDescription-${lang.code}`}
                  value={translations[lang.code]?.metaDescription || ""}
                  onChange={(e) =>
                    onTranslationChange(
                      lang.code,
                      "metaDescription",
                      e.target.value
                    )
                  }
                  placeholder={`Meta description para SEO em ${lang.name}`}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
