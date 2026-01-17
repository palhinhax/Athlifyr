"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "@/components/create-post";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Post, User, Event } from "@prisma/client";

type PostWithDetails = Post & {
  user: Pick<User, "id" | "name" | "image">;
  event: Pick<Event, "title" | "slug"> | null;
  _count: {
    likes: number;
    comments: number;
  };
  likes: Array<{ id: string }>;
};

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface FeedPageClientProps {
  userId: string;
  userName: string | null;
  userImage: string | null;
  initialPosts: PostWithDetails[];
}

export function FeedPageClient({
  userId,
  userName,
  userImage,
  initialPosts,
}: FeedPageClientProps) {
  const t = useTranslations("feed");
  const [posts, setPosts] = useState<PostWithDetails[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalCount: initialPosts.length,
    totalPages: 1,
    hasMore: initialPosts.length >= 10,
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
    []
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.hasMore &&
          !loading &&
          !loadingMore
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
  }, [pagination, loading, loadingMore, fetchPosts]);

  const handlePostCreated = () => {
    // Refresh posts from beginning
    fetchPosts(1, false);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <CreatePost
        userName={userName}
        userImage={userImage}
        onPostCreated={handlePostCreated}
      />

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">{t("emptyTitle")}</p>
            <p className="mt-2">{t("emptyDescription")}</p>
          </div>
        ) : (
          <>
            {posts.map((post) => {
              const postForCard = {
                ...post,
                likesCount: post._count.likes,
                isLikedByUser: post.likes.length > 0,
                commentsCount: post._count.comments,
              };

              return (
                <PostCard
                  key={post.id}
                  post={postForCard}
                  currentUserId={userId}
                />
              );
            })}

            {/* Infinite scroll trigger */}
            {pagination.hasMore && (
              <div
                ref={observerTarget}
                className="flex items-center justify-center py-8"
              >
                {loadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t("loadingMore")}</span>
                  </div>
                )}
              </div>
            )}

            {/* End of results message */}
            {!pagination.hasMore && posts.length > 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t("allPostsLoaded")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
