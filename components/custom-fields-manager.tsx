"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  ListChecks,
  ToggleLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import type { CustomField, CustomFieldType } from "@/types/custom-fields";

interface CustomFieldsManagerProps {
  eventId: string;
}

export function CustomFieldsManager({ eventId }: CustomFieldsManagerProps) {
  const t = useTranslations("manage.customFields");
  const tErr = useTranslations("manage.errors");

  const [fields, setFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New field form state
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<CustomFieldType>("SELECT");
  const [newOptions, setNewOptions] = useState<string[]>([""]);
  const [newRequired, setNewRequired] = useState(false);
  const [newPriceCents, setNewPriceCents] = useState(0);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState<CustomFieldType>("SELECT");
  const [editOptions, setEditOptions] = useState<string[]>([""]);
  const [editRequired, setEditRequired] = useState(false);
  const [editPriceCents, setEditPriceCents] = useState(0);

  const fetchFields = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/custom-fields`);
      if (res.ok) {
        const data = (await res.json()) as CustomField[];
        setFields(data);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void fetchFields();
  }, [fetchFields]);

  const resetForm = () => {
    setNewLabel("");
    setNewType("SELECT");
    setNewOptions([""]);
    setNewRequired(false);
    setNewPriceCents(0);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!newLabel.trim()) {
      toast({
        title: t("labelRequired"),
        variant: "destructive",
      });
      return;
    }

    const filteredOptions = newOptions
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    if (newType === "SELECT" && filteredOptions.length < 2) {
      toast({
        title: t("minTwoOptions"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}/custom-fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newLabel.trim(),
          type: newType,
          options: newType === "SELECT" ? filteredOptions : [],
          required: newRequired,
          priceCents: newPriceCents,
          currency: "EUR",
        }),
      });

      if (!res.ok) throw new Error("Failed to create field");

      toast({ title: t("fieldCreated") });
      resetForm();
      void fetchFields();
    } catch {
      toast({
        title: tErr("saveError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (field: CustomField) => {
    setEditingId(field.id);
    setEditLabel(field.label);
    setEditType(field.type);
    setEditOptions(field.options.length > 0 ? [...field.options] : [""]);
    setEditRequired(field.required);
    setEditPriceCents(field.priceCents);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (fieldId: string) => {
    if (!editLabel.trim()) {
      toast({
        title: t("labelRequired"),
        variant: "destructive",
      });
      return;
    }

    const filteredOptions = editOptions
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    if (editType === "SELECT" && filteredOptions.length < 2) {
      toast({
        title: t("minTwoOptions"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}/custom-fields`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fieldId,
          label: editLabel.trim(),
          type: editType,
          options: editType === "SELECT" ? filteredOptions : [],
          required: editRequired,
          priceCents: editPriceCents,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({ title: t("fieldUpdated") });
      setEditingId(null);
      void fetchFields();
    } catch {
      toast({
        title: tErr("saveError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (fieldId: string) => {
    try {
      const res = await fetch(
        `/api/events/${eventId}/custom-fields?fieldId=${fieldId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: t("fieldDeleted") });
      void fetchFields();
    } catch {
      toast({
        title: tErr("saveError"),
        variant: "destructive",
      });
    }
  };

  const formatPrice = (cents: number) => {
    if (cents <= 0) return t("free");
    return `€${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4" />
          {t("title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing fields list */}
        {fields.length > 0 && (
          <div className="space-y-2">
            {fields.map((field) =>
              editingId === field.id ? (
                <FieldEditForm
                  key={field.id}
                  label={editLabel}
                  type={editType}
                  options={editOptions}
                  required={editRequired}
                  priceCents={editPriceCents}
                  isSaving={isSaving}
                  onLabelChange={setEditLabel}
                  onTypeChange={setEditType}
                  onOptionsChange={setEditOptions}
                  onRequiredChange={setEditRequired}
                  onPriceCentsChange={setEditPriceCents}
                  onSave={() => void handleUpdate(field.id)}
                  onCancel={cancelEdit}
                  t={t}
                />
              ) : (
                <div
                  key={field.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{field.label}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {field.type === "SELECT" ? (
                            <span className="flex items-center gap-1">
                              <ListChecks className="h-3 w-3" />
                              {field.options.join(", ")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ToggleLeft className="h-3 w-3" />
                              {t("yesNo")}
                            </span>
                          )}
                        </Badge>
                        {field.priceCents > 0 && (
                          <Badge className="text-xs">
                            +{formatPrice(field.priceCents)}
                          </Badge>
                        )}
                        {field.required && (
                          <Badge variant="secondary" className="text-xs">
                            {t("requiredBadge")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(field)}
                    >
                      {t("edit")}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deleteFieldTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteFieldDesc")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void handleDelete(field.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t("confirmDelete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {fields.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">{t("noFields")}</p>
        )}

        {/* New field form */}
        {showForm ? (
          <FieldEditForm
            label={newLabel}
            type={newType}
            options={newOptions}
            required={newRequired}
            priceCents={newPriceCents}
            isSaving={isSaving}
            onLabelChange={setNewLabel}
            onTypeChange={setNewType}
            onOptionsChange={setNewOptions}
            onRequiredChange={setNewRequired}
            onPriceCentsChange={setNewPriceCents}
            onSave={() => void handleCreate()}
            onCancel={resetForm}
            isNew
            t={t}
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("addField")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Reusable field form (create / edit) ─────────────────────────────────────

interface FieldEditFormProps {
  label: string;
  type: CustomFieldType;
  options: string[];
  required: boolean;
  priceCents: number;
  isSaving: boolean;
  onLabelChange: (v: string) => void;
  onTypeChange: (v: CustomFieldType) => void;
  onOptionsChange: (v: string[]) => void;
  onRequiredChange: (v: boolean) => void;
  onPriceCentsChange: (v: number) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
  t: ReturnType<typeof useTranslations>;
}

function FieldEditForm({
  label,
  type,
  options,
  required,
  priceCents,
  isSaving,
  onLabelChange,
  onTypeChange,
  onOptionsChange,
  onRequiredChange,
  onPriceCentsChange,
  onSave,
  onCancel,
  isNew,
  t,
}: FieldEditFormProps) {
  const addOption = () => {
    onOptionsChange([...options, ""]);
  };

  const removeOption = (idx: number) => {
    onOptionsChange(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, value: string) => {
    const next = [...options];
    next[idx] = value;
    onOptionsChange(next);
  };

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      {/* Label */}
      <div className="grid gap-1.5">
        <Label className="text-xs">{t("fieldLabel")}</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={t("fieldLabelPlaceholder")}
          className="text-sm"
        />
      </div>

      {/* Type */}
      <div className="grid gap-1.5">
        <Label className="text-xs">{t("fieldType")}</Label>
        <Select
          value={type}
          onValueChange={(v) => onTypeChange(v as CustomFieldType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SELECT">{t("typeSelect")}</SelectItem>
            <SelectItem value="BOOLEAN">{t("typeBoolean")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Options (only for SELECT) */}
      {type === "SELECT" && (
        <div className="grid gap-1.5">
          <Label className="text-xs">{t("fieldOptions")}</Label>
          <div className="space-y-1.5">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`${t("optionPlaceholder")} ${idx + 1}`}
                  className="text-sm"
                />
                {options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeOption(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={addOption}
              className="gap-1 text-xs"
            >
              <Plus className="h-3 w-3" />
              {t("addOption")}
            </Button>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="grid gap-1.5">
        <Label className="text-xs">{t("fieldPrice")}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            step={0.01}
            value={priceCents > 0 ? (priceCents / 100).toFixed(2) : ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPriceCentsChange(isNaN(val) ? 0 : Math.round(val * 100));
            }}
            placeholder="0.00"
            className="w-28 text-sm"
          />
          <span className="text-xs text-muted-foreground">
            € ({t("priceHelp")})
          </span>
        </div>
      </div>

      {/* Required toggle */}
      <div className="flex items-center gap-2">
        <Switch checked={required} onCheckedChange={onRequiredChange} />
        <Label className="text-xs">{t("fieldRequired")}</Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isNew ? t("createField") : t("saveField")}
        </Button>
      </div>
    </div>
  );
}
