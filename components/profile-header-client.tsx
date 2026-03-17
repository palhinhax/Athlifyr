"use client";

import { ProfileImageUpload } from "@/components/profile-image-upload";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Coins } from "lucide-react";

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

  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
      <ProfileImageUpload currentImage={user.image} userName={user.name} />

      <div className="flex-1 text-center md:text-left">
        <div className="mb-4">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-6">
          <div className="rounded-lg bg-accent/10 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-accent">
              {stats.upcomingEvents}
            </div>
            <div className="text-xs text-muted-foreground sm:text-sm">
              {t("upcomingEvents")}
            </div>
          </div>
          <div className="rounded-lg bg-p-info/10 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-p-info">
              {stats.pastEvents}
            </div>
            <div className="text-xs text-muted-foreground sm:text-sm">
              {t("pastEvents")}
            </div>
          </div>
          <div className="rounded-lg bg-p-golden/10 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-p-golden">
              {stats.friendsCount}
            </div>
            <div className="text-xs text-muted-foreground sm:text-sm">
              {t("friends")}
            </div>
          </div>
          {stats.creditBalanceCents !== undefined &&
            stats.creditBalanceCents > 0 && (
              <Link href="/credits" className="block">
                <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-center transition-colors hover:bg-emerald-500/20">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-600">
                    <Coins className="h-5 w-5" />
                    {(stats.creditBalanceCents / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    {t("credits")}
                  </div>
                </div>
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}
