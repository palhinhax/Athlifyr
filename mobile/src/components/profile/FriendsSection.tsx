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
  Clock,
  Check,
  X,
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

interface FriendUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  friendshipStatus?: string | null;
  friendshipId?: string;
}

interface PendingRequest {
  id: string;
  sender: FriendUser;
  createdAt: string;
}

interface SentRequest {
  id: string;
  receiver: FriendUser;
  createdAt: string;
}

interface Friend extends FriendUser {
  friendshipId: string;
  since: string;
}

type Tab = "friends" | "pending" | "search";

// ─── Avatar ────────────────────────────────────────────────────

function FriendAvatar({
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
  friendsCount: number;
}

export function FriendsSection({ friendsCount }: FriendsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ─── Fetch Data ────────────────────────────────────────────

  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get<Friend[]>("/friends");
      setFriends(res.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await api.get<PendingRequest[]>("/friends?type=pending");
      setPendingRequests(res.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const res = await api.get<SentRequest[]>("/friends?type=sent");
      setSentRequests(res.data);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [isAuthenticated, fetchFriends, fetchPendingRequests, fetchSentRequests]);

  // ─── Search ────────────────────────────────────────────────

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get<FriendUser[]>(
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

  const sendFriendRequest = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.post("/friends", { userId });
      showToast(t("profile.friendRequestSent"), "success");
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, friendshipStatus: "request_sent" } : u
        )
      );
      fetchSentRequests();
    } catch {
      showToast(t("profile.friendRequestError"), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const respondToRequest = async (
    friendshipId: string,
    action: "accept" | "reject"
  ) => {
    setProcessingId(friendshipId);
    try {
      await api.patch(`/friends/${friendshipId}`, { action });
      showToast(
        action === "accept"
          ? t("profile.friendAccepted")
          : t("profile.friendRejected"),
        "success"
      );
      fetchPendingRequests();
      if (action === "accept") {
        fetchFriends();
      }
    } catch {
      showToast(t("profile.friendActionError"), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const cancelSentRequest = async (friendshipId: string) => {
    setProcessingId(friendshipId);
    try {
      await api.delete(`/friends/${friendshipId}`);
      showToast(t("profile.friendRequestCancelled"), "success");
      fetchSentRequests();
    } catch {
      showToast(t("profile.friendActionError"), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const removeFriend = async (friendshipId: string) => {
    setProcessingId(friendshipId);
    try {
      await api.delete(`/friends/${friendshipId}`);
      showToast(t("profile.friendRemoved"), "success");
      fetchFriends();
    } catch {
      showToast(t("profile.friendActionError"), "error");
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

  // ─── Pending badge count ──────────────────────────────────

  const pendingTotal = pendingRequests.length + sentRequests.length;

  // ─── Render ────────────────────────────────────────────────

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Users size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>
          {t("profile.friendsCount", { count: friendsCount })}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.tabActive]}
          onPress={() => setActiveTab("friends")}
          activeOpacity={0.7}
        >
          <Users
            size={14}
            color={
              activeTab === "friends"
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.tabTextActive,
            ]}
          >
            {t("profile.friends")}
          </Text>
          <Text
            style={[
              styles.tabCount,
              activeTab === "friends" && styles.tabCountActive,
            ]}
          >
            ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.tabActive]}
          onPress={() => setActiveTab("pending")}
          activeOpacity={0.7}
        >
          <Clock
            size={14}
            color={
              activeTab === "pending"
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.tabTextActive,
            ]}
          >
            {t("profile.pendingRequests")}
          </Text>
          {pendingTotal > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingTotal}</Text>
            </View>
          )}
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
        {/* Friends List */}
        {activeTab === "friends" && (
          <View>
            {friends.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Users size={40} color={theme.colors.textTertiary} />
                <Text style={styles.emptyTitle}>{t("profile.noFriends")}</Text>
                <Text style={styles.emptyDescription}>
                  {t("profile.noFriendsDescription")}
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
              friends.map((friend) => (
                <View key={friend.friendshipId} style={styles.friendCard}>
                  <FriendAvatar image={friend.image} name={friend.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {friend.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {friend.email}
                    </Text>
                  </View>
                  <View style={styles.friendActions}>
                    <TouchableOpacity
                      onPress={() => startChat(friend.id)}
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
                      onPress={() => removeFriend(friend.friendshipId)}
                      disabled={processingId === friend.friendshipId}
                      style={styles.iconButton}
                      activeOpacity={0.7}
                    >
                      {processingId === friend.friendshipId ? (
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

        {/* Pending Requests */}
        {activeTab === "pending" && (
          <View style={styles.pendingContainer}>
            {/* Received */}
            <Text style={styles.subSectionTitle}>
              {t("profile.receivedRequests")} ({pendingRequests.length})
            </Text>
            {pendingRequests.length === 0 ? (
              <View style={styles.emptySmall}>
                <Text style={styles.emptySmallText}>
                  {t("profile.noReceivedRequests")}
                </Text>
              </View>
            ) : (
              pendingRequests.map((request) => (
                <View key={request.id} style={styles.friendCard}>
                  <FriendAvatar
                    image={request.sender.image}
                    name={request.sender.name}
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {request.sender.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {request.sender.email}
                    </Text>
                  </View>
                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.rejectBtn,
                        processingId === request.id && styles.btnDisabled,
                      ]}
                      onPress={() => respondToRequest(request.id, "reject")}
                      disabled={processingId === request.id}
                      activeOpacity={0.7}
                    >
                      <X size={14} color={theme.colors.error} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.acceptBtn,
                        processingId === request.id && styles.btnDisabled,
                      ]}
                      onPress={() => respondToRequest(request.id, "accept")}
                      disabled={processingId === request.id}
                      activeOpacity={0.7}
                    >
                      {processingId === request.id ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.white}
                        />
                      ) : (
                        <Check size={14} color={theme.colors.white} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Sent */}
            <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>
              {t("profile.sentRequests")} ({sentRequests.length})
            </Text>
            {sentRequests.length === 0 ? (
              <View style={styles.emptySmall}>
                <Text style={styles.emptySmallText}>
                  {t("profile.noSentRequests")}
                </Text>
              </View>
            ) : (
              sentRequests.map((request) => (
                <View key={request.id} style={styles.friendCard}>
                  <FriendAvatar
                    image={request.receiver.image}
                    name={request.receiver.name}
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {request.receiver.name}
                    </Text>
                    <View style={styles.pendingLabel}>
                      <Clock size={12} color={theme.colors.textTertiary} />
                      <Text style={styles.pendingLabelText}>
                        {t("profile.awaitingResponse")}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      processingId === request.id && styles.btnDisabled,
                    ]}
                    onPress={() => cancelSentRequest(request.id)}
                    disabled={processingId === request.id}
                    activeOpacity={0.7}
                  >
                    <X size={14} color={theme.colors.error} />
                    <Text style={styles.cancelBtnText}>
                      {t("profile.cancel")}
                    </Text>
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
                  <FriendAvatar image={user.image} name={user.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.friendEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <View style={styles.searchAction}>
                    {user.friendshipStatus === "friends" ? (
                      <View style={styles.statusBadge}>
                        <Check size={14} color="#16a34a" />
                        <Text style={styles.statusText}>
                          {t("profile.friends")}
                        </Text>
                      </View>
                    ) : user.friendshipStatus === "request_sent" ? (
                      <View style={styles.statusBadge}>
                        <Clock size={14} color={theme.colors.textSecondary} />
                        <Text style={styles.statusTextMuted}>
                          {t("profile.requestSent")}
                        </Text>
                      </View>
                    ) : user.friendshipStatus === "request_received" ? (
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          styles.acceptBtn,
                          processingId === user.friendshipId &&
                            styles.btnDisabled,
                        ]}
                        onPress={() =>
                          respondToRequest(user.friendshipId!, "accept")
                        }
                        disabled={processingId === user.friendshipId}
                        activeOpacity={0.7}
                      >
                        <Check size={14} color={theme.colors.white} />
                        <Text style={styles.acceptBtnText}>
                          {t("profile.acceptFriend")}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.addBtn,
                          processingId === user.id && styles.btnDisabled,
                        ]}
                        onPress={() => sendFriendRequest(user.id)}
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
                              {t("profile.addFriend")}
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

  // Tabs
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
  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.white,
  },

  // Tab content
  tabContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },

  // Friend card
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

  // Request actions
  requestActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  acceptBtn: {
    backgroundColor: "#16a34a",
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.white,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnDisabled: {
    opacity: 0.5,
  },

  // Cancel button
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.error,
  },

  // Pending label
  pendingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  pendingLabelText: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },

  // Sub-section
  subSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  pendingContainer: {},

  // Search
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

  // Add button
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

  // Search button
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

  // Status badges
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#16a34a",
  },
  statusTextMuted: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },

  // Empty states
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
  emptySmall: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  emptySmallText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
