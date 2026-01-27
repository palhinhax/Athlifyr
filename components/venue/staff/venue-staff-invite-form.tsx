"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Send, Loader2 } from "lucide-react";
import type { InviteFormData } from "./types";

interface VenueStaffInviteFormProps {
  inviteForm: InviteFormData;
  onFormChange: (form: InviteFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function VenueStaffInviteForm({
  inviteForm,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading,
}: VenueStaffInviteFormProps) {
  const t = useTranslations("venues.staff");
  const tRoles = useTranslations("venues.roles");
  const tCommon = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {t("inviteStaff")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t("inviteEmail")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("inviteEmailPlaceholder")}
              value={inviteForm.email}
              onChange={(e) =>
                onFormChange({ ...inviteForm, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t("inviteRole")}</Label>
            <Select
              value={inviteForm.role}
              onValueChange={(value) =>
                onFormChange({ ...inviteForm, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{tRoles("ADMIN")}</SelectItem>
                <SelectItem value="COACH">{tRoles("COACH")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{t("inviteName")}</Label>
          <Input
            id="name"
            placeholder={t("inviteNamePlaceholder")}
            value={inviteForm.name}
            onChange={(e) =>
              onFormChange({ ...inviteForm, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("inviteMessage")}</Label>
          <Textarea
            id="message"
            placeholder={t("inviteMessagePlaceholder")}
            value={inviteForm.message}
            onChange={(e) =>
              onFormChange({ ...inviteForm, message: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onSubmit} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {t("inviteButton")}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {tCommon("cancel")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
