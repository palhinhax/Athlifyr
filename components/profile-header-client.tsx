"use client";

import { ProfileImageUpload } from "@/components/profile-image-upload";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Calendar, Trophy, Users, Coins } from "lucide-react";

interface EventParticipation {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    city: string;
    country: string;
    sportTypes: string[];
  };
  variant?: {
    name: string;
    distanceKm: number | null;
  } | null;
}

interface VenueSessionBooking {
  id: string;
  session: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    venue: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
    };
  };
}

interface ProfileHeaderClientProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: {
    upcomingEvents: number;
    pastEvents: number;
    friendsCount: number;
    creditBalanceCents?: number;
  };
  participations: EventParticipation[];
  sessionBookings?: VenueSessionBooking[];
}

export function ProfileHeaderClient({ user, stats }: ProfileHeaderClientProps) {
  const t = useTranslations("profile");

  const showCredits =
    stats.creditBalanceCents !== undefined && stats.creditBalanceCents > 0;

  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
      <ProfileImageUpload currentImage={user.image} userName={user.name} />

      <div className="flex-1 text-center md:text-left">
        <div className="mb-4">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <StatItem
            icon={<Calendar className="h-4 w-4" />}
            value={stats.upcomingEvents}
            label={t("upcomingEvents")}
            colorClass="text-accent"
          />
          <Separator />
          <StatItem
            icon={<Trophy className="h-4 w-4" />}
            value={stats.pastEvents}
            label={t("pastEvents")}
            colorClass="text-p-info"
          />
          <Separator />
          <StatItem
            icon={<Users className="h-4 w-4" />}
            value={stats.friendsCount}
            label={t("friends")}
            colorClass="text-p-golden"
          />
          {showCredits && (
            <>
              <Separator />
              <Link
                href="/credits"
                className="group flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <Coins className="h-4 w-4 text-emerald-600" />
                <span className="text-lg font-bold tabular-nums text-emerald-600">
                  {(stats.creditBalanceCents! / 100).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("credits")}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
  colorClass,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={colorClass}>{icon}</span>
      <span className={`text-lg font-bold tabular-nums ${colorClass}`}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Separator() {
  return <div className="hidden h-4 w-px bg-border sm:block" />;
}
