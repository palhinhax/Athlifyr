"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface StoryUser {
  id: string;
  name: string | null;
  image: string | null;
  hasUnseenStory?: boolean;
}

interface FeedStoriesProps {
  readonly currentUser?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  readonly storyUsers?: StoryUser[];
}

export function FeedStories({
  currentUser,
  storyUsers = [],
}: FeedStoriesProps) {
  const t = useTranslations("feed.stories");

  return (
    <section className="relative">
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {/* My Story */}
        {currentUser && (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-primary bg-card p-0.5">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {t("myStory")}
            </span>
          </div>
        )}

        {/* Story Users */}
        {storyUsers.map((user) => (
          <Link
            key={user.id}
            href={`/user/${user.id}`}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <div
              className={`h-16 w-16 rounded-full border-2 bg-card p-0.5 ${
                user.hasUnseenStory ? "border-primary" : "border-muted"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
            <span className="max-w-[64px] truncate text-[10px] font-medium">
              {user.name?.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
