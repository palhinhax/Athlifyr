"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Shield,
  MessageCircleIcon,
  CalendarIcon,
  CalendarClockIcon,
  NewspaperIcon,
  HomeIcon,
  Building2Icon,
  Dumbbell,
  Bell,
} from "lucide-react";
import { GlobalSearch } from "./global-search";
// import { WallClock } from "./wall-clock"; // TODO: Temporarily hidden
import { useChatNotifications } from "@/hooks/chat/use-chat-notifications";
import { useIsVenueStaff } from "@/hooks/use-is-venue-staff";
import { useNotifications } from "@/hooks/use-notifications";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useTranslations("nav");
  const { unreadCount } = useChatNotifications({ enabled: !!session });
  const { isStaff } = useIsVenueStaff();
  const { pendingCount: notificationsPendingCount } = useNotifications({
    enabled: !!session,
  });

  const totalBadgeCount = unreadCount + notificationsPendingCount;

  const closeMenu = () => setIsOpen(false);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:hidden">
      <GlobalSearch />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        className="relative"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        {!isOpen && totalBadgeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50"
            onClick={closeMenu}
          />

          {/* Menu */}
          <div className="fixed inset-x-0 top-16 z-50 border-b border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-md">
            <nav className="flex flex-col gap-1">
              {/* Main Navigation - All with icons */}
              {session ? (
                <>
                  <Link
                    href="/feed"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <NewspaperIcon className="h-4 w-4" />
                    {t("feed")}
                  </Link>

                  <Link
                    href="/chat"
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircleIcon className="h-4 w-4" />
                      {t("messages")}
                    </div>
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/notifications"
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      {t("notifications")}
                    </div>
                    {notificationsPendingCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-xs font-bold text-white">
                        {notificationsPendingCount > 9 ? "9+" : notificationsPendingCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/workouts"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <Dumbbell className="h-4 w-4" />
                    {t("workouts")}
                  </Link>

                  {isStaff && (
                    <Link
                      href="/my-schedule"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                      <CalendarClockIcon className="h-4 w-4" />
                      {t("mySchedule")}
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <HomeIcon className="h-4 w-4" />
                  {t("home")}
                </Link>
              )}

              <Link
                href="/events"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <CalendarIcon className="h-4 w-4" />
                {t("events")}
              </Link>

              <Link
                href="/venues"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <Building2Icon className="h-4 w-4" />
                {t("venues")}
              </Link>

              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <Shield className="h-4 w-4" />
                  {t("admin")}
                </Link>
              )}

              <div className="my-2 border-t" />

              {session ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                    {session.user.role === "ADMIN" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>

                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    {t("accountSettings")}
                  </Link>

                  <button
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <div className="px-3">
                  <Link href="/auth/signin" onClick={closeMenu}>
                    <Button variant="default" className="w-full">
                      {t("signIn")}
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
