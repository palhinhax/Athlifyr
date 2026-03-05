/**
 * GPX Parser — server-side utility.
 *
 * Parses a GPX XML string and extracts:
 *  - routePoints: array of [latitude, longitude] (simplified via Ramer-Douglas-Peucker)
 *  - distanceKm: total track distance using Haversine formula
 *  - elevationGainM: cumulative ascent in metres
 *  - elevationLossM: cumulative descent in metres (positive value)
 *
 * No external dependencies — uses the DOM XML parser available in Node 18+
 * via the `@xmldom/xmldom` package or the built-in global DOMParser (Edge runtime).
 * Falls back to a simple regex approach if DOMParser is not available.
 */

export interface ParsedGpx {
  routePoints: [number, number][];
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  /** Raw track points including elevation, before simplification */
  rawPoints: { lat: number; lng: number; ele: number }[];
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Ramer-Douglas-Peucker polyline simplification ───────────────────────────
function perpendicularDistance(
  point: [number, number],
  lineStart: [number, number],
  lineEnd: [number, number]
): number {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return 0;
  return (
    Math.abs(
      dy * point[0] -
        dx * point[1] +
        lineEnd[0] * lineStart[1] -
        lineEnd[1] * lineStart[0]
    ) / mag
  );
}

function rdpSimplify(
  points: [number, number][],
  epsilon: number
): [number, number][] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(
      points[i],
      points[0],
      points[points.length - 1]
    );
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdpSimplify(points.slice(0, maxIdx + 1), epsilon);
    const right = rdpSimplify(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[points.length - 1]];
}

// ─── Raw track point extraction ──────────────────────────────────────────────
// We use a regex-based approach to avoid requiring xmldom in the server bundle.
// GPX trkpt elements look like: <trkpt lat="..." lon="..."><ele>...</ele></trkpt>
function extractTrackPoints(
  gpx: string
): { lat: number; lng: number; ele: number }[] {
  const points: { lat: number; lng: number; ele: number }[] = [];

  // Match <trkpt ...> ... </trkpt> blocks (single-line and multi-line)
  const trkptRegex =
    /<trkpt\s+lat="([\d.\-]+)"\s+lon="([\d.\-]+)"[^>]*>([\s\S]*?)<\/trkpt>/g;
  const eleRegex = /<ele>([\d.\-]+)<\/ele>/;

  let match: RegExpExecArray | null;
  while ((match = trkptRegex.exec(gpx)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const eleMatch = eleRegex.exec(match[3]);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;

    if (!isNaN(lat) && !isNaN(lng)) {
      points.push({ lat, lng, ele });
    }
  }

  // Also try <rtept> (route points) if no trkpt found
  if (points.length === 0) {
    const rteptRegex =
      /<rtept\s+lat="([\d.\-]+)"\s+lon="([\d.\-]+)"[^>]*>([\s\S]*?)<\/rtept>/g;
    while ((match = rteptRegex.exec(gpx)) !== null) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      const eleMatch = eleRegex.exec(match[3]);
      const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;
      if (!isNaN(lat) && !isNaN(lng)) {
        points.push({ lat, lng, ele });
      }
    }
  }

  return points;
}

// ─── Main export ─────────────────────────────────────────────────────────────
/**
 * Parse a GPX string and return cleaned route data.
 *
 * @param gpxString - Raw GPX XML string
 * @param simplificationEpsilon - RDP epsilon in degrees (default 0.0001 ≈ 10m)
 * @param maxPoints - Maximum number of points after simplification (default 2000)
 */
export function parseGpx(
  gpxString: string,
  simplificationEpsilon = 0.0001,
  maxPoints = 2000
): ParsedGpx {
  const rawPoints = extractTrackPoints(gpxString);

  if (rawPoints.length === 0) {
    return {
      routePoints: [],
      rawPoints: [],
      distanceKm: 0,
      elevationGainM: 0,
      elevationLossM: 0,
    };
  }

  // Calculate distance and elevation from raw points
  let distanceKm = 0;
  let elevationGainM = 0;
  let elevationLossM = 0;

  for (let i = 1; i < rawPoints.length; i++) {
    const prev = rawPoints[i - 1];
    const curr = rawPoints[i];

    distanceKm += haversineKm(prev.lat, prev.lng, curr.lat, curr.lng);

    const eleDiff = curr.ele - prev.ele;
    if (eleDiff > 0) {
      elevationGainM += eleDiff;
    } else {
      elevationLossM += Math.abs(eleDiff);
    }
  }

  // Simplify the polyline for storage
  let simplified: [number, number][] = rawPoints.map(
    (p) => [p.lat, p.lng] as [number, number]
  );

  // Skip simplification if already few points — RDP can over-reduce short routes
  const MIN_POINTS_FOR_SIMPLIFICATION = 50;
  if (simplified.length >= MIN_POINTS_FOR_SIMPLIFICATION) {
    simplified = rdpSimplify(simplified, simplificationEpsilon);
  }

  // Further reduce if still too many points
  if (simplified.length > maxPoints) {
    const step = Math.ceil(simplified.length / maxPoints);
    simplified = simplified.filter((_, i) => i % step === 0);
    // Always keep last point
    const lastRaw = rawPoints[rawPoints.length - 1];
    const lastSimplified = simplified[simplified.length - 1];
    if (
      lastSimplified[0] !== lastRaw.lat ||
      lastSimplified[1] !== lastRaw.lng
    ) {
      simplified.push([lastRaw.lat, lastRaw.lng]);
    }
  }

  return {
    routePoints: simplified,
    rawPoints,
    distanceKm: Math.round(distanceKm * 100) / 100,
    elevationGainM: Math.round(elevationGainM),
    elevationLossM: Math.round(elevationLossM),
  };
}

/**
 * Validate that a string looks like a GPX file.
 */
export function isValidGpx(content: string): boolean {
  return content.includes("<gpx") && content.includes("trkpt");
}
