import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

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
  likes: Array<{ userId: string }> | undefined;
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
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: "15",
    feed: "true",
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token if available (for personalised feed)
  const token = await SecureStore.getItemAsync("auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/posts?${params}`, { headers });
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json() as Promise<PostsResponse>;
}

export function useFeedPosts() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: () => fetchPosts(1),
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
