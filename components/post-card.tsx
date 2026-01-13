"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Heart, Trash2, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string | Date;
    userId: string;
    user: {
      name: string | null;
      image: string | null;
    };
    event?: {
      title: string;
      slug: string;
    } | null;
    likesCount: number;
    isLikedByUser: boolean;
  };
  currentUserId?: string;
  isAdmin?: boolean;
}

export function PostCard({ post, currentUserId, isAdmin }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createdAt =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt)
      : post.createdAt;

  const canDelete = currentUserId === post.userId || isAdmin;

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        // Revert on error
        setIsLiked(isLiked);
        setLikesCount(likesCount);
      } else {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
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
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            {post.user.image ? (
              <Image
                src={post.user.image}
                alt={post.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                {post.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{post.user.name}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="whitespace-nowrap">
                {formatDistanceToNow(createdAt, {
                  addSuffix: true,
                  locale: pt,
                })}
              </span>
              {post.event && (
                <>
                  <span>•</span>
                  <Link
                    href={`/events/${post.event.slug}`}
                    className="truncate hover:text-primary hover:underline"
                  >
                    {post.event.title}
                  </Link>
                </>
              )}
            </div>
          </div>
          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        <div className="px-4 pb-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

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
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>
        </div>
      </Card>

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
