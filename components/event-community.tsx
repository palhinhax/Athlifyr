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
    <section className="py-20 sm:py-24">
      <div className="mb-8 flex items-center justify-between sm:mb-12">
        <h2 className="font-headline text-4xl font-black tracking-tight sm:text-5xl">
          {t("community")}
        </h2>
      </div>

      {/* Create Post Box */}
      <div className="mb-8 rounded-[32px] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:mb-12">
        <CreatePost eventId={eventId} />
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("noPosts")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  event: {
                    id: eventId,
                    title: eventTitle,
                    slug: eventSlug,
                  },
                }}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
              />
            ))}
          </div>
          {posts.length >= 20 && (
            <div className="mt-16 text-center">
              <button className="font-headline text-lg font-extrabold text-primary transition-all hover:underline">
                {t("viewMoreComments")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
