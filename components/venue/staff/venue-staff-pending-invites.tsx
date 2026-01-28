"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, RotateCw, XCircle, User } from "lucide-react";
import type { VenueInvite } from "./types";

interface VenueStaffPendingInvitesProps {
  invites: VenueInvite[];
  onResend: (inviteId: string) => void;
  onCancel: (inviteId: string) => void;
}

export function VenueStaffPendingInvites({
  invites,
  onResend,
  onCancel,
}: VenueStaffPendingInvitesProps) {
  const t = useTranslations("venues.staff");
  const tRoles = useTranslations("venues.roles");

  if (invites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {t("pendingInvites")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invites.map((invite) => {
            // Determine display name and info
            const displayName =
              invite.invitedUser?.name || invite.email || "Unknown";
            const displayEmail = invite.invitedUser?.email || invite.email;
            const isUserInvite = !!invite.invitedUser;

            return (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex flex-1 items-center gap-3">
                  {isUserInvite ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={invite.invitedUser?.image || ""}
                        alt={displayName}
                      />
                      <AvatarFallback>
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{displayName}</p>
                      <Badge variant="outline">{tRoles(invite.role)}</Badge>
                    </div>
                    {displayEmail && displayEmail !== displayName && (
                      <p className="truncate text-sm text-muted-foreground">
                        {displayEmail}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("invitedBy", {
                        name: invite.invitedBy?.name || "Unknown",
                      })}{" "}
                      • {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResend(invite.id)}
                    title={t("resendInvite")}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(invite.id)}
                    title={t("cancelInvite")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
