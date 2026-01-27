"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame, Trophy, Clock } from "lucide-react";
import { formatTime } from "@/lib/performance/scoring";
import type { HyroxEntry, HyroxCategory } from "./types";
import { PerformanceHyroxEntriesList } from "./performance-hyrox-entries-list";

interface PerformanceHyroxTabProps {
  entries: HyroxEntry[];
  totalEntries: number;
  bestTimeByCategory: Record<
    string,
    { timeSeconds: number; performedAt: string }
  >;
  onRefresh: () => void;
}

export function PerformanceHyroxTab({
  entries,
  totalEntries,
  bestTimeByCategory,
  onRefresh,
}: PerformanceHyroxTabProps) {
  const t = useTranslations("performance");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from entries
  const categoriesWithEntries = [
    ...new Set(entries.map((e) => e.hyroxCategory)),
  ];

  // Filter entries by category
  const filteredEntries =
    selectedCategory === "all"
      ? entries
      : entries.filter((e) => e.hyroxCategory === selectedCategory);

  if (totalEntries === 0) {
    return (
      <div className="py-12 text-center">
        <Flame className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">{t("hyrox.noData")}</h3>
        <p className="text-sm text-muted-foreground">{t("hyrox.noDataDesc")}</p>
      </div>
    );
  }

  // Get best time for selected category
  const bestTime =
    selectedCategory !== "all" ? bestTimeByCategory[selectedCategory] : null;

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          {t("hyrox.selectCategory")}
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder={t("hyrox.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("hyrox.allCategories")}</SelectItem>
            {categoriesWithEntries.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {t(`hyrox.categories.${categoryToKey(cat)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Best Time Card (when category selected) */}
      {bestTime && selectedCategory !== "all" && (
        <Card className="bg-primary/10 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 text-yellow-500" />
                {t("hyrox.personalBest")}
              </div>
              <div className="text-3xl font-bold">
                {formatTime(bestTime.timeSeconds)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t(
                  `hyrox.categories.${categoryToKey(selectedCategory as HyroxCategory)}`
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(bestTime.performedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Entries List */}
      <PerformanceHyroxEntriesList
        entries={filteredEntries}
        onRefresh={onRefresh}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalEntries}</div>
          <div className="text-sm text-muted-foreground">
            {t("hyrox.totalRaces")}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {Object.keys(bestTimeByCategory).length}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("hyrox.categoriesRaced")}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper to convert category enum to translation key
function categoryToKey(category: HyroxCategory | string): string {
  const mapping: Record<string, string> = {
    OPEN_MEN: "openMen",
    OPEN_WOMEN: "openWomen",
    PRO_MEN: "proMen",
    PRO_WOMEN: "proWomen",
    ELITE_15_MEN: "elite15Men",
    ELITE_15_WOMEN: "elite15Women",
    DOUBLES_MEN: "doublesMen",
    DOUBLES_WOMEN: "doublesWomen",
    DOUBLES_MIXED: "doublesMixed",
    RELAY_MEN: "relayMen",
    RELAY_WOMEN: "relayWomen",
    RELAY_MIXED: "relayMixed",
    AGE_GROUP_16_29_MEN: "ageGroup1629Men",
    AGE_GROUP_16_29_WOMEN: "ageGroup1629Women",
    AGE_GROUP_30_34_MEN: "ageGroup3034Men",
    AGE_GROUP_30_34_WOMEN: "ageGroup3034Women",
    AGE_GROUP_35_39_MEN: "ageGroup3539Men",
    AGE_GROUP_35_39_WOMEN: "ageGroup3539Women",
    AGE_GROUP_40_44_MEN: "ageGroup4044Men",
    AGE_GROUP_40_44_WOMEN: "ageGroup4044Women",
    AGE_GROUP_45_49_MEN: "ageGroup4549Men",
    AGE_GROUP_45_49_WOMEN: "ageGroup4549Women",
    AGE_GROUP_50_54_MEN: "ageGroup5054Men",
    AGE_GROUP_50_54_WOMEN: "ageGroup5054Women",
    AGE_GROUP_55_59_MEN: "ageGroup5559Men",
    AGE_GROUP_55_59_WOMEN: "ageGroup5559Women",
    AGE_GROUP_60_64_MEN: "ageGroup6064Men",
    AGE_GROUP_60_64_WOMEN: "ageGroup6064Women",
    AGE_GROUP_65_69_MEN: "ageGroup6569Men",
    AGE_GROUP_65_69_WOMEN: "ageGroup6569Women",
    AGE_GROUP_70_PLUS_MEN: "ageGroup70PlusMen",
    AGE_GROUP_70_PLUS_WOMEN: "ageGroup70PlusWomen",
    ADAPTIVE: "adaptive",
  };
  return mapping[category] || category;
}
