"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface SourceOption {
  source_name: string;
  display_name: string;
}

interface ScrapeUrlFormProps {
  sources: SourceOption[];
  apiUrl: string;
  onScraped: () => void;
}

export function ScrapeUrlForm({
  sources,
  apiUrl,
  onScraped,
}: Readonly<ScrapeUrlFormProps>) {
  const t = useTranslations("admin.scraping");
  const [url, setUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url || !sourceName) return;
    setScraping(true);
    setResult(null);
    try {
      const params = new URLSearchParams({
        source_name: sourceName,
        url,
      });
      const res = await fetch(`${apiUrl}/scrape-url?${params.toString()}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setResult(`Error: ${data.detail || "Failed to scrape"}`);
        return;
      }
      const data = await res.json();
      setResult(t("scrapeUrl.success", { title: data.title }));
      setUrl("");
      onScraped();
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      }
    } finally {
      setScraping(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">{t("scrapeUrl.title")}</h3>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <Label>{t("scrapeUrl.source")}</Label>
          <Select value={sourceName} onValueChange={setSourceName}>
            <SelectTrigger>
              <SelectValue placeholder={t("scrapeUrl.selectSource")} />
            </SelectTrigger>
            <SelectContent>
              {sources.map((s) => (
                <SelectItem key={s.source_name} value={s.source_name}>
                  {s.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[300px] flex-[2]">
          <Label>{t("scrapeUrl.url")}</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("scrapeUrl.urlPlaceholder")}
            type="url"
          />
        </div>
        <Button
          onClick={handleScrape}
          disabled={scraping || !url || !sourceName}
        >
          {scraping ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LinkIcon className="mr-2 h-4 w-4" />
          )}
          {t("scrapeUrl.scrape")}
        </Button>
      </div>
      {result && (
        <p
          className={`mt-3 text-sm ${
            result.startsWith("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {result}
        </p>
      )}
    </Card>
  );
}
