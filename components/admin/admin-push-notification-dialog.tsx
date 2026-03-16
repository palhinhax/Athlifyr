"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Loader2,
  Send,
  AlertTriangle,
  Users,
  User,
  Mail,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type Audience = "single" | "broadcast";

interface PushResult {
  usersTargeted: number;
  tokensFound: number;
  sent: number;
  failed: number;
}

interface EmailResult {
  sent: boolean;
  error?: string;
}

interface AdminPushNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected user for single-user send */
  targetUser?: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified?: boolean;
    emailNotifications?: boolean;
    pushNotificationsEnabled?: boolean;
    devices?: {
      web: number;
      mobile: number;
      total: number;
    };
  } | null;
}

// ─── Helper functions ───────────────────────────────────────────────────────

async function sendPushNotification(
  audience: Audience,
  targetUser: AdminPushNotificationDialogProps["targetUser"],
  title: string,
  body: string,
  dataPayload: Record<string, string>
): Promise<PushResult> {
  const isSingle = audience === "single" && targetUser;
  const endpoint = isSingle
    ? "/api/admin/notifications/push/user"
    : "/api/admin/notifications/push/broadcast";

  const data = Object.keys(dataPayload).length > 0 ? dataPayload : undefined;
  const payload = isSingle
    ? { userId: targetUser.id, title, message: body, data }
    : { title, message: body, data, confirmBroadcast: true };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to send push notification");
  }

  const json = await response.json();
  return json.data;
}

async function sendEmailNotification(
  audience: Audience,
  targetUser: AdminPushNotificationDialogProps["targetUser"],
  title: string,
  body: string
): Promise<EmailResult> {
  const emailResponse = await fetch("/api/admin/notifications/email/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: audience === "single" && targetUser ? targetUser.id : undefined,
      broadcast: audience === "broadcast",
      title,
      message: body,
    }),
  });

  if (emailResponse.ok) {
    const emailJson = await emailResponse.json();
    return { sent: true, ...emailJson.data };
  }

  const err = await emailResponse.json();
  return { sent: false, error: err.error };
}

function buildToastParts(
  pushResult: PushResult | null,
  emailSendResult: EmailResult | null,
  audience: Audience
): string[] {
  const parts: string[] = [];

  if (pushResult && pushResult.sent > 0) {
    parts.push(
      audience === "single"
        ? `Push: ${pushResult.sent} dispositivo${pushResult.sent !== 1 ? "s" : ""}`
        : `Push: ${pushResult.usersTargeted} utilizador${pushResult.usersTargeted !== 1 ? "es" : ""}`
    );
  }

  if (emailSendResult?.sent) {
    const emailsSent =
      (emailSendResult as EmailResult & { emailsSent?: number }).emailsSent ||
      0;
    parts.push(
      audience === "single"
        ? "Email enviado"
        : `Emails: ${emailsSent} enviado${emailsSent !== 1 ? "s" : ""}`
    );
  }

  return parts;
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
  const [sendPush, setSendPush] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);
  const [result, setResult] = useState<PushResult | null>(null);
  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);
  const { toast } = useToast();

  // Determine if user can receive each channel
  const canReceivePush =
    audience === "broadcast" ||
    (targetUser?.pushNotificationsEnabled === true &&
      targetUser?.devices != null &&
      targetUser.devices.total > 0);
  const canReceiveEmail =
    audience === "broadcast" ||
    (targetUser?.emailVerified === true && !!targetUser?.email);

  // Reset sendEmail/sendPush when dialog opens or targetUser changes
  useEffect(() => {
    if (!open) return;

    if (targetUser) {
      const userCanPush =
        targetUser.pushNotificationsEnabled === true &&
        targetUser.devices != null &&
        targetUser.devices.total > 0;
      const userCanEmail =
        targetUser.emailVerified === true && !!targetUser.email;

      setSendPush(userCanPush);
      setSendEmail(userCanEmail);
      setAudience("single");
    } else {
      setSendPush(true);
      setSendEmail(false);
      setAudience("broadcast");
    }
  }, [open, targetUser]);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setDeepLink("");
    setSendPush(true);
    setSendEmail(false);
    setIsSending(false);
    setShowBroadcastConfirm(false);
    setResult(null);
    setEmailResult(null);
    setAudience(targetUser ? "single" : "broadcast");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const isValid =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    (sendPush || sendEmail);

  const handleSend = async () => {
    if (!isValid) return;

    // For broadcast, require extra confirmation
    if (audience === "broadcast" && !showBroadcastConfirm) {
      setShowBroadcastConfirm(true);
      return;
    }

    setIsSending(true);
    setResult(null);
    setEmailResult(null);

    try {
      const dataPayload: Record<string, string> = {};
      if (deepLink.trim()) {
        dataPayload.url = deepLink.trim();
        dataPayload.deepLink = deepLink.trim();
        dataPayload.route = deepLink.trim();
      }

      const pushResult = sendPush
        ? await sendPushNotification(
            audience,
            targetUser,
            title.trim(),
            body.trim(),
            dataPayload
          )
        : null;

      const emailSendResult = sendEmail
        ? await sendEmailNotification(
            audience,
            targetUser,
            title.trim(),
            body.trim()
          )
        : null;

      setResult(pushResult);
      setEmailResult(emailSendResult);

      const parts = buildToastParts(pushResult, emailSendResult, audience);

      if (parts.length > 0) {
        toast({
          title: "Notificação enviada ✅",
          description: parts.join(" · "),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sem destinatários",
          description:
            "Nenhum dispositivo ou email disponível para enviar notificação",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
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
              Vais enviar uma notificação
              {sendPush && sendEmail
                ? " push e email"
                : sendEmail
                  ? " por email"
                  : " push"}{" "}
              para <strong>TODOS</strong> os utilizadores com notificações
              ativas. Esta ação não pode ser revertida.
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
  if (result || emailResult) {
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
            {/* Push Results */}
            {result && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <BellRing className="h-4 w-4" />
                  Push
                </h4>
                <div className="grid grid-cols-2 gap-3">
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
            )}

            {/* Email Results */}
            {emailResult && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </h4>
                <div className="rounded-lg border p-3 text-center">
                  {emailResult.sent ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        ✅{" "}
                        {(
                          emailResult as EmailResult & {
                            emailsSent?: number;
                          }
                        ).emailsSent
                          ? `${(emailResult as EmailResult & { emailsSent?: number }).emailsSent} email${((emailResult as EmailResult & { emailsSent?: number }).emailsSent || 0) !== 1 ? "s" : ""} enviado${((emailResult as EmailResult & { emailsSent?: number }).emailsSent || 0) !== 1 ? "s" : ""}`
                          : "Email enviado com sucesso"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        ❌ {emailResult.error || "Erro ao enviar email"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            Enviar Notificação
          </DialogTitle>
          <DialogDescription>
            Envia uma notificação para os utilizadores por push, email ou ambos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audience Selector */}
          <div className="space-y-2">
            <Label>Destinatário</Label>
            {targetUser ? (
              <>
                {audience === "single" ? (
                  <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-blue-900 dark:text-blue-100">
                        {targetUser.name || "Sem nome"}
                      </p>
                      <p className="truncate text-xs text-blue-600 dark:text-blue-400">
                        {targetUser.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAudience("broadcast")}
                      className="shrink-0 text-xs hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      Mudar para todos
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                    <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Todos os utilizadores
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Envio em massa para todos os dispositivos ativos
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAudience("single")}
                      className="shrink-0 text-xs hover:bg-amber-100 dark:hover:bg-amber-900"
                    >
                      ← Voltar
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Todos os utilizadores
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Envio em massa para todos os dispositivos ativos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Channel Selector */}
          <div className="space-y-2">
            <Label>Canais de envio</Label>
            <div className="flex flex-col gap-3 rounded-lg border p-3">
              <label className="flex items-center gap-3">
                <Checkbox
                  checked={sendPush}
                  onCheckedChange={(checked) => setSendPush(!!checked)}
                  disabled={audience === "single" && !canReceivePush}
                />
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <div>
                    <span className="text-sm font-medium">Push</span>
                    {audience === "single" && !canReceivePush && (
                      <p className="text-xs text-muted-foreground">
                        {!targetUser?.pushNotificationsEnabled
                          ? "Push desativado pelo utilizador"
                          : "Sem dispositivos registados"}
                      </p>
                    )}
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <Checkbox
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(!!checked)}
                  disabled={audience === "single" && !canReceiveEmail}
                />
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="text-sm font-medium">Email</span>
                    {audience === "single" && !canReceiveEmail && (
                      <p className="text-xs text-muted-foreground">
                        {!targetUser?.emailVerified
                          ? "Email não verificado"
                          : "Sem email registado"}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            </div>
            {!sendPush && !sendEmail && (
              <p className="text-xs text-red-500">
                Seleciona pelo menos um canal de envio
              </p>
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
