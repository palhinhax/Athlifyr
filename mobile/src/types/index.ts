// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: "USER" | "ADMIN" | "MOD";
  createdAt: string;
  updatedAt: string;
}

// Event types
export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  stravaRouteEmbed?: string | null;
  sportTypes: string[];
  cancelled?: boolean;
  cancellationReason?: string | null;
  variants?: EventVariant[];
  faqs?: EventFAQ[];
  _count?: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventVariant {
  id: string;
  eventId: string;
  name: string;
  distanceKm?: number | null;
  startDate?: string | null;
  startTime?: string | null;
  triathlonSegments?: TriathlonSegment[];
}

export interface TriathlonSegment {
  id: string;
  variantId: string;
  segmentType: string;
  distanceKm: number;
  terrainType: string;
  order: number;
}

export interface EventFAQ {
  id: string;
  eventId: string;
  question: string;
  answer: string;
  order: number;
}

// Venue types
export interface Venue {
  id: string;
  slug: string;
  name: string;
  type: string;
  services: string[];
  description: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string | null;
  logo: string | null;
  instagram: string | null;
  sportTypes?: string[];
  _count?: {
    members: number;
    sessions: number;
  };
}

// Post types
export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface EventFilters {
  sport?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  search?: string;
  status?: "upcoming" | "past" | "cancelled";
}

export interface VenueFilters {
  sport?: string;
  city?: string;
  country?: string;
  search?: string;
  rating?: number;
}
