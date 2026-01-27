"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, RotateCw, XCircle } from "lucide-react";
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
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{invite.email}</p>
                  <Badge variant="outline">{tRoles(invite.role)}</Badge>
                </div>
                {invite.name && (
                  <p className="text-sm text-muted-foreground">{invite.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t("invitedBy", { name: invite.invitedBy.name })} •{" "}
                  {new Date(invite.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResend(invite.id)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(invite.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
