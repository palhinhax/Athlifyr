import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { MessageSquare, Play } from "lucide-react-native";
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
  const { posts, isLoading, refetch } = useFeedPosts();
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Loading
  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderPost = ({ item }: { item: FeedPost }) => <PostCard post={item} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={
          user ? <CreatePostBox onPostCreated={refetch} /> : null
        }
        ListEmptyComponent={<EmptyFeed />}
        contentContainerStyle={
          posts.length === 0 ? styles.emptyListContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />

      {/* Free Run FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: Platform.OS === "ios" ? 24 + insets.bottom : 24 },
        ]}
        activeOpacity={0.85}
        onPress={() => router.push("/free-run")}
      >
        <Play size={22} color={theme.colors.white} fill={theme.colors.white} />
        <Text style={styles.fabLabel}>{t("freeRun.startRun")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
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

  // List
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: theme.spacing.sm,
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
  exploreButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.lg,
  },
  exploreButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabLabel: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: "700",
  },
});
