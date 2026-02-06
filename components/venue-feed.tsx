"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { WodPostCard } from "@/components/wod-post-card";
import { CreatePost } from "@/components/create-post";
import { ShareEventDialog } from "@/components/share-event-dialog";
import { PublishWodDialog } from "@/components/publish-wod-dialog";
import { Loader2, Globe, Calendar, Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  Post,
  User,
  Event,
  Venue,
  EventVariant,
  WorkoutBlockType,
} from "@prisma/client";

// Workout block exercise type for WOD posts
interface WorkoutBlockExercise {
  id: string;
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightFemale: number | null;
  prescribedDistance: number | null;
  prescribedTime: number | null;
  notes: string | null;
  exercise: {
    id: string;
    name: string;
  };
}

// Workout block type for WOD posts
interface WorkoutBlock {
  id: string;
  type: WorkoutBlockType;
  name: string | null;
  timeCap: number | null;
  rounds: number | null;
  workTime: number | null;
  notes: string | null;
  exercises: WorkoutBlockExercise[];
}

// Workout type for WOD posts
interface WorkoutData {
  id: string;
  name: string;
  description: string | null;
  estimatedTime: number | null;
  difficulty: number | null;
  blocks: WorkoutBlock[];
}

type PostWithDetails = Post & {
  user: Pick<User, "id" | "name" | "image">;
  event:
    | (Pick<
        Event,
        | "id"
        | "title"
        | "slug"
        | "description"
        | "startDate"
        | "endDate"
        | "city"
        | "country"
        | "imageUrl"
        | "isFeatured"
        | "sportTypes"
      > & {
        variants?: Pick<EventVariant, "id" | "name" | "distanceKm">[];
      })
    | null;
  venue: Pick<Venue, "id" | "name" | "slug"> | null;
  workout: WorkoutData | null;
  _count: {
    likes: number;
    comments: number;
  };
  likes: Array<{ id: string }>;
  likesCount: number;
  isLikedByUser: boolean;
};

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface VenueFeedProps {
  venueId: string;
  venueName?: string;
  userId?: string;
  userName?: string | null;
  userImage?: string | null;
  isMember: boolean;
  isOwner?: boolean;
}

export function VenueFeed({
  venueId,
  venueName = "",
  userId,
  userName,
  userImage,
  isMember,
  isOwner = false,
}: VenueFeedProps) {
  const t = useTranslations("feed");
  const tVenue = useTranslations("venues.posts");
  const tShareEvent = useTranslations("venues.shareEvent");
  const tPublishWod = useTranslations("venues.publishWod");
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasMore: false,
  });
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", "10");
        params.append("venueId", venueId);

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: {
          posts: PostWithDetails[];
          pagination: PaginationInfo;
        } = await response.json();

        if (append) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }

        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [venueId]
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.hasMore &&
          !loadingMore &&
          !loading
        ) {
          fetchPosts(pagination.page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination, loadingMore, loading, fetchPosts]);

  // Load initial posts
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePostCreated = () => {
    // Refresh posts after creating
    fetchPosts(1);
  };

  const handlePostDeleted = (postId: string) => {
    // Remove post from list immediately
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    // Update pagination count
    setPagination((prev) => ({
      ...prev,
      totalCount: Math.max(0, prev.totalCount - 1),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Action Buttons for owners/coaches */}
      {isOwner && userId && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Publish WOD Button */}
          <PublishWodDialog
            venueId={venueId}
            venueName={venueName}
            onWodPublished={() => fetchPosts(1)}
          >
            <Button variant="default" className="w-full gap-2 sm:w-auto">
              <Dumbbell className="h-4 w-4" />
              {tPublishWod("title")}
            </Button>
          </PublishWodDialog>

          {/* Share Event Button */}
          <ShareEventDialog
            venueId={venueId}
            venueName={venueName}
            onEventShared={() => fetchPosts(1)}
          >
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Calendar className="h-4 w-4" />
              {tShareEvent("buttonLabel")}
            </Button>
          </ShareEventDialog>
        </div>
      )}

      {/* Create Post - Only for members */}
      {isMember && userId && (
        <CreatePost
          userName={userName || undefined}
          userImage={userImage || undefined}
          venueId={venueId}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {t("noPosts")}
            {isMember && (
              <>
                <br />
                {t("beFirstToPost")}
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post.id} className="relative">
              {post.isPublic && (
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="h-3 w-3" />
                    <span className="text-xs">{tVenue("publicBadge")}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {tVenue("publicBadgeDesc")}
                  </span>
                </div>
              )}
              {post.workout ? (
                <WodPostCard
                  post={{
                    id: post.id,
                    content: post.content,
                    createdAt: post.createdAt,
                    userId: post.userId,
                    user: post.user,
                    venue: post.venue,
                    isPublic: post.isPublic,
                    likesCount: post._count?.likes || 0,
                    isLikedByUser: Array.isArray(post.likes)
                      ? post.likes.some((like) => like.id === userId)
                      : false,
                    commentsCount: post._count?.comments || 0,
                  }}
                  workout={post.workout}
                  currentUserId={userId}
                  onPostDeleted={handlePostDeleted}
                />
              ) : (
                <PostCard
                  post={{
                    id: post.id,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    mediaType: post.mediaType,
                    createdAt: post.createdAt,
                    userId: post.userId,
                    user: post.user,
                    event: post.event,
                    venue: post.venue,
                    isPublic: post.isPublic,
                    likesCount: post._count?.likes || 0,
                    isLikedByUser: Array.isArray(post.likes)
                      ? post.likes.some((like) => like.id === userId)
                      : false,
                    commentsCount: post._count?.comments || 0,
                  }}
                  currentUserId={userId}
                  onPostDeleted={handlePostDeleted}
                  hideVenueBadge={true} // Hide venue badge in venue feed
                />
              )}
            </div>
          ))}

          {/* Infinite scroll trigger */}
          {pagination.hasMore && (
            <div ref={observerTarget} className="py-8 text-center">
              {loadingMore && (
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
