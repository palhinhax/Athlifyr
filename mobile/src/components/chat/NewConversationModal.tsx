import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Search, X, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { fetchFriends, type Friend } from "@/src/api/friends";
import { CachedAvatar } from "@/src/components/CachedImage";
import { theme } from "@/src/constants/theme";

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFriend: (friendId: string) => void;
  /** IDs of users who already have a conversation with the current user */
  existingUserIds: string[];
}

export function NewConversationModal({
  visible,
  onClose,
  onSelectFriend,
  existingUserIds,
}: NewConversationModalProps) {
  const { t } = useTranslation();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!visible) return;
    setSearchQuery("");
    setIsLoading(true);
    fetchFriends()
      .then(setFriends)
      .catch((err) =>
        console.error("[NewConversation] Failed to load friends:", err)
      )
      .finally(() => setIsLoading(false));
  }, [visible]);

  // Filter out friends who already have a conversation, then apply search
  const filteredFriends = useMemo(() => {
    const available = friends.filter((f) => !existingUserIds.includes(f.id));
    if (!searchQuery.trim()) return available;
    const q = searchQuery.toLowerCase();
    return available.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
    );
  }, [friends, existingUserIds, searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("chat.newConversationButton")}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search
              size={16}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t("chat.searchFriends")}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Friends list */}
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : filteredFriends.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {friends.length === 0
                  ? t("chat.noFriends")
                  : t("chat.noFriendsFound")}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => onSelectFriend(item.id)}
                >
                  {item.image ? (
                    <CachedAvatar uri={item.image} size={44} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <User size={20} color={theme.colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName} numberOfLines={1}>
                      {item.name || item.email}
                    </Text>
                    {item.name && (
                      <Text style={styles.friendEmail} numberOfLines={1}>
                        {item.email}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    paddingVertical: 10,
  },
  centerContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text,
  },
  friendEmail: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  },
});
