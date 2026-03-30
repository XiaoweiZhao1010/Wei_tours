import { Tour, getTourImageUrl, formatStartDate, getSlug } from "@/lib/tours";
import { MapPin, Calendar, Flag, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TourCard({ tour }: { tour: Tour }) {
  const stops = tour.locations?.length ?? 0;
  const dateStr = formatStartDate(tour.startDates?.[0]);
  // const slug = tour.slug ?? getSlug(tour.name);

  return (
    <article className="natours-card group overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getTourImageUrl(tour.imageCover)}
          alt={tour.name}
          width={500}
          height={500}
          loading="eager"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-natours-to-t from-black/60 via-transparent to-transparent" />
        <h3 className="absolute bottom-3 left-4 right-4 text-xl font-bold text-white drop-shadow-lg dark:text-amber-100">
          {tour.name}
        </h3>
      </div>
      <div className="p-6">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-natours">
          {tour.difficulty} {tour.duration}-day tour
        </h4>
        <p className="mb-4 text-gray-600 dark:text-gray-400">{tour.summary}</p>
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-natours" />
            <span>{tour.startLocation?.description ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-natours" />
            <span>{dateStr || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 shrink-0 text-natours" />
            <span>
              {stops} {stops === 1 ? "stop" : "stops"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-natours" />
            <span>{tour.maxGroupSize} people</span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-bold text-natours">
              ${tour.price}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {" "}
              per person
            </span>
          </div>
          <div className="text-right text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {tour.ratingsAverage} rating
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {" "}
              ({tour.ratingsQuantity})
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/tours/${tour._id}`}
            className="flex-1 rounded-lg border-2 border-natours bg-transparent py-3 text-center text-sm font-semibold text-natours transition-colors hover:bg-natours/10 dark:hover:bg-natours/15"
          >
            Details
          </Link>
          <button
            type="button"
            className="flex-1 rounded-lg border-2 border-transparent bg-natours py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-natours-dark"
          >
            Book now
          </button>
        </div>
      </div>
    </article>
  );
}
