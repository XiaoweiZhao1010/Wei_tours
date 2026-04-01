import { getGuideImageUrl } from "@/lib/tours";
import type { TourReview } from "@/lib/tours";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ReviewItem({ review }: { review: TourReview }) {
  const rawDate = review.createdAt ?? review.createAt;
  const reviewDate =
    rawDate && !Number.isNaN(new Date(rawDate as string).getTime())
      ? new Date(rawDate as string)
      : null;

  return (
    <article
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-4 flex items-center gap-4">
        <Image
          src={getGuideImageUrl(review.user?.photo)}
          alt={review.user?.name ?? "User"}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {review.user?.name ?? "Anonymous"}
          </h3>
          <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(review.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{review.review}</p>
      {reviewDate && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          {reviewDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
    </article>
  );
}

export default function ReviewCard({
  reviews,
  tourId,
  totalCount,
}: {
  reviews: TourReview[];
  tourId: string;
  /** Prefer tour denormalized count; falls back to loaded reviews length */
  totalCount?: number;
}) {
  const showLoadMore = reviews.length > 2;
  const reviewCount =
    typeof totalCount === "number" && totalCount >= 0
      ? totalCount
      : reviews.length;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 flex flex-wrap items-baseline gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Reviews
        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          ({reviewCount})
        </span>
      </h2>
      <div className="space-y-6">
        {reviews.slice(0, 2).map((review, idx) => (
          <ReviewItem key={review._id ?? idx} review={review} />
        ))}
        {showLoadMore && (
          <div className="pt-2">
            <Link
              href={`/tours/${encodeURIComponent(tourId)}/reviews`}
              className="inline-flex items-center font-semibold text-natours underline-offset-4 hover:underline dark:text-natours"
            >
              Load more reviews
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
