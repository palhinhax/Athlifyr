"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Card } from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string | Date;
    user: {
      name: string | null;
      image: string | null;
    };
    event?: {
      title: string;
      slug: string;
    } | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  const createdAt =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt)
      : post.createdAt;

  return (
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
        <div className="flex-1">
          <p className="font-semibold">{post.user.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
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
                  className="hover:text-primary hover:underline"
                >
                  {post.event.title}
                </Link>
              </>
            )}
          </div>
        </div>
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
    </Card>
  );
}
