"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/translations";

interface SportFilterProps {
  sportTypes: { value: string; label: string }[];
  currentFilter: string;
}

const STORAGE_KEY = "athlifyr_sport_filter";

export function SportFilter({ sportTypes, currentFilter }: SportFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [locale, setLocale] = useState("pt");

  useEffect(() => {
    // Extract locale from pathname (first segment after /)
    const segments = pathname.split("/").filter(Boolean);
    const pathLocale = segments[0];
    // Check if first segment is a valid locale
    if (["pt", "en", "es", "fr", "de", "it"].includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const t = getTranslations(locale);

  // On mount, check if we should restore a saved filter
  useEffect(() => {
    // Only restore if no filter is in URL
    if (!searchParams.get("sport")) {
      const savedFilter = localStorage.getItem(STORAGE_KEY);
      if (savedFilter && savedFilter !== "ALL") {
        router.replace(`/${locale}/events?sport=${savedFilter}`);
      }
    }
  }, [router, searchParams, locale]);

  const handleFilterClick = (value: string) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, value);

    // Navigate with locale prefix
    if (value === "ALL") {
      router.push(`/${locale}/events`);
    } else {
      router.push(`/${locale}/events?sport=${value}`);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-medium">{t("nav.filterBySport")}</h2>
      <div className="flex flex-wrap gap-2">
        {sportTypes.map((sport) => (
          <Button
            key={sport.value}
            variant={currentFilter === sport.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(sport.value)}
          >
            {sport.value === "ALL" ? t("nav.all") : t(`sports.${sport.value}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
