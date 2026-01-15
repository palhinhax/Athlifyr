import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/event-utils";
import Link from "next/link";
import { PublicProfileHeader } from "@/components/public-profile-header";
import { PublicPhotoGallery } from "@/components/public-photo-gallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      image: true,
    },
  });

  if (!user) {
    return {
      title: "Utilizador não encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://athlifyr.com";
  const userName = user.name || "Atleta";
  const userImage = user.image || `${baseUrl}/logo.png`;

  return {
    title: `${userName} - Perfil`,
    description: `Perfil de ${userName} na Athlifyr. Veja os eventos em que ${userName} está inscrito e a sua atividade na comunidade.`,
    openGraph: {
      title: `${userName} - Athlifyr`,
      description: `Perfil de ${userName} na Athlifyr`,
      url: `${baseUrl}/user/${id}`,
      siteName: "Athlifyr",
      images: [
        {
          url: userImage,
          width: 400,
          height: 400,
          alt: userName,
        },
      ],
      type: "profile",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  // If viewing own profile, redirect to /profile
  if (session?.user?.id === id) {
    redirect("/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      participations: {
        where: {
          status: "going",
        },
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
    notFound();
  }

  const upcomingEvents = user.participations.filter(
    (p) => p.event.startDate > new Date()
  );
  const pastEvents = user.participations.filter(
    (p) => p.event.startDate <= new Date()
  );
  const friendsCount =
    user.sentFriendships.length + user.receivedFriendships.length;

  // Check friendship status
  let friendshipStatus: string | null = null;
  let friendshipId: string | undefined = undefined;

  if (session?.user?.id) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: id },
          { senderId: id, receiverId: session.user.id },
        ],
      },
    });

    if (friendship) {
      if (friendship.status === "ACCEPTED") {
        friendshipStatus = "friends";
      } else if (friendship.status === "PENDING") {
        friendshipStatus =
          friendship.senderId === session.user.id
            ? "request_sent"
            : "request_received";
      }
      friendshipId = friendship.id;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Public Profile Header */}
        <PublicProfileHeader
          user={{
            id: user.id,
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
          friendshipStatus={friendshipStatus}
          friendshipId={friendshipId}
          isLoggedIn={!!session?.user}
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
                          {participation.variant.distanceKm &&
                            ` - ${participation.variant.distanceKm} km`}
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

        {/* Photo Gallery */}
        <PublicPhotoGallery userId={id} />

        {/* Empty State for Events */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              Ainda não está registado em nenhum evento
            </h3>
            <p className="text-muted-foreground">
              Este utilizador ainda não participa em nenhum evento.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
