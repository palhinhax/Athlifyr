import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import {
  MessageSquare,
  Heart,
  Newspaper,
  Dumbbell,
  Clock,
  MapPin,
  Calendar,
  Volume2,
  VolumeOff,
  Send,
  Trash2,
  User,
} from "lucide-react-native";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { CachedImage, CachedAvatar } from "@/src/components/CachedImage";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import Markdown from "react-native-markdown-display";
import { handleMarkdownLinkPress } from "@/src/lib/markdown-link-handler";
import { theme } from "@/src/constants/theme";

// --- Types matching API response ---

interface PostUser {
  id: string;
  name: string;
  image: string | null;
}

interface PostEvent {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  startDate?: string;
  endDate?: string | null;
  city?: string;
  country?: string;
  imageUrl?: string | null;
  sportTypes?: string[];
  variants?: Array<{ id: string; name: string; distanceKm: number | null }>;
}

interface WorkoutExercise {
  id: string;
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightFemale?: number | null;
  prescribedDistance: number | null;
  prescribedTime: number | null;
  notes: string | null;
  exercise: { id: string; name: string };
}

interface WorkoutBlock {
  id: string;
  type: string;
  name: string | null;
  timeCap: number | null;
  rounds: number | null;
  workTime: number | null;
  notes: string | null;
  exercises: WorkoutExercise[];
}

interface PostWorkout {
  id: string;
  name: string;
  description: string | null;
  estimatedTime: number | null;
  difficulty: number | null;
  blocks: WorkoutBlock[];
}

interface FeedPost {
  id: string;
  content: string;
  imageUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  isPublic?: boolean;
  user?: PostUser;
  event?: PostEvent | null;
  workout?: PostWorkout | null;
  _count: {
    likes: number;
    comments: number;
  };
  likes?: Array<{ id: string }>;
}

interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VenueFeedTabProps {
  venueId: string;
}

// --- Helpers ---

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatExercise(ex: WorkoutExercise): string {
  const parts: string[] = [];
  if (ex.prescribedReps) parts.push(ex.prescribedReps.toString());
  parts.push(ex.exercise.name);
  if (ex.prescribedWeight) {
    if (
      ex.prescribedWeightFemale &&
      ex.prescribedWeightFemale !== ex.prescribedWeight
    ) {
      parts.push(`(${ex.prescribedWeight}/${ex.prescribedWeightFemale}kg)`);
    } else {
      parts.push(`(${ex.prescribedWeight}kg)`);
    }
  }
  if (ex.prescribedDistance) parts.push(`(${ex.prescribedDistance}m)`);
  if (ex.prescribedTime) {
    const mins = Math.floor(ex.prescribedTime / 60);
    const secs = ex.prescribedTime % 60;
    parts.push(
      mins > 0 ? `(${mins}:${secs.toString().padStart(2, "0")})` : `(${secs}s)`
    );
  }
  return parts.join(" ");
}

function formatBlockHeader(block: WorkoutBlock): string {
  const label = block.type.replace(/_/g, " ");
  if (block.type === "AMRAP" && block.timeCap)
    return `AMRAP ${Math.floor(block.timeCap / 60)} min`;
  if (block.type === "FOR_TIME" && block.rounds)
    return `${block.rounds} Rounds For Time`;
  if (block.type === "EMOM" && block.timeCap)
    return `EMOM ${Math.floor(block.timeCap / 60)} min`;
  if (block.type === "STRENGTH" && block.name) return block.name;
  if (block.rounds) return `${block.rounds} Rounds`;
  return label;
}

const BLOCK_TYPE_COLORS: Record<string, string> = {
  WARMUP: "#f59e0b",
  STRENGTH: "#10b981",
  AMRAP: "#f97316",
  EMOM: "#8b5cf6",
  FOR_TIME: "#3b82f6",
  TABATA: "#ef4444",
  CHIPPER: "#6366f1",
  REST: "#6b7280",
  COOLDOWN: "#06b6d4",
  SKILL: "#eab308",
};

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// --- Sub-components ---

function PostHeader({
  user,
  createdAt,
}: {
  user: PostUser;
  createdAt: string;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.postHeader}
      onPress={() => router.push(`/user/${user.id}`)}
      activeOpacity={0.7}
    >
      {user.image ? (
        <CachedAvatar
          uri={user.image}
          style={styles.authorAvatar}
          alt={user.name || "Author"}
          size={36}
        />
      ) : (
        <View style={styles.authorAvatarPlaceholder}>
          <Text style={styles.authorInitial}>
            {user.name?.[0]?.toUpperCase() || "?"}
          </Text>
        </View>
      )}
      <View style={styles.authorInfo}>
        <Text style={styles.authorName}>{user.name}</Text>
        <Text style={styles.postTime}>{timeAgo(createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PostMedia({
  imageUrl,
  mediaType,
}: {
  imageUrl: string;
  mediaType: string | null;
}) {
  const player = useVideoPlayer(
    mediaType === "video" ? imageUrl : null,
    (p) => {
      p.loop = true;
      p.muted = true;
      p.play();
    }
  );
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoPress = useCallback(() => {
    if (!player) return;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const handleMuteToggle = useCallback(() => {
    if (!player) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    player.muted = newMuted;
  }, [player, isMuted]);

  if (mediaType === "video" && player) {
    return (
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        <VideoView
          player={player}
          style={styles.videoPlayer}
          contentFit="cover"
          nativeControls={false}
        />
        <TouchableOpacity
          style={styles.muteButton}
          onPress={handleMuteToggle}
          activeOpacity={0.7}
        >
          {isMuted ? (
            <VolumeOff size={16} color="#fff" />
          ) : (
            <Volume2 size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  return (
    <CachedImage
      uri={imageUrl}
      style={styles.postImage}
      contentFit="cover"
      alt="Post image"
    />
  );
}

function EventCard({ event }: { event: PostEvent }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/events/${event.slug}`)}
      activeOpacity={0.7}
    >
      {event.imageUrl && (
        <CachedImage
          uri={event.imageUrl}
          style={styles.eventImage}
          contentFit="cover"
          alt={event.title}
        />
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>
        {event.startDate && (
          <View style={styles.eventMeta}>
            <Calendar size={13} color={theme.colors.textSecondary} />
            <Text style={styles.eventMetaText}>
              {formatEventDate(event.startDate)}
            </Text>
          </View>
        )}
        {event.city && (
          <View style={styles.eventMeta}>
            <MapPin size={13} color={theme.colors.textSecondary} />
            <Text style={styles.eventMetaText}>
              {event.city}
              {event.country ? `, ${event.country}` : ""}
            </Text>
          </View>
        )}
        {event.variants && event.variants.length > 0 && (
          <View style={styles.variantChips}>
            {event.variants.map((v) => (
              <View key={v.id} style={styles.variantChip}>
                <Text style={styles.variantChipText}>
                  {v.distanceKm ? `${v.distanceKm} km` : v.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function WorkoutCard({ workout }: { workout: PostWorkout }) {
  return (
    <View style={styles.workoutCard}>
      {/* Workout header */}
      <View style={styles.workoutHeader}>
        <View style={styles.workoutIcon}>
          <Dumbbell size={16} color="#fff" />
        </View>
        <View style={styles.workoutHeaderText}>
          <Text style={styles.workoutName} numberOfLines={1}>
            {workout.name}
          </Text>
          {workout.estimatedTime ? (
            <Text style={styles.workoutTime}>~{workout.estimatedTime} min</Text>
          ) : null}
        </View>
      </View>

      {/* Blocks */}
      {workout.blocks.map((block) => {
        const color =
          BLOCK_TYPE_COLORS[block.type] || theme.colors.textSecondary;
        return (
          <View
            key={block.id}
            style={[styles.workoutBlock, { borderLeftColor: color }]}
          >
            <View style={styles.blockHeader}>
              <Clock size={13} color={color} />
              <Text style={[styles.blockHeaderText, { color }]}>
                {formatBlockHeader(block)}
              </Text>
            </View>
            {block.exercises.map((ex) => (
              <Text key={ex.id} style={styles.exerciseText}>
                {formatExercise(ex)}
              </Text>
            ))}
            {block.notes ? (
              <Text style={styles.blockNotes}>{block.notes}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function PostActions({
  post,
  onCountsChange,
}: {
  post: FeedPost;
  onCountsChange?: (likes: number, comments: number) => void;
}) {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.user);

  // Modal states
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Like state
  const isLikedByUser = currentUser ? (post.likes ?? []).length > 0 : false;
  const [optimisticLiked, setOptimisticLiked] = useState(isLikedByUser);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(
    post._count.likes
  );

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    console.log(
      "[VenueFeed] handleLike called, currentUser:",
      currentUser?.id ?? "null"
    );
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    // Optimistic update
    const wasLiked = optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticLikeCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      const response = await api.post<{ liked: boolean; likesCount: number }>(
        `/posts/${post.id}/like`
      );
      setOptimisticLiked(response.data.liked);
      setOptimisticLikeCount(response.data.likesCount);
      onCountsChange?.(response.data.likesCount, commentsCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on failure
      setOptimisticLiked(wasLiked);
      setOptimisticLikeCount(post._count.likes);
    }
  };

  const loadComments = useCallback(async () => {
    if (isLoadingComments) return;
    setIsLoadingComments(true);
    try {
      const response = await api.get<PostComment[]>(
        `/posts/${post.id}/comments`
      );
      const list = Array.isArray(response.data) ? response.data : [];
      setComments(list);
      setCommentsCount(list.length);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [post.id, isLoadingComments]);

  const handleToggleComments = () => {
    console.log(
      "[VenueFeed] handleToggleComments called, showComments:",
      showComments
    );
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!currentUser || !newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post<PostComment>(
        `/posts/${post.id}/comments`,
        { content: newComment.trim() }
      );
      if (response.data?.user) {
        setComments((prev) => [...prev, response.data]);
        setCommentsCount((c) => c + 1);
        setNewComment("");
        onCountsChange?.(optimisticLikeCount, commentsCount + 1);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await api.delete(
        `/posts/${post.id}/comments?commentId=${commentToDelete}`
      );
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      setCommentsCount((c) => c - 1);
      onCountsChange?.(optimisticLikeCount, commentsCount - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setCommentToDelete(null);
    }
  };

  return (
    <View>
      {/* Actions bar */}
      <View style={styles.postStats}>
        <TouchableOpacity
          style={styles.statRow}
          onPress={handleLike}
          activeOpacity={0.6}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={18}
            color={
              optimisticLiked ? theme.colors.error : theme.colors.textSecondary
            }
            fill={optimisticLiked ? theme.colors.error : "none"}
          />
          {optimisticLikeCount > 0 && (
            <Text
              style={[styles.statText, optimisticLiked && styles.statTextLiked]}
            >
              {optimisticLikeCount}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statRow}
          onPress={handleToggleComments}
          activeOpacity={0.6}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MessageSquare
            size={18}
            color={
              showComments ? theme.colors.info : theme.colors.textSecondary
            }
          />
          {commentsCount > 0 && (
            <Text
              style={[styles.statText, showComments && styles.statTextActive]}
            >
              {commentsCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Comments section */}
      {showComments && (
        <View style={styles.commentsSection}>
          {/* Comment input */}
          {currentUser && (
            <View style={styles.commentInputRow}>
              {currentUser.image ? (
                <CachedAvatar
                  uri={currentUser.image}
                  style={styles.commentAvatar}
                  alt={currentUser.name ?? ""}
                  size={28}
                />
              ) : (
                <View style={styles.commentAvatarPlaceholder}>
                  <User size={12} color={theme.colors.white} />
                </View>
              )}
              <TextInput
                style={styles.commentInput}
                placeholder={t("feed.writeComment")}
                placeholderTextColor={theme.colors.textTertiary}
                value={newComment}
                onChangeText={setNewComment}
                multiline={false}
                editable={!isSubmitting}
                returnKeyType="send"
                onSubmitEditing={handleSubmitComment}
              />
              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                style={[
                  styles.sendButton,
                  (!newComment.trim() || isSubmitting) &&
                    styles.sendButtonDisabled,
                ]}
                activeOpacity={0.6}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <Send size={14} color={theme.colors.white} />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Comments list */}
          {isLoadingComments ? (
            <View style={styles.commentsLoading}>
              <ActivityIndicator
                size="small"
                color={theme.colors.textTertiary}
              />
              <Text style={styles.commentsLoadingText}>
                {t("feed.loadingComments")}
              </Text>
            </View>
          ) : comments.length === 0 ? (
            <Text style={styles.noCommentsText}>{t("feed.noComments")}</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                {comment.user.image ? (
                  <CachedAvatar
                    uri={comment.user.image}
                    style={styles.commentAvatar}
                    alt={comment.user.name ?? ""}
                    size={28}
                  />
                ) : (
                  <View style={styles.commentAvatarPlaceholder}>
                    <User size={12} color={theme.colors.white} />
                  </View>
                )}
                <View style={styles.commentContent}>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentAuthor}>
                      {comment.user.name}
                    </Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentTime}>
                      {timeAgo(comment.createdAt)}
                    </Text>
                    {currentUser?.id === comment.user.id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteComment(comment.id)}
                        activeOpacity={0.6}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={12} color={theme.colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Login Prompt Modal */}
      <ConfirmModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title={t("feed.loginToInteract")}
        message={t("feed.loginToInteractDescription")}
        actions={[
          {
            label: t("common.close"),
            variant: "outline",
            onPress: () => setShowLoginPrompt(false),
          },
        ]}
      />

      {/* Delete Comment Confirmation Modal */}
      <ConfirmModal
        visible={commentToDelete !== null}
        onClose={() => setCommentToDelete(null)}
        title={t("feed.deleteComment")}
        message={t("feed.deleteCommentConfirm")}
        actions={[
          {
            label: t("common.cancel"),
            variant: "outline",
            onPress: () => setCommentToDelete(null),
          },
          {
            label: t("common.delete"),
            variant: "destructive",
            onPress: confirmDeleteComment,
          },
        ]}
      />
    </View>
  );
}

// --- Main component ---

export function VenueFeedTab({ venueId }: VenueFeedTabProps) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{ posts: FeedPost[] }>(
        `/posts?venueId=${venueId}&pageSize=20`
      );
      setPosts(response.data.posts ?? []);
    } catch (err) {
      console.error("Error fetching venue feed:", err);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Newspaper size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>{t("venueDetail.noFeedPosts")}</Text>
        <Text style={styles.emptyDescription}>
          {t("venueDetail.noFeedPostsDescription")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {posts.map((post) => {
        if (!post.user) return null;

        const hasEvent = post.event && post.event.city && post.event.sportTypes;
        const hasWorkout = post.workout && post.workout.blocks?.length > 0;

        return (
          <View key={post.id} style={styles.postCard}>
            <PostHeader user={post.user} createdAt={post.createdAt} />

            {/* Text content */}
            {post.content ? (
              <Markdown
                style={venueMarkdownStyles}
                onLinkPress={handleMarkdownLinkPress}
              >
                {post.content}
              </Markdown>
            ) : null}

            {/* Media (image or video) */}
            {post.imageUrl && !hasEvent ? (
              <PostMedia imageUrl={post.imageUrl} mediaType={post.mediaType} />
            ) : null}

            {/* WOD / Workout */}
            {hasWorkout ? <WorkoutCard workout={post.workout!} /> : null}

            {/* Shared Event */}
            {hasEvent ? <EventCard event={post.event!} /> : null}

            {/* Like / Comment actions */}
            <PostActions post={post} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // Post card
  postCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },

  // Header
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  authorInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  postTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // Content
  postContent: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  // Media
  postImage: {
    width: "100%",
    height: 250,
  },
  videoContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    position: "relative" as const,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  muteButton: {
    position: "absolute" as const,
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  // Event card
  eventCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  eventImage: {
    width: "100%",
    height: 140,
  },
  eventContent: {
    padding: theme.spacing.sm + 4,
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventMetaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  variantChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  variantChip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  variantChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
  },

  // Workout card
  workoutCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  workoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
  },
  workoutHeaderText: {
    flex: 1,
  },
  workoutName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  workoutTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  workoutBlock: {
    marginHorizontal: theme.spacing.sm + 4,
    marginVertical: theme.spacing.xs + 2,
    paddingLeft: theme.spacing.sm,
    borderLeftWidth: 3,
    gap: 2,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  blockHeaderText: {
    fontSize: 13,
    fontWeight: "700",
  },
  exerciseText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: theme.colors.text,
    lineHeight: 18,
  },
  blockNotes: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },

  // Stats / Actions
  postStats: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 36,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statTextLiked: {
    color: theme.colors.error,
  },
  statTextActive: {
    color: theme.colors.info,
  },

  // Comments
  commentsSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.md,
    fontSize: 13,
    color: theme.colors.text,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  commentsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  commentsLoadingText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  noCommentsText: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    textAlign: "center",
    paddingVertical: theme.spacing.sm,
  },
  commentRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  commentContent: {
    flex: 1,
    gap: 2,
  },
  commentBubble: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs + 2,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  commentText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  commentTime: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
});

const venueMarkdownStyles = {
  body: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 4,
  },
  strong: {
    fontWeight: "700" as const,
  },
  em: {
    fontStyle: "italic" as const,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: "none" as const,
  },
  heading1: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 4,
    marginTop: 8,
    color: theme.colors.text,
  },
  heading2: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
    marginTop: 8,
    color: theme.colors.text,
  },
  heading3: {
    fontSize: 15,
    fontWeight: "700" as const,
    marginBottom: 2,
    marginTop: 6,
    color: theme.colors.text,
  },
  bullet_list: {
    marginVertical: 2,
  },
  ordered_list: {
    marginVertical: 2,
  },
  list_item: {
    marginVertical: 0,
  },
  code_inline: {
    fontFamily: "monospace",
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 8,
    opacity: 0.8,
  },
  image: {
    display: "none" as const,
  },
};
