// ─── Formatters ─────────────────────────────────────────────────────────────

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatPace(paceMinKm: number): string {
  const mins = Math.floor(paceMinKm);
  const secs = Math.round((paceMinKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function generateDefaultTitle(
  t: (key: string) => string,
  startedAt: number
): string {
  const hour = new Date(startedAt).getHours();
  if (hour < 6) return t("saveActivity.nightRun");
  if (hour < 12) return t("saveActivity.morningRun");
  if (hour < 17) return t("saveActivity.afternoonRun");
  if (hour < 21) return t("saveActivity.eveningRun");
  return t("saveActivity.nightRun");
}
