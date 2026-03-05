"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, Users, ShieldAlert, Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type LiveRaceVisibility = "PUBLIC" | "FRIENDS" | "ORGANIZER_ONLY";

interface LiveRaceVisibilitySettingsProps {
  initialVisibility: LiveRaceVisibility;
}

export function LiveRaceVisibilitySettings({
  initialVisibility,
}: LiveRaceVisibilitySettingsProps) {
  const t = useTranslations("settings");
  const { toast } = useToast();
  const [visibility, setVisibility] =
    useState<LiveRaceVisibility>(initialVisibility);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (value: LiveRaceVisibility) => {
    if (value === visibility || isUpdating) return;

    setIsUpdating(true);
    const previous = visibility;
    setVisibility(value);

    try {
      const res = await fetch("/api/profile/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveRaceVisibility: value }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      toast({
        title: t("privacySettings.updateSuccess"),
        description: t("privacySettings.updateSuccessDesc"),
      });
    } catch {
      setVisibility(previous);
      toast({
        title: t("privacySettings.updateError"),
        description: t("privacySettings.updateErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const options: {
    value: LiveRaceVisibility;
    icon: typeof Globe;
    titleKey: string;
    descKey: string;
  }[] = [
    {
      value: "PUBLIC",
      icon: Globe,
      titleKey: "privacySettings.public",
      descKey: "privacySettings.publicDesc",
    },
    {
      value: "FRIENDS",
      icon: Users,
      titleKey: "privacySettings.friends",
      descKey: "privacySettings.friendsDesc",
    },
    {
      value: "ORGANIZER_ONLY",
      icon: ShieldAlert,
      titleKey: "privacySettings.organizerOnly",
      descKey: "privacySettings.organizerOnlyDesc",
    },
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = visibility === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleChange(option.value)}
            disabled={isUpdating}
            className={cn(
              "flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/50",
              isUpdating && "cursor-not-allowed opacity-60"
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}
            >
              {isSelected && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {t(option.titleKey)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(option.descKey)}
              </p>
            </div>
            {isUpdating && isSelected && (
              <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}
