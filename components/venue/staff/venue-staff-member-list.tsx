"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import type { VenueMember } from "./types";
import { VenueStaffMemberCard } from "./venue-staff-member-card";

interface VenueStaffMemberListProps {
  members: VenueMember[];
  onRoleChange: (member: VenueMember, newRole: string) => void;
  onRemove: (member: VenueMember) => void;
}

export function VenueStaffMemberList({
  members,
  onRoleChange,
  onRemove,
}: VenueStaffMemberListProps) {
  const t = useTranslations("venues.staff");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t("currentStaff")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("noStaff")}</p>
            <p className="text-xs text-muted-foreground">
              {t("noStaffDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <VenueStaffMemberCard
                key={member.id}
                member={member}
                onRoleChange={onRoleChange}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
