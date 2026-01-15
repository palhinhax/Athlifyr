"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { EventAdminActions } from "@/components/event-admin-actions";
import { useTranslations } from "next-intl";
import { SportType } from "@prisma/client";

interface EventPageHeaderProps {
  locale: string;
  isAdmin: boolean;
  event: {
    id: string;
    title: string;
    description: string;
    sportTypes: SportType[];
    startDate: Date;
    endDate: Date | null;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    googleMapsUrl: string | null;
    imageUrl: string | null;
    externalUrl: string | null;
    variants: {
      id: string;
      name: string;
      distanceKm: number | null;
      startDate: Date | null;
      startTime: string | null;
    }[];
  };
  shareDescription: string;
}

export function EventPageHeader({
  locale,
  isAdmin,
  event,
  shareDescription,
}: EventPageHeaderProps) {
  const t = useTranslations("events");
  const tCommon = useTranslations("common");

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={`/${locale}/events`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("backToEvents")}</span>
            <span className="sm:hidden">{tCommon("back")}</span>
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && <EventAdminActions event={event} />}
          <ShareButton title={event.title} description={shareDescription} />
        </div>
      </div>
    </div>
  );
}
