"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Tag } from "lucide-react";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { getMyBookings, type Booking } from "@/lib/bookings";
import { getTourImageUrl } from "@/lib/tours";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/** Visible loading region below header/footer; dvh + inline fallback so nested flex does not collapse height */
const LOADING_MIN_STYLE: CSSProperties = {
  minHeight: "max(24rem, calc(100dvh - 13rem))",
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const list = await getMyBookings();
      setBookings(list);
    } catch (e) {
      setBookings(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    load();
  }, [isAuthenticated, load, router]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex w-full flex-col items-center justify-center gap-3 px-4"
        style={LOADING_MIN_STYLE}
      >
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Checking your session…
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-8 mx-auto"
        style={LOADING_MIN_STYLE}
        aria-busy="true"
        aria-live="polite"
      >
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-900">
          Loading your bookings…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My bookings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tours you have reserved. Payment integration can update the paid
            status later.
          </p>
        </div>
        <Link
          href="/tours"
          className="rounded-lg border border-natours px-4 py-2 text-sm font-semibold text-natours hover:bg-natours/10 dark:hover:bg-natours/15"
        >
          Browse tours
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {!error && bookings && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 p-10 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <p className="text-gray-600 dark:text-gray-400">
            You do not have any bookings yet.
          </p>
          <Link
            href="/tours"
            className="mt-4 inline-block font-semibold text-natours hover:underline"
          >
            Explore tours
          </Link>
        </div>
      )}

      {!error && bookings && bookings.length > 0 && (
        <ul className="space-y-6">
          {bookings.map((b) => {
            const tour = b.tour;
            const tourHref = tour
              ? `/tours/${encodeURIComponent(tour._id)}`
              : "/tours";
            return (
              <li
                key={b._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch">
                  {tour?.imageCover && (
                    <Link
                      href={tourHref}
                      className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-48 sm:aspect-auto"
                    >
                      <Image
                        src={getTourImageUrl(tour.imageCover)}
                        alt={tour.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link href={tourHref}>
                        <h2 className="text-lg font-bold text-gray-900 hover:text-natours dark:text-gray-100 dark:hover:text-natours">
                          {tour?.name ?? "Tour unavailable"}
                        </h2>
                      </Link>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          b.paid
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                            : "bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-200"
                        }`}
                      >
                        {b.paid ? "Paid" : "Payment pending"}
                      </span>
                    </div>
                    {tour && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-natours" />
                          {tour.duration}-day · {tour.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-natours" />${b.price}{" "}
                          booked
                        </span>
                      </div>
                    )}
                    {b.createdAt && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Booked on{" "}
                        {new Date(b.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
