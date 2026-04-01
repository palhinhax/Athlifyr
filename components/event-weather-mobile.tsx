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

interface EventWeatherMobileProps {
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

/** Ordered lookup: first matching keyword(s) → translation key */
const WEATHER_TRANSLATION_LOOKUP: [string[], WeatherTranslationKey][] = [
  [["clear", "sun"], "clear"],
  [["few clouds"], "fewClouds"],
  [["scattered clouds"], "scatteredClouds"],
  [["broken clouds"], "brokenClouds"],
  [["overcast"], "overcast"],
  [["cloud"], "clouds"],
  [["drizzle"], "drizzle"],
  [["light rain"], "lightRain"],
  [["moderate rain"], "moderateRain"],
  [["heavy rain"], "heavyRain"],
  [["rain"], "rain"],
  [["snow"], "snow"],
  [["mist"], "mist"],
  [["fog"], "fog"],
  [["haze"], "haze"],
  [["thunder", "storm"], "thunderstorm"],
];

/**
 * Get translation key for weather condition
 */
function getWeatherTranslationKey(
  condition: string
): WeatherTranslationKey | null {
  const conditionLower = condition.toLowerCase();
  const match = WEATHER_TRANSLATION_LOOKUP.find(([keys]) =>
    keys.some((key) => conditionLower.includes(key))
  );
  return match?.[1] ?? null;
}

/**
 * Map OpenWeatherMap condition codes to Lucide icons
 * Mobile version with larger icons matching desktop
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
 * Mobile-optimized weather forecast component
 * Full-width cards with horizontal layout matching desktop design
 */
export function EventWeatherMobile({
  weather,
  isPastEvent = false,
}: EventWeatherMobileProps) {
  const t = useTranslations("events");

  if (!weather || weather.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] lg:hidden">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {isPastEvent ? t("weather.titlePast") : t("weather.title")}
      </h4>

      <div className="space-y-3">
        {weather.map((w, index) => {
          const translationKey = getWeatherTranslationKey(w.condition);

          return (
            <div
              key={index}
              className="flex items-center justify-between border-b border-surface-container-high pb-3 last:border-0 last:pb-0"
            >
              {/* Left side: Icon and Date */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center">
                  {getWeatherIcon(w.condition)}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {new Date(w.date).toLocaleDateString("pt-PT", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {translationKey
                      ? t(`weather.${translationKey}`)
                      : w.condition}
                  </p>
                </div>
              </div>

              {/* Right side: Temperature and Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="font-headline text-lg font-black">
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

      <p className="mt-4 text-center text-xs text-muted-foreground">
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
