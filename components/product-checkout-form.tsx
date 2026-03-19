"use client";

import { CheckoutForm } from "@/components/checkout-form";

interface ProductCheckoutFormProps {
  venueId: string;
  purchaseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductCheckoutForm({
  venueId,
  purchaseId,
  onSuccess,
  onCancel,
}: Readonly<ProductCheckoutFormProps>) {
  return (
    <CheckoutForm
      confirmEndpoint={`/api/venues/${venueId}/purchases/${purchaseId}/confirm`}
      silentConfirm
      translationNamespace="venues.shop.checkout"
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}
