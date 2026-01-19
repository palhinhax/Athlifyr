"use client";

import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Shield, Building2 } from "lucide-react";
import Image from "next/image";
import { useUserVenues } from "@/hooks/use-user-venues";

export function UserNav() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tVenues = useTranslations("venues");
  const { venues } = useUserVenues();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm">
          {t("signIn")}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
            {session.user.role === "ADMIN" && (
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            {t("accountSettings")}
          </Link>
        </DropdownMenuItem>

        {/* User Venues */}
        {venues.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {tVenues("myVenues")}
            </DropdownMenuLabel>
            {venues.slice(0, 5).map((venue) => (
              <DropdownMenuItem key={venue.id} asChild>
                <Link href={`/venues/${venue.slug}`} className="cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="truncate">{venue.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {venue.role}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            {venues.length > 5 && (
              <DropdownMenuItem asChild>
                <Link href="/venues" className="cursor-pointer text-primary">
                  <Building2 className="mr-2 h-4 w-4" />
                  {tVenues("viewAll")} ({venues.length})
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}

        {session.user.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                {t("admin")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
