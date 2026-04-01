"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useLocale } from "next-intl";
import {
  Heart,
  Trash2,
  MoreHorizontal,
  MessageCircle,
  Send,
  ImageOff,
  Pencil,
  Save,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FeaturedEventCard } from "@/components/featured-event-card";
import type { SportType, EventVariant } from "@prisma/client";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

// Extended event data for shared events
interface SharedEventData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  city?: string;
  country?: string;
  imageUrl?: string | null;
  isFeatured?: boolean;
  sportTypes?: SportType[];
  variants?: Pick<EventVariant, "id" | "name" | "distanceKm">[];
}

interface PostCardProps {
  readonly post: {
    id: string;
    content: string;
    imageUrl?: string | null;
    mediaUrls?: string[];
    mediaType?: string | null;
    createdAt: string | Date;
    userId: string;
    user: {
      name: string | null;
      image: string | null;
    };
    event?: SharedEventData | null;
    venue?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    isPublic?: boolean;
    likesCount: number;
    isLikedByUser: boolean;
    commentsCount?: number;
  };
  readonly currentUserId?: string;
  readonly isAdmin?: boolean;
  readonly onPostDeleted?: (postId: string) => void;
  readonly hideVenueBadge?: boolean; // Hide venue badge when inside venue feed
}

function PostImage({
  imageUrl,
  imageError,
  onImageError,
}: {
  readonly imageUrl: string;
  readonly imageError: boolean;
  readonly onImageError: () => void;
}) {
  if (imageError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
        <ImageOff className="h-12 w-12" />
        <p className="text-sm">Imagem não disponível</p>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt=""
      width={800}
      height={800}
      className="h-auto max-h-[850px] w-full object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={onImageError}
    />
  );
}

function CommentsList({
  comments,
  currentUserId,
  isAdmin,
  onDeleteComment,
  locale,
}: {
  readonly comments: Comment[];
  readonly currentUserId?: string;
  readonly isAdmin?: boolean;
  readonly onDeleteComment: (commentId: string) => void;
  readonly locale: string;
}) {
  const dateLocale = dateLocaleMap[locale] || enUS;
  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Ainda não há comentários. Sê o primeiro a comentar!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            {comment.user.image ? (
              <Image
                src={comment.user.image}
                alt={comment.user.name || "User"}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                {comment.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded-lg bg-muted px-3 py-2">
              <p className="text-sm font-semibold">{comment.user.name}</p>
              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </span>
              {(currentUserId === comment.user.id || isAdmin) && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-destructive hover:underline"
                >
                  Apagar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const dateLocaleMap: Record<string, typeof enUS> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

export function PostCard({
  post,
  currentUserId,
  isAdmin,
  onPostDeleted,
  hideVenueBadge: _hideVenueBadge = false, // Default to showing badge
}: PostCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const dateLocale = dateLocaleMap[locale] || enUS;
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Build carousel image list
  const carouselImages =
    (post.mediaUrls?.length ?? 0) >= 2
      ? post.mediaUrls!
      : post.imageUrl
        ? [post.imageUrl]
        : [];
  const hasCarousel = carouselImages.length > 1;

  const createdAt =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt)
      : post.createdAt;

  const canDelete = currentUserId === post.userId || isAdmin;

  const handleLike = async () => {
    if (!currentUserId) {
      router.push("/auth/signin");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Store previous values for reverting on error
    const prevIsLiked = isLiked;
    const prevLikesCount = likesCount;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      } else {
        // Revert on error
        setIsLiked(prevIsLiked);
        setLikesCount(prevLikesCount);
      }
    } catch {
      // Revert on error
      setIsLiked(prevIsLiked);
      setLikesCount(prevLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteDialog(false);
        // Notify parent component to remove post from list
        if (onPostDeleted) {
          onPostDeleted(post.id);
        } else {
          // Fallback to refresh if no callback provided
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const loadComments = async () => {
    if (isLoadingComments) return;

    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        // API returns comments array directly
        const commentsList = Array.isArray(data) ? data : [];
        setComments(commentsList);
        setCommentsCount(commentsList.length);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      // Set empty array on error
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!currentUserId) {
      router.push("/auth/signin");
      return;
    }
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (response.ok) {
        const comment = await response.json();
        // Validate that comment has required structure
        if (comment?.user) {
          setComments((prev) => {
            // Ensure prev is always an array
            const currentComments = Array.isArray(prev) ? prev : [];
            return [...currentComments, comment];
          });
          setCommentsCount((prev) => prev + 1);
          setNewComment("");
        } else {
          console.error("Invalid comment structure:", comment);
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments((prev) => {
          // Ensure prev is always an array
          const currentComments = Array.isArray(prev) ? prev : [];
          return currentComments.filter((c) => c.id !== commentId);
        });
        setCommentsCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim() || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (response.ok) {
        post.content = editContent.trim();
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  return (
    <>
      <div className="overflow-hidden rounded-[32px] bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        {/* Media (Image, Video or Carousel) — top of card if present */}
        {post.imageUrl && (
          <div className="p-4 pb-0">
            <div
              className={`relative w-full overflow-hidden rounded-[24px] ${
                post.mediaType === "video"
                  ? "flex items-center justify-center bg-black"
                  : "bg-gradient-to-br from-muted/50 to-muted"
              }`}
            >
              {post.mediaType === "video" ? (
                <video
                  src={post.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="aspect-[3/4] w-full cursor-pointer object-cover"
                  preload="auto"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.paused) {
                      video.play();
                    } else {
                      video.pause();
                    }
                  }}
                />
              ) : hasCarousel ? (
                <div className="relative">
                  <PostImage
                    imageUrl={carouselImages[carouselIdx]}
                    imageError={imageError}
                    onImageError={() => {
                      console.error(
                        "Failed to load image:",
                        carouselImages[carouselIdx]
                      );
                      setImageError(true);
                    }}
                  />
                  <button
                    onClick={() =>
                      setCarouselIdx((i) =>
                        i === 0 ? carouselImages.length - 1 : i - 1
                      )
                    }
                    aria-label="Imagem anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() =>
                      setCarouselIdx((i) =>
                        i === carouselImages.length - 1 ? 0 : i + 1
                      )
                    }
                    aria-label="Próxima imagem"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {carouselImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIdx(idx)}
                        aria-label={`Imagem ${idx + 1} de ${carouselImages.length}`}
                        aria-current={idx === carouselIdx ? "true" : undefined}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          idx === carouselIdx ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <PostImage
                  imageUrl={post.imageUrl}
                  imageError={imageError}
                  onImageError={() => {
                    console.error("Failed to load image:", post.imageUrl);
                    setImageError(true);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className={post.imageUrl ? "px-8 pb-8 pt-4" : "p-8"}>
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Link
              href={`/user/${post.userId}`}
              className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted"
            >
              {post.user.image ? (
                <Image
                  src={post.user.image}
                  alt={post.user.name || "User"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                  {post.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/user/${post.userId}`}
                className="block font-headline font-bold hover:underline"
              >
                {post.user.name}
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {formatDistanceToNow(createdAt, {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </p>
            </div>
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11"
                    aria-label="Opções da publicação"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUserId === post.userId && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar publicação
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Apagar publicação
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  aria-label="Editar publicação"
                  className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleUpdatePost}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm min-w-0 max-w-none leading-relaxed text-muted-foreground [overflow-wrap:anywhere] dark:prose-invert prose-headings:mb-1 prose-headings:mt-2 prose-p:my-1 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:overflow-x-auto prose-ol:my-1 prose-ul:my-1 prose-li:my-0 prose-img:hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Shared Event Card */}
          {post.event?.city && post.event?.sportTypes && (
            <div className="mb-6">
              <FeaturedEventCard
                event={{
                  id: post.event.id,
                  title: post.event.title,
                  slug: post.event.slug,
                  description: post.event.description,
                  startDate: post.event.startDate || new Date(),
                  endDate: post.event.endDate,
                  city: post.event.city,
                  country: post.event.country || "",
                  imageUrl: post.event.imageUrl,
                  isFeatured: post.event.isFeatured,
                  sportTypes: post.event.sportTypes,
                  variants: post.event.variants,
                }}
                showDescription={false}
                showStats={false}
                showVariants={true}
                showFriendsGoing={false}
                linkToEvent={true}
                className="border-none shadow-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 text-muted-foreground">
            <button
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              aria-label={
                isLiked
                  ? `Retirar gosto (${likesCount})`
                  : `Dar gosto (${likesCount})`
              }
              aria-pressed={isLiked}
              className={`flex items-center gap-2 transition-colors ${
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              } ${currentUserId ? "" : "cursor-not-allowed opacity-50"}`}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                aria-hidden="true"
              />
              <span className="text-sm font-bold" aria-hidden="true">
                {likesCount}
              </span>
            </button>
            <button
              onClick={handleToggleComments}
              aria-label={`${showComments ? "Ocultar" : "Ver"} comentários (${commentsCount})`}
              aria-expanded={showComments}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-bold" aria-hidden="true">
                {commentsCount}
              </span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 border-t border-surface-container-high pt-4">
              {currentUserId && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitComment();
                  }}
                  className="mb-3 flex gap-2"
                >
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreve um comentário..."
                    className="flex-1"
                    disabled={isSubmittingComment}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    aria-label="Enviar comentário"
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              )}
              {isLoadingComments ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  A carregar comentários...
                </div>
              ) : (
                <CommentsList
                  comments={comments}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onDeleteComment={handleDeleteComment}
                  locale={locale}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apagar publicação</DialogTitle>
            <DialogDescription>
              Tens a certeza que queres apagar esta publicação? Esta ação não
              pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "A apagar..." : "Apagar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
