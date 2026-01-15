import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { useTranslations } from "next-intl";

interface EventCommunityProps {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  posts: Array<{
    id: string;
    content: string;
    imageUrl: string | null;
    userId: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    likesCount: number;
    isLikedByUser: boolean;
    commentsCount: number;
  }>;
  currentUserId: string | undefined;
  isAdmin: boolean;
}

export function EventCommunity({
  eventId,
  eventTitle,
  eventSlug,
  posts,
  currentUserId,
  isAdmin,
}: EventCommunityProps) {
  const t = useTranslations("events");

  return (
    <div className="mt-12 border-t pt-12">
      <h2 className="mb-6 text-2xl font-bold">{t("community")}</h2>
      <div className="space-y-4">
        <CreatePost eventId={eventId} />
        {posts.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {t("noPosts")}
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                event: {
                  title: eventTitle,
                  slug: eventSlug,
                },
              }}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
}
