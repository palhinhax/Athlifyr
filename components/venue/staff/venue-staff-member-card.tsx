"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { VenueMember } from "./types";
import { getRoleBadgeVariant } from "./types";

interface VenueStaffMemberCardProps {
  member: VenueMember;
  onRoleChange: (member: VenueMember, newRole: string) => void;
  onRemove: (member: VenueMember) => void;
}

export function VenueStaffMemberCard({
  member,
  onRoleChange,
  onRemove,
}: VenueStaffMemberCardProps) {
  const tRoles = useTranslations("venues.roles");

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={member.user.image || undefined}
            alt={member.user.name}
          />
          <AvatarFallback>
            {member.user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{member.user.name}</p>
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {member.role === "OWNER" ? (
          <Badge variant={getRoleBadgeVariant(member.role)}>
            {tRoles(member.role)}
          </Badge>
        ) : (
          <>
            <Select
              value={member.role}
              onValueChange={(value) => onRoleChange(member, value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{tRoles("ADMIN")}</SelectItem>
                <SelectItem value="COACH">{tRoles("COACH")}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(member)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
