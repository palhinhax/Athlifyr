"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Flag,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { useLocale } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isBanned?: boolean;
  createdAt?: string;
}

interface Report {
  id: string;
  reason: string;
  details: string | null;
  status: "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  reporter: User;
  reported: User;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Conversation {
  id: string;
  messages: Message[];
}

interface ReportDetails {
  report: Report;
  conversation: Conversation | null;
  otherReports: Report[];
}

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export default function AdminReportsPage() {
  const t = useTranslations("admin.reports");
  const locale = useLocale();
  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;
  const { toast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    reviewing: 0,
    resolved: 0,
    dismissed: 0,
  });

  // Dialogs
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null
  );
  const [isConversationDialogOpen, setIsConversationDialogOpen] =
    useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (statusFilter !== "all") {
        params.set("status", statusFilter.toUpperCase());
      }

      const response = await fetch(`/api/admin/reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.errorDesc"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, t, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const [pendingRes, reviewingRes, resolvedRes, dismissedRes] =
        await Promise.all([
          fetch("/api/admin/reports?status=PENDING&limit=1"),
          fetch("/api/admin/reports?status=REVIEWING&limit=1"),
          fetch("/api/admin/reports?status=RESOLVED&limit=1"),
          fetch("/api/admin/reports?status=DISMISSED&limit=1"),
        ]);

      const [pending, reviewing, resolved, dismissed] = await Promise.all([
        pendingRes.json(),
        reviewingRes.json(),
        resolvedRes.json(),
        dismissedRes.json(),
      ]);

      setStats({
        pending: pending.pagination?.total || 0,
        reviewing: reviewing.pagination?.total || 0,
        resolved: resolved.pagination?.total || 0,
        dismissed: dismissed.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleViewConversation = async (report: Report) => {
    setSelectedReport(report);
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/admin/reports/${report.id}`);
      if (response.ok) {
        const data = await response.json();
        setReportDetails(data);
        setIsConversationDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.errorDesc"),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED"
  ) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: t("toast.statusUpdated"),
          description: t("toast.statusUpdatedDesc", {
            status: t(`status.${newStatus.toLowerCase()}`),
          }),
        });
        fetchReports();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.errorDesc"),
      });
    }
  };

  const handleBanUser = async (report: Report) => {
    setSelectedReport(report);
    setIsBanDialogOpen(true);
  };

  const confirmBanUser = async () => {
    if (!selectedReport) return;

    setIsActionLoading(true);
    try {
      const isBanned = selectedReport.reported.isBanned;
      const response = await fetch(
        `/api/admin/users/${selectedReport.reported.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBanned: !isBanned }),
        }
      );

      if (response.ok) {
        toast({
          title: isBanned ? t("toast.userUnbanned") : t("toast.userBanned"),
          description: isBanned
            ? t("toast.userUnbannedDesc", {
                name: selectedReport.reported.name || "User",
              })
            : t("toast.userBannedDesc", {
                name: selectedReport.reported.name || "User",
              }),
        });
        setIsBanDialogOpen(false);
        fetchReports();

        // If banning, also resolve the report
        if (!isBanned) {
          await handleUpdateStatus(selectedReport.id, "RESOLVED");
        }
      }
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.errorDesc"),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "destructive",
      reviewing: "default",
      resolved: "secondary",
      dismissed: "outline",
    };

    return (
      <Badge variant={variants[statusLower] || "outline"}>
        {t(`status.${statusLower}`)}
      </Badge>
    );
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: Record<string, string> = {
      SPAM: "spam",
      HARASSMENT: "harassment",
      INAPPROPRIATE_CONTENT: "inappropriate",
      FAKE_ACCOUNT: "fake",
      SCAM: "scam",
      OTHER: "other",
    };
    return t(`reasons.${reasonMap[reason] || "other"}`);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              {t("stats.pending")}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              {t("stats.reviewing")}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.reviewing}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              {t("stats.resolved")}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.resolved}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-muted-foreground">
              {t("stats.dismissed")}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.dismissed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="pending">{t("filters.pending")}</SelectItem>
            <SelectItem value="reviewing">{t("filters.reviewing")}</SelectItem>
            <SelectItem value="resolved">{t("filters.resolved")}</SelectItem>
            <SelectItem value="dismissed">{t("filters.dismissed")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {totalCount} {t("stats.total").toLowerCase()}
        </span>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
          <Flag className="h-12 w-12 text-muted-foreground" />
          <p className="font-medium">{t("noReports")}</p>
          <p className="text-sm text-muted-foreground">
            {t("noReportsDescription")}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="space-y-3 md:hidden">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {t("table.reporter")}:
                        </span>
                        <div className="flex items-center gap-2">
                          {report.reporter.image ? (
                            <Image
                              src={report.reporter.image}
                              alt={report.reporter.name || ""}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                              {getInitials(report.reporter.name)}
                            </div>
                          )}
                          <span className="truncate text-sm font-medium">
                            {report.reporter.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {t("table.reported")}:
                        </span>
                        <div className="flex items-center gap-2">
                          {report.reported.image ? (
                            <Image
                              src={report.reported.image}
                              alt={report.reported.name || ""}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                              {getInitials(report.reported.name)}
                            </div>
                          )}
                          <span className="truncate text-sm font-medium">
                            {report.reported.name || "Unknown"}
                          </span>
                          {report.reported.isBanned && (
                            <Badge variant="destructive" className="text-xs">
                              Banned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        {getReasonLabel(report.reason)}
                      </p>
                      {report.details && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {report.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewConversation(report)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t("actions.viewConversation")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {report.status !== "REVIEWING" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(report.id, "REVIEWING")
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("filters.reviewing")}
                        </DropdownMenuItem>
                      )}
                      {report.status !== "RESOLVED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(report.id, "RESOLVED")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("actions.resolve")}
                        </DropdownMenuItem>
                      )}
                      {report.status !== "DISMISSED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(report.id, "DISMISSED")
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {t("actions.dismiss")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBanUser(report)}
                        className={
                          report.reported.isBanned
                            ? "text-green-600"
                            : "text-destructive"
                        }
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        {report.reported.isBanned
                          ? t("actions.unbanUser")
                          : t("actions.banUser")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden rounded-lg border md:block">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    {t("table.reporter")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    {t("table.reported")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    {t("table.reason")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    {t("table.status")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    {t("table.date")}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    {t("table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {report.reporter.image ? (
                          <Image
                            src={report.reporter.image}
                            alt={report.reporter.name || ""}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {getInitials(report.reporter.name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {report.reporter.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.reporter.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {report.reported.image ? (
                          <Image
                            src={report.reported.image}
                            alt={report.reported.name || ""}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {getInitials(report.reported.name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {report.reported.name || "Unknown"}
                            {report.reported.isBanned && (
                              <Badge
                                variant="destructive"
                                className="ml-2 text-xs"
                              >
                                Banned
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.reported.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{getReasonLabel(report.reason)}</p>
                      {report.details && (
                        <p className="max-w-xs truncate text-xs text-muted-foreground">
                          {report.details}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewConversation(report)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t("actions.viewConversation")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {report.status !== "REVIEWING" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(report.id, "REVIEWING")
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("filters.reviewing")}
                            </DropdownMenuItem>
                          )}
                          {report.status !== "RESOLVED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(report.id, "RESOLVED")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t("actions.resolve")}
                            </DropdownMenuItem>
                          )}
                          {report.status !== "DISMISSED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(report.id, "DISMISSED")
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {t("actions.dismiss")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleBanUser(report)}
                            className={
                              report.reported.isBanned
                                ? "text-green-600"
                                : "text-destructive"
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {report.reported.isBanned
                              ? t("actions.unbanUser")
                              : t("actions.banUser")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Conversation Dialog */}
      <Dialog
        open={isConversationDialogOpen}
        onOpenChange={setIsConversationDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("conversationDialog.title", {
                reporter: reportDetails?.report?.reporter?.name || "User",
                reported: reportDetails?.report?.reported?.name || "User",
              })}
            </DialogTitle>
          </DialogHeader>

          {reportDetails?.report && (
            <div className="mb-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium">
                    {getReasonLabel(reportDetails.report.reason)}
                  </p>
                  {reportDetails.report.details && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {reportDetails.report.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="h-[400px] overflow-y-auto rounded-lg border p-4">
            {reportDetails?.conversation?.messages &&
            reportDetails.conversation.messages.length > 0 ? (
              <div className="space-y-4">
                {reportDetails.conversation.messages.map((message) => {
                  const isReported =
                    message.sender.id === reportDetails.report.reported.id;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-2",
                        isReported && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender.image || undefined} />
                        <AvatarFallback>
                          {getInitials(message.sender.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2",
                          isReported
                            ? "bg-destructive/10 text-destructive-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                            locale: dateLocale,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 font-medium">
                  {t("conversationDialog.noMessages")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("conversationDialog.noMessagesDescription")}
                </p>
              </div>
            )}
          </div>

          {reportDetails?.otherReports &&
            reportDetails.otherReports.length > 0 && (
              <div className="mt-4 rounded-lg border bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  ⚠️ This user has {reportDetails.otherReports.length} other
                  report(s)
                </p>
              </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.reported.isBanned
                ? t("actions.unbanUser")
                : t("banDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {selectedReport?.reported.isBanned
                ? `Are you sure you want to unban ${selectedReport?.reported.name}?`
                : t("banDialog.description", {
                    name: selectedReport?.reported.name || "this user",
                  })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBanDialogOpen(false)}
              disabled={isActionLoading}
            >
              {t("banDialog.cancel")}
            </Button>
            <Button
              variant={
                selectedReport?.reported.isBanned ? "default" : "destructive"
              }
              onClick={confirmBanUser}
              disabled={isActionLoading}
            >
              {isActionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedReport?.reported.isBanned
                ? t("actions.unbanUser")
                : t("banDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
