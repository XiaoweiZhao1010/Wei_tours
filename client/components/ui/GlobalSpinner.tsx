import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GlobalSpinner() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" className="dark:border-gray-500/30 dark:border-t-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
      </main>
    </div>
  );
}
