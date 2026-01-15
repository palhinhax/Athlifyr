import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/event-utils";
import Link from "next/link";
import { FriendsSection } from "@/components/friends-section";
import { ProfileHeaderClient } from "@/components/profile-header-client";
import { PhotoGallery } from "@/components/photo-gallery";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { locale: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await Promise.resolve(params);
  const session = await auth();

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
      comments: {
        select: {
          id: true,
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
            commentsCount: user.comments.length,
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
        />

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Calendar className="h-6 w-6 text-primary" />
              Próximos Eventos ({upcomingEvents.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((participation) => (
                <Link
                  key={participation.id}
                  href={`/events/${participation.event.slug}`}
                >
                  <Card className="p-4 transition-colors hover:bg-accent">
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
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          {participation.variant.name}
                          {participation.variant.distanceKm &&
                            ` - ${participation.variant.distanceKm} km`}
                          {participation.variant.startDate &&
                            participation.variant.startDate !==
                              participation.event.startDate && (
                              <span className="ml-1 text-xs">
                                (
                                {formatDate(
                                  participation.variant.startDate,
                                  locale
                                )}
                                {participation.variant.startTime &&
                                  ` às ${participation.variant.startTime}`}
                                )
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Trophy className="h-6 w-6 text-primary" />
              Eventos Passados ({pastEvents.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.slice(0, 6).map((participation) => (
                <Link
                  key={participation.id}
                  href={`/events/${participation.event.slug}`}
                >
                  <Card className="p-4 transition-colors hover:bg-accent">
                    <h3 className="mb-2 font-semibold">
                      {participation.event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(participation.event.startDate, locale)}
                      </div>
                      {participation.variant && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          {participation.variant.name}
                          {participation.variant.distanceKm &&
                            ` - ${participation.variant.distanceKm} km`}
                          {participation.variant.startDate &&
                            participation.variant.startDate !==
                              participation.event.startDate && (
                              <span className="ml-1 text-xs">
                                (
                                {formatDate(
                                  participation.variant.startDate,
                                  locale
                                )}
                                {participation.variant.startTime &&
                                  ` às ${participation.variant.startTime}`}
                                )
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Events */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              Ainda não estás registado em nenhum evento
            </h3>
            <p className="mb-6 text-muted-foreground">
              Explora os eventos disponíveis e marca que vais participar!
            </p>
            <Link href="/events">
              <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Explorar Eventos
              </button>
            </Link>
          </Card>
        )}

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Friends Section */}
        <FriendsSection />
      </div>
    </div>
  );
}
