"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Loader2,
  Plus,
  Trash2,
  Send,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  Zap,
  Calendar,
  Copy,
  RotateCcw,
  Ban,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// ─── Types ─────────────────────────────────────────────────────────────────

type PostStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED"
  | "CANCELLED";
type PostType = "EVENT" | "WEEKLY_ROUNDUP" | "LAST_CALL" | "RESULTS" | "CUSTOM";

interface SocialPost {
  id: string;
  platform: "INSTAGRAM";
  type: PostType;
  status: PostStatus;
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string | null;
  imageUrl: string | null;
  mediaUrls: string[];
  scheduledFor: string | null;
  publishedAt: string | null;
  externalPostId: string | null;
  externalUrl: string | null;
  errorMessage: string | null;
  retryCount: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  _count?: { logs: number };
}

interface PostLog {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  userId: string | null;
  createdAt: string;
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function AdminSocialPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const t = useTranslations("admin.social");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/admin/social/posts?${params.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as {
          posts: SocialPost[];
          total: number;
        };
        setPosts(data.posts);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPosts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("refresh")}
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createPost")}
          </Button>
        </div>
      </div>

      {/* Generate Drafts Section */}
      <GenerateSection onGenerated={fetchPosts} t={t} />

      {/* Filters */}
      <PostFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        total={total}
        t={t}
      />

      {/* Posts List */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{t("posts.empty")}</p>
          <p className="text-sm text-muted-foreground">
            {t("posts.emptyDescription")}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onAction={fetchPosts}
              onSelect={setSelectedPost}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Post Detail Dialog */}
      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onAction={fetchPosts}
          t={t}
        />
      )}

      {/* Create Post Dialog */}
      {showCreate && (
        <CreatePostDialog
          onClose={() => setShowCreate(false)}
          onCreated={fetchPosts}
          t={t}
        />
      )}
    </div>
  );
}

// ─── Filters ───────────────────────────────────────────────────────────────

function PostFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
  total,
  t,
}: {
  statusFilter: string;
  typeFilter: string;
  onStatusChange: (s: string) => void;
  onTypeChange: (s: string) => void;
  total: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const statuses: Array<{ value: string; label: string }> = [
    { value: "", label: t("posts.all") },
    { value: "DRAFT", label: t("posts.status.DRAFT") },
    { value: "SCHEDULED", label: t("posts.status.SCHEDULED") },
    { value: "PUBLISHING", label: t("posts.status.PUBLISHING") },
    { value: "PUBLISHED", label: t("posts.status.PUBLISHED") },
    { value: "FAILED", label: t("posts.status.FAILED") },
    { value: "CANCELLED", label: t("posts.status.CANCELLED") },
  ];

  const types: Array<{ value: string; label: string }> = [
    { value: "", label: t("posts.allTypes") },
    { value: "EVENT", label: t("posts.type.EVENT") },
    { value: "WEEKLY_ROUNDUP", label: t("posts.type.WEEKLY_ROUNDUP") },
    { value: "LAST_CALL", label: t("posts.type.LAST_CALL") },
    { value: "RESULTS", label: t("posts.type.RESULTS") },
    { value: "CUSTOM", label: t("posts.type.CUSTOM") },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {t("posts.title")}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({total})
          </span>
        </h3>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s.value || "all-status"}
            variant={statusFilter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {types.map((tp) => (
          <Button
            key={tp.value || "all-type"}
            variant={typeFilter === tp.value ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(tp.value)}
          >
            {tp.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────

function PostCard({
  post,
  onAction,
  onSelect,
  t,
}: {
  post: SocialPost;
  onAction: () => void;
  onSelect: (post: SocialPost) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleAction = async (
    action:
      | "publish"
      | "cancel"
      | "retry"
      | "duplicate"
      | "delete"
      | "publish-feed",
    method = "POST"
  ) => {
    try {
      setActionLoading(action);
      const url =
        action === "delete"
          ? `/api/admin/social/posts/${post.id}`
          : `/api/admin/social/posts/${post.id}/${action}`;

      const res = await fetch(url, {
        method: method === "POST" ? "POST" : "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast({
          title: t("error"),
          description: err.error || `Failed to ${action}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("success"),
        description: t(
          `actions.${action === "publish-feed" ? "publishFeed" : action}Success`
        ),
      });
      onAction();
    } catch (error) {
      console.error(`Error ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Image preview */}
        {post.imageUrl ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
            <Instagram className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={post.status} t={t} />
            <TypeBadge type={post.type} t={t} />
          </div>

          <p className="mt-1 font-medium">{post.title}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {post.caption}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.scheduledFor && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(post.scheduledFor).toLocaleString()}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleString()}
              </span>
            )}
            {post.errorMessage && (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="h-3 w-3" />
                {post.errorMessage}
              </span>
            )}
            {post.hashtags.length > 0 && (
              <span className="text-muted-foreground">
                #{post.hashtags.slice(0, 3).join(" #")}
                {post.hashtags.length > 3 && ` +${post.hashtags.length - 3}`}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(post)}
            title={t("actions.view")}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {post.externalUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}

          {(post.status === "DRAFT" || post.status === "SCHEDULED") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("publish")}
              disabled={actionLoading !== null}
              title={t("actions.publish")}
            >
              {actionLoading === "publish" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          )}

          {post.imageUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("publish-feed")}
              disabled={actionLoading !== null}
              title={t("actions.publishFeed")}
            >
              {actionLoading === "publish-feed" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </Button>
          )}

          {post.status === "DRAFT" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSchedule(true)}
              disabled={actionLoading !== null}
              title={t("actions.schedule")}
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}

          {(post.status === "DRAFT" || post.status === "SCHEDULED") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("cancel")}
              disabled={actionLoading !== null}
              title={t("actions.cancel")}
            >
              {actionLoading === "cancel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
            </Button>
          )}

          {post.status === "FAILED" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("retry")}
              disabled={actionLoading !== null}
              title={t("actions.retry")}
            >
              {actionLoading === "retry" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("duplicate")}
            disabled={actionLoading !== null}
            title={t("actions.duplicate")}
          >
            {actionLoading === "duplicate" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          {post.status !== "PUBLISHED" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  disabled={actionLoading !== null}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("posts.deleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("posts.deleteDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction("delete", "DELETE")}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {showSchedule && (
        <ScheduleDialog
          postId={post.id}
          postTitle={post.title}
          onClose={() => setShowSchedule(false)}
          onScheduled={() => {
            setShowSchedule(false);
            onAction();
          }}
          t={t}
        />
      )}
    </Card>
  );
}

// ─── Schedule Dialog ───────────────────────────────────────────────────────

function ScheduleDialog({
  postId,
  postTitle,
  onClose,
  onScheduled,
  t,
}: {
  postId: string;
  postTitle: string;
  onClose: () => void;
  onScheduled: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [scheduling, setScheduling] = useState(false);
  const [dateTime, setDateTime] = useState(() => {
    // Default: today + 3 hours, rounded to next :00
    const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const handleSchedule = async () => {
    const scheduled = new Date(dateTime);
    if (scheduled <= new Date()) {
      toast({
        title: t("error"),
        description: t("schedule.futureRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      setScheduling(true);
      const res = await fetch(`/api/admin/social/posts/${postId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledFor: scheduled.toISOString() }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast({
          title: t("error"),
          description: err.error || "Failed to schedule",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("success"),
        description: t("schedule.success"),
      });
      onScheduled();
    } catch (error) {
      console.error("Error scheduling post:", error);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("schedule.title")}
          </DialogTitle>
          <DialogDescription>{postTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("schedule.dateTime")}
            </label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-muted-foreground">
              {t("schedule.hint")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={scheduling}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSchedule} disabled={scheduling}>
            {scheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Clock className="mr-2 h-4 w-4" />
            {t("schedule.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────

function StatusBadge({
  status,
  t,
}: {
  status: PostStatus;
  t: ReturnType<typeof useTranslations>;
}) {
  const config: Record<
    PostStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: typeof CheckCircle2;
    }
  > = {
    DRAFT: { variant: "secondary", icon: Edit },
    SCHEDULED: { variant: "outline", icon: Clock },
    PUBLISHING: { variant: "default", icon: Loader2 },
    PUBLISHED: { variant: "default", icon: CheckCircle2 },
    FAILED: { variant: "destructive", icon: XCircle },
    CANCELLED: { variant: "secondary", icon: Ban },
  };

  const { variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon
        className={`h-3 w-3 ${status === "PUBLISHING" ? "animate-spin" : ""}`}
      />
      {t(`posts.status.${status}`)}
    </Badge>
  );
}

function TypeBadge({
  type,
  t,
}: {
  type: PostType;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Badge variant="outline" className="text-xs">
      {t(`posts.type.${type}`)}
    </Badge>
  );
}

// ─── Generate Section ──────────────────────────────────────────────────────

function GenerateSection({
  onGenerated,
  t,
}: {
  onGenerated: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [days, setDays] = useState("7");
  const [sport, setSport] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const sportOptions = [
    { value: "", label: t("generate.allSports") },
    { value: "TRAIL", label: "Trail" },
    { value: "RUNNING", label: "Running" },
    { value: "CYCLING", label: "Cycling" },
    { value: "BTT", label: "BTT" },
    { value: "TRIATHLON", label: "Triathlon" },
    { value: "OCR", label: "OCR" },
    { value: "CROSSFIT", label: "CrossFit" },
    { value: "HYROX", label: "Hyrox" },
    { value: "SWIMMING", label: "Swimming" },
    { value: "WALKING", label: "Walking" },
  ];

  const handleGenerate = async (
    type: "events" | "weekly" | "lastcall" | "compilation",
    autoSchedule = false
  ) => {
    if (autoSchedule && !scheduleDate) {
      toast({
        title: t("error"),
        description: t("schedule.selectDate"),
        variant: "destructive",
      });
      return;
    }

    if (autoSchedule && new Date(scheduleDate) <= new Date()) {
      toast({
        title: t("error"),
        description: t("schedule.futureRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(autoSchedule ? `${type}-schedule` : type);

      const body: Record<string, unknown> = { type, lang: "pt" };
      if (type !== "lastcall") {
        body.days = parseInt(days, 10);
      }
      if (sport) body.sport = sport;
      if (type === "weekly") body.maxEvents = 5;
      if (type === "lastcall") body.daysUntilDeadline = 3;
      if (autoSchedule) {
        body.scheduledFor = new Date(scheduleDate).toISOString();
      }

      const res = await fetch("/api/admin/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast({
          title: t("error"),
          description: err.error || "Failed to generate",
          variant: "destructive",
        });
        return;
      }

      const data = (await res.json()) as { message: string; created?: number };
      toast({
        title: t("success"),
        description: data.message,
      });

      if (data.created && data.created > 0) {
        onGenerated();
      }
    } catch (error) {
      console.error("Error generating:", error);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">{t("generate.title")}</h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {t("generate.description")}
      </p>

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("generate.days")}</label>
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="7">7 {t("generate.daysLabel")}</option>
            <option value="14">14 {t("generate.daysLabel")}</option>
            <option value="30">30 {t("generate.daysLabel")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("generate.sport")}</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {sportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("schedule.dateTime")}
          </label>
          <Input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">{t("schedule.hint")}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => handleGenerate("events")}
          disabled={generating !== null}
          size="sm"
        >
          {generating === "events" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          {t("generate.events")}
        </Button>

        <Button
          onClick={() => handleGenerate("weekly")}
          disabled={generating !== null}
          size="sm"
          variant="outline"
        >
          {generating === "weekly" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          {t("generate.weekly")}
        </Button>

        <Button
          onClick={() => handleGenerate("lastcall")}
          disabled={generating !== null}
          size="sm"
          variant="outline"
        >
          {generating === "lastcall" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4" />
          )}
          {t("generate.lastCall")}
        </Button>

        <Button
          onClick={() => handleGenerate("compilation")}
          disabled={generating !== null}
          size="sm"
          variant="secondary"
        >
          {generating === "compilation" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="mr-2 h-4 w-4" />
          )}
          {t("generate.compilation")}
        </Button>
      </div>

      {scheduleDate && (
        <>
          <div className="mt-3 border-t pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {t("schedule.generateAndSchedule")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleGenerate("events", true)}
                disabled={generating !== null}
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {generating === "events-schedule" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 h-4 w-4" />
                )}
                {t("generate.events")}
              </Button>

              <Button
                onClick={() => handleGenerate("weekly", true)}
                disabled={generating !== null}
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {generating === "weekly-schedule" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 h-4 w-4" />
                )}
                {t("generate.weekly")}
              </Button>

              <Button
                onClick={() => handleGenerate("lastcall", true)}
                disabled={generating !== null}
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {generating === "lastcall-schedule" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 h-4 w-4" />
                )}
                {t("generate.lastCall")}
              </Button>

              <Button
                onClick={() => handleGenerate("compilation", true)}
                disabled={generating !== null}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
              >
                {generating === "compilation-schedule" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 h-4 w-4" />
                )}
                {t("generate.compilation")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Post Detail Dialog ────────────────────────────────────────────────────

function PostDetailDialog({
  post,
  onClose,
  onAction,
  t,
}: {
  post: SocialPost;
  onClose: () => void;
  onAction: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState(post.hashtags.join(", "));
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<PostLog[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const allImages =
    post.mediaUrls.length >= 2
      ? post.mediaUrls
      : post.imageUrl
        ? [post.imageUrl]
        : [];
  const isCarousel = allImages.length > 1;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/admin/social/posts/${post.id}`);
        if (res.ok) {
          const data = (await res.json()) as {
            post: SocialPost & { logs: PostLog[] };
          };
          setLogs(data.post.logs || []);
        }
      } catch (error) {
        console.error("Error fetching post detail:", error);
      }
    };
    fetchLogs();
  }, [post.id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/social/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          caption,
          hashtags: hashtags
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast({
          title: t("error"),
          description: err.error || "Failed to save",
          variant: "destructive",
        });
        return;
      }

      toast({ title: t("success"), description: t("actions.editSuccess") });
      setEditing(false);
      onAction();
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSaving(false);
    }
  };

  const canEdit = post.status === "DRAFT" || post.status === "FAILED";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusBadge status={post.status} t={t} />
            <TypeBadge type={post.type} t={t} />
          </DialogTitle>
          <DialogDescription>{post.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image / Carousel */}
          {allImages.length > 0 && (
            <div className="relative overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[carouselIndex]}
                alt=""
                className="w-full object-cover"
              />
              {isCarousel && (
                <>
                  <button
                    onClick={() =>
                      setCarouselIndex((i) =>
                        i === 0 ? allImages.length - 1 : i - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCarouselIndex((i) =>
                        i === allImages.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          idx === carouselIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Editable fields */}
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">{t("form.title")}</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("form.caption")}
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("form.hashtags")}
                </label>
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="athlifyr, trail, trailrunning"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("form.caption")}
                </p>
                <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {post.caption}
                </pre>
              </div>
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs">
                      #{h}
                    </Badge>
                  ))}
                </div>
              )}
              {post.callToAction && (
                <p className="text-sm">
                  <span className="font-medium">CTA:</span> {post.callToAction}
                </p>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">
                {t("detail.created")}:
              </span>{" "}
              {new Date(post.createdAt).toLocaleString()}
            </div>
            {post.scheduledFor && (
              <div>
                <span className="text-muted-foreground">
                  {t("detail.scheduled")}:
                </span>{" "}
                {new Date(post.scheduledFor).toLocaleString()}
              </div>
            )}
            {post.publishedAt && (
              <div>
                <span className="text-muted-foreground">
                  {t("detail.published")}:
                </span>{" "}
                {new Date(post.publishedAt).toLocaleString()}
              </div>
            )}
            {post.errorMessage && (
              <div className="col-span-2 text-red-500">
                <span className="font-medium">{t("detail.error")}:</span>{" "}
                {post.errorMessage}
              </div>
            )}
            {post.createdBy && (
              <div>
                <span className="text-muted-foreground">
                  {t("detail.createdBy")}:
                </span>{" "}
                {post.createdBy.name || "Admin"}
              </div>
            )}
            {post.retryCount > 0 && (
              <div>
                <span className="text-muted-foreground">
                  {t("detail.retries")}:
                </span>{" "}
                {post.retryCount}
              </div>
            )}
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">{t("detail.logs")}</p>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <Badge variant="outline" className="text-xs">
                      {log.action}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {canEdit && !editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("actions.edit")}
            </Button>
          )}
          {editing && (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("actions.save")}
              </Button>
            </>
          )}
          {!editing && (
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create Post Dialog ────────────────────────────────────────────────────

function CreatePostDialog({
  onClose,
  onCreated,
  t,
}: {
  onClose: () => void;
  onCreated: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [creating, setCreating] = useState(false);
  const [type, setType] = useState<PostType>("CUSTOM");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("athlifyr");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreate = async () => {
    if (!title || !caption) return;

    try {
      setCreating(true);
      const body: Record<string, unknown> = {
        type,
        title,
        caption,
        hashtags: hashtags
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
      };
      if (imageUrl) body.imageUrl = imageUrl;

      const res = await fetch("/api/admin/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast({
          title: t("error"),
          description: err.error || "Failed to create",
          variant: "destructive",
        });
        return;
      }

      toast({ title: t("success"), description: t("actions.createSuccess") });
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setCreating(false);
    }
  };

  const typeOptions: Array<{ value: PostType; label: string }> = [
    { value: "CUSTOM", label: t("posts.type.CUSTOM") },
    { value: "EVENT", label: t("posts.type.EVENT") },
    { value: "WEEKLY_ROUNDUP", label: t("posts.type.WEEKLY_ROUNDUP") },
    { value: "LAST_CALL", label: t("posts.type.LAST_CALL") },
    { value: "RESULTS", label: t("posts.type.RESULTS") },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createPost")}</DialogTitle>
          <DialogDescription>{t("createPostDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.type")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PostType)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.title")}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("form.titlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.caption")}</label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t("form.captionPlaceholder")}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.hashtags")}</label>
            <Input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="athlifyr, trail, trailrunning"
            />
            <p className="text-xs text-muted-foreground">
              {t("form.hashtagsHint")}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.imageUrl")}</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={creating}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating || !title || !caption}
          >
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("createPost")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
