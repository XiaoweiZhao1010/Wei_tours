"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          We couldn&apos;t load this page. Please try again or head back to
          explore our tours.
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mb-8 max-w-full overflow-auto rounded-lg bg-gray-100 p-4 text-left text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {error.message}
          </pre>
        )}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg bg-natours px-6 py-3 font-semibold text-white transition-colors hover:bg-natours-dark"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Go home
          </Link>
        </div>
      </main>
    </div>
  );
}
