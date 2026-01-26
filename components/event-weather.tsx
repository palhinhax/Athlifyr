"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudFog,
  Droplets,
  Sun,
  CloudSun,
  Zap,
  Wind,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface EventWeatherProps {
  weather: Array<{
    date: Date;
    temperature: number;
    condition: string;
    humidity: number | null;
    windSpeed: number | null;
    icon: string | null;
  }>;
  isPastEvent?: boolean;
}

type WeatherTranslationKey =
  | "clear"
  | "fewClouds"
  | "scatteredClouds"
  | "brokenClouds"
  | "overcast"
  | "clouds"
  | "drizzle"
  | "lightRain"
  | "moderateRain"
  | "heavyRain"
  | "rain"
  | "snow"
  | "mist"
  | "fog"
  | "haze"
  | "thunderstorm";

/**
 * Get translation key for weather condition
 */
function getWeatherTranslationKey(
  condition: string
): WeatherTranslationKey | null {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return "clear";
  }
  if (conditionLower.includes("few clouds")) {
    return "fewClouds";
  }
  if (conditionLower.includes("scattered clouds")) {
    return "scatteredClouds";
  }
  if (conditionLower.includes("broken clouds")) {
    return "brokenClouds";
  }
  if (conditionLower.includes("overcast")) {
    return "overcast";
  }
  if (conditionLower.includes("cloud")) {
    return "clouds";
  }
  if (conditionLower.includes("drizzle")) {
    return "drizzle";
  }
  if (conditionLower.includes("light rain")) {
    return "lightRain";
  }
  if (conditionLower.includes("moderate rain")) {
    return "moderateRain";
  }
  if (conditionLower.includes("heavy rain")) {
    return "heavyRain";
  }
  if (conditionLower.includes("rain")) {
    return "rain";
  }
  if (conditionLower.includes("snow")) {
    return "snow";
  }
  if (conditionLower.includes("mist")) {
    return "mist";
  }
  if (conditionLower.includes("fog")) {
    return "fog";
  }
  if (conditionLower.includes("haze")) {
    return "haze";
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "thunderstorm";
  }

  // Return null if no match
  return null;
}

/**
 * Map OpenWeatherMap condition codes to Lucide icons
 */
function getWeatherIcon(condition: string): React.ReactNode {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return <Sun className="h-10 w-10 text-yellow-500" />;
  }
  if (
    conditionLower.includes("cloud") &&
    (conditionLower.includes("few") || conditionLower.includes("scattered"))
  ) {
    return <CloudSun className="h-10 w-10 text-blue-400" />;
  }
  if (conditionLower.includes("cloud")) {
    return <Cloud className="h-10 w-10 text-gray-400" />;
  }
  if (conditionLower.includes("drizzle")) {
    return <CloudDrizzle className="h-10 w-10 text-blue-500" />;
  }
  if (conditionLower.includes("rain")) {
    return <CloudRain className="h-10 w-10 text-blue-600" />;
  }
  if (conditionLower.includes("snow")) {
    return <CloudSnow className="h-10 w-10 text-blue-300" />;
  }
  if (
    conditionLower.includes("mist") ||
    conditionLower.includes("fog") ||
    conditionLower.includes("haze")
  ) {
    return <CloudFog className="h-10 w-10 text-gray-400" />;
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return <Zap className="h-10 w-10 text-yellow-600" />;
  }

  // Default fallback
  return <CloudSun className="h-10 w-10 text-blue-400" />;
}

/**
 * Responsive weather forecast component
 * Works on both mobile and desktop with adaptive layout
 */
export function EventWeather({
  weather,
  isPastEvent = false,
}: EventWeatherProps) {
  const t = useTranslations("events");

  if (!weather || weather.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium">
        {isPastEvent ? t("weather.titlePast") : t("weather.title")}
      </h3>
      <div className="space-y-3">
        {weather.map((w, index) => {
          const translationKey = getWeatherTranslationKey(w.condition);
          return (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center">
                  {getWeatherIcon(w.condition)}
                </div>
                <div>
                  {/* Desktop: short format, Mobile: long format with full date */}
                  <p className="text-sm font-medium">
                    <span className="hidden lg:inline">
                      {new Date(w.date).toLocaleDateString("pt-PT", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="lg:hidden">
                      {new Date(w.date).toLocaleDateString("pt-PT", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {translationKey
                      ? t(`weather.${translationKey}`)
                      : w.condition}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-lg font-semibold">
                  {Math.round(w.temperature)}°C
                </span>
                {w.humidity !== null && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    <span className="text-xs">{w.humidity}%</span>
                  </div>
                )}
                {w.windSpeed !== null && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Wind className="h-3 w-3" />
                    <span className="text-xs">
                      {Math.round(w.windSpeed)} m/s
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Powered by{" "}
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          OpenWeatherMap
        </a>
      </p>
    </div>
  );
}
