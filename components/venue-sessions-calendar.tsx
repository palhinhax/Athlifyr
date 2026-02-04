"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Dumbbell, UserCircle } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { VenueSessionModal } from "@/components/venue-session-modal";
import { MonthCalendarView } from "@/components/month-calendar-view";
import { VenueSessionCard } from "@/components/venue-session-card";
import { SessionDetailsDialog } from "@/components/session-details-dialog";
import { BulkWorkoutAssignDialog } from "@/components/bulk-workout-assign-dialog";
import { BulkCoachAssignDialog } from "@/components/bulk-coach-assign-dialog";
import {
  SessionDeleteDialog,
  SessionCancelDialog,
} from "@/components/session-dialogs";
import { useVenueSessions } from "@/hooks/use-venue-sessions";
import { useSessionBooking } from "@/hooks/use-session-booking";
import { useSessionManagement } from "@/hooks/use-session-management";

interface VenueSessionsCalendarProps {
  venueId: string;
  locale: string;
  userId?: string;
  hasActiveSubscription?: boolean;
  isOwnerOrAdmin?: boolean;
  venueDefaults?: {
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
  };
}

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

export function VenueSessionsCalendar({
  venueId,
  locale,
  userId,
  hasActiveSubscription = false,
  isOwnerOrAdmin = false,
  venueDefaults,
}: VenueSessionsCalendarProps) {
  const t = useTranslations("venues.sessions");

  // Date navigation state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Calculate date ranges
  const monthStart = useMemo(() => {
    const date = new Date(currentDate);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [currentDate]);

  const monthEnd = useMemo(() => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [currentDate]);

  // Custom hooks for data and actions
  const { sessions, loading, fetchSessions, getSessionsForDay, sessionsByDay } =
    useVenueSessions({
      venueId,
      userId,
      monthStart,
      monthEnd,
    });

  const {
    bookingInProgress,
    cancelDialogOpen,
    setCancelDialogOpen,
    handleBookSession,
    handleCancelBooking,
    confirmCancelBooking,
  } = useSessionBooking({
    venueId,
    userId,
    onSuccess: fetchSessions,
  });

  const {
    sessionModalOpen,
    setSessionModalOpen,
    sessionToEdit,
    defaultSessionDate,
    openCreateSessionModal,
    openEditSessionModal,
    deleteDialogOpen,
    setDeleteDialogOpen,
    sessionToDelete,
    deleteInProgress,
    deleteAll,
    setDeleteAll,
    handleDeleteSession,
    confirmDeleteSession,
    sessionDetailsOpen,
    setSessionDetailsOpen,
    selectedSession,
    handleSessionClick,
  } = useSessionManagement({
    venueId,
    selectedDay,
    onSuccess: fetchSessions,
  });

  // Bulk workout assignment state
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkCoachAssignOpen, setBulkCoachAssignOpen] = useState(false);

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  // Render
  const selectedDaySessions = getSessionsForDay(selectedDay);
  const dateLocale = localeMap[locale] || enUS;

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Session Button (Owner/Admin) */}
      {isOwnerOrAdmin && (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setBulkCoachAssignOpen(true)}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            {t("bulkAssignCoach")}
          </Button>
          <Button variant="outline" onClick={() => setBulkAssignOpen(true)}>
            <Dumbbell className="mr-2 h-4 w-4" />
            {t("bulkAssignWorkout")}
          </Button>
          <Button onClick={() => openCreateSessionModal(selectedDay)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createSession")}
          </Button>
        </div>
      )}

      {/* Month Calendar */}
      <MonthCalendarView
        currentDate={currentDate}
        selectedDay={selectedDay}
        locale={locale}
        sessionsByDay={sessionsByDay}
        onDaySelect={setSelectedDay}
        onPrevious={goToPreviousMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
      />

      {/* Sessions for Selected Day */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">
          {format(selectedDay, "PPP", { locale: dateLocale })}
        </h3>

        {selectedDaySessions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("noSessionsThisDay")}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedDaySessions.map((session) => (
              <VenueSessionCard
                key={session.id}
                session={session}
                locale={locale}
                userId={userId}
                hasActiveSubscription={hasActiveSubscription}
                isOwnerOrAdmin={isOwnerOrAdmin}
                onBook={handleBookSession}
                onCancel={handleCancelBooking}
                onEdit={openEditSessionModal}
                onDelete={handleDeleteSession}
                onClick={handleSessionClick}
                bookingInProgress={bookingInProgress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Session Modal */}
      <VenueSessionModal
        open={sessionModalOpen}
        onOpenChange={setSessionModalOpen}
        venueId={venueId}
        session={sessionToEdit}
        defaultDate={defaultSessionDate}
        onSuccess={fetchSessions}
        venueDefaults={venueDefaults}
      />

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        open={sessionDetailsOpen}
        onOpenChange={setSessionDetailsOpen}
        locale={locale}
        userId={userId}
        hasActiveSubscription={hasActiveSubscription}
        isOwnerOrAdmin={isOwnerOrAdmin}
        onBook={handleBookSession}
        onCancel={handleCancelBooking}
        onEdit={openEditSessionModal}
        onDelete={handleDeleteSession}
        bookingInProgress={bookingInProgress}
      />

      {/* Delete Confirmation Dialog */}
      <SessionDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteSession}
        isDeleting={deleteInProgress}
        isRecurring={!!sessionToDelete?.recurringSessionId}
        deleteAll={deleteAll}
        onDeleteAllChange={setDeleteAll}
      />

      {/* Cancel Booking Dialog */}
      <SessionCancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={confirmCancelBooking}
        isCancelling={false}
      />

      {/* Bulk Workout Assignment Dialog */}
      <BulkWorkoutAssignDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
        venueId={venueId}
        onSuccess={fetchSessions}
      />

      {/* Bulk Coach Assignment Dialog */}
      <BulkCoachAssignDialog
        open={bulkCoachAssignOpen}
        onOpenChange={setBulkCoachAssignOpen}
        venueId={venueId}
        onSuccess={fetchSessions}
      />
    </div>
  );
}
