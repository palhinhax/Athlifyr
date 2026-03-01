"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

interface PersonalDataFormProps {
  initialData: {
    dateOfBirth: Date | null;
    citizenId: string | null;
    nationality: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
  };
}

export function PersonalDataForm({ initialData }: PersonalDataFormProps) {
  const t = useTranslations("settings.personalData");
  const { toast } = useToast();

  const [dateOfBirth, setDateOfBirth] = useState(
    initialData.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : ""
  );
  const [citizenId, setCitizenId] = useState(initialData.citizenId ?? "");
  const [nationality, setNationality] = useState(initialData.nationality ?? "");
  const [emergencyContactName, setEmergencyContactName] = useState(
    initialData.emergencyContactName ?? ""
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    initialData.emergencyContactPhone ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string | null> = {};

      // dateOfBirth → ISO string or null
      payload.dateOfBirth = dateOfBirth
        ? new Date(dateOfBirth).toISOString()
        : null;
      payload.citizenId = citizenId.trim() || null;
      payload.nationality = nationality.trim() || null;
      payload.emergencyContactName = emergencyContactName.trim() || null;
      payload.emergencyContactPhone = emergencyContactPhone.trim() || null;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: t("saved"),
        description: t("savedDescription"),
      });
    } catch {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t("description")}</p>

      {/* Date of Birth */}
      <div className="grid gap-2">
        <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="max-w-xs"
        />
      </div>

      {/* Nationality */}
      <div className="grid gap-2">
        <Label htmlFor="nationality">{t("nationality")}</Label>
        <Input
          id="nationality"
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder={t("nationalityPlaceholder")}
          maxLength={100}
          className="max-w-xs"
        />
      </div>

      {/* Citizen ID */}
      <div className="grid gap-2">
        <Label htmlFor="citizenId">{t("citizenId")}</Label>
        <Input
          id="citizenId"
          type="text"
          value={citizenId}
          onChange={(e) => setCitizenId(e.target.value)}
          placeholder={t("citizenIdPlaceholder")}
          maxLength={30}
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">{t("citizenIdHelp")}</p>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{t("emergencyContact")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("emergencyContactHelp")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="emergencyName">{t("emergencyName")}</Label>
            <Input
              id="emergencyName"
              type="text"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              placeholder={t("emergencyNamePlaceholder")}
              maxLength={100}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyPhone">{t("emergencyPhone")}</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              placeholder={t("emergencyPhonePlaceholder")}
              maxLength={30}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
