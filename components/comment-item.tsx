"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

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

interface CommentItemProps {
  comment: Comment;
  eventId: string;
  onReply: (parentId: string, content: string) => void;
  depth?: number;
}

export function CommentItem({
  comment,
  eventId,
  onReply,
  depth = 0,
}: CommentItemProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
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
          content: replyContent,
          parentId: comment.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);

      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 pl-4" : ""}>
      <div className="rounded-lg border bg-card p-4">
        {/* Comment Header */}
        <div className="mb-3 flex items-center gap-3">
          {comment.user.image ? (
            <Image
              src={comment.user.image}
              alt={comment.user.name || "User"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {comment.user.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div className="font-medium">
              {comment.user.name || "Anonymous"}
            </div>
            <div className="text-xs text-muted-foreground">{timeAgo}</div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="mb-4 whitespace-pre-wrap text-sm">{comment.content}</p>

        {/* Comment Actions */}
        {session && depth < 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageCircle className="mr-2 h-3 w-3" />
            Reply
          </Button>
        )}

        {/* Reply Form */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-4 space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="min-h-[80px] w-full rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-3 w-3" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-3 w-3" />
                    Reply
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              eventId={eventId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
