import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getTour,
  getTourImageUrl,
  getGuideImageUrl,
  formatStartDate,
} from "@/lib/tours";
import { MapPin, Calendar, TrendingUp, Users, Star, Clock } from "lucide-react";
import ReviewCard from "@/components/tourpage/ReviewCard";
import CTASection from "@/components/tourpage/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tourId: string }>;
}): Promise<Metadata> {
  const { tourId } = await params;
  const tour = await getTour(tourId);
  if (!tour) return { title: "Tour not found" };
  return {
    title: `${tour.name} | Wei_tours`,
    description: tour.summary,
  };
}

function formatGuideRole(role?: string) {
  if (!role) return "Tour guide";
  if (role === "lead-guide") return "Lead guide";
  if (role === "guide") return "Tour guide";
  return role;
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const tour = await getTour(tourId);

  if (!tour) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tour not found</h1>
        <Link
          href="/tours"
          className="rounded-lg bg-natours px-4 py-2 font-semibold text-white hover:bg-natours-dark"
        >
          Back to tours
        </Link>
      </div>
    );
  }

  const nextDate = formatStartDate(tour.startDates?.[0]);
  const tourImages = tour.images ?? [];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}

      <main>
        {/* Hero */}
        <section className="relative h-[50vh] min-h-80 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getTourImageUrl(tour.imageCover)}
              alt={tour.name}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          <div className="relative flex h-full flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
            <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl">
              {tour.name}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/95">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{tour.startLocation?.description ?? "—"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Left column - Quick facts & Guides */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Quick facts
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-natours/10 text-natours">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
<p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      Next date
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {nextDate || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-natours/10 text-natours">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Difficulty
                      </p>
                      <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">
                        {tour.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-natours/10 text-natours">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Participants
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {tour.maxGroupSize} people
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-natours/10 text-natours">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Rating
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {tour.ratingsAverage} / 5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    From
                  </p>
                  <p className="mb-5 text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                    ${tour.price}
                    <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
                      {" "}
                      / person
                    </span>
                  </p>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-natours py-3.5 text-center text-base font-semibold text-white shadow-md transition-colors hover:bg-natours-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-natours focus-visible:ring-offset-2 dark:ring-offset-gray-800"
                  >
                    Book now
                  </button>
                </div>

                {tour.guides && tour.guides.length > 0 && (
                  <>
                    <h2 className="mb-6 mt-10 text-xl font-bold text-gray-900 dark:text-gray-100">
                      Your tour guides
                    </h2>
                    <div className="space-y-4">
                      {tour.guides.map((guide) => (
                        <div
                          key={guide._id ?? guide.name}
                          className="flex items-center gap-4"
                        >
                          <Image
                            src={getGuideImageUrl(guide.photo)}
                            alt={guide.name}
                            width={600}
                            height={600}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                              {formatGuideRole(guide.role)}
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {guide.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right column - Description */}
            <div className="lg:col-span-2 lg:order-1">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  About {tour.name}
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p className="leading-relaxed">{tour.summary}</p>
                  {tour.description && (
                    <p className="leading-relaxed">{tour.description}</p>
                  )}
                </div>
              </div>

              {/* Tour pictures */}
              {tourImages.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Tour pictures
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {tourImages.slice(0, 3).map((img, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <Image
                          src={getTourImageUrl(img)}
                          alt={`${tour.name} ${i + 1}`}
                          width={500}
                          height={200}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <ReviewCard reviews={tour.reviews || []} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <CTASection duration={tour.duration} />
      </main>
    </div>
  );
}
