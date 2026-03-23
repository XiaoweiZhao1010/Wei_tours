import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GlobalSpinner() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7f7f7] to-white">
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">Loading data...</p>
      </main>
    </div>
  );
}
