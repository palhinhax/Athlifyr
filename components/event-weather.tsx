"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  CloudSun,
  Zap,
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
 * Ordered mapping from substring patterns to translation keys.
 * More specific patterns (e.g. "few clouds") must come before generic ones (e.g. "cloud").
 */
const weatherConditionMap: [string, WeatherTranslationKey][] = [
  ["clear", "clear"],
  ["sun", "clear"],
  ["few clouds", "fewClouds"],
  ["scattered clouds", "scatteredClouds"],
  ["broken clouds", "brokenClouds"],
  ["overcast", "overcast"],
  ["cloud", "clouds"],
  ["drizzle", "drizzle"],
  ["light rain", "lightRain"],
  ["moderate rain", "moderateRain"],
  ["heavy rain", "heavyRain"],
  ["rain", "rain"],
  ["snow", "snow"],
  ["mist", "mist"],
  ["fog", "fog"],
  ["haze", "haze"],
  ["thunder", "thunderstorm"],
  ["storm", "thunderstorm"],
];

/**
 * Get translation key for weather condition
 */
function getWeatherTranslationKey(
  condition: string
): WeatherTranslationKey | null {
  const conditionLower = condition.toLowerCase();
  const match = weatherConditionMap.find(([pattern]) =>
    conditionLower.includes(pattern)
  );
  return match ? match[1] : null;
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
 * Get gradient classes based on weather condition
 */
function getWeatherGradient(condition: string): string {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return "from-sky-400 to-sky-600";
  }
  if (
    conditionLower.includes("cloud") &&
    (conditionLower.includes("few") || conditionLower.includes("scattered"))
  ) {
    return "from-sky-400 to-slate-500";
  }
  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return "from-slate-400 to-slate-600";
  }
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "from-slate-500 to-blue-700";
  }
  if (conditionLower.includes("snow")) {
    return "from-blue-200 to-blue-400";
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "from-slate-600 to-slate-800";
  }
  return "from-sky-400 to-sky-600";
}

/**
 * Get large weather icon for the hero card
 */
function getWeatherIconLarge(condition: string): React.ReactNode {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return <Sun className="h-12 w-12 text-white/90" />;
  }
  if (
    conditionLower.includes("cloud") &&
    (conditionLower.includes("few") || conditionLower.includes("scattered"))
  ) {
    return <CloudSun className="h-12 w-12 text-white/90" />;
  }
  if (conditionLower.includes("cloud")) {
    return <Cloud className="h-12 w-12 text-white/90" />;
  }
  if (conditionLower.includes("drizzle")) {
    return <CloudDrizzle className="h-12 w-12 text-white/90" />;
  }
  if (conditionLower.includes("rain")) {
    return <CloudRain className="h-12 w-12 text-white/90" />;
  }
  if (conditionLower.includes("snow")) {
    return <CloudSnow className="h-12 w-12 text-white/90" />;
  }
  if (
    conditionLower.includes("mist") ||
    conditionLower.includes("fog") ||
    conditionLower.includes("haze")
  ) {
    return <CloudFog className="h-12 w-12 text-white/90" />;
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return <Zap className="h-12 w-12 text-white/90" />;
  }
  return <CloudSun className="h-12 w-12 text-white/90" />;
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

  // Primary weather entry (event day)
  const primary = weather[0];
  const translationKeyPrimary = getWeatherTranslationKey(primary.condition);
  const conditionText = translationKeyPrimary
    ? t(`weather.${translationKeyPrimary}`)
    : primary.condition;
  const gradient = getWeatherGradient(primary.condition);

  // Additional days
  const extraDays = weather.slice(1);

  return (
    <div className="space-y-4">
      {/* Hero Weather Card */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg sm:p-8`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">
              {isPastEvent ? t("weather.titlePast") : t("weather.title")}
            </p>
            <h4 className="text-3xl font-black">
              {Math.round(primary.temperature)}°C
            </h4>
          </div>
          {getWeatherIconLarge(primary.condition)}
        </div>
        <p className="text-sm font-medium opacity-90">
          {conditionText}
          {primary.windSpeed !== null && (
            <span>
              {" "}
              · {t("weather.wind")} {Math.round(primary.windSpeed)} m/s
            </span>
          )}
          {primary.humidity !== null && (
            <span>
              {" "}
              · {t("weather.humidity")} {primary.humidity}%
            </span>
          )}
        </p>
      </div>

      {/* Additional Days (compact list) */}
      {extraDays.length > 0 && (
        <div className="rounded-2xl bg-card p-4">
          <div className="space-y-3">
            {extraDays.map((w, index) => {
              const translationKey = getWeatherTranslationKey(w.condition);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center">
                      {getWeatherIcon(w.condition)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(w.date).toLocaleDateString("pt-PT", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {translationKey
                          ? t(`weather.${translationKey}`)
                          : w.condition}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold">
                    {Math.round(w.temperature)}°C
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
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
