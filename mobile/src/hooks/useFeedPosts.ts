import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

export interface FeedPost {
  id: string;
  content: string;
  imageUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  event: {
    id: string;
    title: string;
    slug: string;
  } | null;
  venue: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    likes: number;
    comments: number;
  };
  likes: Array<{ id: string }> | undefined;
}

interface PostsResponse {
  posts: FeedPost[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

async function fetchPosts(page: number): Promise<PostsResponse> {
  const response = await api.get<PostsResponse>("/posts", {
    params: { page, pageSize: 15, feed: "true" },
  });
  return response.data;
}

export function useFeedPosts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: () => fetchPosts(1),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  return {
    posts: data?.posts ?? [],
    pagination: data?.pagination,
    isLoading,
    refetch,
  };
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data as { liked: boolean; likesCount: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
}
