"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  MapPin,
  User,
  Loader2,
  ArrowRight,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SportType } from "@prisma/client";

interface SearchResult {
  type: "event" | "venue" | "user";
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  href: string;
  sportTypes?: SportType[];
  date?: string;
}

interface SearchResponse {
  results: SearchResult[];
  counts: {
    events: number;
    venues: number;
    users: number;
  };
}

// Sport type colors for badges
const sportColors: Record<string, string> = {
  RUNNING: "bg-blue-500/10 text-blue-500",
  TRAIL: "bg-green-500/10 text-green-500",
  WALKING: "bg-emerald-500/10 text-emerald-500",
  HYROX: "bg-orange-500/10 text-orange-500",
  CROSSFIT: "bg-red-500/10 text-red-500",
  OCR: "bg-purple-500/10 text-purple-500",
  BTT: "bg-amber-500/10 text-amber-500",
  CYCLING: "bg-cyan-500/10 text-cyan-500",
  SURF: "bg-sky-500/10 text-sky-500",
  TRIATHLON: "bg-indigo-500/10 text-indigo-500",
  SWIMMING: "bg-teal-500/10 text-teal-500",
  OTHER: "bg-gray-500/10 text-gray-500",
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");
  const tSports = useTranslations("sports");

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&locale=${locale}&limit=5`
        );
        if (res.ok) {
          const data: SearchResponse = await res.json();
          setResults(data.results);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, locale]);

  // Navigate to result
  const navigateToResult = useCallback(
    (result: SearchResult) => {
      router.push(`/${locale}${result.href}`);
      setOpen(false);
    },
    [router, locale]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateToResult(results[selectedIndex]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [results, selectedIndex, navigateToResult]
  );

  // Get icon for result type
  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-primary" />;
      case "venue":
        return <MapPin className="h-4 w-4 text-green-500" />;
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get type label
  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "event":
        return t("event");
      case "venue":
        return t("venue");
      case "user":
        return t("person");
    }
  };

  // Format date for events
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Search Trigger Button - Mobile */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border bg-background/80 backdrop-blur-sm transition-colors hover:bg-accent md:hidden"
        aria-label={t("placeholder")}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Search Trigger Button - Desktop */}
      <button
        onClick={() => setOpen(true)}
        className="hidden h-9 w-72 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{t("placeholder")}</span>
        <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
          <div className="flex items-center border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              className="h-14 border-0 px-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {isSearching && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Results - min height to prevent jumping */}
          <div className="max-h-[60vh] min-h-[300px] overflow-y-auto p-2">
            {query.length < 2 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">{t("hint")}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {t("searchDescription")}
                </p>
              </div>
            ) : results.length === 0 && !isSearching ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  {t("noResults")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {t("tryDifferent")}
                </p>
              </div>
            ) : results.length === 0 && isSearching ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {t("searching")}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                  >
                    {/* Avatar/Icon */}
                    {result.type === "user" ? (
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={result.image || undefined} />
                        <AvatarFallback className="bg-blue-500/10 text-blue-500">
                          {result.title?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : result.image ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {getResultIcon(result.type)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {result.title}
                        </span>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px]"
                        >
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {result.subtitle && (
                          <span className="truncate">{result.subtitle}</span>
                        )}
                        {result.date && (
                          <>
                            <span>•</span>
                            <span>{formatDate(result.date)}</span>
                          </>
                        )}
                      </div>
                      {/* Sport badges for events/venues */}
                      {result.sportTypes && result.sportTypes.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {result.sportTypes.slice(0, 3).map((sport) => (
                            <Badge
                              key={sport}
                              variant="secondary"
                              className={cn(
                                "h-5 text-[10px]",
                                sportColors[sport] || sportColors.OTHER
                              )}
                            >
                              {tSports(`sports.${sport}`)}
                            </Badge>
                          ))}
                          {result.sportTypes.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="h-5 text-[10px]"
                            >
                              +{result.sportTypes.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-opacity",
                        index === selectedIndex ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer with keyboard hints */}
          {results.length > 0 && (
            <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5">
                    ↑
                  </kbd>
                  <kbd className="rounded border bg-background px-1.5 py-0.5">
                    ↓
                  </kbd>
                  {t("toNavigate")}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5">
                    Enter
                  </kbd>
                  {t("toOpen")}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-background px-1.5 py-0.5">
                  Esc
                </kbd>
                {t("toClose")}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
