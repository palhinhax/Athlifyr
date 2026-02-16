import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  Heart,
  MessageCircle,
  User,
  Send,
  Trash2,
  Volume2,
  VolumeOff,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import { useToggleLike, type FeedPost } from "@/src/hooks/useFeedPosts";
import { CachedImage, CachedAvatar } from "@/src/components/CachedImage";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "@/src/constants/theme";

// ─── Time Ago ──────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

// ─── Avatar ────────────────────────────────────────────────────

function PostAvatar({
  image,
  name,
}: {
  image: string | null;
  name: string | null;
}) {
  if (image) {
    return (
      <CachedAvatar
        uri={image}
        style={styles.avatar}
        alt={name ?? ""}
        size={40}
      />
    );
  }

  const initial = name?.[0]?.toUpperCase() ?? "U";

  return (
    <View style={styles.avatarPlaceholder}>
      {initial === "U" ? (
        <User size={16} color={colors.white} />
      ) : (
        <Text style={styles.avatarText}>{initial}</Text>
      )}
    </View>
  );
}

// ─── Types ─────────────────────────────────────────────────────

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

// ─── Mini Avatar (for comments) ────────────────────────────────

function MiniAvatar({
  image,
  name,
  size = 32,
}: {
  image: string | null;
  name: string | null;
  size?: number;
}) {
  if (image) {
    return (
      <CachedAvatar
        uri={image}
        style={styles.commentAvatar}
        alt={name ?? ""}
        size={size}
      />
    );
  }

  const initial = name?.[0]?.toUpperCase() ?? "U";

  return (
    <View
      style={[
        styles.commentAvatarPlaceholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {initial === "U" ? (
        <User size={12} color={colors.white} />
      ) : (
        <Text style={styles.commentAvatarText}>{initial}</Text>
      )}
    </View>
  );
}

// ─── Post Card ─────────────────────────────────────────────────

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const toggleLike = useToggleLike();

  const likesArray = Array.isArray(post.likes) ? post.likes : [];
  const isLikedByUser = user
    ? likesArray.some((like) => like.userId === user.id)
    : false;
  const [optimisticLiked, setOptimisticLiked] = useState(isLikedByUser);
  const [optimisticCount, setOptimisticCount] = useState(
    post._count?.likes ?? 0
  );

  // Video state
  const player = useVideoPlayer(
    post.imageUrl && post.mediaType === "video" ? post.imageUrl : null,
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

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(
    post._count?.comments ?? 0
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = () => {
    if (!user) {
      Alert.alert(
        t("feed.loginToInteract"),
        t("feed.loginToInteractDescription")
      );
      return;
    }

    console.log(
      `PostCard: Toggling like for post ${post.id}, current state: ${optimisticLiked}`
    );

    // Optimistic update
    setOptimisticLiked(!optimisticLiked);
    setOptimisticCount((c) => (optimisticLiked ? c - 1 : c + 1));

    // Call API
    toggleLike.mutate(post.id, {
      onError: (error) => {
        console.error("PostCard: Like error:", error);
        // Revert optimistic update
        setOptimisticLiked(isLikedByUser);
        setOptimisticCount(post._count?.likes ?? 0);
      },
      onSuccess: (data) => {
        console.log("PostCard: Like success:", data);
      },
    });
  };

  // ── Comments API ─────────────────────────────────────────────

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
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || isSubmitting) return;
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
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(t("feed.deleteComment"), t("feed.deleteCommentConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(
              `/posts/${post.id}/comments?commentId=${commentId}`
            );
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setCommentsCount((c) => c - 1);
          } catch (error) {
            console.error("Error deleting comment:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <PostAvatar image={post.user.image} name={post.user.name} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {post.user.name ?? "User"}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.timeText}>{timeAgo(post.createdAt)}</Text>
            {post.event && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.eventName} numberOfLines={1}>
                  {post.event.title}
                </Text>
              </>
            )}
            {post.venue && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <View style={styles.venueBadge}>
                  <Text style={styles.venueBadgeText} numberOfLines={1}>
                    {post.venue.name}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Media — Image */}
      {post.imageUrl && post.mediaType !== "video" && (
        <CachedImage
          uri={post.imageUrl}
          style={styles.postImage}
          contentFit="cover"
          alt="Post image"
        />
      )}

      {/* Media — Video (inline autoplay like Instagram) */}
      {post.imageUrl && post.mediaType === "video" && player && (
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
              <VolumeOff size={16} color={colors.white} />
            ) : (
              <Volume2 size={16} color={colors.white} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Actions bar */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.6}
        >
          <Heart
            size={20}
            color={optimisticLiked ? colors.error : colors.textTertiary}
            fill={optimisticLiked ? colors.error : "none"}
          />
          {optimisticCount > 0 && (
            <Text
              style={[
                styles.actionCount,
                optimisticLiked && styles.actionCountLiked,
              ]}
            >
              {optimisticCount}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleToggleComments}
          activeOpacity={0.6}
        >
          <MessageCircle
            size={20}
            color={showComments ? colors.info : colors.textTertiary}
          />
          {commentsCount > 0 && (
            <Text
              style={[
                styles.actionCount,
                showComments && styles.actionCountActive,
              ]}
            >
              {commentsCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsSection}>
          {/* Comment Input */}
          {user && (
            <View style={styles.commentInputRow}>
              <MiniAvatar image={user.image ?? null} name={user.name ?? null} />
              <TextInput
                style={styles.commentInput}
                placeholder={t("feed.writeComment")}
                placeholderTextColor={colors.textTertiary}
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
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Send size={16} color={colors.white} />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <View style={styles.commentsLoading}>
              <ActivityIndicator size="small" color={colors.textTertiary} />
              <Text style={styles.commentsLoadingText}>
                {t("feed.loadingComments")}
              </Text>
            </View>
          ) : comments.length === 0 ? (
            <Text style={styles.noCommentsText}>{t("feed.noComments")}</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <MiniAvatar
                  image={comment.user.image}
                  name={comment.user.name}
                />
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
                    {user?.id === comment.user.id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteComment(comment.id)}
                        activeOpacity={0.6}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={12} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.sm,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.mutedForeground,
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  metaDot: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  eventName: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: "500",
    flexShrink: 1,
  },
  venueBadge: {
    backgroundColor: `${colors.text}12`,
    borderRadius: borderRadius.md,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  venueBadgeText: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: "500",
    color: colors.text,
  },

  // Content
  content: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.fontSize.sm * 1.6,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },

  // Media
  postImage: {
    width: "100%",
    height: 280,
    backgroundColor: colors.muted,
  },
  videoContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.foreground,
    position: "relative" as const,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  muteButton: {
    position: "absolute" as const,
    bottom: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  // Actions
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  actionCountLiked: {
    color: colors.error,
  },
  actionCountActive: {
    color: colors.info,
  },

  // Comments Section
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  // Comment input
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },

  // Comments list
  commentsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  commentsLoadingText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  noCommentsText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    textAlign: "center",
    paddingVertical: spacing.md,
  },

  // Comment row
  commentRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  commentAvatar: {
    backgroundColor: colors.muted,
  },
  commentAvatarPlaceholder: {
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    color: colors.mutedForeground,
    fontSize: typography.fontSize.xs - 1,
    fontWeight: "600",
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  commentAuthor: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 1,
  },
  commentText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    lineHeight: typography.fontSize.xs * 1.5,
  },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 3,
    marginLeft: spacing.xs,
  },
  commentTime: {
    fontSize: typography.fontSize.xs - 1,
    color: colors.textTertiary,
  },
});
