"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Package,
  Save,
  X,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  stock: number | null;
  isActive: boolean;
}

interface VenueProductsSettingsProps {
  venueId: string;
}

export function VenueProductsSettings({ venueId }: VenueProductsSettingsProps) {
  const t = useTranslations("venues.products");
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCurrency, setFormCurrency] = useState("EUR");
  const [formStock, setFormStock] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all products (including inactive) for admin
      const response = await fetch(`/api/venues/${venueId}/products?all=true`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCurrency("EUR");
    setFormStock("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setFormName(product.name);
    setFormDescription(product.description || "");
    setFormPrice(product.price.toString());
    setFormCurrency(product.currency);
    setFormStock(product.stock !== null ? product.stock.toString() : "");
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const price = parseFloat(formPrice);
    if (!formName.trim() || isNaN(price) || price <= 0) {
      toast({
        title: t("validationError"),
        description: t("nameAndPriceRequired"),
        variant: "destructive",
      });
      return;
    }

    const stock = formStock.trim() ? parseInt(formStock, 10) : null;
    if (stock !== null && (isNaN(stock) || stock < 0)) {
      toast({
        title: t("validationError"),
        description: t("invalidStock"),
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        price,
        currency: formCurrency,
        stock,
      };

      const url = editingId
        ? `/api/venues/${venueId}/products/${editingId}`
        : `/api/venues/${venueId}/products`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("saveFailed"));
      }

      toast({
        title: editingId ? t("productUpdated") : t("productCreated"),
        variant: "default",
      });

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: t("saveFailed"),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      if (product.isActive) {
        // Deactivate (soft delete)
        const response = await fetch(
          `/api/venues/${venueId}/products/${product.id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to deactivate");
      } else {
        // Reactivate
        const response = await fetch(
          `/api/venues/${venueId}/products/${product.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: true }),
          }
        );
        if (!response.ok) throw new Error("Failed to reactivate");
      }

      toast({
        title: product.isActive
          ? t("productDeactivated")
          : t("productReactivated"),
        variant: "default",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
      toast({
        title: t("saveFailed"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            {t("addProduct")}
          </Button>
        )}
      </div>

      {/* Product Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingId ? t("editProduct") : t("addProduct")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name">{t("name")}</Label>
                <Input
                  id="product-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="product-price">{t("price")}</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-currency">{t("currency")}</Label>
                  <Input
                    id="product-currency"
                    value={formCurrency}
                    onChange={(e) =>
                      setFormCurrency(e.target.value.toUpperCase())
                    }
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">
                {t("descriptionLabel")}
              </Label>
              <Textarea
                id="product-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">{t("stock")}</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                placeholder={t("stockPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("stockHelp")}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm} disabled={saving}>
                <X className="mr-1 h-4 w-4" />
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Spinner className="mr-1 h-4 w-4" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                {t("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      {products.length === 0 && !showForm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">{t("empty")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("emptyDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className={!product.isActive ? "opacity-60" : ""}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.name}</span>
                    {!product.isActive && (
                      <Badge variant="secondary">{t("inactive")}</Badge>
                    )}
                    {product.stock !== null && (
                      <Badge variant="outline">
                        {t("stockCount", { count: product.stock })}
                      </Badge>
                    )}
                  </div>
                  {product.description && (
                    <CardDescription className="mt-1">
                      {product.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">
                    {product.price.toFixed(2)} {product.currency}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.isActive ? (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      ) : (
                        <RotateCcw className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
