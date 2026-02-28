"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Shield,
  Users,
  ListChecks,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { CustomFieldsForm } from "@/components/custom-fields-form";
import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeamMemberData {
  name: string;
  email: string;
  dateOfBirth: string;
  citizenId: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface PricingPhase {
  id: string;
  name: string | null;
  price: number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
}

interface EventVariant {
  id: string;
  name: string;
  distanceKm?: number | null;
  startDate?: string | null;
  startTime?: string | null;
  maxParticipants?: number | null;
  registrationCount?: number;
  pricingPhases?: PricingPhase[];
  teamSize?: number;
}

interface UserProfileData {
  dateOfBirth: string | null;
  citizenId: string | null;
  nationality: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

interface RegistrationFlowProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  variants: EventVariant[];
  initialVariantId: string | null;
  registrationFieldSettings: Record<string, string>;
  customFields: CustomField[];
  userProfile: UserProfileData | null;
}

// ── Step IDs ──────────────────────────────────────────────────────────────────

type StepId =
  | "variant"
  | "consent"
  | `custom-${number}`
  | `team-${number}`
  | "review";

// ── Component ─────────────────────────────────────────────────────────────────

export function RegistrationFlow({
  eventId,
  eventSlug,
  eventTitle,
  variants,
  initialVariantId,
  registrationFieldSettings,
  customFields,
  userProfile,
}: RegistrationFlowProps) {
  const router = useRouter();
  const t = useTranslations("events.registration");
  const tc = useTranslations("events.registration.consent");
  const { toast } = useToast();

  // ── State ─────────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consent / profile fields
  const [dateOfBirth, setDateOfBirth] = useState(
    userProfile?.dateOfBirth
      ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
      : ""
  );
  const [citizenId, setCitizenId] = useState(userProfile?.citizenId ?? "");
  const [emergencyName, setEmergencyName] = useState(
    userProfile?.emergencyContactName ?? ""
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    userProfile?.emergencyContactPhone ?? ""
  );

  // Custom field answers: map from participantIndex → answers
  const [customFieldAnswersMap, setCustomFieldAnswersMap] = useState<
    Record<number, CustomFieldAnswer[]>
  >({});

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  // ── Derived values ────────────────────────────────────────────────────────
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const teamSize = selectedVariant?.teamSize ?? 1;
  const extraTeamCount = teamSize > 1 ? teamSize - 1 : 0;

  const requiredFields = Object.entries(registrationFieldSettings)
    .filter(([, v]) => v === "required")
    .map(([k]) => k);
  const optionalFields = Object.entries(registrationFieldSettings)
    .filter(([, v]) => v === "optional")
    .map(([k]) => k);
  const allFields = [...requiredFields, ...optionalFields];
  const hasConsentFields = allFields.length > 0;
  const hasCustomFields = customFields.length > 0;

  // Active price for selected variant
  const activePrice = (() => {
    if (!selectedVariant) return null;
    const now = new Date();
    const phases = selectedVariant.pricingPhases ?? [];
    return (
      phases.find(
        (p) =>
          (!p.startDate || new Date(p.startDate) <= now) &&
          (!p.endDate || new Date(p.endDate) >= now)
      ) ?? null
    );
  })();

  // ── Build step flow ───────────────────────────────────────────────────────
  const buildSteps = useCallback((): StepId[] => {
    const steps: StepId[] = [];

    // Step 1: variant selection (always if >1 variant and no initial)
    if (variants.length > 1) {
      steps.push("variant");
    }

    // Step 2: consent / profile fields (if organizer requires fields)
    if (hasConsentFields) {
      steps.push("consent");
    }

    // Step 3: custom fields for main registrant
    if (hasCustomFields) {
      steps.push("custom-0");
    }

    // Step 4+: team member steps
    for (let i = 0; i < extraTeamCount; i++) {
      steps.push(`team-${i}`);
      if (hasCustomFields) steps.push(`custom-${i + 1}`);
    }

    // Final step: review & pay
    steps.push("review");

    return steps;
  }, [variants.length, hasConsentFields, hasCustomFields, extraTeamCount]);

  const [steps, setSteps] = useState<StepId[]>(buildSteps());

  useEffect(() => {
    setSteps(buildSteps());
  }, [buildSteps]);

  const currentStepId = steps[currentStep] ?? "review";
  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Initialize team members when variant changes
  useEffect(() => {
    if (extraTeamCount <= 0) {
      setTeamMembers([]);
      return;
    }
    setTeamMembers((prev) => {
      if (prev.length === extraTeamCount) return prev;
      const members: TeamMemberData[] = [];
      for (let i = 0; i < extraTeamCount; i++) {
        members.push(
          prev[i] ?? {
            name: "",
            email: "",
            dateOfBirth: "",
            citizenId: "",
            phone: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
          }
        );
      }
      return members;
    });
  }, [extraTeamCount]);

  // ── Missing profile fields ────────────────────────────────────────────────
  const needsDateOfBirth =
    allFields.includes("dateOfBirth") && !userProfile?.dateOfBirth;
  const needsCitizenId =
    allFields.includes("citizenId") && !userProfile?.citizenId;
  const needsEmergencyContact =
    allFields.includes("emergencyContact") &&
    (!userProfile?.emergencyContactName || !userProfile?.emergencyContactPhone);
  const hasMissingFields =
    needsDateOfBirth || needsCitizenId || needsEmergencyContact;

  const dateOfBirthRequired = requiredFields.includes("dateOfBirth");
  const citizenIdRequired = requiredFields.includes("citizenId");
  const emergencyContactRequired = requiredFields.includes("emergencyContact");

  // ── Helper functions ──────────────────────────────────────────────────────
  const updateTeamMember = (
    index: number,
    field: keyof TeamMemberData,
    value: string
  ) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getParticipantAnswers = (idx: number): CustomFieldAnswer[] =>
    customFieldAnswersMap[idx] ?? [];

  const setParticipantAnswers = (idx: number, answers: CustomFieldAnswer[]) => {
    setCustomFieldAnswersMap((prev) => ({ ...prev, [idx]: answers }));
  };

  const allCustomFieldAnswers: CustomFieldAnswer[] = Object.entries(
    customFieldAnswersMap
  ).flatMap(([idx, answers]) =>
    answers.map((a) => ({ ...a, participantIndex: Number(idx) }))
  );

  // ── Price calculation ─────────────────────────────────────────────────────
  const calculateTotals = () => {
    if (!activePrice) return { items: [], total: 0, currency: "EUR" };

    const currency = activePrice.currency;
    const pricePerPerson = activePrice.price;
    const items: { label: string; amount: number; qty: number }[] = [];

    // Base registration × teamSize
    for (let i = 0; i < teamSize; i++) {
      const label =
        teamSize > 1
          ? i === 0
            ? `${selectedVariant?.name ?? ""} — ${tc("participantYou").replace(/ \(.*\)/, "")}`
            : `${selectedVariant?.name ?? ""} — ${tc("teamMemberTitle", { number: i + 1 })}`
          : (selectedVariant?.name ?? eventTitle);
      items.push({ label, amount: pricePerPerson, qty: 1 });
    }

    // Custom field extras per participant
    for (const [idxStr, answers] of Object.entries(customFieldAnswersMap)) {
      const idx = Number(idxStr);
      for (const answer of answers) {
        const field = customFields.find((f) => f.id === answer.customFieldId);
        if (!field || field.priceCents <= 0) continue;

        const shouldCharge =
          field.type === "BOOLEAN"
            ? answer.value === "true"
            : answer.value.trim().length > 0;

        if (shouldCharge) {
          const who =
            teamSize > 1
              ? idx === 0
                ? tc("participantYou").replace(/ \(.*\)/, "")
                : tc("teamMemberTitle", { number: idx + 1 })
              : "";
          const label = who ? `${field.label} — ${who}` : field.label;
          items.push({
            label,
            amount: field.priceCents / 100,
            qty: 1,
          });
        }
      }
    }

    const total = items.reduce((sum, item) => sum + item.amount * item.qty, 0);
    return { items, total, currency };
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateVariantStep = (): boolean => {
    if (!selectedVariantId) {
      setError(t("selectVariantRequired"));
      return false;
    }
    // Check sold out
    if (selectedVariant?.maxParticipants) {
      const count = selectedVariant.registrationCount ?? 0;
      if (count >= selectedVariant.maxParticipants) {
        setError(t("soldOut"));
        return false;
      }
    }
    return true;
  };

  const validateConsentStep = (): boolean => {
    if (needsDateOfBirth && dateOfBirthRequired && !dateOfBirth) {
      setError(tc("dateOfBirthRequired"));
      return false;
    }
    if (needsCitizenId && citizenIdRequired && !citizenId.trim()) {
      setError(tc("citizenIdRequired"));
      return false;
    }
    if (
      needsEmergencyContact &&
      emergencyContactRequired &&
      (!emergencyName.trim() || !emergencyPhone.trim())
    ) {
      setError(tc("emergencyContactRequired"));
      return false;
    }
    return true;
  };

  const validateCustomFieldsStep = (participantIndex: number): boolean => {
    const answers = getParticipantAnswers(participantIndex);
    const missingRequired = customFields.filter((field) => {
      if (!field.required) return false;
      const answer = answers.find((a) => a.customFieldId === field.id);
      return !answer || !answer.value.trim();
    });
    if (missingRequired.length > 0) {
      setError(tc("customFieldRequired", { field: missingRequired[0].label }));
      return false;
    }
    return true;
  };

  const validateTeamMemberStep = (memberIndex: number): boolean => {
    const member = teamMembers[memberIndex];
    if (!member) return false;
    if (!member.name.trim()) {
      setError(tc("teamMemberNameRequired"));
      return false;
    }
    if (requiredFields.includes("dateOfBirth") && !member.dateOfBirth) {
      setError(tc("teamMemberDateOfBirthRequired"));
      return false;
    }
    if (requiredFields.includes("citizenId") && !member.citizenId.trim()) {
      setError(tc("teamMemberCitizenIdRequired"));
      return false;
    }
    if (
      requiredFields.includes("emergencyContact") &&
      (!member.emergencyContactName.trim() ||
        !member.emergencyContactPhone.trim())
    ) {
      setError(tc("teamMemberEmergencyContactRequired"));
      return false;
    }
    return true;
  };

  // ── Save profile fields ───────────────────────────────────────────────────
  const saveProfileFields = async (): Promise<boolean> => {
    if (!hasMissingFields) return true;
    try {
      const payload: Record<string, string | null> = {};
      if (needsDateOfBirth && dateOfBirth)
        payload.dateOfBirth = new Date(dateOfBirth).toISOString();
      if (needsCitizenId && citizenId.trim())
        payload.citizenId = citizenId.trim();
      if (needsEmergencyContact) {
        if (emergencyName.trim())
          payload.emergencyContactName = emergencyName.trim();
        if (emergencyPhone.trim())
          payload.emergencyContactPhone = emergencyPhone.trim();
      }
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = async () => {
    setError(null);

    if (currentStepId === "variant") {
      if (!validateVariantStep()) return;
    } else if (currentStepId === "consent") {
      if (!validateConsentStep()) return;
      const saved = await saveProfileFields();
      if (!saved) {
        setError(tc("saveError"));
        return;
      }
    } else if (currentStepId.startsWith("custom-")) {
      const idx = parseInt(currentStepId.split("-")[1], 10);
      if (!validateCustomFieldsStep(idx)) return;
    } else if (currentStepId.startsWith("team-")) {
      const idx = parseInt(currentStepId.split("-")[1], 10);
      if (!validateTeamMemberStep(idx)) return;
    }

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setError(null);
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariantId || undefined,
          customFieldAnswers:
            allCustomFieldAnswers.length > 0
              ? allCustomFieldAnswers
              : undefined,
          teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      const checkoutData = (await res.json()) as {
        url?: string;
        registrationId?: string;
        status?: string;
      };

      // Save custom field answers linked to the registration
      if (allCustomFieldAnswers.length > 0 && checkoutData.registrationId) {
        await fetch(`/api/events/${eventId}/custom-field-responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: allCustomFieldAnswers,
            registrationId: checkoutData.registrationId,
          }),
        });
      }

      // Free registration → redirect to event page
      if (checkoutData.status === "CONFIRMED") {
        toast({
          title: t("paymentSuccessTitle"),
          description: t("paymentSuccessDesc"),
        });
        router.push(`/events/${eventSlug}?registration=success`);
        return;
      }

      // Paid → redirect to Stripe
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      toast({
        title: t("error"),
        description:
          err instanceof Error ? err.message : t("registrationError"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // ── Format currency ───────────────────────────────────────────────────────
  const formatCurrency = (amount: number, currency: string) =>
    amount.toLocaleString("pt-PT", {
      style: "currency",
      currency,
    });

  // ── Step label for progress ───────────────────────────────────────────────
  const getStepLabel = (stepId: StepId): string => {
    if (stepId === "variant") return t("chooseVariant");
    if (stepId === "consent") return tc("title");
    if (stepId === "review") return t("flow.reviewTitle");
    if (stepId.startsWith("custom-")) {
      const idx = parseInt(stepId.split("-")[1], 10);
      return idx === 0
        ? t("flow.yourOptions")
        : `${tc("teamMemberTitle", { number: idx + 1 })} — ${t("flow.options")}`;
    }
    if (stepId.startsWith("team-")) {
      const idx = parseInt(stepId.split("-")[1], 10);
      return tc("teamMemberTitle", { number: idx + 2 });
    }
    return "";
  };

  // ── Sold out / no price checks ────────────────────────────────────────────
  const isVariantSoldOut = (v: EventVariant) =>
    !!v.maxParticipants && (v.registrationCount ?? 0) >= v.maxParticipants;

  const variantHasActivePrice = (v: EventVariant) => {
    const now = new Date();
    return (v.pricingPhases ?? []).some(
      (p) =>
        (!p.startDate || new Date(p.startDate) <= now) &&
        (!p.endDate || new Date(p.endDate) >= now)
    );
  };

  // If only one variant and we didn't get an initialVariantId, auto-select
  useEffect(() => {
    if (variants.length === 1 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/events/${eventSlug}`)}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("flow.backToEvent")}
        </button>
        <h1 className="text-2xl font-bold">{eventTitle}</h1>
        <p className="text-muted-foreground">{t("registerTitle")}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {t("flow.step")} {currentStep + 1} / {totalSteps}
          </span>
          <span>{getStepLabel(currentStepId)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-p-brand transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                i < currentStep
                  ? "bg-p-brand text-white"
                  : i === currentStep
                    ? "bg-p-brand/20 text-p-brand ring-2 ring-p-brand"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {/* ═══ VARIANT STEP ═══ */}
        {currentStepId === "variant" && (
          <div className="space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart className="h-5 w-5 text-p-brand" />
                {t("chooseVariant")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("selectVariantRequiredDesc")}
              </p>
            </div>

            <div className="space-y-3">
              {variants.map((variant) => {
                const soldOut = isVariantSoldOut(variant);
                const noPrice = !variantHasActivePrice(variant);
                const unavailable = soldOut || noPrice;
                const isSelected = selectedVariantId === variant.id;
                const now = new Date();
                const vPrice = (variant.pricingPhases ?? []).find(
                  (p) =>
                    (!p.startDate || new Date(p.startDate) <= now) &&
                    (!p.endDate || new Date(p.endDate) >= now)
                );

                return (
                  <button
                    key={variant.id}
                    onClick={() =>
                      !unavailable && setSelectedVariantId(variant.id)
                    }
                    disabled={unavailable}
                    className={cn(
                      "w-full rounded-lg border-2 p-4 text-left transition-all",
                      isSelected
                        ? "border-p-brand bg-p-brand/5"
                        : unavailable
                          ? "cursor-not-allowed border-muted bg-muted/30 opacity-60"
                          : "border-border hover:border-p-brand/50 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{variant.name}</span>
                          {variant.distanceKm && (
                            <span className="text-sm text-muted-foreground">
                              {variant.distanceKm}km
                            </span>
                          )}
                          {(variant.teamSize ?? 1) > 1 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-p-brand/10 px-2 py-0.5 text-xs font-medium text-p-brand">
                              <Users className="h-3 w-3" />
                              {variant.teamSize}p
                            </span>
                          )}
                        </div>
                        {variant.startDate && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {new Date(variant.startDate).toLocaleDateString(
                              "pt-PT",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                            {variant.startTime && ` • ${variant.startTime}`}
                          </p>
                        )}
                        {soldOut && (
                          <p className="mt-1 text-xs font-medium text-destructive">
                            {t("soldOut")}
                          </p>
                        )}
                        {!soldOut && noPrice && (
                          <p className="mt-1 text-xs font-medium text-amber-600">
                            {t("registrationClosed")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {vPrice && (
                          <span className="text-lg font-bold">
                            {vPrice.price === 0
                              ? t("flow.free")
                              : formatCurrency(vPrice.price, vPrice.currency)}
                          </span>
                        )}
                        {isSelected && (
                          <div className="mt-1 flex justify-end">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-p-brand text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ CONSENT STEP ═══ */}
        {currentStepId === "consent" && (
          <div className="space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-5 w-5 text-p-brand" />
                {tc("title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {tc("description")}
              </p>
            </div>

            {/* Data sharing notice */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-3 text-sm font-medium">{tc("dataShared")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                  {tc("fieldName")}
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                  {tc("fieldEmail")}
                </li>
                {allFields.includes("dateOfBirth") && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                    {tc("fieldDateOfBirth")}
                    {!dateOfBirthRequired && (
                      <span className="text-xs italic">({tc("optional")})</span>
                    )}
                  </li>
                )}
                {allFields.includes("citizenId") && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                    {tc("fieldCitizenId")}
                    {!citizenIdRequired && (
                      <span className="text-xs italic">({tc("optional")})</span>
                    )}
                  </li>
                )}
                {allFields.includes("emergencyContact") && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-p-brand" />
                    {tc("fieldEmergencyContact")}
                    {!emergencyContactRequired && (
                      <span className="text-xs italic">({tc("optional")})</span>
                    )}
                  </li>
                )}
              </ul>
            </div>

            {/* Missing fields form */}
            {hasMissingFields && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="mr-1 inline-block h-4 w-4" />
                  {tc("missingFields")}
                </p>

                {needsDateOfBirth && (
                  <div className="grid gap-2">
                    <Label htmlFor="flow-dob">
                      {tc("fieldDateOfBirth")}
                      {!dateOfBirthRequired && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({tc("optional")})
                        </span>
                      )}
                    </Label>
                    <Input
                      id="flow-dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}

                {needsCitizenId && (
                  <div className="grid gap-2">
                    <Label htmlFor="flow-cc">
                      {tc("fieldCitizenId")}
                      {!citizenIdRequired && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({tc("optional")})
                        </span>
                      )}
                    </Label>
                    <Input
                      id="flow-cc"
                      type="text"
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      placeholder={tc("citizenIdPlaceholder")}
                      maxLength={30}
                    />
                  </div>
                )}

                {needsEmergencyContact && (
                  <div className="grid gap-2">
                    <Label>
                      {tc("fieldEmergencyContact")}
                      {!emergencyContactRequired && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({tc("optional")})
                        </span>
                      )}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder={tc("emergencyNamePlaceholder")}
                      />
                      <Input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder={tc("emergencyPhonePlaceholder")}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {!hasMissingFields && (
              <p className="text-xs text-muted-foreground">
                {tc("dataFromProfile")}
              </p>
            )}
          </div>
        )}

        {/* ═══ CUSTOM FIELDS STEP ═══ */}
        {currentStepId.startsWith("custom-") &&
          (() => {
            const participantIndex = parseInt(currentStepId.split("-")[1], 10);
            const isMain = participantIndex === 0;
            const participantLabel = isMain
              ? teamSize > 1
                ? tc("participantYou")
                : undefined
              : tc("teamMemberTitle", { number: participantIndex + 1 });

            return (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <ListChecks className="h-5 w-5 text-p-brand" />
                    {t("flow.yourOptions")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {participantLabel
                      ? tc("customFieldsForParticipant", {
                          participant: participantLabel,
                        })
                      : tc("step2Description")}
                  </p>
                </div>

                <CustomFieldsForm
                  fields={customFields}
                  answers={getParticipantAnswers(participantIndex)}
                  onAnswersChange={(answers) =>
                    setParticipantAnswers(participantIndex, answers)
                  }
                  participantLabel={participantLabel}
                />
              </div>
            );
          })()}

        {/* ═══ TEAM MEMBER STEP ═══ */}
        {currentStepId.startsWith("team-") &&
          (() => {
            const memberIndex = parseInt(currentStepId.split("-")[1], 10);
            const member = teamMembers[memberIndex];
            if (!member) return null;

            const showDob = allFields.includes("dateOfBirth");
            const showCc = allFields.includes("citizenId");
            const showEmergency = allFields.includes("emergencyContact");
            const dobReq = requiredFields.includes("dateOfBirth");
            const ccReq = requiredFields.includes("citizenId");
            const emergReq = requiredFields.includes("emergencyContact");

            return (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-p-brand" />
                    {tc("teamMemberTitle", { number: memberIndex + 2 })}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tc("teamMemberDescription", {
                      number: memberIndex + 2,
                      total: teamSize,
                    })}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>{tc("teamMemberName")} *</Label>
                    <Input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(memberIndex, "name", e.target.value)
                      }
                      placeholder={tc("teamMemberNamePlaceholder")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label>{tc("teamMemberEmail")}</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) =>
                          updateTeamMember(memberIndex, "email", e.target.value)
                        }
                        placeholder={tc("teamMemberEmailPlaceholder")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{tc("teamMemberPhone")}</Label>
                      <Input
                        type="tel"
                        value={member.phone}
                        onChange={(e) =>
                          updateTeamMember(memberIndex, "phone", e.target.value)
                        }
                        placeholder={tc("teamMemberPhonePlaceholder")}
                      />
                    </div>
                  </div>

                  {(showDob || showCc) && (
                    <div className="grid grid-cols-2 gap-3">
                      {showDob && (
                        <div className="grid gap-2">
                          <Label>
                            {tc("fieldDateOfBirth")}
                            {dobReq ? (
                              " *"
                            ) : (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({tc("optional")})
                              </span>
                            )}
                          </Label>
                          <Input
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
                          <Label>
                            {tc("fieldCitizenId")}
                            {ccReq ? (
                              " *"
                            ) : (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({tc("optional")})
                              </span>
                            )}
                          </Label>
                          <Input
                            type="text"
                            value={member.citizenId}
                            onChange={(e) =>
                              updateTeamMember(
                                memberIndex,
                                "citizenId",
                                e.target.value
                              )
                            }
                            placeholder={tc("citizenIdPlaceholder")}
                            maxLength={30}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {showEmergency && (
                    <div className="grid gap-2">
                      <Label>
                        {tc("fieldEmergencyContact")}
                        {emergReq ? (
                          " *"
                        ) : (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({tc("optional")})
                          </span>
                        )}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          value={member.emergencyContactName}
                          onChange={(e) =>
                            updateTeamMember(
                              memberIndex,
                              "emergencyContactName",
                              e.target.value
                            )
                          }
                          placeholder={tc("emergencyNamePlaceholder")}
                        />
                        <Input
                          type="tel"
                          value={member.emergencyContactPhone}
                          onChange={(e) =>
                            updateTeamMember(
                              memberIndex,
                              "emergencyContactPhone",
                              e.target.value
                            )
                          }
                          placeholder={tc("emergencyPhonePlaceholder")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        {/* ═══ REVIEW STEP ═══ */}
        {currentStepId === "review" &&
          (() => {
            const totals = calculateTotals();
            const isFree = totals.total === 0;

            return (
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <ShoppingCart className="h-5 w-5 text-p-brand" />
                    {t("flow.reviewTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("flow.reviewDescription")}
                  </p>
                </div>

                {/* Event & Variant summary */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-semibold">{eventTitle}</p>
                  {selectedVariant && (
                    <p className="text-sm text-muted-foreground">
                      {selectedVariant.name}
                      {selectedVariant.distanceKm &&
                        ` — ${selectedVariant.distanceKm}km`}
                      {teamSize > 1 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-p-brand">
                          <Users className="h-3 w-3" />
                          {teamSize} {t("flow.people")}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Team summary */}
                {teamSize > 1 && teamMembers.length > 0 && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 text-sm font-semibold">
                      {t("flow.teamSummary")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-p-brand/10 text-xs font-medium text-p-brand">
                          1
                        </div>
                        <span>{tc("participantYou")}</span>
                      </div>
                      {teamMembers.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-p-brand/10 text-xs font-medium text-p-brand">
                            {i + 2}
                          </div>
                          <span>
                            {m.name || tc("teamMemberTitle", { number: i + 2 })}
                          </span>
                          {m.email && (
                            <span className="text-xs text-muted-foreground">
                              ({m.email})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-semibold">
                    {t("flow.priceBreakdown")}
                  </h3>

                  <div className="space-y-2 text-sm">
                    {totals.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {item.label}
                          {item.qty > 1 && ` ×${item.qty}`}
                        </span>
                        <span>
                          {formatCurrency(
                            item.amount * item.qty,
                            totals.currency
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold">
                        {t("flow.total")}
                      </span>
                      <span className="text-xl font-bold text-p-brand">
                        {isFree
                          ? t("flow.free")
                          : formatCurrency(totals.total, totals.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pay button */}
                <Button
                  onClick={() => void handleCheckout()}
                  disabled={isLoading}
                  size="lg"
                  className="w-full gap-2 text-base"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isFree ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  {isLoading
                    ? t("redirectingToPayment")
                    : isFree
                      ? t("flow.confirmRegistration")
                      : `${t("flow.payNow")} — ${formatCurrency(totals.total, totals.currency)}`}
                </Button>

                {!isFree && (
                  <p className="text-center text-xs text-muted-foreground">
                    {t("securePaymentInfo")}
                  </p>
                )}
              </div>
            );
          })()}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mr-1 inline-block h-4 w-4" />
            {error}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {currentStepId !== "review" && (
        <div className="mt-6 flex items-center justify-between">
          {!isFirstStep ? (
            <Button variant="ghost" onClick={handlePrev} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              {tc("back")}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => router.push(`/events/${eventSlug}`)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {tc("cancel")}
            </Button>
          )}
          <Button onClick={() => void handleNext()} className="gap-2">
            {tc("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Review step back button */}
      {currentStepId === "review" && !isFirstStep && (
        <div className="mt-6">
          <Button variant="ghost" onClick={handlePrev} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            {tc("back")}
          </Button>
        </div>
      )}
    </div>
  );
}
