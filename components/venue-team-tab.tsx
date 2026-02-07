"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface VenueTeamTabProps {
  members: TeamMember[];
}

export function VenueTeamTab({ members }: VenueTeamTabProps) {
  const t = useTranslations("venues");
  const tRoles = useTranslations("venues.roles");

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t("noTeamMembers")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <Link
          key={member.id}
          href={`/user/${member.user.id}`}
          className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            {member.user.image ? (
              <Image
                src={member.user.image}
                alt={member.user.name || "User"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {member.user.name?.[0] || "?"}
              </div>
            )}
            <div>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {tRoles(member.role)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
