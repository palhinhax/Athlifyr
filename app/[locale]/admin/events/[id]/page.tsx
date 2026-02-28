"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Save,
  ExternalLink,
  CheckCircle,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SportType, EventOrganizerRole } from "@prisma/client";
import { Link } from "@/i18n/routing";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventDetails {
  id: string;
  title: string;
  slug: string;
  city: string;
  country: string;
  startDate: string;
  sportTypes: SportType[];
  hasRegistrations: boolean;
  hasLiveRace: boolean;
  commissionPercent: number;
  refundDeadline: string | null;
  checkInOpensAt: string | null;
  checkInClosesAt: string | null;
  stripeOnboardingStatus: string;
  stripeAccountId: string | null;
  cancelled: boolean;
}

interface OrganizerMember {
  id: string;
  role: EventOrganizerRole;
  user: { id: string; name: string | null; email: string };
}

const ORGANIZER_ROLE_LABELS: Record<EventOrganizerRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  FINANCE: "Financeiro",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminEventSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [organizers, setOrganizers] = useState<OrganizerMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    hasLiveRace: false,
    commissionPercent: 0.0,
    refundDeadline: "",
    checkInOpensAt: "",
    checkInClosesAt: "",
  });

  const [addOrganizerUserId, setAddOrganizerUserId] = useState("");
  const [addOrganizerRole, setAddOrganizerRole] = useState<EventOrganizerRole>(
    EventOrganizerRole.OWNER
  );

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // ── Load data ───────────────────────────────────────────────────────────────
  const loadEvent = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error("Event not found");
      const data = (await res.json()) as EventDetails;
      setEvent(data);
      setSettings({
        hasLiveRace: data.hasLiveRace,
        commissionPercent: data.commissionPercent,
        refundDeadline: data.refundDeadline
          ? new Date(data.refundDeadline).toISOString().slice(0, 16)
          : "",
        checkInOpensAt: data.checkInOpensAt
          ? new Date(data.checkInOpensAt).toISOString().slice(0, 16)
          : "",
        checkInClosesAt: data.checkInClosesAt
          ? new Date(data.checkInClosesAt).toISOString().slice(0, 16)
          : "",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Evento não encontrado.",
        variant: "destructive",
      });
      router.push("/admin/events");
    }
  }, [eventId, router]);

  const loadOrganizers = useCallback(async (id: string) => {
    const res = await fetch(`/api/events/${id}/organizers`);
    if (res.ok) setOrganizers((await res.json()) as OrganizerMember[]);
  }, []);

  useEffect(() => {
    if (!session?.user || session.user.role !== "ADMIN") return;
    void loadEvent().then(() => setIsLoading(false));
  }, [session, loadEvent]);

  useEffect(() => {
    if (event?.id) void loadOrganizers(event.id);
  }, [event?.id, loadOrganizers]);

  // ── Save settings ───────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasLiveRace: settings.hasLiveRace,
          commissionPercent: settings.commissionPercent,
          refundDeadline: settings.refundDeadline || null,
          checkInOpensAt: settings.checkInOpensAt || null,
          checkInClosesAt: settings.checkInClosesAt || null,
        }),
      });
      if (!res.ok) throw new Error();
      await loadEvent();
      toast({ title: "Guardado", description: "Configurações atualizadas." });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível guardar.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Add organizer ────────────────────────────────────────────────────────────
  const handleAddOrganizer = async () => {
    if (!event || !addOrganizerUserId.trim()) return;
    try {
      const res = await fetch(`/api/events/${event.id}/organizers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: addOrganizerUserId.trim(),
          role: addOrganizerRole,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      setAddOrganizerUserId("");
      await loadOrganizers(event.id);
      toast({ title: "Responsável atribuído." });
    } catch (e) {
      toast({
        title: "Erro",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>
                {event.city}, {event.country}
              </span>
              <span>·</span>
              <Link
                href={`/events/${event.slug}`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Ver evento público <ExternalLink className="h-3 w-3" />
              </Link>
              <span>·</span>
              <Link
                href={`/events/${event.slug}/manage`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Área do organizador <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {event.hasLiveRace && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Shield className="mr-1 h-3 w-3" />
                LiveRace
              </Badge>
            )}
            {event.hasRegistrations && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="mr-1 h-3 w-3" />
                Inscrições
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* ── Responsável do evento ─────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-purple-500" />
                Responsável do evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organizers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum responsável atribuído — o evento é gerido apenas pela
                  Athlifyr.
                </p>
              ) : (
                <div className="space-y-2">
                  {organizers.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {org.user.name ?? org.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {org.user.email}
                        </p>
                      </div>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {ORGANIZER_ROLE_LABELS[org.role]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 border-t pt-4">
                <Input
                  placeholder="User ID do responsável"
                  value={addOrganizerUserId}
                  onChange={(e) => setAddOrganizerUserId(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={addOrganizerRole}
                  onValueChange={(v) =>
                    setAddOrganizerRole(v as EventOrganizerRole)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORGANIZER_ROLE_LABELS).map(
                      ([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddOrganizer} className="gap-1.5">
                  <UserPlus className="h-4 w-4" />
                  Atribuir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Funcionalidades & Comissão ────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Funcionalidades &amp; Comissão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Inscrições no site</p>
                  <p className="text-sm text-muted-foreground">
                    Ativado automaticamente quando o Stripe está configurado
                  </p>
                </div>
                <Badge
                  className={
                    event.hasRegistrations
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {event.hasRegistrations ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">LiveRace</p>
                  <p className="text-sm text-muted-foreground">
                    Rastreamento GPS em tempo real e resultados ao vivo
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      hasLiveRace: !prev.hasLiveRace,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.hasLiveRace ? "bg-purple-600" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      settings.hasLiveRace ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <Label>Comissão da plataforma (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.commissionPercent}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      commissionPercent: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="max-w-[180px]"
                />
                <p className="text-xs text-muted-foreground">
                  % retido pela Athlifyr em cada inscrição
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Check-in & Reembolso ──────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Check-in &amp; Reembolso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Check-in abre</Label>
                  <Input
                    type="datetime-local"
                    value={settings.checkInOpensAt}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        checkInOpensAt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check-in fecha</Label>
                  <Input
                    type="datetime-local"
                    value={settings.checkInClosesAt}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        checkInClosesAt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Prazo de reembolso</Label>
                  <Input
                    type="datetime-local"
                    value={settings.refundDeadline}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        refundDeadline: e.target.value,
                      }))
                    }
                    className="max-w-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
