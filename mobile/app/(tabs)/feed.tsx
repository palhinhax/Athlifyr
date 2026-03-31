import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react-native";
import { useFeedPosts, type FeedPost } from "@/src/hooks/useFeedPosts";
import { PostCard } from "@/src/components/PostCard";
import { CreatePostBox } from "@/src/components/CreatePostBox";
import { useAuthStore } from "@/src/lib/auth-store";
import { theme } from "@/src/constants/theme";

// ─── Empty State ───────────────────────────────────────────────

function EmptyFeed() {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MessageSquare size={48} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{t("feed.emptyTitle")}</Text>
      <Text style={styles.emptyDescription}>{t("feed.emptyDescription")}</Text>
    </View>
  );
}

// ─── Main Feed Screen ──────────────────────────────────────────

export default function FeedScreen() {
  const { t } = useTranslation();
  const { posts, isLoading, refetch } = useFeedPosts();
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.safeArea}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            accessibilityLabel={t("a11y.loading")}
          />
        </View>
      </View>
    );
  }

  const renderPost = ({ item }: { item: FeedPost }) => <PostCard post={item} />;

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={
          user ? <CreatePostBox onPostCreated={refetch} /> : null
        }
        ListEmptyComponent={<EmptyFeed />}
        contentContainerStyle={[
          posts.length === 0 ? styles.emptyListContent : styles.listContent,
          { paddingTop: insets.top + theme.spacing.xs },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressViewOffset={insets.top}
          />
        }
        accessibilityLabel={t("a11y.feedList")}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  logo: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: "900",
    fontStyle: "italic",
    color: theme.colors.text,
    letterSpacing: -1,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },

  // List
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["2xl"],
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: theme.typography.fontSize.sm * 1.5,
    marginBottom: theme.spacing.lg,
  },
});
