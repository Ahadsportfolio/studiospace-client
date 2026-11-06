export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop";

export const STUDIO_CATEGORIES: readonly StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export interface StudioReview {
  name: string;
  photo: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  city?: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  reviews?: StudioReview[];
  ownerEmail: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudiosApiResponse {
  data: Studio[];
  total: number;
  page: number;
  totalPages: number;
}
