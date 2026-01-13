import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { MessageSquare, Calendar, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/event-utils";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's participations to show activity from those events
  const userParticipations = await prisma.participation.findMany({
    where: {
      userId: session.user.id,
      status: "going",
    },
    select: {
      eventId: true,
    },
  });

  const eventIds = userParticipations.map((p) => p.eventId);

  // Get recent comments from user's events
  const recentComments = await prisma.comment.findMany({
    where: {
      eventId: {
        in: eventIds.length > 0 ? eventIds : ["no-events"], // Avoid empty array
      },
      parentId: null, // Only top-level comments
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      event: {
        select: {
          title: true,
          slug: true,
        },
      },
      replies: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  // Get recent participations from user's events
  const recentParticipations = await prisma.participation.findMany({
    where: {
      eventId: {
        in: eventIds.length > 0 ? eventIds : ["no-events"],
      },
      status: "going",
      userId: {
        not: session.user.id, // Exclude user's own participations
      },
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      event: {
        select: {
          title: true,
          slug: true,
          startDate: true,
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
      createdAt: "desc",
    },
    take: 10,
  });

  // Combine and sort activities
  const activities: Array<{
    type: "comment" | "participation";
    date: Date;
    data: (typeof recentComments)[0] | (typeof recentParticipations)[0];
  }> = [
    ...recentComments.map((c) => ({
      type: "comment" as const,
      date: c.createdAt,
      data: c,
    })),
    ...recentParticipations.map((p) => ({
      type: "participation" as const,
      date: p.createdAt,
      data: p,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Feed de Atividade</h1>

        {eventIds.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              Sem atividade por agora
            </h3>
            <p className="mb-6 text-muted-foreground">
              Regista-te em eventos para veres a atividade da comunidade!
            </p>
            <Link href="/events">
              <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Explorar Eventos
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Ainda não há atividade recente nos teus eventos.
                </p>
              </Card>
            ) : (
              activities.map((activity, index) => (
                <Card key={`${activity.type}-${index}`} className="p-4">
                  {activity.type === "comment" ? (
                    <div className="flex gap-4">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        {activity.data.user.image ? (
                          <Image
                            src={activity.data.user.image}
                            alt={activity.data.user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                            {activity.data.user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold">
                            {activity.data.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            comentou em
                          </span>
                          <Link
                            href={`/events/${activity.data.event.slug}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {activity.data.event.title}
                          </Link>
                        </div>
                        {"content" in activity.data && (
                          <>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {activity.data.content.slice(0, 150)}
                              {activity.data.content.length > 150 && "..."}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(activity.date, {
                                  addSuffix: true,
                                  locale: pt,
                                })}
                              </span>
                              {"replies" in activity.data &&
                                activity.data.replies.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {activity.data.replies.length}{" "}
                                    {activity.data.replies.length === 1
                                      ? "resposta"
                                      : "respostas"}
                                  </span>
                                )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        {activity.data.user.image ? (
                          <Image
                            src={activity.data.user.image}
                            alt={activity.data.user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                            {activity.data.user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold">
                            {activity.data.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            vai participar em
                          </span>
                          <Link
                            href={`/events/${activity.data.event.slug}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {activity.data.event.title}
                          </Link>
                        </div>
                        {"variant" in activity.data && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {activity.data.variant && (
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {activity.data.variant.name}
                                {activity.data.variant.distance &&
                                  ` - ${activity.data.variant.distance}`}
                              </span>
                            )}
                            {"startDate" in activity.data.event && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(activity.data.event.startDate)}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.date, {
                            addSuffix: true,
                            locale: pt,
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
