import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Activity, MessageSquare } from "lucide-react-native";
import { useAuthStore } from "@/src/lib/auth-store";
import { useFeedPosts, type FeedPost } from "@/src/hooks/useFeedPosts";
import { PostCard } from "@/src/components/PostCard";
import { theme } from "@/src/constants/theme";

// ─── Empty State ───────────────────────────────────────────────

function EmptyFeed() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MessageSquare size={48} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{t("feed.emptyTitle")}</Text>
      <Text style={styles.emptyDescription}>{t("feed.emptyDescription")}</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/(tabs)")}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>{t("feed.exploreEvents")}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Guest State ───────────────────────────────────────────────

function GuestFeed() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Activity size={48} color={theme.colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{t("feed.title")}</Text>
      <Text style={styles.emptyDescription}>{t("feed.signInRequired")}</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/login")}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>
          {t("profile.signInButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Feed Screen ──────────────────────────────────────────

export default function FeedScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { posts, isLoading, refetch } = useFeedPosts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Guest view
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <GuestFeed />
      </SafeAreaView>
    );
  }

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
});
