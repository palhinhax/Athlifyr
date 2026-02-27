"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Shield,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";

interface UserProfileData {
  dateOfBirth: string | null;
  citizenId: string | null;
  nationality: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

interface RegistrationConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredFields: string[];
  optionalFields?: string[];
  userProfile: UserProfileData | null;
  onConfirm: () => void;
  customFieldsSlot?: React.ReactNode;
  hasCustomFields?: boolean;
  /** The custom field definitions — used to validate required fields */
  customFields?: CustomField[];
  /** The current answers — used to validate required fields */
  customFieldAnswers?: CustomFieldAnswer[];
}

export function RegistrationConsentDialog({
  open,
  onOpenChange,
  requiredFields,
  optionalFields = [],
  userProfile,
  onConfirm,
  customFieldsSlot,
  hasCustomFields = false,
  customFields = [],
  customFieldAnswers = [],
}: RegistrationConsentDialogProps) {
  const t = useTranslations("events.registration.consent");

  const [step, setStep] = useState<1 | 2>(1);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from user profile when dialog opens
  useEffect(() => {
    if (open && userProfile) {
      setDateOfBirth(
        userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
          : ""
      );
      setCitizenId(userProfile.citizenId ?? "");
      setEmergencyName(userProfile.emergencyContactName ?? "");
      setEmergencyPhone(userProfile.emergencyContactPhone ?? "");
    }
    if (open) {
      setError(null);
      setStep(1);
    }
  }, [open, userProfile]);

  // All configured fields (required + optional)
  const allFields = [...requiredFields, ...optionalFields];
  const hasConsentFields = allFields.length > 0;

  // Determine which fields are missing (need user input)
  const needsDateOfBirth =
    allFields.includes("dateOfBirth") && !userProfile?.dateOfBirth;
  const needsCitizenId =
    allFields.includes("citizenId") && !userProfile?.citizenId;
  const needsEmergencyContact =
    allFields.includes("emergencyContact") &&
    (!userProfile?.emergencyContactName || !userProfile?.emergencyContactPhone);

  // Which of the missing fields are required vs optional
  const dateOfBirthRequired = requiredFields.includes("dateOfBirth");
  const citizenIdRequired = requiredFields.includes("citizenId");
  const emergencyContactRequired = requiredFields.includes("emergencyContact");

  const hasMissingFields =
    needsDateOfBirth || needsCitizenId || needsEmergencyContact;

  // Fields that the user already has but will be shared
  const sharedExistingFields = allFields.filter((f) => {
    if (f === "dateOfBirth" && userProfile?.dateOfBirth) return true;
    if (f === "citizenId" && userProfile?.citizenId) return true;
    if (
      f === "emergencyContact" &&
      userProfile?.emergencyContactName &&
      userProfile?.emergencyContactPhone
    )
      return true;
    return false;
  });

  // Determine total steps — if no consent fields (only custom fields), start at step 2
  const totalSteps = hasConsentFields && hasCustomFields ? 2 : 1;
  const effectiveStep = !hasConsentFields && hasCustomFields ? 2 : step;

  const validateStep1 = (): boolean => {
    setError(null);
    if (needsDateOfBirth && dateOfBirthRequired && !dateOfBirth) {
      setError(t("dateOfBirthRequired"));
      return false;
    }
    if (needsCitizenId && citizenIdRequired && !citizenId.trim()) {
      setError(t("citizenIdRequired"));
      return false;
    }
    if (
      needsEmergencyContact &&
      emergencyContactRequired &&
      (!emergencyName.trim() || !emergencyPhone.trim())
    ) {
      setError(t("emergencyContactRequired"));
      return false;
    }
    return true;
  };

  const saveProfileFields = async (): Promise<boolean> => {
    if (!hasMissingFields) return true;

    setIsSaving(true);
    try {
      const payload: Record<string, string | null> = {};
      if (needsDateOfBirth && dateOfBirth) {
        payload.dateOfBirth = new Date(dateOfBirth).toISOString();
      }
      if (needsCitizenId && citizenId.trim()) {
        payload.citizenId = citizenId.trim();
      }
      if (needsEmergencyContact) {
        if (emergencyName.trim()) {
          payload.emergencyContactName = emergencyName.trim();
        }
        if (emergencyPhone.trim()) {
          payload.emergencyContactPhone = emergencyPhone.trim();
        }
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      return true;
    } catch {
      setError(t("saveError"));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep1()) return;
    const saved = await saveProfileFields();
    if (!saved) return;

    if (hasCustomFields) {
      setError(null);
      setStep(2);
    } else {
      onConfirm();
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(1);
  };

  const handleFinish = () => {
    // Validate required custom fields
    const missingRequired = customFields.filter((field) => {
      if (!field.required) return false;
      const answer = customFieldAnswers.find(
        (a) => a.customFieldId === field.id
      );
      if (!answer || !answer.value.trim()) return true;
      // For SELECT fields, an empty string means nothing was selected
      if (field.type === "SELECT" && !answer.value.trim()) return true;
      return false;
    });

    if (missingRequired.length > 0) {
      setError(t("customFieldRequired", { field: missingRequired[0].label }));
      return;
    }

    setError(null);
    onConfirm();
  };

  // ── Step indicators ──────────────────────────────────────────────────────

  const stepIndicator =
    totalSteps === 2 ? (
      <div className="flex items-center justify-center gap-2 pb-2">
        <div
          className={`h-2 w-2 rounded-full transition-colors ${
            effectiveStep === 1 ? "bg-p-brand" : "bg-muted-foreground/30"
          }`}
        />
        <div
          className={`h-2 w-2 rounded-full transition-colors ${
            effectiveStep === 2 ? "bg-p-brand" : "bg-muted-foreground/30"
          }`}
        />
      </div>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {stepIndicator}

        {/* ═══ STEP 1: Consent & Profile Fields ═══ */}
        {effectiveStep === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-p-brand" />
                {t("title")}
              </DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Data sharing notice */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-3 text-sm font-medium">{t("dataShared")}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                    {t("fieldName")}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                    {t("fieldEmail")}
                  </li>
                  {allFields.includes("dateOfBirth") && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                      {t("fieldDateOfBirth")}
                      {!dateOfBirthRequired && (
                        <span className="text-xs italic">
                          ({t("optional")})
                        </span>
                      )}
                    </li>
                  )}
                  {allFields.includes("citizenId") && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                      {t("fieldCitizenId")}
                      {!citizenIdRequired && (
                        <span className="text-xs italic">
                          ({t("optional")})
                        </span>
                      )}
                    </li>
                  )}
                  {allFields.includes("emergencyContact") && (
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                      {t("fieldEmergencyContact")}
                      {!emergencyContactRequired && (
                        <span className="text-xs italic">
                          ({t("optional")})
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </div>

              {/* Already-filled fields info */}
              {sharedExistingFields.length > 0 && !hasMissingFields && (
                <p className="text-xs text-muted-foreground">
                  {t("dataFromProfile")}
                </p>
              )}

              {/* Missing fields form */}
              {hasMissingFields && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    <AlertCircle className="mr-1 inline-block h-4 w-4" />
                    {t("missingFields")}
                  </p>

                  {needsDateOfBirth && (
                    <div className="grid gap-2">
                      <Label htmlFor="consent-dob">
                        {t("fieldDateOfBirth")}
                        {!dateOfBirthRequired && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({t("optional")})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="consent-dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("savedToProfile")}
                      </p>
                    </div>
                  )}

                  {needsCitizenId && (
                    <div className="grid gap-2">
                      <Label htmlFor="consent-cc">
                        {t("fieldCitizenId")}
                        {!citizenIdRequired && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({t("optional")})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="consent-cc"
                        type="text"
                        value={citizenId}
                        onChange={(e) => setCitizenId(e.target.value)}
                        placeholder={t("citizenIdPlaceholder")}
                        maxLength={30}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("citizenIdHelp")}
                      </p>
                    </div>
                  )}

                  {needsEmergencyContact && (
                    <div className="grid gap-2">
                      <Label>
                        {t("fieldEmergencyContact")}
                        {!emergencyContactRequired && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({t("optional")})
                          </span>
                        )}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="consent-emergency-name"
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder={t("emergencyNamePlaceholder")}
                        />
                        <Input
                          id="consent-emergency-phone"
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder={t("emergencyPhonePlaceholder")}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("emergencyContactHelp")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">
                  <AlertCircle className="mr-1 inline-block h-4 w-4" />
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="flex-row gap-2 sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={() => void handleNext()}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {hasCustomFields ? (
                  <>
                    {t("next")}
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  t("confirm")
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ═══ STEP 2: Custom Fields ═══ */}
        {effectiveStep === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-p-brand" />
                {t("step2Title")}
              </DialogTitle>
              <DialogDescription>{t("step2Description")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {customFieldsSlot}

              {error && (
                <p className="text-sm text-destructive">
                  <AlertCircle className="mr-1 inline-block h-4 w-4" />
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="flex-row gap-2 sm:justify-between">
              {hasConsentFields ? (
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {t("back")}
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  {t("cancel")}
                </Button>
              )}
              <Button onClick={handleFinish} className="gap-2">
                {t("confirm")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
