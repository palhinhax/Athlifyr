"use client";

import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Route,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  MapPin,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  formatTime,
  formatPace as formatPaceRaw,
} from "@/lib/performance/scoring";
import { formatDistance as formatDistanceKm } from "@/lib/geolocation";
import { type GpsPoint } from "./types";

const ActivityMapClient = dynamic(
  () =>
    import("@/components/performance/activity-map-client").then(
      (m) => m.ActivityMapClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
    ),
  }
);

interface ActivityData {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  distanceM: number;
  avgPaceMinKm: number | null;
  maxSpeedKmh: number | null;
  elevationGainM: number;
  elevationLossM: number;
  track: GpsPoint[];
}

interface Labels {
  title: string;
  distance: string;
  duration: string;
  avgPace: string;
  maxSpeed: string;
  elevGain: string;
  elevLoss: string;
  gpsPoints: string;
  back: string;
}

function formatDuration(ms: number): string {
  return formatTime(Math.floor(ms / 1000));
}

function formatDistance(meters: number): string {
  return formatDistanceKm(meters / 1000);
}

function formatPace(paceMinKm: number): string {
  return `${formatPaceRaw(paceMinKm * 60)} /km`;
}

interface ActivityDetailClientProps {
  activity: ActivityData;
  labels: Labels;
}

export function ActivityDetailClient({
  activity,
  labels,
}: ActivityDetailClientProps) {
  const date = new Date(activity.startedAt);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{labels.title}</h1>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            ·{" "}
            {date.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Map */}
      {activity.track.length >= 2 && (
        <Card className="overflow-hidden">
          <ActivityMapClient
            track={activity.track}
            className="h-[400px] w-full"
          />
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Route className="h-5 w-5 text-blue-500" />}
          label={labels.distance}
          value={formatDistance(activity.distanceM)}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-green-500" />}
          label={labels.duration}
          value={formatDuration(activity.durationMs)}
        />
        <StatCard
          icon={<Gauge className="h-5 w-5 text-orange-500" />}
          label={labels.avgPace}
          value={
            activity.avgPaceMinKm ? formatPace(activity.avgPaceMinKm) : "—"
          }
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          label={labels.maxSpeed}
          value={
            activity.maxSpeedKmh
              ? `${activity.maxSpeedKmh.toFixed(1)} km/h`
              : "—"
          }
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          label={labels.elevGain}
          value={`${activity.elevationGainM}m`}
        />
        <StatCard
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          label={labels.elevLoss}
          value={`${activity.elevationLossM}m`}
        />
        <StatCard
          icon={<MapPin className="h-5 w-5 text-purple-500" />}
          label={labels.gpsPoints}
          value={activity.track.length.toLocaleString()}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );
}
