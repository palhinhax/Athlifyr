import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EventSearchResult {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  location: string;
  sport: { name: string };
  variants: Array<{ name: string }>;
}

interface EventSearchProps {
  onEventSelect: (event: EventSearchResult) => void;
}

export function EventSearch({ onEventSelect }: EventSearchProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EventSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search events with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchEvents = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/events?search=${encodeURIComponent(searchQuery)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.events || []);
        }
      } catch (error) {
        console.error("Error searching events:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchEvents, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectEvent = (event: EventSearchResult) => {
    onEventSelect(event);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Start from Event</h2>
          <p className="text-sm text-muted-foreground">
            Search and select an event to auto-fill template
          </p>
        </div>
        <Button
          variant={showSearch ? "secondary" : "default"}
          onClick={() => setShowSearch(!showSearch)}
          size="sm"
        >
          {showSearch ? "Hide" : "Search Event"}
        </Button>
      </div>

      {showSearch && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Input
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {event.sport.name} •{" "}
                    {new Date(event.startDate).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    • {event.location}
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No events found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
