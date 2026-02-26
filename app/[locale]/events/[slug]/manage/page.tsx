"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Users,
  CreditCard,
  ExternalLink,
  CheckCircle,
  FileEdit,
  MapPin,
  Layers,
  Settings,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type {
  EventDetails,
  EventVariant,
  OrganizerMember,
  StaffMember,
  PricingPhase,
} from "./_components/types";
import { EventOrganizerRole } from "@prisma/client";
import { TabEvento } from "./_components/tab-evento";
import { TabLocalizacao } from "./_components/tab-localizacao";
import { TabPercursos } from "./_components/tab-percursos";
import { TabPrecos } from "./_components/tab-precos";
import { TabEquipa } from "./_components/tab-equipa";
import { TabPagamentos } from "./_components/tab-pagamentos";
import { TabConfig } from "./_components/tab-config";

export default function EventManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("manage");

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [organizers, setOrganizers] = useState<OrganizerMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [variants, setVariants] = useState<EventVariant[]>([]);
  const [pricingPhases, setPricingPhases] = useState<PricingPhase[]>([]);
  const [isLoadingPhases, setIsLoadingPhases] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Populate form from event data ──────────────────────────────────────────

  const populateFormFields = useCallback((data: EventDetails) => {
    setVariants(data.variants);
  }, []);

  // ─── Load team ──────────────────────────────────────────────────────────────

  const loadTeam = useCallback(async (eventId: string) => {
    const [orgRes, staffRes] = await Promise.all([
      fetch(`/api/events/${eventId}/organizers`),
      fetch(`/api/events/${eventId}/staff`),
    ]);
    if (orgRes.ok) setOrganizers((await orgRes.json()) as OrganizerMember[]);
    if (staffRes.ok) setStaff((await staffRes.json()) as StaffMember[]);
  }, []);

  // ─── Load pricing phases ───────────────────────────────────────────────────

  const loadPricingPhases = useCallback(async (eventId: string) => {
    setIsLoadingPhases(true);
    try {
      const res = await fetch(`/api/events/${eventId}/pricing-phases`);
      if (res.ok) setPricingPhases((await res.json()) as PricingPhase[]);
    } finally {
      setIsLoadingPhases(false);
    }
  }, []);

  // ─── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/");
      return;
    }

    const init = async () => {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as EventDetails;

        const isAdminUser = session.user.role === "ADMIN";
        if (!isAdminUser) {
          const orgRes = await fetch(`/api/events/${data.id}/organizers`);
          if (orgRes.ok) {
            const orgs = (await orgRes.json()) as OrganizerMember[];
            const isMember = orgs.some((o) => o.user.id === session.user.id);
            if (!isMember) {
              router.push(`/events/${slug}`);
              return;
            }
            setEvent(data);
            populateFormFields(data);
            setOrganizers(orgs);
            const staffRes = await fetch(`/api/events/${data.id}/staff`);
            if (staffRes.ok) setStaff((await staffRes.json()) as StaffMember[]);
          } else {
            router.push(`/events/${slug}`);
            return;
          }
        } else {
          setEvent(data);
          populateFormFields(data);
          await loadTeam(data.id);
        }
        await loadPricingPhases(data.id);
        setIsLoading(false);
      } catch {
        router.push("/events");
      }
    };

    void init();
  }, [
    session,
    status,
    slug,
    router,
    loadTeam,
    loadPricingPhases,
    populateFormFields,
  ]);

  // ─── Derived state ─────────────────────────────────────────────────────────

  const isAdmin = session?.user?.role === "ADMIN";
  const currentUserOrg = organizers.find(
    (o) => o.user.id === session?.user?.id
  );
  const canManageTeam =
    isAdmin ||
    currentUserOrg?.role === EventOrganizerRole.OWNER ||
    currentUserOrg?.role === EventOrganizerRole.ADMIN;

  // ─── PATCH helper ──────────────────────────────────────────────────────────

  const patchEvent = async (payload: Record<string, unknown>) => {
    if (!event) return;
    const res = await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json()) as { error: string };
      throw new Error(err.error ?? "Error");
    }
    const updated = (await res.json()) as EventDetails;
    setEvent(updated);
    populateFormFields(updated);
  };

  const populateEvent = (data: EventDetails) => {
    setEvent(data);
    populateFormFields(data);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/events/${event.slug}`}>
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
                {t("viewEvent")} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          {event.hasRegistrations && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("registrationsOpen")}
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="evento">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1">
            <TabsTrigger value="evento" className="gap-2">
              <FileEdit className="h-4 w-4" />
              {t("tabs.event")}
            </TabsTrigger>
            <TabsTrigger value="localizacao" className="gap-2">
              <MapPin className="h-4 w-4" />
              {t("tabs.location")}
            </TabsTrigger>
            <TabsTrigger value="percursos" className="gap-2">
              <Layers className="h-4 w-4" />
              {t("tabs.variants")}
              {variants.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                >
                  {variants.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="precos" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {t("tabs.pricing")}
              {pricingPhases.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                >
                  {pricingPhases.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              {t("tabs.team")}
              {organizers.length + staff.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                >
                  {organizers.length + staff.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {t("tabs.payments")}
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              {t("tabs.settings")}
            </TabsTrigger>
          </TabsList>

          <TabEvento event={event} onSave={patchEvent} />
          <TabLocalizacao event={event} onSave={patchEvent} />
          <TabPercursos
            event={event}
            variants={variants}
            setVariants={setVariants}
            onSave={patchEvent}
          />
          <TabPrecos
            event={event}
            variants={variants}
            pricingPhases={pricingPhases}
            isLoadingPhases={isLoadingPhases}
            loadPricingPhases={loadPricingPhases}
          />
          <TabEquipa
            event={event}
            organizers={organizers}
            staff={staff}
            canManageTeam={canManageTeam}
            loadTeam={loadTeam}
          />
          <TabPagamentos
            event={event}
            onSave={patchEvent}
            populateEvent={populateEvent}
          />
          <TabConfig event={event} isAdmin={isAdmin} onSave={patchEvent} />
        </Tabs>

        {/* Admin link */}
        {isAdmin && (
          <div className="mt-8 flex justify-end">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href={`/admin/events/${event.id}`}>
                <Settings className="h-4 w-4" />
                {t("adminLink")}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
