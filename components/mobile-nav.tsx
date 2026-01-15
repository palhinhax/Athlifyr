"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react";
import { getTranslations } from "@/lib/translations";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [locale, setLocale] = useState("pt");

  // Extract locale from pathname (first segment after /)
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const pathLocale = segments[0];
    // Check if first segment is a valid locale
    if (["pt", "en", "es", "fr", "de", "it"].includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const t = getTranslations(locale);

  const closeMenu = () => setIsOpen(false);

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50"
            onClick={closeMenu}
          />

          {/* Menu */}
          <div className="fixed inset-x-0 top-16 z-50 border-b bg-background p-4 shadow-lg">
            <nav className="flex flex-col gap-2">
              {session && (
                <Link
                  href={`/${locale}/profile`}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  {t("nav.profile")}
                </Link>
              )}
              <Link
                href={`/${locale}/events`}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {t("nav.events")}
              </Link>
              <Link
                href={`/${locale}/map`}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {t("nav.map")}
              </Link>
              {session && (
                <Link
                  href={`/${locale}/feed`}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {t("nav.feed")}
                </Link>
              )}
              <Link
                href={`/${locale}/contact`}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {t("nav.contact")}
              </Link>

              <div className="my-2 border-t" />

              {session ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                    {session.user.role === "ADMIN" && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/${locale}/settings`}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    {t("nav.accountSettings")}
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <>
                      <Link
                        href={`/${locale}/admin/events`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Shield className="h-4 w-4" />
                        {t("nav.manageEvents")}
                      </Link>
                      <Link
                        href={`/${locale}/admin/instagram`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Shield className="h-4 w-4" />
                        {t("nav.instagramGenerator")}
                      </Link>
                      <Link
                        href={`/${locale}/admin/contacts`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Shield className="h-4 w-4" />
                        {t("nav.adminContacts")}
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <div className="px-3">
                  <Link href={`/${locale}/auth/signin`} onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      {t("nav.signIn")}
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
