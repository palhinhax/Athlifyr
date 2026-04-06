"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/event-utils";
import { UserPlus } from "lucide-react";

interface UpcomingEvent {
  id: string;
  title: string;
  slug: string;
  startDate: Date | string;
  _count?: { participations: number };
}

interface SuggestedUser {
  id: string;
  name: string | null;
  image: string | null;
  sport?: string;
  city?: string;
}

interface FeedSidebarProps {
  readonly upcomingEvents?: UpcomingEvent[];
  readonly suggestedUsers?: SuggestedUser[];
  readonly trendingTags?: string[];
}

export function FeedSidebar({
  upcomingEvents = [],
  suggestedUsers = [],
  trendingTags = [],
}: FeedSidebarProps) {
  const t = useTranslations("feed.sidebar");

  return (
    <aside className="space-y-6">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="rounded-2xl bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline text-base font-bold">
              {t("upcomingEvents")}
            </h3>
            <Link
              href="/events"
              className="text-xs font-bold text-primary hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const startDate = new Date(
                typeof event.startDate === "string"
                  ? event.startDate
                  : event.startDate
              );
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex gap-3"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {startDate.toLocaleDateString("en", { month: "short" })}
                    </span>
                    <span className="text-lg font-black leading-none">
                      {startDate.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="truncate text-sm font-bold transition-colors group-hover:text-primary">
                      {event.title}
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      {event._count?.participations
                        ? `${event._count.participations} ${t("attending")}`
                        : formatDate(new Date(event.startDate))}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Suggested Users */}
      {suggestedUsers.length > 0 && (
        <section className="rounded-2xl bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 font-headline text-base font-bold">
            {t("suggestedAthletes")}
          </h3>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link
                  href={`/user/${user.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || ""}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold">{user.name}</h5>
                    {(user.sport || user.city) && (
                      <p className="text-[10px] text-muted-foreground">
                        {[user.sport, user.city].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>
                </Link>
                <Link
                  href={`/user/${user.id}`}
                  className="flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  <UserPlus className="h-3 w-3" />
                  {t("addFriend")}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Tags */}
      {trendingTags.length > 0 && (
        <section className="rounded-2xl bg-muted/50 p-5">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("trending")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-card px-3 py-1 text-[10px] font-bold shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-1 text-center lg:text-left">
        <p className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Athlifyr
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
          <Link
            href="/privacy"
            className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/terms"
            className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
          >
            {t("terms")}
          </Link>
        </div>
      </footer>
    </aside>
  );
}
