export interface VenueMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface VenueInvite {
  id: string;
  email: string;
  role: string;
  name: string | null;
  message: string | null;
  invitedBy: {
    name: string;
  };
  createdAt: string;
}

export interface InviteFormData {
  email: string;
  role: string;
  name: string;
  message: string;
}

export interface VenueStaffManagerProps {
  venueId: string;
  venueName: string;
  members: VenueMember[];
  currentUserId: string;
  isOwner: boolean;
  isAppAdmin?: boolean;
}

export function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "OWNER":
      return "default";
    case "ADMIN":
      return "secondary";
    case "COACH":
      return "outline";
    default:
      return "outline";
  }
}
