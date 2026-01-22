"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "@/components/create-post";
import { Loader2, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Post, User, Event, Venue } from "@prisma/client";

type PostWithDetails = Post & {
  user: Pick<User, "id" | "name" | "image">;
  event: Pick<Event, "title" | "slug"> | null;
  venue: Pick<Venue, "id" | "name" | "slug"> | null;
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
  userId?: string;
  userName?: string | null;
  userImage?: string | null;
  isMember: boolean;
}

export function VenueFeed({
  venueId,
  userId,
  userName,
  userImage,
  isMember,
}: VenueFeedProps) {
  const t = useTranslations("feed");
  const tVenue = useTranslations("venues.posts");
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
    <div className="space-y-6">
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
              <PostCard
                post={{
                  id: post.id,
                  content: post.content,
                  imageUrl: post.imageUrl,
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
