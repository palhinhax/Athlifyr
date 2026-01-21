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
  endDate?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  organizerId: string;
  organizer?: User;
  sport: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  variants?: EventVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface EventVariant {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  distance?: number;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
}

// Venue types
export interface Venue {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  image?: string;
  amenities?: string[];
  sport: string;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
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
  status?: Event["status"];
}

export interface VenueFilters {
  sport?: string;
  city?: string;
  country?: string;
  search?: string;
  rating?: number;
}
