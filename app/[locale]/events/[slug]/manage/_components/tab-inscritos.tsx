"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Download,
  Search,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RegistrationEntry {
  id: string;
  type: "paid" | "free";
  userId: string;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  variantId: string | null;
  variantName: string | null;
  variantDistance: number | null;
  status: string;
  bibNumber: string | null;
  checkedInAt: string | null;
  amountCents: number | null;
  currency: string | null;
  createdAt: string;
}

interface VariantOption {
  id: string;
  name: string;
  distanceKm: number | null;
}

interface RegistrationCounts {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  totalParticipations: number;
  goingParticipations: number;
  interestedParticipations: number;
}

interface CustomFieldDef {
  id: string;
  label: string;
  type: string;
  options: string[];
}

interface CustomFieldResponseEntry {
  customFieldId: string;
  registrationId: string | null;
  participationId: string | null;
  userId: string;
  value: string;
  customField: CustomFieldDef;
}

interface TabInscritosProps {
  event: EventDetails;
  isAdmin?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── Status Badge Component ─────────────────────────────────────────────────

function StatusBadge({
  status,
  type,
  t,
}: {
  status: string;
  type: "paid" | "free";
  t: ReturnType<typeof useTranslations>;
}) {
  if (type === "paid") {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("statusConfirmed")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            {t("statusPending")}
          </Badge>
        );
      case "CANCELLED":
      case "REFUNDED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="mr-1 h-3 w-3" />
            {status === "REFUNDED" ? t("statusRefunded") : t("statusCancelled")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  // Free participation
  return (
    <Badge
      className={
        status === "going"
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      }
    >
      {status === "going" ? t("statusGoing") : t("statusInterested")}
    </Badge>
  );
}

// ─── CSV Export ──────────────────────────────────────────────────────────────

function exportToCSV(
  entries: RegistrationEntry[],
  eventTitle: string,
  t: ReturnType<typeof useTranslations>,
  customFieldDefs: CustomFieldDef[] = [],
  responseMap: Map<string, Map<string, string>> = new Map()
) {
  const headers = [
    t("csvName"),
    t("csvEmail"),
    t("csvVariant"),
    t("csvStatus"),
    t("csvType"),
    t("csvBib"),
    t("csvAmount"),
    t("csvDate"),
    ...customFieldDefs.map((f) => f.label),
  ];

  const rows = entries.map((entry) => {
    const entryKey =
      entry.type === "paid" ? `reg:${entry.id}` : `par:${entry.id}`;
    const entryResponses = responseMap.get(entryKey);

    return [
      entry.userName ?? "",
      entry.userEmail,
      entry.variantName ?? "",
      entry.status,
      entry.type === "paid" ? t("typePaid") : t("typeFree"),
      entry.bibNumber ?? "",
      entry.amountCents && entry.currency
        ? formatAmount(entry.amountCents, entry.currency)
        : "",
      new Date(entry.createdAt).toLocaleDateString(),
      ...customFieldDefs.map((f) => entryResponses?.get(f.id) ?? ""),
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${eventTitle.replace(/[^a-z0-9]/gi, "_")}_registrations.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function TabInscritos({ event, isAdmin = false }: TabInscritosProps) {
  const t = useTranslations("manage.registrations");
  const { toast } = useToast();

  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [participations, setParticipations] = useState<RegistrationEntry[]>([]);
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [counts, setCounts] = useState<RegistrationCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [variantFilter, setVariantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<RegistrationEntry | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom field data
  const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDef[]>([]);
  // Map: "reg:{id}" or "par:{id}" => Map<customFieldId, value>
  const [cfResponseMap, setCfResponseMap] = useState<
    Map<string, Map<string, string>>
  >(new Map());

  // ─── Fetch data ────────────────────────────────────────────────────────────

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (variantFilter !== "all") params.set("variant", variantFilter);

      const res = await fetch(
        `/api/events/${event.id}/registrations?${params.toString()}`
      );
      if (!res.ok) throw new Error();

      const data = (await res.json()) as {
        registrations: RegistrationEntry[];
        participations: RegistrationEntry[];
        variants: VariantOption[];
        counts: RegistrationCounts;
      };

      setRegistrations(data.registrations);
      setParticipations(data.participations);
      setVariants(data.variants);
      setCounts(data.counts);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [event.id, variantFilter]);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

  // Fetch custom fields + responses
  useEffect(() => {
    const fetchCustomFieldData = async () => {
      try {
        // Fetch field definitions
        const fieldsRes = await fetch(`/api/events/${event.id}/custom-fields`);
        if (!fieldsRes.ok) return;
        const fields = (await fieldsRes.json()) as CustomFieldDef[];
        setCustomFieldDefs(fields);

        if (fields.length === 0) return;

        // Fetch responses
        const responsesRes = await fetch(
          `/api/events/${event.id}/custom-field-responses`
        );
        if (!responsesRes.ok) return;
        const responses =
          (await responsesRes.json()) as CustomFieldResponseEntry[];

        // Build a map: entryKey => Map<customFieldId, value>
        const map = new Map<string, Map<string, string>>();
        for (const r of responses) {
          const key = r.registrationId
            ? `reg:${r.registrationId}`
            : r.participationId
              ? `par:${r.participationId}`
              : null;
          if (!key) continue;
          if (!map.has(key)) map.set(key, new Map());
          map.get(key)!.set(r.customFieldId, r.value);
        }
        setCfResponseMap(map);
      } catch {
        // silent
      }
    };
    void fetchCustomFieldData();
  }, [event.id, registrations, participations]);

  // ─── Filtering ─────────────────────────────────────────────────────────────

  const allEntries = [...registrations, ...participations];

  const filteredEntries = allEntries.filter((entry) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = entry.userName?.toLowerCase().includes(query);
      const matchesEmail = entry.userEmail.toLowerCase().includes(query);
      const matchesBib = entry.bibNumber?.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail && !matchesBib) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "paid") return entry.type === "paid";
      if (statusFilter === "free") return entry.type === "free";
      if (entry.status !== statusFilter) return false;
    }

    return true;
  });

  // ─── Export handler ────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    exportToCSV(
      filteredEntries,
      event.title,
      t,
      customFieldDefs,
      cfResponseMap
    );
  };

  // ─── Delete handler (admin only) ──────────────────────────────────────────

  const handleDeleteRegistration = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/events/${event.id}/registrations/${deleteTarget.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast({
          title: t("deleteSuccess"),
          description: t("deleteSuccessDesc", {
            name: deleteTarget.userName ?? deleteTarget.userEmail,
          }),
        });
        // Refresh data
        void fetchRegistrations();
      } else {
        const data = (await res.json()) as { error: string };
        toast({
          title: t("deleteError"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("deleteError"),
        description: t("deleteErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <TabsContent value="inscritos" className="space-y-6">
      {/* Stats Cards */}
      {counts && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {event.hasRegistrations ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("totalRegistrations")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {counts.totalRegistrations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("confirmed")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {counts.confirmedRegistrations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("pending")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-yellow-600">
                    {counts.pendingRegistrations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("cancelledRefunded")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {counts.cancelledRegistrations}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("totalParticipants")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {counts.totalParticipations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("going")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {counts.goingParticipations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("interested")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-600">
                    {counts.interestedParticipations}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Filters & Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{t("registeredList")}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredEntries.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {t("exportCSV")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter row */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {variants.length > 0 && (
              <Select value={variantFilter} onValueChange={setVariantFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t("allVariants")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allVariants")}</SelectItem>
                  {variants.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                      {v.distanceKm ? ` (${v.distanceKm}km)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                {event.hasRegistrations ? (
                  <>
                    <SelectItem value="CONFIRMED">
                      {t("statusConfirmed")}
                    </SelectItem>
                    <SelectItem value="PENDING">
                      {t("statusPending")}
                    </SelectItem>
                    <SelectItem value="CANCELLED">
                      {t("statusCancelled")}
                    </SelectItem>
                    <SelectItem value="REFUNDED">
                      {t("statusRefunded")}
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="going">{t("statusGoing")}</SelectItem>
                    <SelectItem value="interested">
                      {t("statusInterested")}
                    </SelectItem>
                  </>
                )}
                {event.hasRegistrations && (
                  <>
                    <SelectItem value="paid">{t("typePaid")}</SelectItem>
                    <SelectItem value="free">{t("typeFree")}</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>{t("noRegistrations")}</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {t("showingResults", { count: filteredEntries.length })}
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("columnName")}</TableHead>
                      <TableHead>{t("columnEmail")}</TableHead>
                      <TableHead>{t("columnVariant")}</TableHead>
                      <TableHead>{t("columnStatus")}</TableHead>
                      {event.hasRegistrations && (
                        <TableHead>{t("columnAmount")}</TableHead>
                      )}
                      <TableHead>{t("columnDate")}</TableHead>
                      {customFieldDefs.map((cf) => (
                        <TableHead key={cf.id} className="text-xs">
                          {cf.label}
                        </TableHead>
                      ))}
                      {isAdmin && (
                        <TableHead className="w-[70px]">
                          {t("columnActions")}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={`${entry.type}-${entry.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={entry.userImage ?? undefined}
                                alt={entry.userName ?? entry.userEmail}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(entry.userName, entry.userEmail)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {entry.userName ?? t("noName")}
                              </p>
                              {entry.bibNumber && (
                                <p className="text-xs text-muted-foreground">
                                  #{entry.bibNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {entry.userEmail}
                        </TableCell>
                        <TableCell className="text-sm">
                          {entry.variantName ?? "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={entry.status}
                            type={entry.type}
                            t={t}
                          />
                        </TableCell>
                        {event.hasRegistrations && (
                          <TableCell className="text-sm">
                            {entry.amountCents && entry.currency
                              ? formatAmount(entry.amountCents, entry.currency)
                              : "—"}
                          </TableCell>
                        )}
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </TableCell>
                        {customFieldDefs.map((cf) => {
                          const entryKey =
                            entry.type === "paid"
                              ? `reg:${entry.id}`
                              : `par:${entry.id}`;
                          const val =
                            cfResponseMap.get(entryKey)?.get(cf.id) ?? "—";
                          return (
                            <TableCell key={cf.id} className="text-sm">
                              {val === "true"
                                ? "✅"
                                : val === "false"
                                  ? "—"
                                  : val}
                            </TableCell>
                          );
                        })}
                        {isAdmin && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setDeleteTarget(entry)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog (admin only) */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription", {
                name: deleteTarget?.userName ?? deleteTarget?.userEmail ?? "",
                variant: deleteTarget?.variantName ?? "—",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("deleteCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRegistration}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}
