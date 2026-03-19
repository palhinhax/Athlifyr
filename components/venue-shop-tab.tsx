"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingBag, Package, Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  stock: number | null;
}

interface VenueShopTabProps {
  venueId: string;
  userId?: string;
  paymentMode: string;
  onPurchaseClick: (product: Product, quantity: number) => void;
}

export function VenueShopTab({
  venueId,
  userId,
  paymentMode,
  onPurchaseClick,
}: VenueShopTabProps) {
  const t = useTranslations("venues.shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/venues/${venueId}/products`);
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

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const setQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    const product = products.find((p) => p.id === productId);
    if (product?.stock != null && qty > product.stock) return;
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const canPurchase =
    userId && (paymentMode === "IN_APP" || paymentMode === "MIXED");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">{t("empty")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{t("title")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const qty = getQuantity(product.id);
          const outOfStock = product.stock !== null && product.stock <= 0;

          return (
            <Card key={product.id} className={outOfStock ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  {product.stock !== null && (
                    <Badge variant={outOfStock ? "destructive" : "secondary"}>
                      {outOfStock
                        ? t("outOfStock")
                        : t("inStock", { count: product.stock })}
                    </Badge>
                  )}
                </div>
                {product.description && (
                  <CardDescription>{product.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {product.price.toFixed(2)} {product.currency}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                {canPurchase && !outOfStock ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(product.id, qty - 1)}
                        disabled={qty <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(product.id, qty + 1)}
                        disabled={
                          product.stock !== null && qty >= product.stock
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPurchaseClick(product, qty)}
                    >
                      <Package className="mr-1 h-4 w-4" />
                      {t("buy")} {(product.price * qty).toFixed(2)}{" "}
                      {product.currency}
                    </Button>
                  </>
                ) : outOfStock ? (
                  <span className="text-sm text-muted-foreground">
                    {t("outOfStock")}
                  </span>
                ) : !userId ? (
                  <span className="text-sm text-muted-foreground">
                    {t("loginToBuy")}
                  </span>
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
