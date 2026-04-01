import { getTours } from "@/lib/tours";
import TourCard from "@/app/TourCard";

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white dark:from-gray-500 dark:via-gray-700 dark:to-gray-500">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          All tours
        </h1>
        <p className="mb-12 text-gray-600 dark:text-gray-400">
          Discover our handpicked selection of outdoor adventures.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tours?.map((tour) => (
            <TourCard key={tour._id ?? tour.name} tour={tour} />
          ))}
        </div>
      </main>
    </div>
  );
}
