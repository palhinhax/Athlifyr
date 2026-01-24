import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface SessionBooking {
  id: string;
  status: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VenueSession {
  id: string;
  venueId: string;
  type: "CLASS" | "APPOINTMENT";
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  coachId: string | null;
  tags: string[];
  recurringSessionId: string | null;
  recurringSession?: {
    id: string;
    isActive: boolean;
  } | null;
  bookings?: SessionBooking[];
  _count: {
    bookings: number;
  };
  isBooked?: boolean;
}

interface UseSessionManagementParams {
  venueId: string;
  selectedDay: Date;
  onSuccess: () => void;
}

export function useSessionManagement({
  venueId,
  selectedDay,
  onSuccess,
}: UseSessionManagementParams) {
  const t = useTranslations("venues.sessions");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  // Create/Edit modal state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<VenueSession | null>(null);
  const [defaultSessionDate, setDefaultSessionDate] = useState<
    Date | undefined
  >(undefined);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<VenueSession | null>(
    null
  );
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);

  // Details modal state
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<VenueSession | null>(
    null
  );

  // Open create session modal
  const openCreateSessionModal = (date?: Date) => {
    setSessionToEdit(null);
    setDefaultSessionDate(date || selectedDay);
    setSessionModalOpen(true);
  };

  // Open edit session modal
  const openEditSessionModal = (session: VenueSession) => {
    setSessionToEdit(session);
    setDefaultSessionDate(undefined);
    setSessionModalOpen(true);
  };

  // Open delete dialog
  const handleDeleteSession = (session: VenueSession) => {
    setSessionToDelete(session);
    setDeleteAll(false);
    setDeleteDialogOpen(true);
  };

  // Confirm delete session
  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    setDeleteInProgress(true);
    try {
      const url =
        deleteAll && sessionToDelete.recurringSessionId
          ? `/api/venues/${venueId}/sessions/${sessionToDelete.id}?deleteAll=true`
          : `/api/venues/${venueId}/sessions/${sessionToDelete.id}`;

      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      toast({
        title: t("deleteSuccess"),
        variant: "default",
      });

      onSuccess();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: tCommon("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setDeleteInProgress(false);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
      setDeleteAll(false);
    }
  };

  // Open session details modal
  const handleSessionClick = (session: VenueSession) => {
    setSelectedSession(session);
    setSessionDetailsOpen(true);
  };

  return {
    // Create/Edit modal
    sessionModalOpen,
    setSessionModalOpen,
    sessionToEdit,
    defaultSessionDate,
    openCreateSessionModal,
    openEditSessionModal,

    // Delete dialog
    deleteDialogOpen,
    setDeleteDialogOpen,
    sessionToDelete,
    deleteInProgress,
    deleteAll,
    setDeleteAll,
    handleDeleteSession,
    confirmDeleteSession,

    // Details modal
    sessionDetailsOpen,
    setSessionDetailsOpen,
    selectedSession,
    handleSessionClick,
  };
}
