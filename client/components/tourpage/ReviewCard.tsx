import { getGuideImageUrl } from "@/lib/tours";
import type { TourReview } from "@/lib/tours";
import { Star } from "lucide-react";

export default function ReviewCard({
  reviews,
}: {
  reviews: TourReview[];
}) {
  return (
    <>
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews</h2>
          <div className="space-y-6">
            {reviews.slice(0, 5).map((review, idx) => (
              <div
                key={review._id ?? idx}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={getGuideImageUrl(review.user?.photo)}
                    alt={review.user?.name ?? "User"}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h6 className="font-semibold text-gray-900 dark:text-gray-100">
                      {review.user?.name ?? "Anonymous"}
                    </h6>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(review.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
