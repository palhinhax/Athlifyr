"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  MapPin,
  Trophy,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { EventTicketModal } from "@/components/event-ticket-modal";
import { EventLiveStatusBadge } from "@/components/event-live-status-badge";
import { formatDate } from "@/lib/event-utils";

interface RegistrationItem {
  id: string;
  status: string;
  bibNumber: string | null;
  checkedInAt: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: string;
    city: string;
    country: string;
    imageUrl: string | null;
    hasLiveRace: boolean;
    liveStatus: string;
    checkInOpensAt: string | null;
    checkInClosesAt: string | null;
  };
  variant: {
    name: string;
    distanceKm: number | null;
    startDate: string | null;
    startTime: string | null;
  } | null;
}

interface MyRegistrationsListProps {
  upcoming: RegistrationItem[];
  past: RegistrationItem[];
  locale: string;
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("registrations");

  const config: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: {
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      icon: CheckCircle2,
    },
    PENDING: {
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: Clock,
    },
    CANCELLED: {
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      icon: XCircle,
    },
    REFUNDED: {
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      icon: XCircle,
    },
  };

  const c = config[status] || config.PENDING;
  const Icon = c.icon;
  const label = t(`status.${status}` as "status.CONFIRMED" | "status.PENDING" | "status.CANCELLED" | "status.REFUNDED");

  return (
    <Badge className={`gap-1 ${c.className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function CheckInBadge({ checkedInAt }: { checkedInAt: string | null }) {
  const t = useTranslations("registrations");

  if (!checkedInAt) return null;

  return (
    <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
      <CheckCircle2 className="h-3 w-3" />
      {t("checkedIn")}
    </Badge>
  );
}

function RegistrationCard({
  registration,
  locale,
  onShowTicket,
}: {
  registration: RegistrationItem;
  locale: string;
  onShowTicket: (eventId: string) => void;
}) {
  const t = useTranslations("registrations");

  return (
    <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Link href={`/events/${registration.event.slug}`}>
            <h3 className="font-semibold transition-colors hover:text-primary">
              {registration.event.title}
            </h3>
          </Link>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {formatDate(new Date(registration.event.startDate), locale)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {registration.event.city}, {registration.event.country}
            </div>
            {registration.variant && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 shrink-0" />
                <span>
                  {registration.variant.name}
                  {registration.variant.distanceKm &&
                    ` — ${registration.variant.distanceKm} km`}
                </span>
              </div>
            )}
            {registration.bibNumber && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {t("bibNumber")}: {registration.bibNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={registration.status} />
            <CheckInBadge checkedInAt={registration.checkedInAt} />
            <EventLiveStatusBadge
              liveStatus={registration.event.liveStatus}
              hasLiveRace={registration.event.hasLiveRace}
              checkInOpensAt={registration.event.checkInOpensAt}
              checkInClosesAt={registration.event.checkInClosesAt}
            />
          </div>
          {registration.status === "CONFIRMED" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onShowTicket(registration.event.id)}
            >
              <Ticket className="h-4 w-4" />
              {t("showTicket")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyRegistrationsList({
  upcoming,
  past,
  locale,
}: MyRegistrationsListProps) {
  const t = useTranslations("registrations");
  const [ticketEventId, setTicketEventId] = useState<string | null>(null);

  return (
    <>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t("upcoming")} ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Clock className="h-4 w-4" />
            {t("past")} ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("noUpcoming")}
            </p>
          ) : (
            upcoming.map((r) => (
              <RegistrationCard
                key={r.id}
                registration={r}
                locale={locale}
                onShowTicket={setTicketEventId}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3">
          {past.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("noPast")}
            </p>
          ) : (
            past.map((r) => (
              <RegistrationCard
                key={r.id}
                registration={r}
                locale={locale}
                onShowTicket={setTicketEventId}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {ticketEventId && (
        <EventTicketModal
          eventId={ticketEventId}
          open={!!ticketEventId}
          onOpenChange={(open) => {
            if (!open) setTicketEventId(null);
          }}
        />
      )}
    </>
  );
}
