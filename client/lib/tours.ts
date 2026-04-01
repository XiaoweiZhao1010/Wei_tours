export interface TourGuide {
  _id?: string;
  name: string;
  photo?: string;
  role?: "user" | "guide" | "lead-guide" | "admin";
}

export interface TourReview {
  _id?: string;
  review: string;
  rating: number;
  user?: { name: string; photo?: string };
  /** API schema field name */
  createAt?: string;
  createdAt?: string;
}

export interface Tour {
  _id?: string;
  name: string;
  slug?: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description?: string;
  imageCover?: string;
  images?: string[];
  startLocation?: { description: string };
  locations?: unknown[];
  startDates?: string[];
  guides?: TourGuide[];
  reviews?: TourReview[];
}

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getTourImageUrl(imageCover?: string) {
  if (!imageCover) return "";
  return `${IMG_BASE}/img/tours/${imageCover}`;
}

export function getGuideImageUrl(photo?: string) {
  if (!photo) return `${IMG_BASE}/img/users/default.jpg`;
  return `${IMG_BASE}/img/users/${photo}`;
}

export function formatStartDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function getSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

const API_BASE =
  process.env.API_URL ||
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") + "/api/v1";

export async function getTours(): Promise<Tour[]> {
  try {
    const tours = await fetch(`${API_BASE}/tours`);
    const data = await tours.json();
    return data.data.docs;
  } catch (err) {
    console.error("Error loading tours:", err);
    return [];
  }
}
export async function getTour(slug: string): Promise<Tour | null> {
  try {
    const data = await fetch(`${API_BASE}/tours/${slug}`);
    const tourData = await data.json();
    return tourData.data.tour ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export type TourReviewsResult = {
  reviews: TourReview[];
  page: number;
  limit: number;
  hasMore: boolean;
};

export async function getTourReviews(
  tourId: string,
  page: number = 1,
  limit: number = 6,
): Promise<TourReviewsResult> {
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const safeLimit =
    Number.isFinite(limit) && limit >= 1 ? Math.min(100, Math.floor(limit)) : 6;
  try {
    const res = await fetch(
      `${API_BASE}/tours/${encodeURIComponent(tourId)}/reviews?page=${safePage}&limit=${safeLimit}`,
      {
        cache: "no-store",
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) {
      return { reviews: [], page: safePage, limit: safeLimit, hasMore: false };
    }
    const data = await res.json();
    const reviews = (data.data?.docs ?? []) as TourReview[];
    const hasMore = reviews.length === safeLimit;
    return { reviews, page: safePage, limit: safeLimit, hasMore };
  } catch {
    return { reviews: [], page: safePage, limit: safeLimit, hasMore: false };
  }
}
