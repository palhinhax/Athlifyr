"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Timer,
  Heart,
  MessageCircle,
  Dumbbell,
  Repeat,
  Clock,
  Zap,
  Flame,
  RefreshCw,
  Coffee,
  Target,
  MoreHorizontal,
  Trash2,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import type { Locale } from "date-fns";
import type { WorkoutBlockType } from "@prisma/client";

// Map locale to date-fns locale
const dateLocales: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

// Block type display info - covers all WorkoutBlockType values
const BLOCK_TYPE_CONFIG: Record<
  WorkoutBlockType,
  { icon: React.ElementType; color: string; gradient: string }
> = {
  WARMUP: {
    icon: Flame,
    color: "text-amber-500",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  STRENGTH: {
    icon: Dumbbell,
    color: "text-green-500",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  AMRAP: {
    icon: Timer,
    color: "text-orange-500",
    gradient: "from-orange-500/10 to-red-500/10",
  },
  EMOM: {
    icon: Repeat,
    color: "text-purple-500",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  FOR_TIME: {
    icon: Clock,
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  TABATA: {
    icon: RefreshCw,
    color: "text-red-500",
    gradient: "from-red-500/10 to-rose-500/10",
  },
  CHIPPER: {
    icon: Target,
    color: "text-indigo-500",
    gradient: "from-indigo-500/10 to-violet-500/10",
  },
  REST: {
    icon: Coffee,
    color: "text-gray-500",
    gradient: "from-gray-500/10 to-slate-500/10",
  },
  COOLDOWN: {
    icon: Coffee,
    color: "text-cyan-500",
    gradient: "from-cyan-500/10 to-teal-500/10",
  },
  SKILL: {
    icon: Zap,
    color: "text-yellow-500",
    gradient: "from-yellow-500/10 to-amber-500/10",
  },
};

// Workout block exercise type
interface WorkoutBlockExercise {
  id: string;
  prescribedReps?: number | null;
  prescribedWeight?: number | null;
  prescribedWeightFemale?: number | null;
  prescribedDistance?: number | null;
  prescribedTime?: number | null;
  notes?: string | null;
  exercise: {
    id: string;
    name: string;
  };
}

// Workout block type
interface WorkoutBlock {
  id: string;
  type: WorkoutBlockType;
  name?: string | null;
  timeCap?: number | null;
  rounds?: number | null;
  workTime?: number | null;
  restTime?: number | null;
  notes?: string | null;
  exercises: WorkoutBlockExercise[];
}

// Workout data type
interface WorkoutData {
  id: string;
  name: string;
  description?: string | null;
  estimatedTime?: number | null;
  difficulty?: number | null;
  blocks: WorkoutBlock[];
}

// Comment type
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

// Post data for WOD posts
interface WodPostData {
  id: string;
  content: string;
  createdAt: string | Date;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
  venue?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  isPublic?: boolean;
  likesCount: number;
  isLikedByUser: boolean;
  commentsCount?: number;
}

// Session data
interface SessionData {
  id: string;
  name: string;
  startsAt: Date | string;
}

export interface WodPostCardProps {
  post: WodPostData;
  workout: WorkoutData;
  session?: SessionData;
  currentUserId?: string;
  isAdmin?: boolean;
  onPostDeleted?: (postId: string) => void;
}

export function WodPostCard({
  post,
  workout,
  session,
  currentUserId,
  isAdmin,
  onPostDeleted,
}: WodPostCardProps) {
  const t = useTranslations("venues.wodPost");
  const tBlocks = useTranslations("workouts.blocks.types");
  const locale = useLocale();
  const dateLocale = dateLocales[locale] || enUS;

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

  const createdAt =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt)
      : post.createdAt;

  const canDelete = currentUserId === post.userId || isAdmin;

  // Format the block header (e.g., "AMRAP 20 min" or "3 Rounds For Time")
  const formatBlockHeader = (block: WorkoutBlock) => {
    const typeLabel = tBlocks(block.type);

    if (block.type === "AMRAP" && block.timeCap) {
      return `${typeLabel} ${Math.floor(block.timeCap / 60)} min`;
    }
    if (block.type === "FOR_TIME" && block.rounds) {
      return `${block.rounds} ${t("rounds")} ${typeLabel}`;
    }
    if (block.type === "EMOM" && block.timeCap) {
      return `${typeLabel} ${Math.floor(block.timeCap / 60)} min`;
    }
    if (block.type === "STRENGTH" && block.name) {
      return block.name;
    }
    if (block.rounds) {
      return `${block.rounds} ${t("rounds")}`;
    }
    return typeLabel;
  };

  // Format exercise prescription
  const formatExercise = (exercise: WorkoutBlockExercise): string => {
    const parts: string[] = [];

    if (exercise.prescribedReps) {
      parts.push(exercise.prescribedReps.toString());
    }

    parts.push(exercise.exercise.name);

    if (exercise.prescribedWeight) {
      const femaleWeight = exercise.prescribedWeightFemale;
      if (femaleWeight && femaleWeight !== exercise.prescribedWeight) {
        parts.push(`(${exercise.prescribedWeight}/${femaleWeight}kg)`);
      } else {
        parts.push(`(${exercise.prescribedWeight}kg)`);
      }
    }

    if (exercise.prescribedDistance) {
      parts.push(`(${exercise.prescribedDistance}m)`);
    }

    if (exercise.prescribedTime) {
      const mins = Math.floor(exercise.prescribedTime / 60);
      const secs = exercise.prescribedTime % 60;
      if (mins > 0) {
        parts.push(`(${mins}:${secs.toString().padStart(2, "0")})`);
      } else {
        parts.push(`(${secs}s)`);
      }
    }

    return parts.join(" ");
  };

  // Get user initials for avatar fallback
  const userInitials =
    post.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Like handler
  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        setIsLiked(isLiked);
        setLikesCount(likesCount);
      } else {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch {
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts?id=${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteDialog(false);
        onPostDeleted?.(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Load comments
  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    setIsLoadingComments(true);

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setCommentsCount((prev) => prev + 1);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header with user info */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <Link href={`/user/${post.userId}`}>
            <Avatar className="h-10 w-10 flex-shrink-0">
              {post.user.image ? (
                <AvatarImage src={post.user.image} alt={post.user.name || ""} />
              ) : (
                <AvatarFallback>{userInitials}</AvatarFallback>
              )}
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/user/${post.userId}`}
              className="truncate font-semibold hover:underline"
            >
              {post.user.name}
            </Link>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="whitespace-nowrap">
                {formatDistanceToNow(createdAt, {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </span>
              {session && (
                <>
                  <span>•</span>
                  <span className="truncate">{session.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions menu */}
          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post content */}
        {post.content && (
          <div className="px-4 pb-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </p>
          </div>
        )}

        {/* Workout card */}
        <div className="mx-4 mb-4 rounded-xl border bg-muted/30">
          {/* Workout header */}
          <div className="flex items-center gap-2 border-b p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{workout.name}</p>
              {workout.estimatedTime && (
                <p className="text-xs text-muted-foreground">
                  ~{workout.estimatedTime} min
                </p>
              )}
            </div>
          </div>

          {/* Workout blocks */}
          <div className="space-y-3 p-3">
            {workout.blocks.map((block) => {
              const config = BLOCK_TYPE_CONFIG[block.type];
              const Icon = config.icon;

              return (
                <div
                  key={block.id}
                  className={`rounded-lg bg-gradient-to-br ${config.gradient} p-3`}
                >
                  {/* Block header */}
                  <div className="mb-2 flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${config.color}`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold">
                      {formatBlockHeader(block)}
                    </span>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-1 font-mono text-xs">
                    {block.exercises.map((exercise) => (
                      <p key={exercise.id}>{formatExercise(exercise)}</p>
                    ))}
                  </div>

                  {/* Block notes */}
                  {block.notes && (
                    <div className="border-current/10 mt-2 border-t pt-2">
                      {block.notes.split("\n").map((note, i) => (
                        <p
                          key={i}
                          className="text-[10px] text-muted-foreground"
                        >
                          {note.startsWith("Rx:") ||
                          note.startsWith("Scale:") ||
                          note.startsWith("RX:") ? (
                            <>
                              <strong>
                                {note.split(":")[0].trim().toUpperCase()}:
                              </strong>{" "}
                              {note.split(":").slice(1).join(":").trim()}
                            </>
                          ) : (
                            note
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 border-t px-4 py-3">
          <button
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked
                ? "text-red-500"
                : "text-muted-foreground hover:text-red-500"
            } ${!currentUserId ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
              aria-hidden="true"
            />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={loadComments}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-p-info"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="border-t px-4 py-3">
            {isLoadingComments ? (
              <p className="text-center text-sm text-muted-foreground">
                {t("loadingComments")}
              </p>
            ) : (
              <>
                {/* Existing comments */}
                {comments.length > 0 && (
                  <div className="mb-3 space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          {comment.user.image ? (
                            <AvatarImage
                              src={comment.user.image}
                              alt={comment.user.name || ""}
                            />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {comment.user.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 rounded-lg bg-muted px-3 py-2">
                          <p className="text-xs font-semibold">
                            {comment.user.name}
                          </p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New comment form */}
                {currentUserId && (
                  <form
                    onSubmit={handleSubmitComment}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t("writeComment")}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newComment.trim() || isSubmittingComment}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
