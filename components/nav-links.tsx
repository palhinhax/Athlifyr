"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function NavLinks() {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <Link href="/profile" className="text-sm font-medium hover:underline">
          Perfil
        </Link>
      )}
      <Link href="/events" className="text-sm font-medium hover:underline">
        Eventos
      </Link>
      <Link href="/feed" className="text-sm font-medium hover:underline">
        Feed
      </Link>
    </>
  );
}
