"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  CalendarIcon,
  Building2Icon,
  NewspaperIcon,
  MessageCircleIcon,
  ShieldIcon,
  HomeIcon,
  DumbbellIcon,
  CalendarClockIcon,
} from "lucide-react";
import { useChatNotifications } from "@/hooks/chat/use-chat-notifications";
import { useIsVenueStaff } from "@/hooks/use-is-venue-staff";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  adminOnly?: boolean;
  staffOnly?: boolean;
  authOnly?: boolean;
  publicOnly?: boolean;
}

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { unreadCount } = useChatNotifications({ enabled: !!session });
  const { isStaff } = useIsVenueStaff();

  // Navigation items - different based on auth state
  const navItems: NavItem[] = session
    ? [
        // Authenticated user navigation
        {
          href: "/feed",
          icon: NewspaperIcon,
          label: t("feed"),
        },
        {
          href: "/profile",
          icon: UserIcon,
          label: t("profile"),
        },
        {
          href: "/events",
          icon: CalendarIcon,
          label: t("events"),
        },
        {
          href: "/venues",
          icon: Building2Icon,
          label: t("venues"),
        },
        {
          href: "/workouts",
          icon: DumbbellIcon,
          label: t("workouts"),
        },
        {
          href: "/my-schedule",
          icon: CalendarClockIcon,
          label: t("mySchedule"),
        },
        {
          href: "/chat",
          icon: MessageCircleIcon,
          label: t("messages"),
          badge: unreadCount,
        },
        {
          href: "/admin",
          icon: ShieldIcon,
          label: t("admin"),
          adminOnly: true,
        },
      ]
    : [
        // Public navigation (not logged in)
        {
          href: "/",
          icon: HomeIcon,
          label: t("home"),
        },
        {
          href: "/feed",
          icon: NewspaperIcon,
          label: t("feed"),
        },
        {
          href: "/events",
          icon: CalendarIcon,
          label: t("events"),
        },
        {
          href: "/venues",
          icon: Building2Icon,
          label: t("venues"),
        },
      ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && session?.user?.role !== "ADMIN") return false;
    if (item.staffOnly && !isStaff) return false;
    return true;
  });

  const isActive = (href: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");
    if (href === "/") {
      return pathWithoutLocale === "/" || pathWithoutLocale === "";
    }
    return pathWithoutLocale.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header with collapse toggle */}
      <div className="flex h-16 shrink-0 items-center justify-center border-b px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon as React.ComponentType<{
                className?: string;
              }>;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                            "mx-auto",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">
                              {item.badge > 9 ? "9+" : item.badge}
                            </span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border/60 bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out md:block",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden shrink-0 transition-all duration-300 ease-in-out md:block",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      />
    </>
  );
}
