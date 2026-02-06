"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Building2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveVenue {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  role: string | null;
  subscriptionEndsAt: Date | null;
}

// Pages where the venues bar should be hidden
const HIDDEN_ON_PATHS = ["/chat"];

/**
 * Active Venues Bar
 * Shows a quick access bar to venues where the user has an active subscription
 * Positioned below the main navigation header
 */
export function ActiveVenuesBar() {
  const t = useTranslations("venues");
  const pathname = usePathname();
  const [activeVenues, setActiveVenues] = useState<ActiveVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function fetchActiveVenues() {
      try {
        // Try to get cached data first for faster initial render
        const cached = sessionStorage.getItem("activeVenues");
        if (cached && !hasFetched) {
          try {
            const parsedCache = JSON.parse(cached);
            if (Array.isArray(parsedCache) && parsedCache.length > 0) {
              setActiveVenues(parsedCache);
              setIsLoading(false);
            }
          } catch {
            // Ignore parse errors
          }
        }

        const response = await fetch("/api/user/active-venues", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setActiveVenues(data);
          // Cache the result
          sessionStorage.setItem("activeVenues", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to fetch active venues:", error);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    }

    fetchActiveVenues();
  }, [hasFetched]);

  // Check if we should hide on current path
  const shouldHide = HIDDEN_ON_PATHS.some((path) => pathname.includes(path));

  // Don't render if no active venues, still loading, or on hidden paths
  if (isLoading || activeVenues.length === 0 || shouldHide) {
    return null;
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Label */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("myVenues")}</span>
          </div>

          {/* Venues List - Horizontal Scroll */}
          <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto pb-1">
            {activeVenues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.slug}`}
                className={cn(
                  "group flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5",
                  "whitespace-nowrap"
                )}
              >
                {/* Venue Image/Icon */}
                {venue.imageUrl ? (
                  <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={venue.imageUrl}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}

                {/* Venue Name */}
                <span className="max-w-[150px] truncate md:max-w-[200px]">
                  {venue.name}
                </span>

                {/* Role Badge */}
                {/* {venue.role && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      venue.role === "OWNER" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      venue.role === "ADMIN" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                      venue.role === "COACH" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                      venue.role === "CLIENT" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {venue.role === "OWNER" && "Owner"}
                    {venue.role === "ADMIN" && "Admin"}
                    {venue.role === "COACH" && "Coach"}
                    {venue.role === "CLIENT" && "Member"}
                  </span>
                )} */}

                {/* Arrow Icon */}
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
