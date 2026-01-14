/**
 * Geolocation utilities for calculating distances between coordinates
 */

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance in a human-readable way
 * @param km Distance in kilometers
 * @returns Formatted string (e.g., "15 km", "1.5 km", "500 m")
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Get user's current location using browser Geolocation API
 * @returns Promise with latitude and longitude, or null if not available
 */
export async function getUserLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported");
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Error getting location:", error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Sort events by distance from user location
 * @param events Array of events with latitude/longitude
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @returns Sorted array with distance field added
 */
export function sortEventsByDistance<
  T extends { latitude: number | null; longitude: number | null },
>(events: T[], userLat: number, userLon: number): (T & { distance: number })[] {
  return events
    .filter((event) => event.latitude !== null && event.longitude !== null)
    .map((event) => ({
      ...event,
      distance: calculateDistance(
        userLat,
        userLon,
        event.latitude!,
        event.longitude!
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Filter events within a certain radius
 * @param events Array of events with latitude/longitude
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param radiusKm Maximum distance in kilometers
 * @returns Filtered array with events within radius
 */
export function filterEventsByRadius<
  T extends { latitude: number | null; longitude: number | null },
>(
  events: T[],
  userLat: number,
  userLon: number,
  radiusKm: number
): (T & { distance: number })[] {
  return sortEventsByDistance(events, userLat, userLon).filter(
    (event) => event.distance <= radiusKm
  );
}

/**
 * Get Google Maps URL for coordinates
 * @param latitude Latitude
 * @param longitude Longitude
 * @param label Optional label for the location
 * @returns Google Maps URL
 */
export function getGoogleMapsUrl(
  latitude: number,
  longitude: number,
  label?: string
): string {
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(label)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/**
 * Common locations in Portugal for reference
 */
export const PORTUGAL_LOCATIONS = {
  LISBON: { latitude: 38.7223, longitude: -9.1393, name: "Lisboa" },
  PORTO: { latitude: 41.1579, longitude: -8.6291, name: "Porto" },
  FUNCHAL: { latitude: 32.6447, longitude: -16.9078, name: "Funchal" },
  COIMBRA: { latitude: 40.2033, longitude: -8.4103, name: "Coimbra" },
  BRAGA: { latitude: 41.5454, longitude: -8.4265, name: "Braga" },
  FARO: { latitude: 37.0194, longitude: -7.9322, name: "Faro" },
} as const;
