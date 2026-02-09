"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Check, X, Loader2, GraduationCap } from "lucide-react";

interface TrialBookingRequest {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  session: {
    id: string;
    title: string | null;
    startsAt: string;
    endsAt: string;
  };
}

interface TrialBookingRequestsPanelProps {
  venueId: string;
  locale: string;
  onRequestHandled?: () => void;
}

export function TrialBookingRequestsPanel({
  venueId,
  locale,
  onRequestHandled,
}: TrialBookingRequestsPanelProps) {
  const t = useTranslations("venues.trialBooking");
  const { toast } = useToast();
  const [requests, setRequests] = useState<TrialBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `/api/venues/${venueId}/trial-bookings?status=PENDING`
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data.trialBookings || []);
      }
    } catch (error) {
      console.error("Error fetching trial booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [venueId]);

  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const response = await fetch(`/api/trial-bookings/${bookingId}/accept`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: t("accepted"),
          description: t("acceptSuccess"),
        });
        // Refresh the list
        await fetchRequests();
        onRequestHandled?.();
      } else {
        const error = await response.json();
        toast({
          title: t("acceptError"),
          description: error.error || t("acceptError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accepting trial booking:", error);
      toast({
        title: t("acceptError"),
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const response = await fetch(`/api/trial-bookings/${bookingId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        toast({
          title: t("rejected"),
          description: t("rejectSuccess"),
        });
        // Refresh the list
        await fetchRequests();
        onRequestHandled?.();
      } else {
        const error = await response.json();
        toast({
          title: t("rejectError"),
          description: error.error || t("rejectError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting trial booking:", error);
      toast({
        title: t("rejectError"),
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {t("pendingRequests")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null; // Don't show the panel if there are no pending requests
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {t("pendingRequests")}
          <Badge variant="secondary">{requests.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => {
          const sessionDate = new Date(request.session.startsAt);
          const requestDate = new Date(request.createdAt);
          const isProcessing = processingId === request.id;

          return (
            <div
              key={request.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={request.user.image || undefined}
                  alt={request.user.name || "User"}
                />
                <AvatarFallback>
                  {(request.user.name || request.user.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {t("requestFrom", { name: request.user.name || request.user.email })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("requestedFor", {
                    date: format(sessionDate, "PPP", { locale: require(`date-fns/locale/${locale}`).default }),
                    time: format(sessionDate, "p", { locale: require(`date-fns/locale/${locale}`).default }),
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("requestedOn", {
                    date: format(requestDate, "PPP", { locale: require(`date-fns/locale/${locale}`).default }),
                  })}
                </p>
                {request.session.title && (
                  <p className="text-xs text-muted-foreground">
                    {request.session.title}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleAccept(request.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="ml-1">{t("accept")}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleReject(request.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span className="ml-1">{t("reject")}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
