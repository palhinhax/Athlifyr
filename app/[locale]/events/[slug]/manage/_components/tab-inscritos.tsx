"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  ScanLine,
  ChevronLeft,
  ChevronRight,
  Settings2,
  FileText,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  // Profile fields
  dateOfBirth: string | null;
  citizenId: string | null;
  nationality: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  phone: string | null;
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
  checkedInRegistrations: number;
  totalParticipations: number;
  goingParticipations: number;
  interestedParticipations: number;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
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

// ─── Main Component ─────────────────────────────────────────────────────────

export function TabInscritos({ event, isAdmin = false }: TabInscritosProps) {
  const t = useTranslations("manage.registrations");
  const { toast } = useToast();

  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [participations, setParticipations] = useState<RegistrationEntry[]>([]);
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [counts, setCounts] = useState<RegistrationCounts | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [variantFilter, setVariantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkedInFilter, setCheckedInFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<RegistrationEntry | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  // Custom field data
  const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDef[]>([]);
  // Map: "reg:{id}" or "par:{id}" => Map<customFieldId, value>
  const [cfResponseMap, setCfResponseMap] = useState<
    Map<string, Map<string, string>>
  >(new Map());

  // ─── Column visibility ─────────────────────────────────────────────────────
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      name: true,
      bibNumber: true,
      email: true,
      variant: true,
      status: true,
      checkIn: true,
      amount: true,
      date: true,
      phone: false,
      citizenId: false,
      dateOfBirth: false,
      nationality: false,
      emergencyContactName: false,
      emergencyContactPhone: false,
    }
  );

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  // ─── Custom field filter ───────────────────────────────────────────────────
  const [cfFilterFieldId, setCfFilterFieldId] = useState("all");
  const [cfFilterValue, setCfFilterValue] = useState("all");

  // Reset cf filter value when field changes
  useEffect(() => {
    setCfFilterValue("all");
  }, [cfFilterFieldId]);

  // Get options for the currently selected custom field filter
  const activeCfField = useMemo(
    () => customFieldDefs.find((cf) => cf.id === cfFilterFieldId),
    [customFieldDefs, cfFilterFieldId]
  );

  // Get unique values for a SELECT field from responses
  const cfFilterOptions = useMemo(() => {
    if (!activeCfField) return [];
    if (activeCfField.type === "SELECT") return activeCfField.options;
    if (activeCfField.type === "BOOLEAN") return ["true", "false"];
    return [];
  }, [activeCfField]);

  // Filter entries by custom field value (client-side)
  const filterByCf = useCallback(
    (entries: RegistrationEntry[]): RegistrationEntry[] => {
      if (cfFilterFieldId === "all" || cfFilterValue === "all") return entries;
      return entries.filter((entry) => {
        const entryKey =
          entry.type === "paid" ? `reg:${entry.id}` : `par:${entry.id}`;
        const val = cfResponseMap.get(entryKey)?.get(cfFilterFieldId);
        return val === cfFilterValue;
      });
    },
    [cfFilterFieldId, cfFilterValue, cfResponseMap]
  );

  // ─── Debounce search input ─────────────────────────────────────────────────
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // ─── Reset page to 1 when filters change ──────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [variantFilter, statusFilter, checkedInFilter]);

  // ─── Fetch data ────────────────────────────────────────────────────────────

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (variantFilter !== "all") params.set("variant", variantFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (checkedInFilter !== "all") params.set("checkedIn", checkedInFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("page", String(currentPage));
      params.set("pageSize", "25");

      const res = await fetch(
        `/api/events/${event.id}/registrations?${params.toString()}`
      );
      if (!res.ok) throw new Error();

      const data = (await res.json()) as {
        registrations: RegistrationEntry[];
        participations: RegistrationEntry[];
        variants: VariantOption[];
        counts: RegistrationCounts;
        pagination: PaginationMeta;
      };

      setRegistrations(data.registrations);
      setParticipations(data.participations);
      setVariants(data.variants);
      setCounts(data.counts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    event.id,
    variantFilter,
    statusFilter,
    checkedInFilter,
    debouncedSearch,
    currentPage,
  ]);

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

  // ─── Combined entries (already server-filtered + paginated) ───────────────

  const allEntries = filterByCf([...registrations, ...participations]);

  // ─── Export state ────────────────────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);

  // ─── CSV helpers ───────────────────────────────────────────────────────────

  const escapeCSV = (value: string): string => `"${value.replace(/"/g, '""')}"`;

  const buildCSVRow = (cells: string[]): string =>
    cells.map(escapeCSV).join(",") + "\r\n";

  // ─── Export handler (client-side CSV — matches visible table exactly) ──────

  // ─── Shared export data builder ─────────────────────────────────────────────

  const fetchExportData = async (): Promise<{
    headers: string[];
    rows: string[][];
    entries: RegistrationEntry[];
  } | null> => {
    const params = new URLSearchParams();
    if (variantFilter !== "all") params.set("variant", variantFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (checkedInFilter !== "all") params.set("checkedIn", checkedInFilter);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", "1");
    params.set("pageSize", "10000");

    const res = await fetch(
      `/api/events/${event.id}/registrations?${params.toString()}`
    );
    if (!res.ok) throw new Error("Failed to fetch data for export");

    const data = (await res.json()) as {
      registrations: RegistrationEntry[];
      participations: RegistrationEntry[];
    };

    const exportEntries = filterByCf([
      ...data.registrations,
      ...data.participations,
    ]);

    if (exportEntries.length === 0) {
      toast({
        title: t("exportError"),
        description: t("noRegistrations"),
        variant: "destructive",
      });
      return null;
    }

    // Build headers + getters from visible columns
    const headers: string[] = [];
    const columnGetters: ((entry: RegistrationEntry) => string)[] = [];

    if (visibleColumns.name) {
      headers.push(t("csvName"));
      columnGetters.push((e) => e.userName ?? "");
    }
    if (event.hasRegistrations && visibleColumns.bibNumber) {
      headers.push(t("csvBib"));
      columnGetters.push((e) => e.bibNumber ?? "");
    }
    if (visibleColumns.email) {
      headers.push(t("csvEmail"));
      columnGetters.push((e) => e.userEmail);
    }
    if (visibleColumns.variant) {
      headers.push(t("csvVariant"));
      columnGetters.push((e) => e.variantName ?? "");
    }
    if (visibleColumns.status) {
      headers.push(t("csvStatus"));
      columnGetters.push((e) => e.status);
    }
    if (event.hasRegistrations && visibleColumns.checkIn) {
      headers.push(t("columnCheckIn"));
      columnGetters.push((e) =>
        e.checkedInAt
          ? new Date(e.checkedInAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""
      );
    }
    if (event.hasRegistrations && visibleColumns.amount) {
      headers.push(t("csvAmount"));
      columnGetters.push((e) =>
        e.amountCents && e.currency
          ? formatAmount(e.amountCents, e.currency)
          : ""
      );
    }
    if (visibleColumns.date) {
      headers.push(t("csvDate"));
      columnGetters.push((e) => new Date(e.createdAt).toLocaleDateString());
    }
    if (visibleColumns.phone) {
      headers.push(t("columnPhone"));
      columnGetters.push((e) => e.phone ?? "");
    }
    if (visibleColumns.citizenId) {
      headers.push(t("columnCitizenId"));
      columnGetters.push((e) => e.citizenId ?? "");
    }
    if (visibleColumns.dateOfBirth) {
      headers.push(t("columnDateOfBirth"));
      columnGetters.push((e) =>
        e.dateOfBirth ? new Date(e.dateOfBirth).toLocaleDateString() : ""
      );
    }
    if (visibleColumns.nationality) {
      headers.push(t("columnNationality"));
      columnGetters.push((e) => e.nationality ?? "");
    }
    if (visibleColumns.emergencyContactName) {
      headers.push(t("columnEmergencyName"));
      columnGetters.push((e) => e.emergencyContactName ?? "");
    }
    if (visibleColumns.emergencyContactPhone) {
      headers.push(t("columnEmergencyPhone"));
      columnGetters.push((e) => e.emergencyContactPhone ?? "");
    }

    // Custom field columns
    for (const cf of customFieldDefs) {
      if (visibleColumns[`cf:${cf.id}`] !== false) {
        headers.push(cf.label);
        columnGetters.push((e) => {
          const entryKey = e.type === "paid" ? `reg:${e.id}` : `par:${e.id}`;
          const val = cfResponseMap.get(entryKey)?.get(cf.id) ?? "";
          return val === "true" ? "Yes" : val === "false" ? "No" : val;
        });
      }
    }

    const rows = exportEntries.map((entry) =>
      columnGetters.map((getter) => getter(entry))
    );

    return { headers, rows, entries: exportEntries };
  };

  // ─── Export handler: CSV ──────────────────────────────────────────────────

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const exportData = await fetchExportData();
      if (!exportData) return;

      const { headers, rows } = exportData;

      const BOM = "\uFEFF";
      let csv = BOM + buildCSVRow(headers);
      for (const row of rows) {
        csv += buildCSVRow(row);
      }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const datePart = new Date().toISOString().slice(0, 10);
      const slug = event.slug ?? "event";
      const filename = `athlifyr-registrations-${slug}-${datePart}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: t("exportSuccess"),
        description: t("exportSuccessDesc"),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("CSV export error:", error.message);
      }
      toast({
        title: t("exportError"),
        description: t("exportErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Export handler: PDF ──────────────────────────────────────────────────

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const exportData = await fetchExportData();
      if (!exportData) return;

      const { headers, rows, entries } = exportData;

      // Load logo.svg → render onto a canvas pre-filled with the header golden
      // colour (#FAC864) so the resulting PNG has no transparent/white corners.
      // jsPDF receives a fully opaque PNG — no border artefacts.
      let logoPngDataUrl: string | null = null;
      try {
        const svgText = await fetch("/logo.svg").then((r) => r.text());
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        logoPngDataUrl = await new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const SIZE = 256;
            const cvs = document.createElement("canvas");
            cvs.width = SIZE;
            cvs.height = SIZE;
            const c = cvs.getContext("2d")!;
            // Fill with the exact same golden colour used in the PDF header
            // so the logo blends perfectly with no white/black corners
            c.fillStyle = "#FAC864";
            c.fillRect(0, 0, SIZE, SIZE);
            c.drawImage(img, 0, 0, SIZE, SIZE);
            URL.revokeObjectURL(url);
            resolve(cvs.toDataURL("image/png"));
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve("");
          };
          img.src = url;
        });
        if (!logoPngDataUrl) logoPngDataUrl = null;
      } catch {
        // Logo is optional — PDF will render without it
      }

      // Dynamically import to avoid SSR issues
      const { generateRegistrationsPDF } = await import("@/lib/pdf-export");

      generateRegistrationsPDF({
        title: event.title ?? event.slug ?? "Event",
        slug: event.slug ?? "event",
        headers,
        rows,
        totalCount: entries.length,
        logoPngDataUrl,
      });

      toast({
        title: t("exportSuccess"),
        description: t("exportSuccessDesc"),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("PDF export error:", error.message);
      }
      toast({
        title: t("exportError"),
        description: t("exportErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsExportingPDF(false);
    }
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

  // ─── Check-in toggle handler ───────────────────────────────────────────────

  const handleToggleCheckIn = async (entry: RegistrationEntry) => {
    if (entry.type !== "paid") return;
    const targetCheckedIn = !entry.checkedInAt;
    setCheckingIn(entry.id);
    try {
      const res = await fetch(
        `/api/events/${event.id}/registrations/${entry.id}/checkin`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkedIn: targetCheckedIn }),
        }
      );

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error || "Check-in failed");
      }

      const result = (await res.json()) as { checkedInAt: string | null };

      // Optimistic update: update in-place without full refetch
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === entry.id ? { ...r, checkedInAt: result.checkedInAt } : r
        )
      );

      // Update counts optimistically
      if (counts) {
        setCounts({
          ...counts,
          checkedInRegistrations: targetCheckedIn
            ? counts.checkedInRegistrations + 1
            : counts.checkedInRegistrations - 1,
        });
      }

      toast({
        title: targetCheckedIn ? t("checkInSuccess") : t("checkInUndone"),
        description: targetCheckedIn
          ? t("checkInSuccessDesc", {
              name: entry.userName ?? entry.userEmail,
            })
          : t("checkInUndoneDesc", {
              name: entry.userName ?? entry.userEmail,
            }),
      });
    } catch (error) {
      toast({
        title: t("checkInError"),
        description:
          error instanceof Error ? error.message : t("checkInErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setCheckingIn(null);
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
                <CardContent className="p-4" aria-label={t("checkedIn")}>
                  <div className="flex items-center gap-2">
                    <ScanLine className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-muted-foreground">
                      {t("checkedIn")}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-indigo-600">
                    {counts.checkedInRegistrations}
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
            <div className="flex items-center gap-2">
              {/* Column visibility toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    {t("columns")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t("toggleColumns")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.name}
                    onCheckedChange={() => toggleColumn("name")}
                  >
                    {t("columnName")}
                  </DropdownMenuCheckboxItem>
                  {event.hasRegistrations && (
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.bibNumber}
                      onCheckedChange={() => toggleColumn("bibNumber")}
                    >
                      {t("columnBib")}
                    </DropdownMenuCheckboxItem>
                  )}
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.email}
                    onCheckedChange={() => toggleColumn("email")}
                  >
                    {t("columnEmail")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.variant}
                    onCheckedChange={() => toggleColumn("variant")}
                  >
                    {t("columnVariant")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.status}
                    onCheckedChange={() => toggleColumn("status")}
                  >
                    {t("columnStatus")}
                  </DropdownMenuCheckboxItem>
                  {event.hasRegistrations && (
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.checkIn}
                      onCheckedChange={() => toggleColumn("checkIn")}
                    >
                      {t("columnCheckIn")}
                    </DropdownMenuCheckboxItem>
                  )}
                  {event.hasRegistrations && (
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.amount}
                      onCheckedChange={() => toggleColumn("amount")}
                    >
                      {t("columnAmount")}
                    </DropdownMenuCheckboxItem>
                  )}
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.date}
                    onCheckedChange={() => toggleColumn("date")}
                  >
                    {t("columnDate")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t("profileFields")}</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.phone}
                    onCheckedChange={() => toggleColumn("phone")}
                  >
                    {t("columnPhone")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.citizenId}
                    onCheckedChange={() => toggleColumn("citizenId")}
                  >
                    {t("columnCitizenId")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.dateOfBirth}
                    onCheckedChange={() => toggleColumn("dateOfBirth")}
                  >
                    {t("columnDateOfBirth")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.nationality}
                    onCheckedChange={() => toggleColumn("nationality")}
                  >
                    {t("columnNationality")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.emergencyContactName}
                    onCheckedChange={() => toggleColumn("emergencyContactName")}
                  >
                    {t("columnEmergencyName")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.emergencyContactPhone}
                    onCheckedChange={() =>
                      toggleColumn("emergencyContactPhone")
                    }
                  >
                    {t("columnEmergencyPhone")}
                  </DropdownMenuCheckboxItem>
                  {customFieldDefs.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{t("customFields")}</DropdownMenuLabel>
                      {customFieldDefs.map((cf) => (
                        <DropdownMenuCheckboxItem
                          key={cf.id}
                          checked={visibleColumns[`cf:${cf.id}`] !== false}
                          onCheckedChange={() => toggleColumn(`cf:${cf.id}`)}
                        >
                          {cf.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={pagination.total === 0 || isExporting}
                className="gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {t("exportCSV")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={pagination.total === 0 || isExportingPDF}
                className="gap-2"
              >
                {isExportingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {t("exportPDF")}
              </Button>
            </div>
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

            {event.hasRegistrations && (
              <Select
                value={checkedInFilter}
                onValueChange={setCheckedInFilter}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <ScanLine className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t("allCheckIn")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCheckIn")}</SelectItem>
                  <SelectItem value="true">{t("checkedInOnly")}</SelectItem>
                  <SelectItem value="false">{t("notCheckedInOnly")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Custom field filter row */}
          {customFieldDefs.filter(
            (cf) => cf.type === "SELECT" || cf.type === "BOOLEAN"
          ).length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                value={cfFilterFieldId}
                onValueChange={setCfFilterFieldId}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder={t("filterByField")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allFields")}</SelectItem>
                  {customFieldDefs
                    .filter(
                      (cf) => cf.type === "SELECT" || cf.type === "BOOLEAN"
                    )
                    .map((cf) => (
                      <SelectItem key={cf.id} value={cf.id}>
                        {cf.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {cfFilterFieldId !== "all" && cfFilterOptions.length > 0 && (
                <Select value={cfFilterValue} onValueChange={setCfFilterValue}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={t("allValues")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allValues")}</SelectItem>
                    {cfFilterOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "true"
                          ? "✅ " + t("yes")
                          : opt === "false"
                            ? "— " + t("no")
                            : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : allEntries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>{t("noRegistrations")}</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {t("showingResults", { count: pagination.total })}
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.name && (
                        <TableHead>{t("columnName")}</TableHead>
                      )}
                      {event.hasRegistrations && visibleColumns.bibNumber && (
                        <TableHead>{t("columnBib")}</TableHead>
                      )}
                      {visibleColumns.email && (
                        <TableHead>{t("columnEmail")}</TableHead>
                      )}
                      {visibleColumns.variant && (
                        <TableHead>{t("columnVariant")}</TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead>{t("columnStatus")}</TableHead>
                      )}
                      {event.hasRegistrations && visibleColumns.checkIn && (
                        <TableHead>{t("columnCheckIn")}</TableHead>
                      )}
                      {event.hasRegistrations && visibleColumns.amount && (
                        <TableHead>{t("columnAmount")}</TableHead>
                      )}
                      {visibleColumns.date && (
                        <TableHead>{t("columnDate")}</TableHead>
                      )}
                      {visibleColumns.phone && (
                        <TableHead>{t("columnPhone")}</TableHead>
                      )}
                      {visibleColumns.citizenId && (
                        <TableHead>{t("columnCitizenId")}</TableHead>
                      )}
                      {visibleColumns.dateOfBirth && (
                        <TableHead>{t("columnDateOfBirth")}</TableHead>
                      )}
                      {visibleColumns.nationality && (
                        <TableHead>{t("columnNationality")}</TableHead>
                      )}
                      {visibleColumns.emergencyContactName && (
                        <TableHead>{t("columnEmergencyName")}</TableHead>
                      )}
                      {visibleColumns.emergencyContactPhone && (
                        <TableHead>{t("columnEmergencyPhone")}</TableHead>
                      )}
                      {customFieldDefs.map(
                        (cf) =>
                          visibleColumns[`cf:${cf.id}`] !== false && (
                            <TableHead key={cf.id} className="text-xs">
                              {cf.label}
                            </TableHead>
                          )
                      )}
                      {isAdmin && (
                        <TableHead className="w-[70px]">
                          {t("columnActions")}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEntries.map((entry) => (
                      <TableRow key={`${entry.type}-${entry.id}`}>
                        {visibleColumns.name && (
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
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {event.hasRegistrations && visibleColumns.bibNumber && (
                          <TableCell className="font-mono text-sm">
                            {entry.bibNumber ? `#${entry.bibNumber}` : "—"}
                          </TableCell>
                        )}
                        {visibleColumns.email && (
                          <TableCell className="text-sm">
                            {entry.userEmail}
                          </TableCell>
                        )}
                        {visibleColumns.variant && (
                          <TableCell className="text-sm">
                            {entry.variantName ?? "—"}
                          </TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>
                            <StatusBadge
                              status={entry.status}
                              type={entry.type}
                              t={t}
                            />
                          </TableCell>
                        )}
                        {event.hasRegistrations && visibleColumns.checkIn && (
                          <TableCell>
                            {entry.type === "paid" ? (
                              <div className="flex items-center gap-2">
                                {entry.checkedInAt ? (
                                  <Badge className="gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    <ScanLine className="h-3 w-3" />
                                    {new Date(
                                      entry.checkedInAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    —
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 ${
                                    entry.checkedInAt
                                      ? "text-indigo-600 hover:text-indigo-800"
                                      : "text-muted-foreground hover:text-indigo-600"
                                  }`}
                                  disabled={checkingIn === entry.id}
                                  onClick={() => handleToggleCheckIn(entry)}
                                  title={
                                    entry.checkedInAt
                                      ? t("undoCheckIn")
                                      : t("doCheckIn")
                                  }
                                >
                                  {checkingIn === entry.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ScanLine className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                        )}
                        {event.hasRegistrations && visibleColumns.amount && (
                          <TableCell className="text-sm">
                            {entry.amountCents && entry.currency
                              ? formatAmount(entry.amountCents, entry.currency)
                              : "—"}
                          </TableCell>
                        )}
                        {visibleColumns.date && (
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </TableCell>
                        )}
                        {visibleColumns.phone && (
                          <TableCell className="text-sm">
                            {entry.phone || "—"}
                          </TableCell>
                        )}
                        {visibleColumns.citizenId && (
                          <TableCell className="text-sm">
                            {entry.citizenId || "—"}
                          </TableCell>
                        )}
                        {visibleColumns.dateOfBirth && (
                          <TableCell className="text-sm">
                            {entry.dateOfBirth
                              ? new Date(entry.dateOfBirth).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        )}
                        {visibleColumns.nationality && (
                          <TableCell className="text-sm">
                            {entry.nationality || "—"}
                          </TableCell>
                        )}
                        {visibleColumns.emergencyContactName && (
                          <TableCell className="text-sm">
                            {entry.emergencyContactName || "—"}
                          </TableCell>
                        )}
                        {visibleColumns.emergencyContactPhone && (
                          <TableCell className="text-sm">
                            {entry.emergencyContactPhone || "—"}
                          </TableCell>
                        )}
                        {customFieldDefs.map((cf) => {
                          if (visibleColumns[`cf:${cf.id}`] === false)
                            return null;
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("paginationInfo", {
                      page: pagination.page,
                      totalPages: pagination.totalPages,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page <= 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(pagination.totalPages, p + 1)
                        )
                      }
                      disabled={
                        pagination.page >= pagination.totalPages || isLoading
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
