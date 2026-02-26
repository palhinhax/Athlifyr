"use client";

import { useState } from "react";
import { Loader2, Settings2, AlertTriangle, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";
import { toDatetimeLocal } from "./types";

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

  // Danger zone
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
