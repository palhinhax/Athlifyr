"use client";

import { useState } from "react";
import { Bell, Loader2, Send, AlertTriangle, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type Audience = "single" | "broadcast";

interface PushResult {
  usersTargeted: number;
  tokensFound: number;
  sent: number;
  failed: number;
}

interface AdminPushNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected user for single-user send */
  targetUser?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

const TITLE_MAX = 60;
const BODY_MAX = 240;

export function AdminPushNotificationDialog({
  open,
  onOpenChange,
  targetUser,
}: AdminPushNotificationDialogProps) {
  const [audience, setAudience] = useState<Audience>(
    targetUser ? "single" : "broadcast"
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);
  const [result, setResult] = useState<PushResult | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setBody("");
    setDeepLink("");
    setIsSending(false);
    setShowBroadcastConfirm(false);
    setResult(null);
    setAudience(targetUser ? "single" : "broadcast");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  const handleSend = async () => {
    if (!isValid) return;

    // For broadcast, require extra confirmation
    if (audience === "broadcast" && !showBroadcastConfirm) {
      setShowBroadcastConfirm(true);
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      const dataPayload: Record<string, string> = {};
      if (deepLink.trim()) {
        dataPayload.deepLink = deepLink.trim();
        dataPayload.route = deepLink.trim();
      }

      let response: Response;

      if (audience === "single" && targetUser) {
        response = await fetch("/api/admin/notifications/push/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUser.id,
            title: title.trim(),
            message: body.trim(),
            data: Object.keys(dataPayload).length > 0 ? dataPayload : undefined,
          }),
        });
      } else {
        response = await fetch("/api/admin/notifications/push/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            message: body.trim(),
            data: Object.keys(dataPayload).length > 0 ? dataPayload : undefined,
            confirmBroadcast: true,
          }),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to send notification");
      }

      const json = await response.json();
      const pushResult: PushResult = json.data;
      setResult(pushResult);

      if (pushResult.sent > 0) {
        toast({
          title: "Notificação enviada ✅",
          description:
            audience === "single"
              ? `Enviada para ${pushResult.sent} dispositivo${pushResult.sent !== 1 ? "s" : ""}`
              : `Enviada para ${pushResult.usersTargeted} utilizador${pushResult.usersTargeted !== 1 ? "es" : ""} (${pushResult.sent} dispositivo${pushResult.sent !== 1 ? "s" : ""})`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sem dispositivos",
          description:
            pushResult.tokensFound === 0
              ? "Nenhum dispositivo registado para notificações push"
              : `${pushResult.failed} envio${pushResult.failed !== 1 ? "s" : ""} falhado${pushResult.failed !== 1 ? "s" : ""}`,
        });
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao enviar notificação",
      });
    } finally {
      setIsSending(false);
      setShowBroadcastConfirm(false);
    }
  };

  // Broadcast confirmation view
  if (showBroadcastConfirm && !isSending) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Envio em Massa
            </DialogTitle>
            <DialogDescription>
              Vais enviar uma notificação push para <strong>TODOS</strong> os
              utilizadores com notificações ativas. Esta ação não pode ser
              revertida.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowBroadcastConfirm(false)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A enviar...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirmar Envio para Todos
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Result view
  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Resultado do Envio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{result.usersTargeted}</p>
                <p className="text-xs text-muted-foreground">
                  Utilizador{result.usersTargeted !== 1 ? "es" : ""}
                </p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{result.tokensFound}</p>
                <p className="text-xs text-muted-foreground">
                  Dispositivo{result.tokensFound !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-900 dark:bg-green-950">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {result.sent}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Enviado{result.sent !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-900 dark:bg-red-950">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {result.failed}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">
                  Falhado{result.failed !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Main form view
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enviar Notificação Push
          </DialogTitle>
          <DialogDescription>
            Envia uma notificação push para os dispositivos dos utilizadores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audience Selector */}
          <div className="space-y-2">
            <Label>Destinatário</Label>
            {targetUser ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {targetUser.name || "Sem nome"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {targetUser.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudience("broadcast")}
                  className="text-xs"
                >
                  Enviar para todos
                </Button>
              </div>
            ) : (
              <Select
                value={audience}
                onValueChange={(v) => setAudience(v as Audience)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broadcast">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Todos os utilizadores
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            {audience === "broadcast" && targetUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudience("single")}
                className="text-xs"
              >
                ← Voltar para utilizador individual
              </Button>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-title">Título</Label>
              <span
                className={`text-xs ${
                  title.length > TITLE_MAX
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <Input
              id="push-title"
              placeholder="Ex: Nova funcionalidade disponível!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX + 20}
            />
          </div>

          {/* Body/Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-body">Mensagem</Label>
              <span
                className={`text-xs ${
                  body.length > BODY_MAX
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {body.length}/{BODY_MAX}
              </span>
            </div>
            <Textarea
              id="push-body"
              placeholder="Escreve aqui a mensagem da notificação..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={BODY_MAX + 40}
            />
          </div>

          {/* Deep Link (optional) */}
          <div className="space-y-2">
            <Label htmlFor="push-link">
              Deep Link{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="push-link"
              placeholder="Ex: /events/trail-2026"
              value={deepLink}
              onChange={(e) => setDeepLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Rota da app para abrir quando o utilizador tocar na notificação.
            </p>
          </div>

          {/* Preview */}
          {(title.trim() || body.trim()) && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Pré-visualização
              </Label>
              <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                {title.trim() && (
                  <p className="text-sm font-semibold">{title.trim()}</p>
                )}
                {body.trim() && (
                  <p className="text-sm text-muted-foreground">{body.trim()}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!isValid || isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />A enviar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {audience === "broadcast" ? "Enviar para Todos" : "Enviar"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
