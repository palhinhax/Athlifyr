"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface ThemeOption {
  value: Theme;
  icon: typeof Sun;
}

const themeOptions: ThemeOption[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export function ThemeSelector() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {themeOptions.map((option) => (
          <div
            key={option.value}
            className="flex h-20 animate-pulse items-center justify-center rounded-lg border bg-muted"
          />
        ))}
      </div>
    );
  }

  const getThemeLabel = (value: Theme): string => {
    switch (value) {
      case "light":
        return t("themes.light");
      case "dark":
        return t("themes.dark");
      case "system":
        return t("themes.system");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = theme === option.value;

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:bg-muted/50",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                : "border-border"
            )}
          >
            {isSelected && (
              <div className="absolute right-2 top-2">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}
            <Icon
              className={cn(
                "h-6 w-6",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            >
              {getThemeLabel(option.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
