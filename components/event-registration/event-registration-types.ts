import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";

export interface TeamMemberData {
  name: string;
  email: string;
  dateOfBirth: string;
  citizenId: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface PricingPhase {
  id: string;
  name: string | null;
  price: number;
  currency: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
}

export interface EventVariant {
  id: string;
  name: string;
  distanceKm?: number | null;
  startDate?: Date | string | null;
  startTime?: string | null;
  maxParticipants?: number | null;
  registrationCount?: number;
  pricingPhases?: PricingPhase[];
  teamSize?: number;
}

export interface Participation {
  id: string;
  status: string;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
}

export interface PaidRegistration {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  variantId: string;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  } | null;
  amountCents: number;
  currency: string;
}

export interface EventRegistrationProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  hasRegistrations?: boolean;
  variants?: EventVariant[];
  registrationFieldSettings?: Record<string, string>;
}

export interface UserProfileData {
  dateOfBirth: string | null;
  citizenId: string | null;
  nationality: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

export interface RegistrationState {
  userParticipation: Participation | null;
  paidRegistration: PaidRegistration | null;
  selectedVariantId: string;
  isLoading: boolean;
  participantsCount: number;
  interestedCount: number;
  showShareDialog: boolean;
  shareContent: string;
  isSharing: boolean;
  registrationChecked: boolean;
  showTicketModal: boolean;
  isCancellingPending: boolean;
  isRetryingPayment: boolean;
  showConsentDialog: boolean;
  customFields: CustomField[];
  customFieldAnswersMap: Record<number, CustomFieldAnswer[]>;
  teamMembers: TeamMemberData[];
  userProfileData: UserProfileData | null;
}

export interface RegistrationActions {
  setSelectedVariantId: (id: string) => void;
  setShowShareDialog: (show: boolean) => void;
  setShareContent: (content: string) => void;
  setShowTicketModal: (show: boolean) => void;
  setShowConsentDialog: (show: boolean) => void;
  setCustomFieldAnswersMap: React.Dispatch<
    React.SetStateAction<Record<number, CustomFieldAnswer[]>>
  >;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMemberData[]>>;
  handleCheckout: () => Promise<void>;
  handleRegister: () => Promise<void>;
  handleUnregister: () => Promise<void>;
  handleMarkInterested: () => Promise<void>;
  handleSharePost: () => Promise<void>;
  handleRetryPayment: () => Promise<void>;
  handleCancelPending: () => Promise<void>;
  handleConsentConfirmed: () => void;
}

export interface RegistrationDerived {
  activePrice: PricingPhase | null;
  selectedVariantSoldOut: boolean;
  selectedVariantNoPrice: boolean;
  allVariantsSoldOut: boolean;
  selectedVariantTeamSize: number;
  needsConsentOrTeam: boolean;
  requiredRegistrationFields: string[];
  optionalRegistrationFields: string[];
  consentFlowRef: React.MutableRefObject<"checkout" | "free">;
}
