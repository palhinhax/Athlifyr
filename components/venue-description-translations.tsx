"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { Loader2, Globe, CheckCircle2, AlertCircle } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
] as const;

type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

interface DescriptionTranslation {
  language: LanguageCode;
  description: string;
}

interface VenueDescriptionTranslationsProps {
  venueId: string;
  venueDescription: string | null;
  isOwner: boolean;
  isAppAdmin?: boolean;
}

export function VenueDescriptionTranslations({
  venueId,
  venueDescription,
  isOwner,
  isAppAdmin = false,
}: VenueDescriptionTranslationsProps) {
  const t = useTranslations("venues.translations");
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("en");
  const [translations, setTranslations] = useState<
    Record<LanguageCode, DescriptionTranslation>
  >(() => {
    const initial: Partial<Record<LanguageCode, DescriptionTranslation>> = {};
    for (const lang of SUPPORTED_LANGUAGES) {
      initial[lang.code] = {
        language: lang.code,
        description: "",
      };
    }
    return initial as Record<LanguageCode, DescriptionTranslation>;
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
                    description: translation.description || "",
                  };
                }
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching description translations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [venueId]);

  const handleDescriptionChange = (language: LanguageCode, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        description: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // We need to merge with existing SEO data
      const existingResponse = await fetch(`/api/venues/${venueId}/seo`);
      let existingTranslations: Array<{
        language: string;
        description?: string;
        metaTitle?: string;
        metaDescription?: string;
      }> = [];

      if (existingResponse.ok) {
        const existingData = await existingResponse.json();
        existingTranslations = existingData.translations || [];
      }

      // Merge description translations with existing SEO data
      const mergedTranslations = SUPPORTED_LANGUAGES.map((lang) => {
        const existing = existingTranslations.find(
          (t) => t.language === lang.code
        );
        return {
          language: lang.code,
          description: translations[lang.code].description || null,
          metaTitle: existing?.metaTitle || null,
          metaDescription: existing?.metaDescription || null,
        };
      });

      const response = await fetch(`/api/venues/${venueId}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ translations: mergedTranslations }),
      });

      if (!response.ok) {
        throw new Error("Failed to save translations");
      }

      toast({
        title: t("saved"),
        description: t("savedDescription"),
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving translations:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyFromOriginal = (language: LanguageCode) => {
    if (venueDescription) {
      handleDescriptionChange(language, venueDescription);
    }
  };

  const getCompletionStatus = () => {
    let completed = 0;
    for (const lang of SUPPORTED_LANGUAGES) {
      if (translations[lang.code].description) {
        completed++;
      }
    }
    return completed;
  };

  const isLanguageComplete = (language: LanguageCode) => {
    return !!translations[language].description;
  };

  if (!isOwner && !isAppAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">{t("ownerOnly")}</p>
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
    <div className="space-y-6">
      {/* Header with completion status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
            </div>
            <Badge variant={completedLanguages === 6 ? "default" : "secondary"}>
              {completedLanguages}/6 {t("complete")}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Original description info */}
      {venueDescription && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {t("originalDescription")}
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  {venueDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Language tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs
            value={activeLanguage}
            onValueChange={(v) => setActiveLanguage(v as LanguageCode)}
          >
            <TabsList className="grid w-full grid-cols-6">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TabsTrigger
                  key={lang.code}
                  value={lang.code}
                  className="relative flex items-center gap-1.5"
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">
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
                      {t("complete")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {t("incomplete")}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${lang.code}`}>
                      {t("descriptionLabel")} ({lang.name})
                    </Label>
                    {venueDescription && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyFromOriginal(lang.code)}
                      >
                        {t("copyOriginal")}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`description-${lang.code}`}
                    value={translations[lang.code].description}
                    onChange={(e) =>
                      handleDescriptionChange(lang.code, e.target.value)
                    }
                    placeholder={t("descriptionPlaceholder", {
                      language: lang.name,
                    })}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("markdownSupported")}
                  </p>
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
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
