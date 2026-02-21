import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { Link } from "@/i18n/routing";
import { FriendsSection } from "@/components/friends-section";
import { ProfileHeaderClient } from "@/components/profile-header-client";
import { PhotoGallery } from "@/components/photo-gallery";
import { ProfileUpcomingSessions } from "@/components/profile-upcoming-sessions";
import { ProfilePastSessions } from "@/components/profile-past-sessions";
import { PerformanceSection } from "@/components/performance/performance-section";
import { ProfileProfessionalSection } from "@/components/profile-professional-section";
import { AnalysesSection } from "@/components/analyses-section";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { locale: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await Promise.resolve(params);
  const session = await auth();
  const t = await getTranslations({ locale, namespace: "profile" });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      participations: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startDate: true,
              city: true,
              country: true,
              sportTypes: true,
            },
          },
          variant: {
            select: {
              name: true,
              distanceKm: true,
              startDate: true,
              startTime: true,
            },
          },
        },
        orderBy: {
          event: {
            startDate: "asc",
          },
        },
      },
      results: {
        select: {
          id: true,
        },
      },
      sentFriendships: {
        where: { status: "ACCEPTED" },
        select: { id: true },
      },
      receivedFriendships: {
        where: { status: "ACCEPTED" },
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch future session bookings
  const upcomingBookings = await prisma.venueBooking.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["BOOKED", "ATTENDED"] },
      session: {
        startsAt: { gte: new Date() },
      },
    },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          endsAt: true,
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: {
      session: {
        startsAt: "asc",
      },
    },
  });

  // Fetch past session bookings (sessions with workouts)
  const pastBookingsRaw = await prisma.venueBooking.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["BOOKED", "ATTENDED"] },
      session: {
        startsAt: { lt: new Date() },
        sessionWorkouts: { some: {} }, // Only sessions with workouts
      },
    },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          endsAt: true,
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
            },
          },
          sessionWorkouts: {
            select: {
              id: true,
              workout: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      session: {
        startsAt: "desc",
      },
    },
    take: 10, // Limit to last 10 sessions
  });

  // Check which sessions have logged workouts
  const sessionIds = pastBookingsRaw.map((b) => b.session.id);
  const workoutLogs = await prisma.workoutLog.findMany({
    where: {
      userId: session.user.id,
      sessionId: { in: sessionIds },
    },
    select: {
      sessionId: true,
    },
  });
  const loggedSessionIds = new Set(workoutLogs.map((l) => l.sessionId));

  const pastBookings = pastBookingsRaw.map((b) => ({
    ...b,
    hasLoggedWorkout: loggedSessionIds.has(b.session.id),
  }));

  const upcomingEvents = user.participations.filter(
    (p) => p.event.startDate > new Date() && p.status === "going"
  );
  const pastEvents = user.participations.filter(
    (p) => p.event.startDate <= new Date() && p.status === "going"
  );
  const friendsCount =
    user.sentFriendships.length + user.receivedFriendships.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <ProfileHeaderClient
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
          }}
          stats={{
            upcomingEvents: upcomingEvents.length,
            pastEvents: pastEvents.length,
            friendsCount,
          }}
          participations={user.participations.map((p) => ({
            id: p.id,
            status: p.status,
            event: {
              id: p.event.id,
              title: p.event.title,
              slug: p.event.slug,
              startDate: p.event.startDate,
              city: p.event.city,
              country: p.event.country,
              sportTypes: p.event.sportTypes,
            },
            variant: p.variant
              ? {
                  name: p.variant.name,
                  distanceKm: p.variant.distanceKm,
                  startDate: p.variant.startDate,
                  startTime: p.variant.startTime,
                }
              : null,
          }))}
          sessionBookings={upcomingBookings.map((b) => ({
            id: b.id,
            session: {
              id: b.session.id,
              title: b.session.title,
              startsAt: b.session.startsAt,
              endsAt: b.session.endsAt,
              venue: {
                id: b.session.venue.id,
                name: b.session.venue.name,
                slug: b.session.venue.slug,
                city: b.session.venue.city,
              },
            },
          }))}
        />

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Calendar className="h-6 w-6 text-primary" />
              {t("upcomingEventsCount", { count: upcomingEvents.length })}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((participation) => (
                <Link
                  key={participation.id}
                  href={`/events/${participation.event.slug}`}
                >
                  <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
                    <h3 className="mb-2 font-semibold">
                      {participation.event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(participation.event.startDate, locale)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {participation.event.city},{" "}
                        {participation.event.country}
                      </div>
                      {participation.variant && (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 shrink-0" />
                            <span>
                              {participation.variant.name}
                              {participation.variant.distanceKm &&
                                ` - ${participation.variant.distanceKm} km`}
                            </span>
                          </div>
                          {participation.variant.startDate &&
                            participation.variant.startDate !==
                              participation.event.startDate && (
                              <span className="pl-6 text-xs">
                                (
                                {formatDate(
                                  participation.variant.startDate,
                                  locale
                                )}
                                {participation.variant.startTime &&
                                  ` ${t("at")} ${participation.variant.startTime}`}
                                )
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Session Bookings */}
        <ProfileUpcomingSessions bookings={upcomingBookings} locale={locale} />

        {/* Past Session Bookings with Workouts */}
        <ProfilePastSessions bookings={pastBookings} locale={locale} />

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Trophy className="h-6 w-6 text-primary" />
              {t("pastEventsCount", { count: pastEvents.length })}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.slice(0, 6).map((participation) => (
                <Link
                  key={participation.id}
                  href={`/events/${participation.event.slug}`}
                >
                  <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
                    <h3 className="mb-2 font-semibold">
                      {participation.event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(participation.event.startDate, locale)}
                      </div>
                      {participation.variant && (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 shrink-0" />
                            <span>
                              {participation.variant.name}
                              {participation.variant.distanceKm &&
                                ` - ${participation.variant.distanceKm} km`}
                            </span>
                          </div>
                          {participation.variant.startDate &&
                            participation.variant.startDate !==
                              participation.event.startDate && (
                              <span className="pl-6 text-xs">
                                (
                                {formatDate(
                                  participation.variant.startDate,
                                  locale
                                )}
                                {participation.variant.startTime &&
                                  ` ${t("at")} ${participation.variant.startTime}`}
                                )
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Events */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="mt-12 rounded-lg border p-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">{t("noEventsTitle")}</h3>
            <p className="mb-6 text-muted-foreground">
              {t("noEventsDescription")}
            </p>
            <Link href="/events">
              <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {t("exploreEvents")}
              </button>
            </Link>
          </div>
        )}

        {/* Performance Section */}
        <PerformanceSection />

        {/* Analyses Section */}
        <AnalysesSection />

        {/* Professional Section - Only shows if user has venue invites or memberships */}
        <ProfileProfessionalSection userId={session.user.id} />

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Friends Section */}
        <FriendsSection />
      </div>
    </div>
  );
}
