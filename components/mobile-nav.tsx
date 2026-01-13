"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

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
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
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
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              )}
              <Link
                href="/events"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Eventos
              </Link>
              <Link
                href="/feed"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Feed
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
                    href="/settings"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    Definições da Conta
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin/events"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                      <Shield className="h-4 w-4" />
                      Gerir Eventos
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link href="/auth/signin" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={closeMenu}>
                    <Button className="w-full">Criar Conta</Button>
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
