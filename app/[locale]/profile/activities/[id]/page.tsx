import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ActivityDetailClient } from "@/components/performance/activity-detail-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { id, locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const activity = await prisma.runActivity.findUnique({
    where: { id },
  });

  if (!activity || activity.userId !== session.user.id) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "performance" });

  const track = Array.isArray(activity.track)
    ? (activity.track as Array<{
        lat: number;
        lng: number;
        timestamp: number;
        altitude?: number;
        speed?: number;
      }>)
    : [];

  return (
    <ActivityDetailClient
      activity={{
        id: activity.id,
        startedAt: activity.startedAt.toISOString(),
        finishedAt: activity.finishedAt.toISOString(),
        durationMs: activity.durationMs,
        distanceM: activity.distanceM,
        avgPaceMinKm: activity.avgPaceMinKm,
        maxSpeedKmh: activity.maxSpeedKmh,
        elevationGainM: activity.elevationGainM,
        elevationLossM: activity.elevationLossM,
        track,
      }}
      labels={{
        title: t("activity.title"),
        distance: t("activity.distance"),
        duration: t("activity.duration"),
        avgPace: t("activity.avgPace"),
        maxSpeed: t("activity.maxSpeed"),
        elevGain: t("activity.elevGain"),
        elevLoss: t("activity.elevLoss"),
        gpsPoints: t("activity.gpsPoints"),
        back: t("activity.back"),
      }}
    />
  );
}
