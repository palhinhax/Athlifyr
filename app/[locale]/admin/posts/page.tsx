"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Heart,
  Calendar,
  Image as ImageIcon,
  Video,
  Globe,
  Lock,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PostUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  user: PostUser;
}

interface PostEvent {
  id: string;
  title: string;
  slug: string;
}

interface PostVenue {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  mediaType: string | null;
  isPublic: boolean;
  postType: string;
  createdAt: string;
  user: PostUser;
  event: PostEvent | null;
  venue: PostVenue | null;
  comments: PostComment[];
  _count: {
    likes: number;
    comments: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

type Locale = typeof pt;

export default function AdminPostsPage() {
  const t = useTranslations("admin.postsManagement");
  const locale = useLocale();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "post" | "comment";
    postId: string;
    commentId?: string;
  }>({ open: false, type: "post", postId: "" });
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
        });
        if (search) params.set("search", search);

        const res = await fetch(`/api/admin/posts?${params}`);
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch {
        toast({
          title: t("toast.error"),
          description: t("toast.fetchErrorDesc"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [search, toast, t]
  );

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleExpanded = (postId: string) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleDeletePost = async () => {
    if (!deleteDialog.postId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${deleteDialog.postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");

      toast({
        title: t("toast.postDeleted"),
        description: t("toast.postDeletedDesc"),
      });
      setDeleteDialog({ open: false, type: "post", postId: "" });
      fetchPosts(pagination.page);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.deleteErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteDialog.postId || !deleteDialog.commentId) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/posts/${deleteDialog.postId}/comments?commentId=${deleteDialog.commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete comment");

      toast({
        title: t("toast.commentDeleted"),
        description: t("toast.commentDeletedDesc"),
      });
      setDeleteDialog({ open: false, type: "post", postId: "" });
      fetchPosts(pagination.page);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.deleteCommentErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: localeMap[locale] || enUS,
    });
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t("stats.total")}</p>
          <p className="text-2xl font-bold">{pagination.total}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} variant="secondary">
          {t("searchButton")}
        </Button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">{t("noPosts")}</p>
          <p className="text-sm text-muted-foreground">
            {t("noPostsDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              expanded={expandedPosts.has(post.id)}
              onToggleExpand={() => toggleExpanded(post.id)}
              onDeletePost={() =>
                setDeleteDialog({
                  open: true,
                  type: "post",
                  postId: post.id,
                })
              }
              onDeleteComment={(commentId: string) =>
                setDeleteDialog({
                  open: true,
                  type: "comment",
                  postId: post.id,
                  commentId,
                })
              }
              formatDate={formatDate}
              getInitials={getInitials}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchPosts(pagination.page - 1)}
          >
            {t("pagination.previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pagination.pageOf", {
              page: pagination.page,
              total: pagination.totalPages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchPosts(pagination.page + 1)}
          >
            {t("pagination.next")}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, type: "post", postId: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteDialog.type === "post"
                ? t("deletePostDialog.title")
                : t("deleteCommentDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {deleteDialog.type === "post"
                ? t("deletePostDialog.description")
                : t("deleteCommentDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, type: "post", postId: "" })
              }
              disabled={deleting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={
                deleteDialog.type === "post"
                  ? handleDeletePost
                  : handleDeleteComment
              }
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("confirmDelete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Post Card Component ─── */

interface PostCardProps {
  post: Post;
  expanded: boolean;
  onToggleExpand: () => void;
  onDeletePost: () => void;
  onDeleteComment: (commentId: string) => void;
  formatDate: (date: string) => string;
  getInitials: (name: string | null) => string;
  t: ReturnType<typeof useTranslations>;
}

function PostCard({
  post,
  expanded,
  onToggleExpand,
  onDeletePost,
  onDeleteComment,
  formatDate,
  getInitials,
  t,
}: PostCardProps) {
  return (
    <div className="rounded-lg border bg-card">
      {/* Post Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.image || undefined} />
            <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium">{post.user.name || t("unknownUser")}</p>
            <p className="text-xs text-muted-foreground">{post.user.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                <Calendar className="mr-1 inline h-3 w-3" />
                {formatDate(post.createdAt)}
              </span>
              {post.isPublic ? (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Globe className="h-3 w-3" />
                  {t("public")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  {t("private")}
                </Badge>
              )}
              {post.postType !== "STANDARD" && (
                <Badge variant="outline" className="text-xs">
                  {post.postType}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={onDeletePost}
          title={t("deletePost")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-wrap text-sm">{post.content}</p>

        {/* Post Image/Video */}
        {post.imageUrl && (
          <div className="mt-3">
            {post.mediaType === "video" ? (
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>{t("videoAttached")}</span>
              </div>
            ) : (
              <div className="relative aspect-video max-w-sm overflow-hidden rounded-md border">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 384px"
                />
              </div>
            )}
          </div>
        )}

        {/* Context: Event / Venue */}
        {(post.event || post.venue) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.event && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {post.event.title}
              </Badge>
            )}
            {post.venue && (
              <Badge variant="outline" className="gap-1">
                <Building2 className="h-3 w-3" />
                {post.venue.name}
              </Badge>
            )}
          </div>
        )}

        {/* Post Stats */}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post._count.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {post._count.comments}
          </span>
          {post.imageUrl && (
            <span className="flex items-center gap-1">
              {post.mediaType === "video" ? (
                <Video className="h-4 w-4" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {post._count.comments > 0 && (
        <div className="border-t">
          <button
            onClick={onToggleExpand}
            className={cn(
              "flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50",
              expanded && "bg-muted/30"
            )}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("comments", { count: post._count.comments })}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expanded && (
            <div className="space-y-3 border-t px-4 py-3">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 rounded-md bg-muted/30 p-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-medium">
                          {comment.user.name || t("unknownUser")}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteComment(comment.id)}
                        title={t("deleteComment")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
