import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  User,
  X,
} from "lucide-react-native";
import { API_URL } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "@/src/constants/theme";

interface SearchResult {
  id: string;
  type: "event" | "venue" | "user";
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const token = useAuthStore((s) => s.token);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        // Build headers - include auth token if available to enable user search
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();

        // API returns { results: SearchResult[], counts: {...} }
        // Results already have the correct structure: type, id, title, subtitle, image, href
        if (data.results && Array.isArray(data.results)) {
          setResults(
            data.results.map(
              (r: {
                type: string;
                id: string;
                title: string;
                subtitle?: string;
                image?: string;
                href: string;
              }) => ({
                id: r.id,
                type: r.type as "event" | "venue" | "user",
                title: r.title,
                subtitle: r.subtitle,
                image: r.image,
                href: r.href,
              })
            )
          );
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleResultPress = (result: SearchResult) => {
    Keyboard.dismiss();

    // href contains the full path like "/events/slug" or "/venues/slug" or "/users/id"
    // Navigate based on type since mobile routes may differ from web
    switch (result.type) {
      case "event":
        // Extract slug from href (e.g., "/events/slug" -> "slug")
        const eventSlug = result.href.split("/").pop();
        if (eventSlug) {
          router.push(`/events/${eventSlug}`);
        }
        break;
      case "venue":
        // Extract slug from href (e.g., "/venues/slug" -> "slug")
        const venueSlug = result.href.split("/").pop();
        if (venueSlug) {
          router.push(`/venues/${venueSlug}`);
        }
        break;
      case "user":
        // Users page not yet implemented in mobile - TODO
        // For now, just dismiss keyboard
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar size={20} color={colors.primary} />;
      case "venue":
        return <MapPin size={20} color={colors.secondary} />;
      case "user":
        return <User size={20} color={colors.accent} />;
      default:
        return <Search size={20} color={colors.textSecondary} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "event":
        return t("search.event");
      case "venue":
        return t("search.venue");
      case "user":
        return t("search.user");
      default:
        return "";
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultIcon}>{getIcon(item.type)}</View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>
      <View style={styles.resultBadge}>
        <Text style={styles.resultBadgeText}>{getTypeLabel(item.type)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with Search Input */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder={t("search.placeholder")}
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : hasSearched && results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Search
            size={48}
            color={colors.textTertiary}
            style={{ opacity: 0.5 }}
          />
          <Text style={styles.emptyTitle}>{t("search.noResults")}</Text>
          <Text style={styles.emptyDescription}>
            {t("search.noResultsDescription")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={renderResult}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.text,
  },
  resultSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resultBadge: {
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  resultBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "500",
    color: colors.textSecondary,
  },
});
