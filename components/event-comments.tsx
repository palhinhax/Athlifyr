"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CommentItem } from "./comment-item";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
  replies: Comment[];
}

interface EventCommentsProps {
  eventId: string;
  initialComments: Comment[];
}

export function EventComments({
  eventId,
  initialComments,
}: EventCommentsProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const data = await response.json();

      setComments([data.comment, ...comments]);
      setNewComment("");

      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string, replyContent: string) => {
    // Update the comments state to include the new reply
    setComments((prevComments) => {
      const updateComments = (commentsList: Comment[]): Comment[] => {
        return commentsList.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [
                {
                  id: `temp-${Date.now()}`,
                  content: replyContent,
                  createdAt: new Date().toISOString(),
                  user: {
                    name: session?.user?.name || null,
                    image: session?.user?.image || null,
                  },
                  replies: [],
                },
                ...comment.replies,
              ],
            };
          }
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateComments(comment.replies),
            };
          }
          return comment;
        });
      };
      return updateComments(prevComments);
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">
          Discussion ({comments.length}{" "}
          {comments.length === 1 ? "comment" : "comments"})
        </h2>
      </div>

      {/* Comment Form */}
      {status === "loading" ? (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Spinner />
        </div>
      ) : status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this event..."
                className="min-h-[100px] w-full rounded-lg border bg-background p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            You need to be signed in to join the discussion
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 p-12 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No comments yet</p>
            <p className="text-muted-foreground">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              eventId={eventId}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
