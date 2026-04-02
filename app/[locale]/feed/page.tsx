import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { formatDistanceToNow, type Locale } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { MessageSquare, Calendar, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/event-utils";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { FeedSidebar } from "@/components/feed-sidebar";
// import { FeedStories } from "@/components/feed-stories";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// Map locale codes to date-fns locales
const dateLocales: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export const metadata: Metadata = {
  title: "Activity Feed",
  description:
    "See the latest updates from your events. Follow posts, photos, and results from the sports community.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function FeedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feed" });
  const dateLocale = dateLocales[locale] || enUS;
  const session = await auth();

  const isAuthenticated = !!session?.user?.id;

  // Get fresh user data from database if authenticated
  let currentUser: {
    id: string;
    name: string | null;
    image: string | null;
  } | null = null;
  if (isAuthenticated) {
    currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  }

  // Get user's participations to show activity from those events (only if authenticated)
  let eventIds: string[] = [];
  if (isAuthenticated) {
    const userParticipations = await prisma.participation.findMany({
      where: {
        userId: session.user.id,
        status: "going",
      },
      select: {
        eventId: true,
      },
    });
    eventIds = userParticipations.map((p) => p.eventId);
  }

  // Get all recent posts (public posts + user's participating events if authenticated)
  const postsWhereClause =
    isAuthenticated && eventIds.length > 0
      ? {
          OR: [{ isPublic: true }, { eventId: { in: eventIds } }],
        }
      : { isPublic: true };

  const recentPosts = await prisma.post.findMany({
    where: postsWhereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: isAuthenticated
        ? {
            where: { userId: session.user.id },
            select: { id: true },
          }
        : { where: { userId: "none" }, select: { id: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 30,
  });

  // Get recent comments from user's events (only if authenticated)
  const recentComments =
    isAuthenticated && eventIds.length > 0
      ? await prisma.comment.findMany({
          where: {
            eventId: {
              in: eventIds,
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
        })
      : [];

  // Get recent participations from user's events (only if authenticated)
  const recentParticipations =
    isAuthenticated && eventIds.length > 0
      ? await prisma.participation.findMany({
          where: {
            eventId: {
              in: eventIds,
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
                distanceKm: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        })
      : [];

  // Deduplicate: if a user already has a post about an event, skip their participation card
  const postUserEventPairs = new Set(
    recentPosts
      .filter((p) => p.userId && p.eventId)
      .map((p) => `${p.userId}-${p.eventId}`)
  );
  const deduplicatedParticipations = recentParticipations.filter(
    (p) => !postUserEventPairs.has(`${p.userId}-${p.eventId}`)
  );

  // Combine and sort activities
  const activities: Array<{
    type: "comment" | "participation" | "post";
    date: Date;
    data:
      | (typeof recentComments)[0]
      | (typeof recentParticipations)[0]
      | (typeof recentPosts)[0];
  }> = [
    ...recentPosts.map((p) => ({
      type: "post" as const,
      date: p.createdAt,
      data: p,
    })),
    ...recentComments.map((c) => ({
      type: "comment" as const,
      date: c.createdAt,
      data: c,
    })),
    ...deduplicatedParticipations.map((p) => ({
      type: "participation" as const,
      date: p.createdAt,
      data: p,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Fetch upcoming events for sidebar
  const upcomingEvents = await prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      _count: { select: { participations: true } },
    },
    orderBy: { startDate: "asc" },
    take: 4,
  });

  // Get IDs of users the current user already follows
  const followingIds = isAuthenticated
    ? (
        await prisma.friendship.findMany({
          where: { senderId: session.user.id, status: "ACCEPTED" },
          select: { receiverId: true },
        })
      ).map((f) => f.receiverId)
    : [];

  // Fetch suggested users for sidebar (exclude self and already-followed)
  const suggestedUsers = isAuthenticated
    ? await prisma.user.findMany({
        where: {
          id: { notIn: [session.user.id, ...followingIds] },
          name: { not: null },
          image: { not: null },
        },
        select: { id: true, name: true, image: true },
        take: 4,
        orderBy: { updatedAt: "desc" },
      })
    : [];

  // Story users: users who recently posted with images
  // const storyUsers = await prisma.user.findMany({
  //   where: {
  //     posts: {
  //       some: {
  //         imageUrl: { not: null },
  //         createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  //       },
  //     },
  //     ...(isAuthenticated ? { id: { not: session.user.id } } : {}),
  //   },
  //   select: { id: true, name: true, image: true },
  //   take: 8,
  // });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Feed Column */}
          <div className="space-y-6 lg:col-span-8">
            {/* Stories */}
            {/* <FeedStories
              currentUser={currentUser}
              storyUsers={storyUsers.map((u) => ({
                ...u,
                hasUnseenStory: true,
              }))}
            /> */}

            {/* Create Post */}
            {isAuthenticated && currentUser && (
              <section className="rounded-xl bg-card p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <CreatePost
                  userImage={currentUser.image}
                  userName={currentUser.name}
                />
              </section>
            )}

            {/* Activity Feed */}
            <div className="space-y-6">
              {activities.length === 0 ? (
                <Card className="overflow-hidden rounded-xl p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-semibold">
                    {t("emptyTitle")}
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    {t("emptyDescription")}
                  </p>
                  <Link
                    href="/events"
                    className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t("exploreEvents")}
                  </Link>
                </Card>
              ) : (
                activities.map((activity, index) => {
                  if (activity.type === "post" && "content" in activity.data) {
                    const postData = activity.data as (typeof recentPosts)[0];
                    return (
                      <PostCard
                        key={`post-${index}`}
                        post={{
                          id: postData.id,
                          content: postData.content,
                          imageUrl: postData.imageUrl,
                          mediaType: postData.mediaType,
                          createdAt: activity.date,
                          userId: postData.userId,
                          user: postData.user,
                          event: postData.event,
                          venue: postData.venue,
                          likesCount: postData._count.likes,
                          isLikedByUser: postData.likes.length > 0,
                          commentsCount: postData._count.comments,
                        }}
                        currentUserId={session?.user?.id}
                        isAdmin={session?.user?.role === "ADMIN"}
                      />
                    );
                  }

                  return (
                    <Card
                      key={`${activity.type}-${index}`}
                      className="overflow-hidden rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                    >
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
                                {activity.data.user.name?.[0]?.toUpperCase() ||
                                  "U"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-semibold">
                                {activity.data.user.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {t("commentedOn")}
                              </span>
                              {activity.data.event && (
                                <Link
                                  href={`/events/${activity.data.event.slug}`}
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {activity.data.event.title}
                                </Link>
                              )}
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
                                      locale: dateLocale,
                                    })}
                                  </span>
                                  {"replies" in activity.data &&
                                    activity.data.replies.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {activity.data.replies.length}{" "}
                                        {activity.data.replies.length === 1
                                          ? t("reply")
                                          : t("replies")}
                                      </span>
                                    )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 sm:gap-4">
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
                                {activity.data.user.name?.[0]?.toUpperCase() ||
                                  "U"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="font-semibold">
                                {activity.data.user.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {t("willParticipateIn")}
                              </span>
                              {activity.data.event && (
                                <Link
                                  href={`/events/${activity.data.event.slug}`}
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {activity.data.event.title}
                                </Link>
                              )}
                            </div>
                            {"variant" in activity.data && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                {activity.data.variant && (
                                  <span className="flex items-center gap-1">
                                    <Trophy className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {activity.data.variant.name}
                                      {activity.data.variant.distanceKm &&
                                        ` - ${activity.data.variant.distanceKm} km`}
                                    </span>
                                  </span>
                                )}
                                {"startDate" in activity.data.event &&
                                  activity.data.event.startDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 flex-shrink-0" />
                                      {formatDate(
                                        activity.data.event.startDate
                                      )}
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
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-20">
              <FeedSidebar
                upcomingEvents={upcomingEvents}
                suggestedUsers={suggestedUsers}
                trendingTags={[
                  "#TrailRunning",
                  "#HYROX",
                  "#CrossFit",
                  "#Cycling",
                  "#UltraTrai",
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
