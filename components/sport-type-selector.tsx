"use client";

import { Label } from "@/components/ui/label";
import { SportType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface SportTypeSelectorProps {
  selectedSportTypes: SportType[];
  onToggleSportType: (sportType: SportType) => void;
}

export function SportTypeSelector({
  selectedSportTypes,
  onToggleSportType,
}: SportTypeSelectorProps) {
  const t = useTranslations("admin.events");
  const tSports = useTranslations("sports");

  return (
    <div className="grid gap-2">
      <Label>{t("sportsLabel")} *</Label>
      <p className="text-xs text-muted-foreground">{t("selectSportsDesc")}</p>
      <div className="grid grid-cols-2 gap-3 rounded-md border border-input p-3">
        {Object.values(SportType).map((type) => (
          <label
            key={type}
            className="flex cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={selectedSportTypes.includes(type)}
              onChange={() => onToggleSportType(type)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">{tSports(type)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
