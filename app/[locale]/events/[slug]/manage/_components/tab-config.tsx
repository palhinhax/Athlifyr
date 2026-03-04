"use client";

import { useState } from "react";
import {
  Loader2,
  Settings2,
  AlertTriangle,
  Trash2,
  Ban,
  ClipboardList,
  Play,
  Pause,
  Square,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";
import { toDatetimeLocal } from "./types";
import {
  REGISTRATION_FIELD_KEYS,
  type FieldRequirement,
  type RegistrationFieldSettings,
} from "@/types/registration-fields";
import { CustomFieldsManager } from "@/components/custom-fields-manager";

interface TabConfigProps {
  event: EventDetails;
  isAdmin: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}

export function TabConfig({ event, isAdmin, onSave }: TabConfigProps) {
  const t = useTranslations("manage.config");
  const tDanger = useTranslations("manage.danger");
  const tErr = useTranslations("manage.errors");
  const tCommon = useTranslations("manage.common");
  const router = useRouter();

  const [checkInOpensAt, setCheckInOpensAt] = useState(
    toDatetimeLocal(event.checkInOpensAt)
  );
  const [checkInClosesAt, setCheckInClosesAt] = useState(
    toDatetimeLocal(event.checkInClosesAt)
  );
  const [refundDeadline, setRefundDeadline] = useState(
    toDatetimeLocal(event.refundDeadline)
  );
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Registration field settings (required / optional / none)
  const [fieldSettings, setFieldSettings] = useState<RegistrationFieldSettings>(
    (event.registrationFieldSettings ?? {}) as RegistrationFieldSettings
  );
  const [isSavingFields, setIsSavingFields] = useState(false);

  // Danger zone
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live status
  const [liveStatus, setLiveStatus] = useState(
    event.liveStatus || "SCHEDULED"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<string | null>(
    null
  );

  const statusLabel = (status: string): string => {
    const map: Record<string, string> = {
      SCHEDULED: t("statusScheduled"),
      LIVE: t("statusLive"),
      PAUSED: t("statusPaused"),
      FINISHED: t("statusFinished"),
      CANCELLED: t("statusCancelled"),
    };
    return map[status] || status;
  };

  const statusColor = (status: string): string => {
    const map: Record<string, string> = {
      SCHEDULED:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      LIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      PAUSED:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      FINISHED:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      CANCELLED:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return map[status] || "";
  };

  const handleLiveStatusTransition = async (targetStatus: string) => {
    setPendingTransition(null);
    setIsTransitioning(true);
    try {
      const res = await fetch(`/api/events/${event.id}/live-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error || "Failed to update status");
      }
      const result = (await res.json()) as {
        liveStatus: string;
        previousStatus: string;
      };
      setLiveStatus(result.liveStatus);
      toast({
        title: t("liveStatusChanged"),
        description: t("liveStatusChangedDesc", {
          from: statusLabel(result.previousStatus),
          to: statusLabel(result.liveStatus),
        }),
      });
    } catch (e) {
      toast({
        title: t("liveStatusError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await onSave({
        checkInOpensAt: checkInOpensAt || null,
        checkInClosesAt: checkInClosesAt || null,
        refundDeadline: refundDeadline || null,
      });
      toast({ title: t("configSaved") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleFieldSettingChange = (field: string, value: string) => {
    setFieldSettings((prev) => {
      const next = { ...prev };
      if (value === "none") {
        delete next[field];
      } else {
        next[field] = value as FieldRequirement;
      }
      return next;
    });
  };

  const handleSaveFieldSettings = async () => {
    setIsSavingFields(true);
    try {
      await onSave({ registrationFieldSettings: fieldSettings });
      toast({ title: t("requiredFieldsSaved") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSavingFields(false);
    }
  };

  const handleCancelEvent = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancelled: true,
          cancellationReason: cancelReason.trim() || undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to cancel event");
      toast({
        title: tDanger("eventCancelledSuccess"),
        description: tDanger("eventCancelledDescription"),
      });
      setIsCancelOpen(false);
      setCancelReason("");
      router.refresh();
    } catch {
      toast({
        title: tErr("saveError"),
        description: tDanger("cancelError"),
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      toast({
        title: tDanger("eventDeletedSuccess"),
        description: tDanger("eventDeletedDescription"),
      });
      router.push("/events");
      router.refresh();
    } catch {
      toast({
        title: tErr("saveError"),
        description: tDanger("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TabsContent value="config" className="space-y-6">
      {/* Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("checkIn")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="checkInOpensAt">{t("checkInOpens")}</Label>
              <Input
                id="checkInOpensAt"
                type="datetime-local"
                value={checkInOpensAt}
                onChange={(e) => setCheckInOpensAt(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="checkInClosesAt">{t("checkInCloses")}</Label>
              <Input
                id="checkInClosesAt"
                type="datetime-local"
                value={checkInClosesAt}
                onChange={(e) => setCheckInClosesAt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Status Control */}
      {event.hasLiveRace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Radio className="h-4 w-4" />
              {t("liveStatus")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {t("liveStatusHelp")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {t("liveStatusCurrent")}:
              </span>
              <Badge className={statusColor(liveStatus)}>
                {statusLabel(liveStatus)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {liveStatus === "SCHEDULED" && (
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={isTransitioning}
                  onClick={() => setPendingTransition("LIVE")}
                >
                  {isTransitioning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {t("startRace")}
                </Button>
              )}
              {liveStatus === "LIVE" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={isTransitioning}
                    onClick={() => setPendingTransition("PAUSED")}
                  >
                    {isTransitioning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                    {t("pauseRace")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    disabled={isTransitioning}
                    onClick={() => setPendingTransition("FINISHED")}
                  >
                    {isTransitioning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    {t("finishRace")}
                  </Button>
                </>
              )}
              {liveStatus === "PAUSED" && (
                <>
                  <Button
                    size="sm"
                    className="gap-2"
                    disabled={isTransitioning}
                    onClick={() => setPendingTransition("LIVE")}
                  >
                    {isTransitioning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {t("resumeRace")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    disabled={isTransitioning}
                    onClick={() => setPendingTransition("FINISHED")}
                  >
                    {isTransitioning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    {t("finishRace")}
                  </Button>
                </>
              )}
              {liveStatus !== "CANCELLED" && liveStatus !== "FINISHED" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  disabled={isTransitioning}
                  onClick={() => setPendingTransition("CANCELLED")}
                >
                  {isTransitioning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4" />
                  )}
                  {t("cancelRace")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transition confirmation dialog */}
      <AlertDialog
        open={!!pendingTransition}
        onOpenChange={(open) => {
          if (!open) setPendingTransition(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTransition")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmTransitionDesc", {
                from: statusLabel(liveStatus),
                to: pendingTransition ? statusLabel(pendingTransition) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingTransition) {
                  void handleLiveStatusTransition(pendingTransition);
                }
              }}
            >
              {tCommon("save")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refunds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("refunds")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="refundDeadline">{t("refundDeadline")}</Label>
            <Input
              id="refundDeadline"
              type="datetime-local"
              value={refundDeadline}
              onChange={(e) => setRefundDeadline(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("refundHelp")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Registration Field Settings */}
      {event.hasRegistrations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              {t("requiredFields")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {t("requiredFieldsHelp")}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {REGISTRATION_FIELD_KEYS.map((field) => (
              <div
                key={field}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium">
                    {t(
                      `field_${field}` as
                        | "field_dateOfBirth"
                        | "field_citizenId"
                        | "field_emergencyContact"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      `field_${field}_help` as
                        | "field_dateOfBirth_help"
                        | "field_citizenId_help"
                        | "field_emergencyContact_help"
                    )}
                  </p>
                </div>
                <Select
                  value={fieldSettings[field] ?? "none"}
                  onValueChange={(value) =>
                    handleFieldSettingChange(field, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("fieldOption_none")}
                    </SelectItem>
                    <SelectItem value="optional">
                      {t("fieldOption_optional")}
                    </SelectItem>
                    <SelectItem value="required">
                      {t("fieldOption_required")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => void handleSaveFieldSettings()}
                disabled={isSavingFields}
                size="sm"
                className="gap-2"
              >
                {isSavingFields && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("saveRequiredFields")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom registration fields (organizer-defined) */}
      {event.hasRegistrations && <CustomFieldsManager eventId={event.id} />}

      {/* Admin-only: LiveRace */}
      {isAdmin && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
              <Settings2 className="h-4 w-4" />
              {t("adminFeatures")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{t("liveRace")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("liveRaceHelp")}
                </p>
              </div>
              <Switch
                checked={event.hasLiveRace}
                onCheckedChange={(checked) => {
                  void onSave({ hasLiveRace: checked })
                    .then(() => {
                      toast({
                        title: checked
                          ? t("liveRaceEnabled")
                          : t("liveRaceDisabled"),
                      });
                    })
                    .catch((e: Error) => {
                      toast({
                        title: tErr("saveError"),
                        description: e.message,
                        variant: "destructive",
                      });
                    });
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => void handleSaveConfig()}
          disabled={isSavingConfig}
          className="gap-2"
        >
          {isSavingConfig && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("saveConfig")}
        </Button>
      </div>

      {/* Danger zone */}
      <Card className="border-red-300 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {tDanger("dangerZone")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cancel Event */}
          {!event.cancelled ? (
            <div className="flex items-center justify-between rounded-lg border border-orange-200 p-4 dark:border-orange-800">
              <div>
                <p className="text-sm font-medium">{tDanger("cancelEvent")}</p>
                <p className="text-xs text-muted-foreground">
                  {tDanger("cancelEventHelp")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                onClick={() => setIsCancelOpen(true)}
              >
                <Ban className="h-4 w-4" />
                {tDanger("cancelEvent")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
              <Ban className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-800 dark:text-red-400">
                  🚫 {tDanger("eventCancelled")}
                </p>
                {event.cancellationReason && (
                  <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                    {event.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Delete Event */}
          <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-800">
            <div>
              <p className="text-sm font-medium">{tDanger("deleteEvent")}</p>
              <p className="text-xs text-muted-foreground">
                {tDanger("deleteEventHelp")}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  {tCommon("delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {tDanger("deleteEventDialog")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {tDanger("deleteEventConfirm")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => void handleDeleteEvent()}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting
                      ? tDanger("deleting")
                      : tDanger("confirmDelete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Event Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tDanger("cancelEventDialog")}</DialogTitle>
            <DialogDescription>
              {tDanger("cancelEventConfirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">
                {tDanger("cancellationReason")}
              </Label>
              <Textarea
                id="cancellation-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={tDanger("cancellationReasonPlaceholder")}
                rows={4}
                disabled={isCancelling}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
            >
              {tCommon("back")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleCancelEvent()}
              disabled={isCancelling}
            >
              {isCancelling ? tDanger("cancelling") : tDanger("confirmCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
