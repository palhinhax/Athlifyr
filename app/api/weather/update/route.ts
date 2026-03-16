import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_UPDATE_SECRET = process.env.WEATHER_UPDATE_SECRET;

interface OpenWeatherResponse {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface ForecastResponse {
  list: OpenWeatherResponse[];
}

interface WeatherEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  latitude: number | null;
  longitude: number | null;
}

async function fetchAndSaveWeatherForEvent(event: WeatherEvent): Promise<void> {
  const eventDays = getEventDays(event.startDate, event.endDate);

  console.log(
    `🌤️  Fetching weather for "${event.title}" (${eventDays.length} day${eventDays.length > 1 ? "s" : ""})`
  );

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${event.latitude}&lon=${event.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  const response = await fetch(forecastUrl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const forecastData: ForecastResponse = await response.json();

  for (const eventDay of eventDays) {
    const targetTime = new Date(eventDay);
    targetTime.setHours(12, 0, 0, 0);

    const closestForecast = findClosestForecast(forecastData.list, targetTime);

    if (!closestForecast) {
      console.warn(`⚠️  No forecast found for ${eventDay.toISOString()}`);
      continue;
    }

    await prisma.eventWeather.upsert({
      where: {
        eventId_date: { eventId: event.id, date: eventDay },
      },
      update: {
        temperature: closestForecast.main.temp,
        condition: closestForecast.weather[0].main,
        humidity: closestForecast.main.humidity,
        windSpeed: closestForecast.wind.speed,
        icon: closestForecast.weather[0].icon,
      },
      create: {
        eventId: event.id,
        date: eventDay,
        temperature: closestForecast.main.temp,
        condition: closestForecast.weather[0].main,
        humidity: closestForecast.main.humidity,
        windSpeed: closestForecast.wind.speed,
        icon: closestForecast.weather[0].icon,
      },
    });

    console.log(
      `   ✅ ${eventDay.toISOString().split("T")[0]}: ${closestForecast.main.temp}°C, ${closestForecast.weather[0].main}`
    );
  }
}

/**
 * Update weather forecasts for all events in the next 6 days
 * Called daily by GitHub Actions
 */
export async function POST(request: Request) {
  try {
    // Verify secret token for security
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${WEATHER_UPDATE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: "OpenWeather API key not configured" },
        { status: 500 }
      );
    }

    // Get all events starting within the next 6 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sixDaysFromNow = new Date(today);
    sixDaysFromNow.setDate(today.getDate() + 6);

    const upcomingEvents = await prisma.event.findMany({
      where: {
        startDate: {
          gte: today,
          lte: sixDaysFromNow,
        },
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        latitude: true,
        longitude: true,
      },
    });

    console.log(`📅 Found ${upcomingEvents.length} events in the next 6 days`);

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ event: string; error: string }> = [];
    const processed: Array<{ event: string; status: string }> = [];

    for (const event of upcomingEvents) {
      try {
        await fetchAndSaveWeatherForEvent(event);

        successCount++;
        processed.push({ event: event.title, status: "success" });

        // Rate limiting: 60 requests/minute = 1 request per second
        await new Promise((resolve) => setTimeout(resolve, 1100));
      } catch (error) {
        console.error(`❌ Error processing event ${event.title}:`, error);
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        errors.push({ event: event.title, error: errorMsg });
        if (error instanceof Error) {
          console.error(`   Stack: ${error.stack}`);
        }
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Weather update completed",
      stats: {
        totalEvents: upcomingEvents.length,
        successCount,
        errorCount,
      },
      processed,
      errors,
    });
  } catch (error) {
    console.error("❌ Error updating weather:", error);
    return NextResponse.json(
      { error: "Failed to update weather" },
      { status: 500 }
    );
  }
}

/**
 * Get all days an event spans (including multi-day events)
 */
function getEventDays(startDate: Date, endDate: Date | null): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : new Date(startDate);
  end.setHours(0, 0, 0, 0);

  const currentDay = new Date(start);

  while (currentDay <= end) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
}

/**
 * Find the forecast entry closest to the target time
 */
function findClosestForecast(
  forecasts: OpenWeatherResponse[],
  targetTime: Date
): OpenWeatherResponse | null {
  if (forecasts.length === 0) return null;

  let closest = forecasts[0];
  let minDiff = Math.abs(forecasts[0].dt * 1000 - targetTime.getTime());

  for (const forecast of forecasts) {
    const diff = Math.abs(forecast.dt * 1000 - targetTime.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closest = forecast;
    }
  }

  return closest;
}
