"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Plus,
  FileText,
  Trash2,
  Pencil,
  Copy,
  Eye,
  Send,
  GripVertical,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { FormFieldType, FormStatus } from "@prisma/client";

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormField {
  id?: string;
  _key: string;
  label: string;
  placeholder?: string;
  type: FormFieldType;
  required: boolean;
  order: number;
  options: string[];
  section?: string;
}

interface FormSummary {
  id: string;
  title: string;
  description: string | null;
  status: FormStatus;
  slug: string;
  closesAt: string | null;
  maxSubmissions: number | null;
  createdAt: string;
  _count: { submissions: number; fields: number };
}

interface ApiFormField {
  id: string;
  label: string;
  placeholder?: string;
  type: FormFieldType;
  required: boolean;
  order: number;
  options: string[];
  section?: string;
}

interface FormDetail extends FormSummary {
  fields: ApiFormField[];
  submissions: Array<{
    id: string;
    name: string | null;
    email: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    } | null;
    values: Array<{
      id: string;
      value: string;
      field: { id: string; label: string; type: FormFieldType };
    }>;
  }>;
}

const FIELD_TYPES: FormFieldType[] = [
  "TEXT",
  "EMAIL",
  "PHONE",
  "NUMBER",
  "DATE",
  "TEXTAREA",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "CHECKBOX_GROUP",
  "TIME",
  "COUNTRY",
  "URL",
];

const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  TEXT: "Text",
  EMAIL: "Email",
  PHONE: "Phone",
  NUMBER: "Number",
  DATE: "Date",
  TEXTAREA: "Text Area",
  SELECT: "Dropdown",
  RADIO: "Radio Buttons",
  CHECKBOX: "Checkbox",
  CHECKBOX_GROUP: "Checkbox Group",
  TIME: "Time",
  COUNTRY: "Country",
  URL: "URL",
};

let fieldKeyCounter = 0;
function nextFieldKey() {
  return `field-${++fieldKeyCounter}-${Date.now()}`;
}

const STATUS_COLORS: Record<FormStatus, string> = {
  DRAFT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CLOSED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// ─── Main Component ────────────────────────────────────────────────────────

export default function AdminFormsPage() {
  const t = useTranslations("admin.forms");
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<FormDetail | null>(null);
  const [viewingForm, setViewingForm] = useState<FormDetail | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchForms = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/forms");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: FormSummary[] = await res.json();
      setForms(data);
    } catch {
      toast({ title: t("errors.fetchFailed"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleViewForm = async (formId: string) => {
    try {
      const res = await fetch(`/api/admin/forms/${formId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: FormDetail = await res.json();
      setViewingForm(data);
    } catch {
      toast({ title: t("errors.fetchFailed"), variant: "destructive" });
    }
  };

  const handleEditForm = async (formId: string) => {
    try {
      const res = await fetch(`/api/admin/forms/${formId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: FormDetail = await res.json();
      setEditingForm(data);
      setShowBuilder(true);
    } catch {
      toast({ title: t("errors.fetchFailed"), variant: "destructive" });
    }
  };

  const handleDeleteForm = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/forms/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: t("deleteSuccess") });
      setDeletingId(null);
      fetchForms();
    } catch {
      toast({ title: t("errors.deleteFailed"), variant: "destructive" });
    }
  };

  const handleStatusChange = async (formId: string, status: FormStatus) => {
    try {
      const res = await fetch(`/api/admin/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: t("statusUpdated") });
      fetchForms();
    } catch {
      toast({ title: t("errors.updateFailed"), variant: "destructive" });
    }
  };

  const copyLink = (slug: string) => {
    const url = `${globalThis.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: t("linkCopied") });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingForm(null);
            setShowBuilder(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createForm")}
        </Button>
      </div>

      {/* Forms List */}
      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">{t("noForms")}</p>
            <p className="text-sm text-muted-foreground">
              {t("noFormsDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{form.title}</h3>
                    <Badge className={STATUS_COLORS[form.status]}>
                      {t(`status.${form.status}`)}
                    </Badge>
                  </div>
                  {form.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {form.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>
                      {t("fieldsCount", { count: form._count.fields })}
                    </span>
                    <span>
                      {form.maxSubmissions
                        ? t("submissionsOfMax", {
                            count: form._count.submissions,
                            max: form.maxSubmissions,
                          })
                        : t("submissionsCount", {
                            count: form._count.submissions,
                          })}
                    </span>
                    <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Select
                    value={form.status}
                    onValueChange={(val) =>
                      handleStatusChange(form.id, val as FormStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">{t("status.DRAFT")}</SelectItem>
                      <SelectItem value="ACTIVE">
                        {t("status.ACTIVE")}
                      </SelectItem>
                      <SelectItem value="CLOSED">
                        {t("status.CLOSED")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyLink(form.slug)}
                    title={t("copyLink")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewForm(form.id)}
                    title={t("viewSubmissions")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditForm(form.id)}
                    title={t("editForm")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(form.id)}
                    title={t("deleteForm")}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Builder Dialog */}
      {showBuilder && (
        <FormBuilderDialog
          form={editingForm}
          onClose={() => {
            setShowBuilder(false);
            setEditingForm(null);
          }}
          onSaved={() => {
            setShowBuilder(false);
            setEditingForm(null);
            fetchForms();
          }}
        />
      )}

      {/* Submissions Viewer Dialog */}
      {viewingForm && (
        <SubmissionsDialog
          form={viewingForm}
          onClose={() => setViewingForm(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForm}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Form Builder Dialog ───────────────────────────────────────────────────

function FormBuilderDialog({
  form,
  onClose,
  onSaved,
}: Readonly<{
  form: FormDetail | null;
  onClose: () => void;
  onSaved: () => void;
}>) {
  const t = useTranslations("admin.forms");
  const [title, setTitle] = useState(form?.title ?? "");
  const [description, setDescription] = useState(form?.description ?? "");
  const [closesAt, setClosesAt] = useState(
    form?.closesAt ? new Date(form.closesAt).toISOString().slice(0, 16) : ""
  );
  const [maxSubmissions, setMaxSubmissions] = useState<string>(
    form?.maxSubmissions === null || form?.maxSubmissions === undefined
      ? ""
      : String(form.maxSubmissions)
  );
  const [fields, setFields] = useState<FormField[]>(
    form?.fields?.map((f) => ({
      id: f.id,
      _key: f.id || nextFieldKey(),
      label: f.label,
      placeholder: f.placeholder ?? "",
      type: f.type,
      required: f.required,
      order: f.order,
      options: f.options,
      section: f.section ?? "",
    })) ?? []
  );
  const [saving, setSaving] = useState(false);

  const addField = () => {
    setFields([
      ...fields,
      {
        _key: nextFieldKey(),
        label: "",
        placeholder: "",
        type: "TEXT",
        required: false,
        order: fields.length,
        options: [],
        section: "",
      },
    ]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    );
  };

  const removeField = (index: number) => {
    setFields((prev) =>
      prev.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i }))
    );
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    )
      return;
    const newFields = [...fields];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newFields[index], newFields[swapIndex]] = [
      newFields[swapIndex],
      newFields[index],
    ];
    setFields(newFields.map((f, i) => ({ ...f, order: i })));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: t("errors.titleRequired"), variant: "destructive" });
      return;
    }

    if (fields.length === 0) {
      toast({ title: t("errors.fieldsRequired"), variant: "destructive" });
      return;
    }

    for (const field of fields) {
      if (!field.label.trim()) {
        toast({
          title: t("errors.fieldLabelRequired"),
          variant: "destructive",
        });
        return;
      }
      if (
        ["SELECT", "RADIO", "CHECKBOX_GROUP"].includes(field.type) &&
        field.options.length === 0
      ) {
        toast({
          title: t("errors.optionsRequired", { field: field.label }),
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        closesAt: closesAt || null,
        maxSubmissions: maxSubmissions
          ? Number.parseInt(maxSubmissions, 10)
          : null,
        fields: fields.map((f) => ({
          label: f.label,
          placeholder: f.placeholder || undefined,
          type: f.type,
          required: f.required,
          order: f.order,
          options: f.options,
          section: f.section || undefined,
        })),
      };

      const url = form ? `/api/admin/forms/${form.id}` : "/api/admin/forms";
      const method = form ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast({ title: form ? t("updateSuccess") : t("createSuccess") });
      onSaved();
    } catch {
      toast({ title: t("errors.saveFailed"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const needsOptions = (type: FormFieldType) =>
    ["SELECT", "RADIO", "CHECKBOX_GROUP"].includes(type);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form ? t("editFormTitle") : t("createFormTitle")}
          </DialogTitle>
          <DialogDescription>{t("builderDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Metadata */}
          <div className="space-y-4">
            <div>
              <Label>{t("formTitle")}</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("formTitlePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("formDescription")}</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("formDescriptionPlaceholder")}
              />
            </div>
            <div>
              <Label>{t("closesAt")}</Label>
              <Input
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("maxSubmissions")}</Label>
              <Input
                type="number"
                min="1"
                value={maxSubmissions}
                onChange={(e) => setMaxSubmissions(e.target.value)}
                placeholder={t("maxSubmissionsPlaceholder")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("maxSubmissionsHint")}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">{t("fields")}</Label>
              <Button size="sm" variant="outline" onClick={addField}>
                <Plus className="mr-1 h-3 w-3" />
                {t("addField")}
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("noFieldsYet")}
              </p>
            )}

            {fields.map((field, index) => (
              <Card key={field._key} className="relative">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveField(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveField(index, "down")}
                        disabled={index === fields.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeField(index)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">{t("fieldLabel")}</Label>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(index, { label: e.target.value })
                        }
                        placeholder={t("fieldLabelPlaceholder")}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t("fieldType")}</Label>
                      <Select
                        value={field.type}
                        onValueChange={(val) =>
                          updateField(index, {
                            type: val as FormFieldType,
                            options: needsOptions(val as FormFieldType)
                              ? field.options
                              : [],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((ft) => (
                            <SelectItem key={ft} value={ft}>
                              {FIELD_TYPE_LABELS[ft]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">{t("placeholder")}</Label>
                      <Input
                        value={field.placeholder ?? ""}
                        onChange={(e) =>
                          updateField(index, { placeholder: e.target.value })
                        }
                        placeholder={t("placeholderText")}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t("section")}</Label>
                      <Input
                        value={field.section ?? ""}
                        onChange={(e) =>
                          updateField(index, { section: e.target.value })
                        }
                        placeholder={t("sectionPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          updateField(index, { required: checked })
                        }
                      />
                      <Label className="text-xs">{t("required")}</Label>
                    </div>
                  </div>

                  {/* Options for SELECT / RADIO / CHECKBOX_GROUP */}
                  {needsOptions(field.type) && (
                    <FieldOptionsEditor
                      options={field.options}
                      onChange={(options) => updateField(index, { options })}
                      t={t}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form ? t("saveChanges") : t("createForm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Field Options Editor ──────────────────────────────────────────────────

function FieldOptionsEditor({
  options,
  onChange,
  t,
}: Readonly<{
  options: string[];
  onChange: (options: string[]) => void;
  t: ReturnType<typeof useTranslations>;
}>) {
  const updateOption = (optIdx: number, value: string) => {
    const newOpts = [...options];
    newOpts[optIdx] = value;
    onChange(newOpts);
  };

  const removeOption = (optIdx: number) => {
    onChange(options.filter((_, i) => i !== optIdx));
  };

  return (
    <div>
      <Label className="text-xs">{t("options")}</Label>
      <div className="space-y-1">
        {options.map((opt, optIdx) => (
          <div key={`opt-${optIdx}-${opt}`} className="flex items-center gap-1">
            <Input
              value={opt}
              onChange={(e) => updateOption(optIdx, e.target.value)}
              className="h-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => removeOption(optIdx)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange([...options, ""])}
        >
          <Plus className="mr-1 h-3 w-3" />
          {t("addOption")}
        </Button>
      </div>
    </div>
  );
}

// ─── Submissions Viewer Dialog ─────────────────────────────────────────────

function SubmissionsDialog({
  form,
  onClose,
}: Readonly<{
  form: FormDetail;
  onClose: () => void;
}>) {
  const t = useTranslations("admin.forms");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form.title} — {t("submissions")}
          </DialogTitle>
          <DialogDescription>
            {t("submissionsCount", { count: form.submissions.length })}
          </DialogDescription>
        </DialogHeader>

        {form.submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Send className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">{t("noSubmissions")}</p>
            <p className="text-sm text-muted-foreground">
              {t("noSubmissionsDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.submissions.map((submission, idx) => (
              <Card key={submission.id}>
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        #{form.submissions.length - idx}
                      </Badge>
                      {submission.user ? (
                        <span className="text-sm font-medium">
                          {submission.user.name || submission.user.email}
                        </span>
                      ) : (
                        <span className="text-sm font-medium">
                          {submission.name ||
                            submission.email ||
                            t("anonymous")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {submission.values.map((val) => (
                      <div key={val.id} className="rounded-md bg-muted/50 p-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {val.field.label}
                        </p>
                        <p className="text-sm">{val.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
