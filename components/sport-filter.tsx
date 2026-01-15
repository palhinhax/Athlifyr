"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [locale, setLocale] = useState("pt");

  useEffect(() => {
    // Get locale from cookie
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    if (cookieLocale) {
      setLocale(cookieLocale);
    }
  }, []);

  const t = getTranslations(locale);

  // On mount, check if we should restore a saved filter
  useEffect(() => {
    // Only restore if no filter is in URL
    if (!searchParams.get("sport")) {
      const savedFilter = localStorage.getItem(STORAGE_KEY);
      if (savedFilter && savedFilter !== "ALL") {
        router.replace(`/events?sport=${savedFilter}`);
      }
    }
  }, [router, searchParams]);

  const handleFilterClick = (value: string) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, value);

    // Navigate
    if (value === "ALL") {
      router.push("/events");
    } else {
      router.push(`/events?sport=${value}`);
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
