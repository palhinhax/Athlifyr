"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
] as const;

type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

interface VenueTranslation {
  language: LanguageCode;
  metaTitle: string;
  metaDescription: string;
}

interface VenueSEOSettingsProps {
  venueId: string;
  venueName: string;
  venueCity: string | null;
  isOwner: boolean;
  isAppAdmin?: boolean;
}

export function VenueSEOSettings({
  venueId,
  venueName,
  venueCity,
  isOwner,
  isAppAdmin = false,
}: VenueSEOSettingsProps) {
  const t = useTranslations("venues");
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("en");
  const [translations, setTranslations] = useState<
    Record<LanguageCode, VenueTranslation>
  >(() => {
    const initial: Partial<Record<LanguageCode, VenueTranslation>> = {};
    for (const lang of SUPPORTED_LANGUAGES) {
      initial[lang.code] = {
        language: lang.code,
        metaTitle: "",
        metaDescription: "",
      };
    }
    return initial as Record<LanguageCode, VenueTranslation>;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch existing translations
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/api/venues/${venueId}/seo`);
        if (response.ok) {
          const data = await response.json();
          if (data.translations && Array.isArray(data.translations)) {
            setTranslations((prev) => {
              const updated = { ...prev };
              for (const translation of data.translations) {
                if (updated[translation.language as LanguageCode]) {
                  updated[translation.language as LanguageCode] = {
                    language: translation.language,
                    metaTitle: translation.metaTitle || "",
                    metaDescription: translation.metaDescription || "",
                  };
                }
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching SEO translations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [venueId]);

  const handleTranslationChange = (
    language: LanguageCode,
    field: "metaTitle" | "metaDescription",
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ translations: Object.values(translations) }),
      });

      if (!response.ok) {
        throw new Error("Failed to save SEO settings");
      }

      toast({
        title: t("seo.saved"),
        description: t("seo.savedDescription"),
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast({
        title: t("seo.error"),
        description: t("seo.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const generateSuggestion = (
    language: LanguageCode,
    field: "metaTitle" | "metaDescription"
  ) => {
    const locationSuffix = venueCity ? ` | ${venueCity}` : "";

    if (field === "metaTitle") {
      const suggestions: Record<LanguageCode, string> = {
        en: `${venueName}${locationSuffix} - Athlifyr`,
        pt: `${venueName}${locationSuffix} - Athlifyr`,
        es: `${venueName}${locationSuffix} - Athlifyr`,
        fr: `${venueName}${locationSuffix} - Athlifyr`,
        de: `${venueName}${locationSuffix} - Athlifyr`,
        it: `${venueName}${locationSuffix} - Athlifyr`,
      };
      return suggestions[language];
    }

    const descriptions: Record<LanguageCode, string> = {
      en: `Discover ${venueName}${venueCity ? ` in ${venueCity}` : ""}. Book sessions, check schedules, and join the community on Athlifyr.`,
      pt: `Descobre ${venueName}${venueCity ? ` em ${venueCity}` : ""}. Reserva sessões, consulta horários e junta-te à comunidade no Athlifyr.`,
      es: `Descubre ${venueName}${venueCity ? ` en ${venueCity}` : ""}. Reserva sesiones, consulta horarios y únete a la comunidad en Athlifyr.`,
      fr: `Découvrez ${venueName}${venueCity ? ` à ${venueCity}` : ""}. Réservez des séances, consultez les horaires et rejoignez la communauté sur Athlifyr.`,
      de: `Entdecke ${venueName}${venueCity ? ` in ${venueCity}` : ""}. Buche Sessions, prüfe Zeitpläne und werde Teil der Community auf Athlifyr.`,
      it: `Scopri ${venueName}${venueCity ? ` a ${venueCity}` : ""}. Prenota sessioni, controlla gli orari e unisciti alla community su Athlifyr.`,
    };
    return descriptions[language];
  };

  const applySuggestion = (
    language: LanguageCode,
    field: "metaTitle" | "metaDescription"
  ) => {
    const suggestion = generateSuggestion(language, field);
    handleTranslationChange(language, field, suggestion);
  };

  const getCompletionStatus = () => {
    let completed = 0;
    for (const lang of SUPPORTED_LANGUAGES) {
      const translation = translations[lang.code];
      if (translation.metaTitle && translation.metaDescription) {
        completed++;
      }
    }
    return completed;
  };

  const isLanguageComplete = (language: LanguageCode) => {
    const translation = translations[language];
    return translation.metaTitle && translation.metaDescription;
  };

  if (!isOwner && !isAppAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">{t("seo.ownerOnly")}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const completedLanguages = getCompletionStatus();

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header with completion status */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate">{t("seo.title")}</CardTitle>
                <CardDescription className="truncate">
                  {t("seo.description")}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={completedLanguages === 6 ? "default" : "secondary"}
              className="shrink-0"
            >
              {completedLanguages}/6 {t("seo.languagesCompleted")}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* SEO Tips */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="p-4 pt-6 sm:p-6">
          <div className="flex gap-3">
            <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {t("seo.tipsTitle")}
              </p>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li>• {t("seo.tip1")}</li>
                <li>• {t("seo.tip2")}</li>
                <li>• {t("seo.tip3")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language tabs */}
      <Card>
        <CardContent className="p-3 pt-6 sm:p-6">
          <Tabs
            value={activeLanguage}
            onValueChange={(v) => setActiveLanguage(v as LanguageCode)}
          >
            <TabsList className="grid w-full grid-cols-3 gap-1 sm:grid-cols-6">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TabsTrigger
                  key={lang.code}
                  value={lang.code}
                  className="relative flex items-center justify-center gap-1.5"
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs sm:text-sm">
                    {lang.code.toUpperCase()}
                  </span>
                  {isLanguageComplete(lang.code) && (
                    <CheckCircle2 className="absolute -right-1 -top-1 h-3.5 w-3.5 text-green-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {SUPPORTED_LANGUAGES.map((lang) => (
              <TabsContent
                key={lang.code}
                value={lang.code}
                className="mt-6 space-y-6"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <h3 className="text-lg font-semibold">{lang.name}</h3>
                  {isLanguageComplete(lang.code) ? (
                    <Badge variant="default" className="ml-auto">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("seo.complete")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {t("seo.incomplete")}
                    </Badge>
                  )}
                </div>

                {/* Meta Title */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor={`metaTitle-${lang.code}`}>
                      {t("seo.metaTitle")}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion(lang.code, "metaTitle")}
                    >
                      {t("seo.useSuggestion")}
                    </Button>
                  </div>
                  <Input
                    id={`metaTitle-${lang.code}`}
                    value={translations[lang.code].metaTitle}
                    onChange={(e) =>
                      handleTranslationChange(
                        lang.code,
                        "metaTitle",
                        e.target.value
                      )
                    }
                    placeholder={generateSuggestion(lang.code, "metaTitle")}
                    maxLength={60}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t("seo.metaTitleHint")}</span>
                    <span
                      className={
                        translations[lang.code].metaTitle.length > 60
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {translations[lang.code].metaTitle.length}/60
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor={`metaDescription-${lang.code}`}>
                      {t("seo.metaDescription")}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        applySuggestion(lang.code, "metaDescription")
                      }
                    >
                      {t("seo.useSuggestion")}
                    </Button>
                  </div>
                  <Textarea
                    id={`metaDescription-${lang.code}`}
                    value={translations[lang.code].metaDescription}
                    onChange={(e) =>
                      handleTranslationChange(
                        lang.code,
                        "metaDescription",
                        e.target.value
                      )
                    }
                    placeholder={generateSuggestion(
                      lang.code,
                      "metaDescription"
                    )}
                    maxLength={160}
                    rows={3}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t("seo.metaDescriptionHint")}</span>
                    <span
                      className={
                        translations[lang.code].metaDescription.length > 160
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {translations[lang.code].metaDescription.length}/160
                    </span>
                  </div>
                </div>

                {/* Google Preview */}
                <div className="space-y-2">
                  <Label>{t("seo.googlePreview")}</Label>
                  <div className="overflow-hidden rounded-lg border bg-white p-3 dark:bg-zinc-950 sm:p-4">
                    <div className="space-y-1">
                      <p className="truncate text-base text-blue-600 hover:underline sm:text-lg">
                        {translations[lang.code].metaTitle ||
                          generateSuggestion(lang.code, "metaTitle")}
                      </p>
                      <p className="truncate text-xs text-green-700 sm:text-sm">
                        athlifyr.com › venues ›{" "}
                        {venueName.toLowerCase().replace(/\s+/g, "-")}
                      </p>
                      <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                        {translations[lang.code].metaDescription ||
                          generateSuggestion(lang.code, "metaDescription")}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !hasChanges}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("seo.save")}
        </Button>
      </div>
    </div>
  );
}
