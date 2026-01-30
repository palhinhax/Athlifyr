"use client";

import { NavLinks } from "./nav-links";
import { UserNav } from "./user-nav";
import { MobileNav } from "./mobile-nav";
import { GlobalSearch } from "./global-search";
import { WallClock } from "./wall-clock";
import { ChatNotificationBell } from "./chat/chat-notification-bell";
import { useSession } from "next-auth/react";

export function DesktopNav() {
  const { data: session } = useSession();

  return (
    <nav className="hidden items-center gap-4 md:flex">
      <WallClock />
      <GlobalSearch />
      <NavLinks />
      {session && <ChatNotificationBell />}
      <UserNav />
    </nav>
  );
}

export function MobileNavWrapper() {
  return <MobileNav />;
}
