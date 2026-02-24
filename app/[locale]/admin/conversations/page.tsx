"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  Search,
  User,
  Users,
  Calendar,
  Hash,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { type Locale, pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useLocale } from "next-intl";

const dateLocales: Record<string, Locale> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

interface ConversationUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  user: ConversationUser;
  _count: { messages: number };
}

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  uniqueUsers: number;
  today: number;
  thisWeek: number;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function AdminConversationsPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<
    Record<string, Message[]>
  >({});
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const t = useTranslations("admin.conversations");
  const locale = useLocale();
  const dateFnsLocale = dateLocales[locale] || enUS;

  const fetchConversations = useCallback(
    async (page: number, search: string) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          search,
        });
        const response = await fetch(`/api/admin/conversations?${params}`);
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setConversations(data.conversations);
        setStats(data.stats);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchConversations(pagination.page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExpandedId(null);
    setExpandedMessages({});
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleExpand = async (conversationId: string) => {
    if (expandedId === conversationId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(conversationId);

    // Lazy load messages if not cached
    if (!expandedMessages[conversationId]) {
      setLoadingMessages(conversationId);
      try {
        const response = await fetch(
          `/api/admin/conversations/${conversationId}/messages`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setExpandedMessages((prev) => ({
          ...prev,
          [conversationId]: data.messages,
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(null);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setExpandedId(null);
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.totalConversations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">
                  {stats.totalConversations}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.totalMessages")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">
                  {stats.totalMessages}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.uniqueUsers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.uniqueUsers}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.today")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">{stats.today}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("stats.thisWeek")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{stats.thisWeek}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="default" size="default">
          <Search className="h-4 w-4" />
        </Button>
        {searchQuery && (
          <Button onClick={handleClearSearch} variant="outline" size="default">
            {t("clearSearch")}
          </Button>
        )}
      </div>

      {/* Results info */}
      {!loading && pagination.totalCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {t("showing", {
            from: (pagination.page - 1) * pagination.limit + 1,
            to: Math.min(
              pagination.page * pagination.limit,
              pagination.totalCount
            ),
            total: pagination.totalCount,
          })}
        </p>
      )}

      {/* Loading overlay for page changes */}
      {loading && conversations.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Conversations List */}
      {!loading && conversations.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">{t("noConversations")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("noConversationsDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        !loading && (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Card key={conv.id} className="overflow-hidden">
                <button
                  onClick={() => handleExpand(conv.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={conv.user.image || undefined}
                        alt={conv.user.name || "User"}
                      />
                      <AvatarFallback>
                        {conv.user.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {conv.user.name || conv.user.email}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {conv._count.messages} {t("messagesCount")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {conv.title || t("untitled")} ·{" "}
                        {formatDistanceToNow(new Date(conv.createdAt), {
                          addSuffix: true,
                          locale: dateFnsLocale,
                        })}
                      </p>
                    </div>
                  </div>
                  {expandedId === conv.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {expandedId === conv.id && (
                  <div className="border-t bg-muted/20 p-4">
                    {loadingMessages === conv.id ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : expandedMessages[conv.id] ? (
                      <div className="space-y-3">
                        {expandedMessages[conv.id].map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3 rounded-lg p-3",
                              msg.role === "user"
                                ? "bg-background"
                                : msg.role === "assistant"
                                  ? "bg-primary/5"
                                  : "bg-yellow-500/10"
                            )}
                          >
                            <div className="shrink-0 pt-0.5">
                              {msg.role === "user" ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
                                  <User className="h-3.5 w-3.5 text-blue-500" />
                                </div>
                              ) : msg.role === "assistant" ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                  <Bot className="h-3.5 w-3.5 text-primary" />
                                </div>
                              ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10">
                                  <Bot className="h-3.5 w-3.5 text-yellow-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <Badge
                                  variant={
                                    msg.role === "user" ? "default" : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {msg.role === "user"
                                    ? t("roles.user")
                                    : msg.role === "assistant"
                                      ? t("roles.assistant")
                                      : t("roles.system")}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleString(
                                    locale
                                  )}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap break-words text-sm">
                                {msg.content}
                              </p>
                              {msg.metadata &&
                                Object.keys(msg.metadata).length > 0 && (
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                      {t("metadata")}
                                    </summary>
                                    <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">
                                      {JSON.stringify(msg.metadata, null, 2)}
                                    </pre>
                                  </details>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("page", {
              current: pagination.page,
              total: pagination.totalPages,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
