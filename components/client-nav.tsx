"use client";

import { NavLinks } from "./nav-links";
import { UserNav } from "./user-nav";
import { MobileNav } from "./mobile-nav";
import { GlobalSearch } from "./global-search";

export function DesktopNav() {
  return (
    <nav className="hidden items-center gap-4 md:flex">
      <GlobalSearch />
      <NavLinks />
      <UserNav />
    </nav>
  );
}

export function MobileNavWrapper() {
  return <MobileNav />;
}
