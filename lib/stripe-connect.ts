// Stripe Connect types and utilities

export interface StripeAccountStatus {
  accountId: string | null;
  onboardingStatus: "NOT_STARTED" | "PENDING" | "COMPLETE" | "RESTRICTED";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  lastWebhookAt: Date | null;
}

export interface StripeOnboardingLinkResponse {
  url: string;
}

export interface StripeLoginLinkResponse {
  url: string;
}

export interface StripeAccountUpdateData {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingStatus: "NOT_STARTED" | "PENDING" | "COMPLETE" | "RESTRICTED";
}
