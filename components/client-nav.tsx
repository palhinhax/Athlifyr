"use client";

import { NavLinks } from "./nav-links";
import { UserNav } from "./user-nav";
import { MobileNav } from "./mobile-nav";

export function DesktopNav() {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      <NavLinks />
      <UserNav />
    </nav>
  );
}

export function MobileNavWrapper() {
  return <MobileNav />;
}
