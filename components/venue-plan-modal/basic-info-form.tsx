"use client";

import { useTranslations } from "next-intl";
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

interface BasicInfoFormProps {
  formData: {
    name: string;
    description: string;
    price: string;
    currency: string;
    paymentProvider: string;
  };
  onFormDataChange: (data: BasicInfoFormProps["formData"]) => void;
}

export function BasicInfoForm({
  formData,
  onFormDataChange,
}: BasicInfoFormProps) {
  const t = useTranslations("venues.plans");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            onFormDataChange({ ...formData, name: e.target.value })
          }
          placeholder={t("namePlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            onFormDataChange({ ...formData, description: e.target.value })
          }
          placeholder={t("descriptionPlaceholder")}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t("price")}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              onFormDataChange({ ...formData, price: e.target.value })
            }
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t("currency")}</Label>
          <Input
            id="currency"
            value={formData.currency}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                currency: e.target.value.toUpperCase(),
              })
            }
            placeholder="EUR"
            maxLength={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentProvider">{t("paymentMethod")}</Label>
        <Select
          value={formData.paymentProvider}
          onValueChange={(value) =>
            onFormDataChange({ ...formData, paymentProvider: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("selectPaymentMethod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN_APP">{t("paymentInApp")} (Stripe)</SelectItem>
            <SelectItem value="EXTERNAL">{t("paymentExternal")}</SelectItem>
            <SelectItem value="BOTH">{t("paymentBoth")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
