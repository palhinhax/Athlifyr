"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Shield,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ListChecks,
  Users,
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
import { CustomFieldsForm } from "@/components/custom-fields-form";
import type { TeamMemberData } from "@/components/event-registration";

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
  hasCustomFields?: boolean;
  /** The custom field definitions — used to validate required fields */
  customFields?: CustomField[];
  /** Per-participant answers map: key = participantIndex (0 = main, 1+ = team members) */
  customFieldAnswersMap?: Record<number, CustomFieldAnswer[]>;
  /** Callback to update the full answers map */
  onCustomFieldAnswersMapChange?: (
    map: Record<number, CustomFieldAnswer[]>
  ) => void;
  /** Total number of people in team (1 = individual, 2-4 = team) */
  teamSize?: number;
  /** Extra team member data (length = teamSize - 1) */
  teamMembers?: TeamMemberData[];
  /** Callback to update team members */
  onTeamMembersChange?: (members: TeamMemberData[]) => void;
}

export function RegistrationConsentDialog({
  open,
  onOpenChange,
  requiredFields,
  optionalFields = [],
  userProfile,
  onConfirm,
  hasCustomFields = false,
  customFields = [],
  customFieldAnswersMap = {},
  onCustomFieldAnswersMapChange,
  teamSize = 1,
  teamMembers = [],
  onTeamMembersChange,
}: RegistrationConsentDialogProps) {
  const t = useTranslations("events.registration.consent");

  // Step is a number: 1 = consent, 2 = custom fields, 3+ = team members
  const [step, setStep] = useState(1);
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

  // ── Step flow computation ────────────────────────────────────────────────
  // Build an ordered list of step identifiers.
  // When there are custom fields AND team members, each participant gets
  // their own custom-fields step.
  // Flow: consent → custom-0 (main) → team-0 + custom-1 → team-1 + custom-2 …
  const extraTeamCount = teamSize > 1 ? teamSize - 1 : 0;
  const steps: string[] = [];
  if (hasConsentFields) steps.push("consent");
  // Custom fields for main registrant (participant 0)
  if (hasCustomFields) steps.push("custom-0");
  // Team member steps: each team member gets their data step + custom fields step
  for (let i = 0; i < extraTeamCount; i++) {
    steps.push(`team-${i}`);
    if (hasCustomFields) steps.push(`custom-${i + 1}`);
  }
  // If no steps at all but teamSize is 1, still need at least consent
  if (steps.length === 0) steps.push("consent");

  const totalSteps = steps.length;
  // Map step number (1-based human) to step identifier
  const currentStepId = steps[step - 1] ?? steps[0];
  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  // ── Team member helper ───────────────────────────────────────────────────
  const updateTeamMember = (
    index: number,
    field: keyof TeamMemberData,
    value: string
  ) => {
    if (!onTeamMembersChange) return;
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    onTeamMembersChange(updated);
  };

  // ── Per-participant custom field answer helpers ──────────────────────────
  const getParticipantAnswers = (
    participantIndex: number
  ): CustomFieldAnswer[] => customFieldAnswersMap[participantIndex] ?? [];

  const setParticipantAnswers = (
    participantIndex: number,
    answers: CustomFieldAnswer[]
  ) => {
    onCustomFieldAnswersMapChange?.({
      ...customFieldAnswersMap,
      [participantIndex]: answers,
    });
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validateConsentStep = (): boolean => {
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

  const validateCustomFieldsStep = (participantIndex: number): boolean => {
    const answers = getParticipantAnswers(participantIndex);
    const missingRequired = customFields.filter((field) => {
      if (!field.required) return false;
      const answer = answers.find((a) => a.customFieldId === field.id);
      if (!answer || !answer.value.trim()) return true;
      if (field.type === "SELECT" && !answer.value.trim()) return true;
      return false;
    });

    if (missingRequired.length > 0) {
      setError(t("customFieldRequired", { field: missingRequired[0].label }));
      return false;
    }
    return true;
  };

  const validateTeamMemberStep = (memberIndex: number): boolean => {
    setError(null);
    const member = teamMembers[memberIndex];
    if (!member) return false;
    if (!member.name.trim()) {
      setError(t("teamMemberNameRequired"));
      return false;
    }
    // Enforce the same required fields as the main registrant
    if (requiredFields.includes("dateOfBirth") && !member.dateOfBirth) {
      setError(t("teamMemberDateOfBirthRequired"));
      return false;
    }
    if (requiredFields.includes("citizenId") && !member.citizenId.trim()) {
      setError(t("teamMemberCitizenIdRequired"));
      return false;
    }
    if (
      requiredFields.includes("emergencyContact") &&
      (!member.emergencyContactName.trim() ||
        !member.emergencyContactPhone.trim())
    ) {
      setError(t("teamMemberEmergencyContactRequired"));
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

  // ── Navigation ───────────────────────────────────────────────────────────
  const handleNextStep = async () => {
    setError(null);

    // Validate current step
    if (currentStepId === "consent") {
      if (!validateConsentStep()) return;
      const saved = await saveProfileFields();
      if (!saved) return;
    } else if (currentStepId.startsWith("custom-")) {
      const participantIndex = parseInt(currentStepId.split("-")[1], 10);
      if (!validateCustomFieldsStep(participantIndex)) return;
    } else if (currentStepId.startsWith("team-")) {
      const memberIndex = parseInt(currentStepId.split("-")[1], 10);
      if (!validateTeamMemberStep(memberIndex)) return;
    }

    if (isLastStep) {
      onConfirm();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (!isFirstStep) {
      setStep((prev) => prev - 1);
    }
  };

  // ── Step indicators ──────────────────────────────────────────────────────

  const stepIndicator =
    totalSteps > 1 ? (
      <div className="flex items-center justify-center gap-2 pb-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              step === i + 1 ? "bg-p-brand" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    ) : null;

  const hasMoreSteps = !isLastStep;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {stepIndicator}

        {/* ═══ CONSENT STEP: Consent & Profile Fields ═══ */}
        {currentStepId === "consent" && (
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
                onClick={() => void handleNextStep()}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {hasMoreSteps ? (
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

        {/* ═══ CUSTOM FIELDS STEP (per participant) ═══ */}
        {currentStepId.startsWith("custom-") &&
          (() => {
            const participantIndex = parseInt(currentStepId.split("-")[1], 10);
            // Participant 0 = main registrant, 1+ = team member
            const isMainParticipant = participantIndex === 0;
            const participantLabel = isMainParticipant
              ? teamSize > 1
                ? t("participantYou")
                : undefined
              : t("teamMemberTitle", { number: participantIndex + 1 });

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-p-brand" />
                    {t("step2Title")}
                  </DialogTitle>
                  <DialogDescription>
                    {participantLabel
                      ? t("customFieldsForParticipant", {
                          participant: participantLabel,
                        })
                      : t("step2Description")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <CustomFieldsForm
                    fields={customFields}
                    answers={getParticipantAnswers(participantIndex)}
                    onAnswersChange={(answers) =>
                      setParticipantAnswers(participantIndex, answers)
                    }
                    participantLabel={participantLabel}
                  />

                  {error && (
                    <p className="text-sm text-destructive">
                      <AlertCircle className="mr-1 inline-block h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-between">
                  {!isFirstStep ? (
                    <Button
                      variant="ghost"
                      onClick={handlePrevStep}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t("back")}
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                      {t("cancel")}
                    </Button>
                  )}
                  <Button
                    onClick={() => void handleNextStep()}
                    className="gap-2"
                  >
                    {hasMoreSteps ? (
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
            );
          })()}

        {/* ═══ TEAM MEMBER STEPS ═══ */}
        {currentStepId.startsWith("team-") &&
          (() => {
            const memberIndex = parseInt(currentStepId.split("-")[1], 10);
            const member = teamMembers[memberIndex];
            if (!member) return null;

            const dobRequired = requiredFields.includes("dateOfBirth");
            const ccRequired = requiredFields.includes("citizenId");
            const emergencyRequired =
              requiredFields.includes("emergencyContact");
            const showDob = allFields.includes("dateOfBirth") || dobRequired;
            const showCc = allFields.includes("citizenId") || ccRequired;
            const showEmergency =
              allFields.includes("emergencyContact") || emergencyRequired;

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-p-brand" />
                    {t("teamMemberTitle", { number: memberIndex + 2 })}
                  </DialogTitle>
                  <DialogDescription>
                    {t("teamMemberDescription", {
                      number: memberIndex + 2,
                      total: teamSize,
                    })}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`team-name-${memberIndex}`}>
                      {t("teamMemberName")} *
                    </Label>
                    <Input
                      id={`team-name-${memberIndex}`}
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(memberIndex, "name", e.target.value)
                      }
                      placeholder={t("teamMemberNamePlaceholder")}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`team-email-${memberIndex}`}>
                      {t("teamMemberEmail")}
                    </Label>
                    <Input
                      id={`team-email-${memberIndex}`}
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateTeamMember(memberIndex, "email", e.target.value)
                      }
                      placeholder={t("teamMemberEmailPlaceholder")}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`team-phone-${memberIndex}`}>
                      {t("teamMemberPhone")}
                    </Label>
                    <Input
                      id={`team-phone-${memberIndex}`}
                      type="tel"
                      value={member.phone}
                      onChange={(e) =>
                        updateTeamMember(memberIndex, "phone", e.target.value)
                      }
                      placeholder={t("teamMemberPhonePlaceholder")}
                    />
                  </div>

                  {(showDob || showCc) && (
                    <div className="grid grid-cols-2 gap-3">
                      {showDob && (
                        <div className="grid gap-2">
                          <Label htmlFor={`team-dob-${memberIndex}`}>
                            {t("fieldDateOfBirth")}
                            {dobRequired ? (
                              " *"
                            ) : (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({t("optional")})
                              </span>
                            )}
                          </Label>
                          <Input
                            id={`team-dob-${memberIndex}`}
                            type="date"
                            value={member.dateOfBirth}
                            onChange={(e) =>
                              updateTeamMember(
                                memberIndex,
                                "dateOfBirth",
                                e.target.value
                              )
                            }
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      )}

                      {showCc && (
                        <div className="grid gap-2">
                          <Label htmlFor={`team-cc-${memberIndex}`}>
                            {t("fieldCitizenId")}
                            {ccRequired ? (
                              " *"
                            ) : (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({t("optional")})
                              </span>
                            )}
                          </Label>
                          <Input
                            id={`team-cc-${memberIndex}`}
                            type="text"
                            value={member.citizenId}
                            onChange={(e) =>
                              updateTeamMember(
                                memberIndex,
                                "citizenId",
                                e.target.value
                              )
                            }
                            placeholder={t("citizenIdPlaceholder")}
                            maxLength={30}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {showEmergency && (
                    <div className="grid gap-2">
                      <Label>
                        {t("fieldEmergencyContact")}
                        {emergencyRequired ? (
                          " *"
                        ) : (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({t("optional")})
                          </span>
                        )}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id={`team-emergency-name-${memberIndex}`}
                          type="text"
                          value={member.emergencyContactName}
                          onChange={(e) =>
                            updateTeamMember(
                              memberIndex,
                              "emergencyContactName",
                              e.target.value
                            )
                          }
                          placeholder={t("emergencyNamePlaceholder")}
                        />
                        <Input
                          id={`team-emergency-phone-${memberIndex}`}
                          type="tel"
                          value={member.emergencyContactPhone}
                          onChange={(e) =>
                            updateTeamMember(
                              memberIndex,
                              "emergencyContactPhone",
                              e.target.value
                            )
                          }
                          placeholder={t("emergencyPhonePlaceholder")}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-destructive">
                      <AlertCircle className="mr-1 inline-block h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-between">
                  <Button
                    variant="ghost"
                    onClick={handlePrevStep}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("back")}
                  </Button>
                  <Button
                    onClick={() => void handleNextStep()}
                    className="gap-2"
                  >
                    {hasMoreSteps ? (
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
            );
          })()}
      </DialogContent>
    </Dialog>
  );
}
