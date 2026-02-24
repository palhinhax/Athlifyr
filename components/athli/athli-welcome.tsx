"use client";

import { useTranslations } from "next-intl";
import { Bot, CalendarDays, MapPin, Dumbbell, Zap } from "lucide-react";

interface AthliWelcomeProps {
  onSuggestionClick: (message: string) => void;
}

export function AthliWelcome({ onSuggestionClick }: AthliWelcomeProps) {
  const t = useTranslations("athli");

  const suggestions = [
    {
      icon: CalendarDays,
      label: t("suggestions.events"),
      message: t("suggestions.eventsMessage"),
    },
    {
      icon: MapPin,
      label: t("suggestions.venues"),
      message: t("suggestions.venuesMessage"),
    },
    {
      icon: Dumbbell,
      label: t("suggestions.training"),
      message: t("suggestions.trainingMessage"),
    },
    {
      icon: Zap,
      label: t("suggestions.workout"),
      message: t("suggestions.workoutMessage"),
    },
    // TODO: Re-enable when venues and sessions are available
    // {
    //   icon: Trophy,
    //   label: t("suggestions.bookings"),
    //   message: t("suggestions.bookingsMessage"),
    // },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-6">
      {/* Avatar */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
        <Bot className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-bold">{t("welcome")} 👋</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("welcomeDescription")}
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="grid w-full max-w-sm grid-cols-2 gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => onSuggestionClick(suggestion.message)}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3 text-left text-xs transition-all hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm"
          >
            <suggestion.icon className="h-4 w-4 shrink-0 text-violet-500" />
            <span className="line-clamp-2">{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
