"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Search, Users, UserMinus, Loader2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FollowButton } from "@/components/follow-button";

interface FollowUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  followId?: string;
  since?: string;
}

interface SearchUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  friendshipStatus?: string | null;
}

type Tab = "following" | "followers" | "search";

export function FriendsSection() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("follow");
  const [activeTab, setActiveTab] = useState<Tab>("following");
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await fetch("/api/follow?type=following");
      if (res.ok) {
        const data = await res.json();
        setFollowing(data);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  }, []);

  const fetchFollowers = useCallback(async () => {
    try {
      const res = await fetch("/api/follow?type=followers");
      if (res.ok) {
        const data = await res.json();
        setFollowers(data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchFollowing();
      fetchFollowers();
    }
  }, [session, fetchFollowing, fetchFollowers]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const unfollowUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/follow/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: t("unfollowed"),
          description: t("unfollowedDesc"),
        });
        fetchFollowing();
      } else {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("unfollowError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("genericError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: userId }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/chat?conversation=${data.conversation.id}`);
      } else {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("chatError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("genericError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) return null;

  const renderUserCard = (user: FollowUser, showUnfollow: boolean) => (
    <Card key={user.id} className="flex min-w-0 items-center gap-3 p-4">
      <Link
        href={`/user/${user.id}`}
        className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/user/${user.id}`}
          className="block truncate font-medium transition-colors hover:text-primary"
        >
          {user.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => startChat(user.id)}
        disabled={isLoading}
        className="flex-shrink-0 text-muted-foreground hover:text-primary"
        title={t("sendMessage")}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      {showUnfollow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => unfollowUser(user.id)}
          disabled={isLoading}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
          title={t("unfollow")}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );

  return (
    <div className="mt-12">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Users className="h-6 w-6 text-primary" />
        {t("connections")}
      </h2>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
        {/* Tabs */}
        <div className="mb-6 grid w-full grid-cols-3 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <button
            onClick={() => setActiveTab("following")}
            className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
              activeTab === "following"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("following")}</span>
            <span className="text-xs">({following.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
              activeTab === "followers"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("followers")}</span>
            <span className="text-xs">({followers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
              activeTab === "search"
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("search")}</span>
          </button>
        </div>

        {/* Following List */}
        {activeTab === "following" && (
          <div>
            {following.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {t("notFollowingAnyone")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("notFollowingAnyoneDesc")}
                </p>
                <Button
                  onClick={() => setActiveTab("search")}
                  variant="outline"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {t("searchUsers")}
                </Button>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {following.map((user) => renderUserCard(user, true))}
              </div>
            )}
          </div>
        )}

        {/* Followers List */}
        {activeTab === "followers" && (
          <div>
            {followers.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {t("noFollowers")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("noFollowersDesc")}
                </p>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {followers.map((user) => renderUserCard(user, false))}
              </div>
            )}
          </div>
        )}

        {/* Search Users */}
        {activeTab === "search" && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isSearching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : searchQuery.length < 2 ? (
              <Card className="p-8 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {t("searchUsers")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("searchMinChars")}
                </p>
              </Card>
            ) : searchResults.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">{t("noResults")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("noResultsDesc")}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <Card
                    key={user.id}
                    className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4"
                  >
                    <Link
                      href={`/user/${user.id}`}
                      className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80"
                    >
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/user/${user.id}`}
                        className="block font-medium transition-colors hover:text-primary"
                      >
                        {user.name}
                      </Link>
                      <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-end sm:w-auto">
                      <FollowButton
                        userId={user.id}
                        initialFollowing={
                          user.friendshipStatus === "friends" ||
                          user.friendshipStatus === "request_sent"
                        }
                        size="sm"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
