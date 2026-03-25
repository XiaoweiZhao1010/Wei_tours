import MeAccountNav from "@/components/me/MeAccountNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="ml-8 relative flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:py-10">
        <aside className="rounded-2xl border border-gray-200/90 bg-white/95 p-3 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20 dark:backdrop-blur-md lg:sticky lg:top-24 lg:self-start lg:p-4">
          <p className="mb-3 hidden px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-800 dark:text-gray-100 md:block">
            Account
          </p>

          <MeAccountNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
