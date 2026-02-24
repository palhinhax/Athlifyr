"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, addMonths, subMonths } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import { useEasyBookSessions } from "@/hooks/use-easy-book-sessions";
import { MonthCalendarView } from "@/components/month-calendar-view";
import { EasyBookSessionCard } from "@/components/easy-book/easy-book-session-card";
import { EasyBookFormDialog } from "@/components/easy-book/easy-book-form-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, LogIn, CreditCard } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

// Translations for Easy Book (minimal set)
const translations: Record<string, Record<string, Record<string, unknown>>> = {
  en: {
    easyBook: {
      title: "Quick Booking",
      selectClass: "Select a class to book",
      noClassesThisDay: "No classes available for this day",
      bookNow: "Book Now",
      loginRequired: "Login required",
      loginRequiredDescription:
        "You need to log in to book a class at this venue.",
      loginButton: "Log In",
      planRequired: "Active plan required",
      planRequiredDescription:
        "You need an active plan to book classes at this venue.",
      viewPlans: "View Plans",
      bookingForm: {
        title: "Complete your booking",
        name: "Your name",
        namePlaceholder: "Enter your full name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        phone: "Phone number",
        phonePlaceholder: "+351 912 345 678",
        confirmBooking: "Confirm Booking",
        cancel: "Cancel",
        required: "Required",
        invalidEmail: "Please enter a valid email",
        success: "Booking confirmed!",
        successDescription:
          "Your booking has been confirmed. Check your email for details.",
        error: "Booking failed",
        errorDescription: "Unable to complete your booking. Please try again.",
        sessionFull: "This class is full",
        alreadyBooked: "You already have a booking for this class",
      },
    },
    venues: {
      sessions: {
        today: "Today",
        class: "Class",
        appointment: "Appointment",
        minute: "{count} min",
        spotsLeft: "{count} spots left",
        full: "Full",
        noSessionsThisDay: "No sessions for this day",
        loadError: "Failed to load sessions",
      },
    },
    common: {
      error: "Error",
    },
  },
  pt: {
    easyBook: {
      title: "Reserva Rápida",
      selectClass: "Seleciona uma aula para reservar",
      noClassesThisDay: "Sem aulas disponíveis para este dia",
      bookNow: "Reservar Agora",
      loginRequired: "Login necessário",
      loginRequiredDescription:
        "Precisas de iniciar sessão para reservar aulas neste espaço.",
      loginButton: "Iniciar Sessão",
      planRequired: "Plano ativo necessário",
      planRequiredDescription:
        "Precisas de um plano ativo para reservar aulas neste espaço.",
      viewPlans: "Ver Planos",
      bookingForm: {
        title: "Completa a tua reserva",
        name: "O teu nome",
        namePlaceholder: "Introduz o teu nome completo",
        email: "Email",
        emailPlaceholder: "teu@email.com",
        phone: "Número de telefone",
        phonePlaceholder: "+351 912 345 678",
        confirmBooking: "Confirmar Reserva",
        cancel: "Cancelar",
        required: "Obrigatório",
        invalidEmail: "Por favor introduz um email válido",
        success: "Reserva confirmada!",
        successDescription:
          "A tua reserva foi confirmada. Verifica o teu email para detalhes.",
        error: "Reserva falhou",
        errorDescription:
          "Não foi possível completar a reserva. Tenta novamente.",
        sessionFull: "Esta aula está cheia",
        alreadyBooked: "Já tens uma reserva para esta aula",
      },
    },
    venues: {
      sessions: {
        today: "Hoje",
        class: "Aula",
        appointment: "Consulta",
        minute: "{count} min",
        spotsLeft: "{count} lugares",
        full: "Cheio",
        noSessionsThisDay: "Sem sessões para este dia",
        loadError: "Erro ao carregar sessões",
      },
    },
    common: {
      error: "Erro",
    },
  },
  es: {
    easyBook: {
      title: "Reserva Rápida",
      selectClass: "Selecciona una clase para reservar",
      noClassesThisDay: "No hay clases disponibles para este día",
      bookNow: "Reservar Ahora",
      loginRequired: "Inicio de sesión requerido",
      loginRequiredDescription:
        "Necesitas iniciar sesión para reservar clases en este espacio.",
      loginButton: "Iniciar Sesión",
      planRequired: "Plan activo requerido",
      planRequiredDescription:
        "Necesitas un plan activo para reservar clases en este espacio.",
      viewPlans: "Ver Planes",
      bookingForm: {
        title: "Completa tu reserva",
        name: "Tu nombre",
        namePlaceholder: "Introduce tu nombre completo",
        email: "Correo electrónico",
        emailPlaceholder: "tu@email.com",
        phone: "Número de teléfono",
        phonePlaceholder: "+34 612 345 678",
        confirmBooking: "Confirmar Reserva",
        cancel: "Cancelar",
        required: "Obligatorio",
        invalidEmail: "Por favor introduce un email válido",
        success: "¡Reserva confirmada!",
        successDescription:
          "Tu reserva ha sido confirmada. Revisa tu email para más detalles.",
        error: "Error en la reserva",
        errorDescription:
          "No se pudo completar la reserva. Por favor, inténtalo de nuevo.",
        sessionFull: "Esta clase está llena",
        alreadyBooked: "Ya tienes una reserva para esta clase",
      },
    },
    venues: {
      sessions: {
        today: "Hoy",
        class: "Clase",
        appointment: "Cita",
        minute: "{count} min",
        spotsLeft: "{count} plazas",
        full: "Lleno",
        noSessionsThisDay: "Sin sesiones para este día",
        loadError: "Error al cargar sesiones",
      },
    },
    common: {
      error: "Error",
    },
  },
  fr: {
    easyBook: {
      title: "Réservation Rapide",
      selectClass: "Sélectionnez un cours à réserver",
      noClassesThisDay: "Pas de cours disponibles pour ce jour",
      bookNow: "Réserver",
      loginRequired: "Connexion requise",
      loginRequiredDescription:
        "Vous devez vous connecter pour réserver des cours dans cet espace.",
      loginButton: "Se Connecter",
      planRequired: "Plan actif requis",
      planRequiredDescription:
        "Vous avez besoin d'un plan actif pour réserver des cours dans cet espace.",
      viewPlans: "Voir les Plans",
      bookingForm: {
        title: "Complétez votre réservation",
        name: "Votre nom",
        namePlaceholder: "Entrez votre nom complet",
        email: "Email",
        emailPlaceholder: "votre@email.com",
        phone: "Numéro de téléphone",
        phonePlaceholder: "+33 6 12 34 56 78",
        confirmBooking: "Confirmer la réservation",
        cancel: "Annuler",
        required: "Obligatoire",
        invalidEmail: "Veuillez entrer un email valide",
        success: "Réservation confirmée !",
        successDescription:
          "Votre réservation a été confirmée. Vérifiez votre email pour les détails.",
        error: "Échec de la réservation",
        errorDescription:
          "Impossible de compléter votre réservation. Veuillez réessayer.",
        sessionFull: "Ce cours est complet",
        alreadyBooked: "Vous avez déjà une réservation pour ce cours",
      },
    },
    venues: {
      sessions: {
        today: "Aujourd'hui",
        class: "Cours",
        appointment: "Rendez-vous",
        minute: "{count} min",
        spotsLeft: "{count} places",
        full: "Complet",
        noSessionsThisDay: "Pas de sessions pour ce jour",
        loadError: "Erreur lors du chargement des sessions",
      },
    },
    common: {
      error: "Erreur",
    },
  },
  de: {
    easyBook: {
      title: "Schnellbuchung",
      selectClass: "Wähle einen Kurs zum Buchen",
      noClassesThisDay: "Keine Kurse für diesen Tag verfügbar",
      bookNow: "Jetzt Buchen",
      loginRequired: "Anmeldung erforderlich",
      loginRequiredDescription:
        "Du musst dich anmelden, um Kurse in diesem Raum zu buchen.",
      loginButton: "Anmelden",
      planRequired: "Aktiver Plan erforderlich",
      planRequiredDescription:
        "Du brauchst einen aktiven Plan, um Kurse in diesem Raum zu buchen.",
      viewPlans: "Pläne ansehen",
      bookingForm: {
        title: "Buchung abschließen",
        name: "Dein Name",
        namePlaceholder: "Gib deinen vollständigen Namen ein",
        email: "E-Mail",
        emailPlaceholder: "deine@email.com",
        phone: "Telefonnummer",
        phonePlaceholder: "+49 151 12345678",
        confirmBooking: "Buchung bestätigen",
        cancel: "Abbrechen",
        required: "Erforderlich",
        invalidEmail: "Bitte gib eine gültige E-Mail ein",
        success: "Buchung bestätigt!",
        successDescription:
          "Deine Buchung wurde bestätigt. Überprüfe deine E-Mail für Details.",
        error: "Buchung fehlgeschlagen",
        errorDescription:
          "Buchung konnte nicht abgeschlossen werden. Bitte versuche es erneut.",
        sessionFull: "Dieser Kurs ist voll",
        alreadyBooked: "Du hast bereits eine Buchung für diesen Kurs",
      },
    },
    venues: {
      sessions: {
        today: "Heute",
        class: "Kurs",
        appointment: "Termin",
        minute: "{count} Min",
        spotsLeft: "{count} Plätze",
        full: "Voll",
        noSessionsThisDay: "Keine Sessions für diesen Tag",
        loadError: "Fehler beim Laden der Sessions",
      },
    },
    common: {
      error: "Fehler",
    },
  },
  it: {
    easyBook: {
      title: "Prenotazione Rapida",
      selectClass: "Seleziona una lezione da prenotare",
      noClassesThisDay: "Nessuna lezione disponibile per questo giorno",
      bookNow: "Prenota Ora",
      loginRequired: "Accesso richiesto",
      loginRequiredDescription:
        "Devi effettuare l'accesso per prenotare lezioni in questo spazio.",
      loginButton: "Accedi",
      planRequired: "Piano attivo richiesto",
      planRequiredDescription:
        "Hai bisogno di un piano attivo per prenotare lezioni in questo spazio.",
      viewPlans: "Vedi Piani",
      bookingForm: {
        title: "Completa la prenotazione",
        name: "Il tuo nome",
        namePlaceholder: "Inserisci il tuo nome completo",
        email: "Email",
        emailPlaceholder: "tua@email.com",
        phone: "Numero di telefono",
        phonePlaceholder: "+39 333 1234567",
        confirmBooking: "Conferma Prenotazione",
        cancel: "Annulla",
        required: "Obbligatorio",
        invalidEmail: "Inserisci un'email valida",
        success: "Prenotazione confermata!",
        successDescription:
          "La tua prenotazione è stata confermata. Controlla la tua email per i dettagli.",
        error: "Prenotazione fallita",
        errorDescription: "Impossibile completare la prenotazione. Riprova.",
        sessionFull: "Questa lezione è piena",
        alreadyBooked: "Hai già una prenotazione per questa lezione",
      },
    },
    venues: {
      sessions: {
        today: "Oggi",
        class: "Lezione",
        appointment: "Appuntamento",
        minute: "{count} min",
        spotsLeft: "{count} posti",
        full: "Pieno",
        noSessionsThisDay: "Nessuna sessione per questo giorno",
        loadError: "Errore nel caricamento delle sessioni",
      },
    },
    common: {
      error: "Errore",
    },
  },
};

interface VenueData {
  id: string;
  slug: string;
  name: string;
  coverImage: string | null;
  logo: string | null;
  city: string | null;
  country: string;
  requiresPlanToBook: boolean;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  hasActiveSubscription: boolean;
  isMember: boolean;
}

interface EasyBookClientProps {
  venue: VenueData;
  locale: string;
  user: UserData | null;
}

export function EasyBookClient({ venue, locale, user }: EasyBookClientProps) {
  const messages = translations[locale] || translations.en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <EasyBookContent venue={venue} locale={locale} user={user} />
    </NextIntlClientProvider>
  );
}

function EasyBookContent({ venue, locale, user }: EasyBookClientProps) {
  const dateLocale = localeMap[locale] || enUS;
  const t = translations[locale]?.easyBook || translations.en.easyBook;

  // Date navigation state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<{
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
  } | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

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

  const { sessions, loading, fetchSessions, getSessionsForDay, sessionsByDay } =
    useEasyBookSessions({
      venueId: venue.id,
      monthStart,
      monthEnd,
    });

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  const handleBookSession = (session: {
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
  }) => {
    setSelectedSession(session);
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingDialogOpen(false);
    setSelectedSession(null);
    fetchSessions();
  };

  const selectedDaySessions = getSessionsForDay(selectedDay);

  // Determine booking mode
  // requiresPlanToBook = true: user must be logged in AND have active subscription
  // requiresPlanToBook = false: anyone can book (guest or logged in)
  const canBookAsGuest = !venue.requiresPlanToBook && !user;
  const canBookAsUser =
    user && (!venue.requiresPlanToBook || user.hasActiveSubscription);
  const needsLogin = venue.requiresPlanToBook && !user;
  const needsPlan =
    venue.requiresPlanToBook && user && !user.hasActiveSubscription;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Venue Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          {venue.coverImage ? (
            <Image
              src={venue.coverImage}
              alt={venue.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Venue Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-3">
            {venue.logo && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-lg">
                <Image
                  src={venue.logo}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xl font-bold drop-shadow-md sm:text-2xl">
                {venue.name}
              </p>
              {venue.city && (
                <p className="flex items-center gap-1 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.city}, {venue.country}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Message */}
      {needsLogin && (
        <div className="m-4 rounded-lg border bg-card p-6 text-center">
          <LogIn className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold">
            {t.loginRequired as string}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t.loginRequiredDescription as string}
          </p>
          <Button asChild>
            <Link
              href={`/${locale}/auth/signin?callbackUrl=/v/${venue.slug}/book`}
            >
              {t.loginButton as string}
            </Link>
          </Button>
        </div>
      )}

      {/* Plan Required Message */}
      {needsPlan && (
        <div className="m-4 rounded-lg border bg-card p-6 text-center">
          <CreditCard className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-semibold">
            {t.planRequired as string}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t.planRequiredDescription as string}
          </p>
          <Button asChild>
            <Link href={`/${locale}/venues/${venue.slug}`}>
              {t.viewPlans as string}
            </Link>
          </Button>
        </div>
      )}

      {/* Calendar Section - Only show if user can book */}
      {(canBookAsGuest || canBookAsUser) && (
        <div className="p-4">
          {loading && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Calendar */}
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
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">
                    {format(selectedDay, "PPP", { locale: dateLocale })}
                  </h3>
                </div>

                {selectedDaySessions.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {t.noClassesThisDay as string}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDaySessions.map((session) => (
                      <EasyBookSessionCard
                        key={session.id}
                        session={session}
                        locale={locale}
                        onBook={handleBookSession}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Form Dialog */}
      <EasyBookFormDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        venueId={venue.id}
        venueName={venue.name}
        session={selectedSession}
        locale={locale}
        user={user}
        onSuccess={handleBookingSuccess}
      />

      {/* Footer */}
      <div className="border-t bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://www.athlifyr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Athlifyr
          </a>
        </p>
      </div>
    </div>
  );
}
