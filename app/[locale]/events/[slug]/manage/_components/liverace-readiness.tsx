"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Flag,
  Route,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

export interface VariantReadiness {
  variantId: string;
  variantName: string;
  hasRoute: boolean;
  routePointCount: number;
  hasStartCheckpoint: boolean;
  hasFinishCheckpoint: boolean;
  checkpointCount: number;
  hasStartTime: boolean;
}

export interface LiveReadinessData {
  ready: boolean;
  hasLiveRace: boolean;
  variantCount: number;
  variants: VariantReadiness[];
  errors: string[];
  warnings: string[];
}

interface LiveRaceReadinessProps {
  readiness: LiveReadinessData;
}

function parseReadinessCode(
  code: string,
  t: ReturnType<typeof useTranslations>
): string {
  const parts = code.split(":");
  const type = parts[0];
  const variantName = parts[1] ?? "";

  switch (type) {
    case "LIVERACE_NOT_ENABLED":
      return t("readiness.errLiveraceNotEnabled");
    case "NO_VARIANTS":
      return t("readiness.errNoVariants");
    case "NO_ROUTE":
      return t("readiness.errNoRoute", { variant: variantName });
    case "NO_START":
      return t("readiness.errNoStart", { variant: variantName });
    case "NO_FINISH":
      return t("readiness.errNoFinish", { variant: variantName });
    case "NO_START_TIME":
      return t("readiness.errNoStartTime", { variant: variantName });
    case "NO_CHECKPOINTS":
      return t("readiness.warnNoCheckpoints", { variant: variantName });
    default:
      return code;
  }
}

function ReadinessErrorIcon({ code }: Readonly<{ code: string }>) {
  if (code.startsWith("NO_ROUTE")) {
    return <Route className="mt-0.5 h-3.5 w-3.5 shrink-0" />;
  }
  if (code.startsWith("NO_START")) {
    return <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0" />;
  }
  if (code.startsWith("NO_FINISH")) {
    return <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />;
  }
  return <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />;
}

function ReadinessAllGood() {
  const t = useTranslations("manage.liverace");

  return (
    <Alert className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800 dark:text-green-300">
        {t("readiness.allGood")}
      </AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-400">
        {t("readiness.allGoodDesc")}
      </AlertDescription>
    </Alert>
  );
}

function ReadinessErrors({ errors }: Readonly<{ errors: string[] }>) {
  const t = useTranslations("manage.liverace");

  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{t("readiness.errorsTitle")}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{t("readiness.errorsDesc")}</p>
        <ul className="space-y-1.5">
          {errors.map((code) => (
            <li key={code} className="flex items-start gap-2 text-sm">
              <ReadinessErrorIcon code={code} />
              <span>{parseReadinessCode(code, t)}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

function ReadinessWarnings({ warnings }: Readonly<{ warnings: string[] }>) {
  const t = useTranslations("manage.liverace");

  return (
    <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-300">
        {t("readiness.warningsTitle")}
      </AlertTitle>
      <AlertDescription>
        <ul className="space-y-1.5">
          {warnings.map((code) => (
            <li
              key={code}
              className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{parseReadinessCode(code, t)}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

function VariantReadinessOverview({
  variants,
}: Readonly<{ variants: VariantReadiness[] }>) {
  const t = useTranslations("manage.liverace");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {t("readiness.variantsTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {variants.map((v) => (
            <div
              key={v.variantId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="text-sm font-medium">{v.variantName}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    v.hasRoute
                      ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                      : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                  }
                >
                  <Route className="mr-1 h-3 w-3" />
                  {v.hasRoute
                    ? t("readiness.hasRoute")
                    : t("readiness.noRoute")}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    v.hasStartCheckpoint
                      ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                      : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                  }
                >
                  <Flag className="mr-1 h-3 w-3" />
                  {v.hasStartCheckpoint
                    ? t("readiness.hasStart")
                    : t("readiness.noStart")}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    v.hasFinishCheckpoint
                      ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                      : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                  }
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {v.hasFinishCheckpoint
                    ? t("readiness.hasFinish")
                    : t("readiness.noFinish")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveRaceReadiness({
  readiness,
}: Readonly<LiveRaceReadinessProps>) {
  const hasNoIssues = readiness.ready && readiness.warnings.length === 0;
  const hasErrors = readiness.errors.length > 0;
  const hasWarnings = readiness.warnings.length > 0;
  const hasVariants = readiness.variants.length > 0;

  return (
    <>
      {hasNoIssues && <ReadinessAllGood />}
      {hasErrors && <ReadinessErrors errors={readiness.errors} />}
      {hasWarnings && <ReadinessWarnings warnings={readiness.warnings} />}
      {hasVariants && (
        <VariantReadinessOverview variants={readiness.variants} />
      )}
    </>
  );
}
