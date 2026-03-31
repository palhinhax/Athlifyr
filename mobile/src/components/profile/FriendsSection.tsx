import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Users,
  Search,
  Check,
  UserPlus,
  UserMinus,
  MessageCircle,
  User,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { CachedAvatar } from "@/src/components/CachedImage";
import { useToast } from "@/src/hooks/useToast";
import { Toast } from "@/src/components/ui/Toast";

// ─── Types ─────────────────────────────────────────────────────

interface FollowUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isFollowing?: boolean;
}

type Tab = "following" | "followers" | "search";

// ─── Avatar ────────────────────────────────────────────────────

function FollowAvatar({
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
        size={44}
      />
    );
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View style={styles.avatarPlaceholder}>
      {initials === "?" ? (
        <User size={18} color={theme.colors.white} />
      ) : (
        <Text style={styles.avatarText}>{initials}</Text>
      )}
    </View>
  );
}

// ─── Main Component ────────────────────────────────────────────

interface FriendsSectionProps {
  followingCount: number;
  followersCount: number;
}

export function FriendsSection(_props: FriendsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("following");
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [searchResults, setSearchResults] = useState<FollowUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Fetch Data ────────────────────────────────────────────

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await api.get<FollowUser[]>("/follow?type=following");
      setFollowing(res.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  }, []);

  const fetchFollowers = useCallback(async () => {
    try {
      const res = await api.get<FollowUser[]>("/follow?type=followers");
      setFollowers(res.data);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFollowing();
      fetchFollowers();
    }
  }, [isAuthenticated, fetchFollowing, fetchFollowers]);

  // ─── Search ────────────────────────────────────────────────

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get<FollowUser[]>(
          `/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        setSearchResults(res.data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Actions ───────────────────────────────────────────────

  const handleFollow = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.post("/follow", { userId });
      showToast(t("profile.followSuccess"), "success");
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u))
      );
      fetchFollowing();
    } catch {
      showToast(t("profile.followError"), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnfollow = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.delete(`/follow/${userId}`);
      showToast(t("profile.unfollowSuccess"), "success");
      setFollowing((prev) => prev.filter((u) => u.id !== userId));
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u))
      );
    } catch {
      showToast(t("profile.unfollowError"), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const startChat = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ conversation: { id: string } }>(
        "/chat/conversations",
        { otherUserId: userId }
      );
      router.push(`/chat/${res.data.conversation.id}`);
    } catch {
      showToast(t("profile.chatError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Users size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>{t("profile.connections")}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "following" && styles.tabActive]}
          onPress={() => setActiveTab("following")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "following" && styles.tabTextActive,
            ]}
          >
            {t("profile.following")}
          </Text>
          <Text
            style={[
              styles.tabCount,
              activeTab === "following" && styles.tabCountActive,
            ]}
          >
            ({following.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "followers" && styles.tabActive]}
          onPress={() => setActiveTab("followers")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followers" && styles.tabTextActive,
            ]}
          >
            {t("profile.followers")}
          </Text>
          <Text
            style={[
              styles.tabCount,
              activeTab === "followers" && styles.tabCountActive,
            ]}
          >
            ({followers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.tabActive]}
          onPress={() => setActiveTab("search")}
          activeOpacity={0.7}
        >
          <Search
            size={14}
            color={
              activeTab === "search"
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "search" && styles.tabTextActive,
            ]}
          >
            {t("profile.searchUsers")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      <View style={styles.tabContent}>
        {/* Following List */}
        {activeTab === "following" && (
          <View>
            {following.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={40} color={theme.colors.textTertiary} />
                <Text style={styles.emptyTitle}>
                  {t("profile.noFollowing")}
                </Text>
                <Text style={styles.emptyDescription}>
                  {t("profile.noFollowingDescription")}
                </Text>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => setActiveTab("search")}
                  activeOpacity={0.7}
                >
                  <Search size={16} color={theme.colors.primary} />
                  <Text style={styles.searchButtonText}>
                    {t("profile.searchUsers")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              following.map((user) => (
                <View key={user.id} style={styles.friendCard}>
                  <FollowAvatar image={user.image} name={user.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <View style={styles.friendActions}>
                    <TouchableOpacity
                      onPress={() => startChat(user.id)}
                      disabled={isLoading}
                      style={styles.iconButton}
                      activeOpacity={0.7}
                    >
                      <MessageCircle
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleUnfollow(user.id)}
                      disabled={processingId === user.id}
                      style={styles.iconButton}
                      activeOpacity={0.7}
                    >
                      {processingId === user.id ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.error}
                        />
                      ) : (
                        <UserMinus size={18} color={theme.colors.error} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Followers List */}
        {activeTab === "followers" && (
          <View>
            {followers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={40} color={theme.colors.textTertiary} />
                <Text style={styles.emptyTitle}>
                  {t("profile.noFollowers")}
                </Text>
                <Text style={styles.emptyDescription}>
                  {t("profile.noFollowersDescription")}
                </Text>
              </View>
            ) : (
              followers.map((user) => (
                <View key={user.id} style={styles.friendCard}>
                  <FollowAvatar image={user.image} name={user.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => startChat(user.id)}
                    disabled={isLoading}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <MessageCircle
                      size={18}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Search Users */}
        {activeTab === "search" && (
          <View>
            <View style={styles.searchInputContainer}>
              <Search size={16} color={theme.colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder={t("profile.searchPlaceholder")}
                placeholderTextColor={theme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {isSearching ? (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : searchQuery.length < 2 ? (
              <View style={styles.emptyContainer}>
                <Search size={40} color={theme.colors.textTertiary} />
                <Text style={styles.emptyTitle}>
                  {t("profile.searchUsersTitle")}
                </Text>
                <Text style={styles.emptyDescription}>
                  {t("profile.searchUsersDescription")}
                </Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={40} color={theme.colors.textTertiary} />
                <Text style={styles.emptyTitle}>
                  {t("profile.noSearchResults")}
                </Text>
                <Text style={styles.emptyDescription}>
                  {t("profile.noSearchResultsDescription")}
                </Text>
              </View>
            ) : (
              searchResults.map((user) => (
                <View key={user.id} style={styles.friendCard}>
                  <FollowAvatar image={user.image} name={user.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <View style={styles.searchAction}>
                    {user.isFollowing ? (
                      <TouchableOpacity
                        style={[
                          styles.unfollowBtn,
                          processingId === user.id && styles.btnDisabled,
                        ]}
                        onPress={() => handleUnfollow(user.id)}
                        disabled={processingId === user.id}
                        activeOpacity={0.7}
                      >
                        {processingId === user.id ? (
                          <ActivityIndicator
                            size="small"
                            color={theme.colors.error}
                          />
                        ) : (
                          <>
                            <Check
                              size={14}
                              color={theme.colors.textSecondary}
                            />
                            <Text style={styles.unfollowBtnText}>
                              {t("profile.following")}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.addBtn,
                          processingId === user.id && styles.btnDisabled,
                        ]}
                        onPress={() => handleFollow(user.id)}
                        disabled={processingId === user.id}
                        activeOpacity={0.7}
                      >
                        {processingId === user.id ? (
                          <ActivityIndicator
                            size="small"
                            color={theme.colors.white}
                          />
                        ) : (
                          <>
                            <UserPlus size={14} color={theme.colors.white} />
                            <Text style={styles.addBtnText}>
                              {t("profile.follow")}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: 3,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md - 2,
  },
  tabActive: {
    backgroundColor: theme.colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  tabCount: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  tabCountActive: {
    color: theme.colors.text,
  },
  tabContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  friendInfo: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  friendEmail: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  friendActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    paddingVertical: 6,
  },
  searchLoading: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  searchAction: {
    alignItems: "flex-end",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.white,
  },
  unfollowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  unfollowBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: theme.spacing.md,
  },
  searchButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    lineHeight: 18,
  },
});
