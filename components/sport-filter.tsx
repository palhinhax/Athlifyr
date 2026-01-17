"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/translations";
import { locales } from "@/i18n";
import { getSportIcon } from "@/lib/sport-config";

interface SportFilterProps {
  sportTypes: { value: string; label: string }[];
  currentFilter: string;
}

const STORAGE_KEY = "athlifyr_sport_filter";

export function SportFilter({ sportTypes, currentFilter }: SportFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const pathLocale = segments[0];
    // Check if first segment is a valid locale, otherwise default to 'pt'
    return pathLocale &&
      locales.includes(pathLocale as (typeof locales)[number])
      ? pathLocale
      : "pt";
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
            className="gap-2"
          >
            {sport.value !== "ALL" && (
              <span className="text-base leading-none">
                {getSportIcon(sport.value)}
              </span>
            )}
            <span>
              {sport.value === "ALL"
                ? t("nav.all")
                : t(`sports.${sport.value}`)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
