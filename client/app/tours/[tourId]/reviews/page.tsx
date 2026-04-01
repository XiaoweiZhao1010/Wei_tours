import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTour, getTourReviews } from "@/lib/tours";
import { ReviewItem } from "@/components/tourpage/ReviewCard";

const REVIEWS_PER_PAGE = 6;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tourId: string }>;
}): Promise<Metadata> {
  const { tourId } = await params;
  const tour = await getTour(tourId);
  if (!tour) return { title: "Reviews" };
  return {
    title: `Reviews · ${tour.name} | Wei_tours`,
    description: `Guest reviews for ${tour.name}`,
  };
}

export default async function TourReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tourId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tourId } = await params;
  const { page: pageParam } = await searchParams;
  const parsed = parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;

  const tour = await getTour(tourId);
  if (!tour) notFound();

  const {
    reviews,
    hasMore,
    page: currentPage,
  } = await getTourReviews(tourId, page, REVIEWS_PER_PAGE);

  const prevHref =
    currentPage > 1
      ? `/tours/${encodeURIComponent(tourId)}/reviews?page=${currentPage - 1}`
      : null;
  const nextHref = hasMore
    ? `/tours/${encodeURIComponent(tourId)}/reviews?page=${currentPage + 1}`
    : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            href={`/tours/${encodeURIComponent(tourId)}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-natours hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to {tour.name}
          </Link>
        </nav>

        <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
          <p className="text-sm font-medium uppercase tracking-wide text-natours">
            Reviews
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {tour.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {tour.ratingsQuantity} review
            {tour.ratingsQuantity === 1 ? "" : "s"} ·{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {tour.ratingsAverage}
            </span>{" "}
            average rating
          </p>
        </header>

        {reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white/80 p-8 text-center text-gray-600 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-400">
            No reviews on this page yet.
            {currentPage > 1 && (
              <>
                {" "}
                <Link
                  href={`/tours/${encodeURIComponent(tourId)}/reviews`}
                  className="font-medium text-natours hover:underline"
                >
                  View first page
                </Link>
              </>
            )}
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review, idx) => (
              <li key={review._id ?? idx}>
                <ReviewItem review={review} />
              </li>
            ))}
          </ul>
        )}

        {(prevHref || nextHref) && (
          <nav
            className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700"
            aria-label="Review pages"
          >
            {prevHref ? (
              <Link
                href={prevHref}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage}
            </span>
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
