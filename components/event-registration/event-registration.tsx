"use client";

import { RegistrationConsentDialog } from "@/components/registration-consent-dialog";
import { useEventRegistration } from "./use-event-registration";
import { EventRegistrationHeader } from "./event-registration-header";
import { EventRegistrationPaid } from "./event-registration-paid";
import { EventRegistrationFree } from "./event-registration-free";
import { EventRegistrationShareDialog } from "./event-registration-share-dialog";
import type { EventRegistrationProps } from "./event-registration-types";

export {
  type EventRegistrationProps,
  type TeamMemberData,
} from "./event-registration-types";

export function EventRegistration(props: Readonly<EventRegistrationProps>) {
  const { hasRegistrations = false, variants = [], eventId } = props;

  const { state, actions, derived, session } = useEventRegistration(props);

  if (session.status === "loading") {
    return null;
  }

  const isAuthenticated = !!session.data?.user;

  return (
    <div className="rounded-lg border bg-card p-6">
      <EventRegistrationHeader
        hasRegistrations={hasRegistrations}
        participantsCount={state.participantsCount}
        interestedCount={state.interestedCount}
      />

      {hasRegistrations ? (
        <EventRegistrationPaid
          eventId={eventId}
          isAuthenticated={isAuthenticated}
          registrationChecked={state.registrationChecked}
          paidRegistration={state.paidRegistration}
          variants={variants}
          selectedVariantId={state.selectedVariantId}
          onVariantChange={actions.setSelectedVariantId}
          isLoading={state.isLoading}
          activePrice={derived.activePrice}
          selectedVariantSoldOut={derived.selectedVariantSoldOut}
          selectedVariantNoPrice={derived.selectedVariantNoPrice}
          allVariantsSoldOut={derived.allVariantsSoldOut}
          allVariantsNoPrice={derived.allVariantsNoPrice}
          showTicketModal={state.showTicketModal}
          onShowTicketModal={actions.setShowTicketModal}
          isCancellingPending={state.isCancellingPending}
          isRetryingPayment={state.isRetryingPayment}
          onCheckout={() => void actions.handleCheckout()}
          onRetryPayment={() => void actions.handleRetryPayment()}
          onCancelPending={() => void actions.handleCancelPending()}
        />
      ) : (
        <EventRegistrationFree
          isAuthenticated={isAuthenticated}
          userParticipation={state.userParticipation}
          variants={variants}
          selectedVariantId={state.selectedVariantId}
          onVariantChange={actions.setSelectedVariantId}
          isLoading={state.isLoading}
          selectedVariantSoldOut={derived.selectedVariantSoldOut}
          allVariantsSoldOut={derived.allVariantsSoldOut}
          onRegister={() => void actions.handleRegister()}
          onUnregister={() => void actions.handleUnregister()}
          onMarkInterested={() => void actions.handleMarkInterested()}
        />
      )}

      {/* Registration Consent Dialog */}
      {derived.needsConsentOrTeam && (
        <RegistrationConsentDialog
          open={state.showConsentDialog}
          onOpenChange={actions.setShowConsentDialog}
          requiredFields={derived.requiredRegistrationFields}
          optionalFields={derived.optionalRegistrationFields}
          userProfile={state.userProfileData}
          onConfirm={actions.handleConsentConfirmed}
          hasCustomFields={state.customFields.length > 0}
          customFields={state.customFields}
          customFieldAnswersMap={state.customFieldAnswersMap}
          onCustomFieldAnswersMapChange={actions.setCustomFieldAnswersMap}
          teamSize={derived.selectedVariantTeamSize}
          teamMembers={state.teamMembers}
          onTeamMembersChange={actions.setTeamMembers}
        />
      )}

      {/* Share Post Dialog */}
      <EventRegistrationShareDialog
        open={state.showShareDialog}
        onOpenChange={actions.setShowShareDialog}
        shareContent={state.shareContent}
        onShareContentChange={actions.setShareContent}
        isSharing={state.isSharing}
        onShare={() => void actions.handleSharePost()}
      />
    </div>
  );
}
