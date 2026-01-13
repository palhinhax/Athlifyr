import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/event-utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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
              sportType: true,
            },
          },
          variant: {
            select: {
              name: true,
              distance: true,
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-2 text-4xl font-bold">{user.name}</h1>
            <p className="mb-4 text-muted-foreground">{user.email}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {upcomingEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Próximos Eventos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {pastEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Eventos Passados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {user.comments.length}
                </div>
                <div className="text-sm text-muted-foreground">Comentários</div>
              </div>
            </div>
          </div>
        </div>

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
                        {formatDate(participation.event.startDate)}
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
                          {participation.variant.distance &&
                            ` - ${participation.variant.distance}`}
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
                        {formatDate(participation.event.startDate)}
                      </div>
                      {participation.variant && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          {participation.variant.name}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
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
      </div>
    </div>
  );
}
