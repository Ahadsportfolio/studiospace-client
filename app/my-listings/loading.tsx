export default function MyListingsLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 rounded-full bg-base-300" />
            <div className="h-9 w-60 rounded-xl bg-base-300 sm:w-72" />
            <div className="h-4 w-80 max-w-full rounded bg-base-200" />
          </div>
          <div className="h-11 w-44 rounded-xl bg-base-300" />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-base-300 bg-base-200/40">
          <div className="h-10 w-full sm:w-72 rounded-xl bg-base-200" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-base-200" />
            ))}
          </div>
        </div>

        {/* Listings Display Skeleton */}
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5 border-b border-base-200 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-24 rounded-2xl bg-base-300 shrink-0" />
                    <div className="space-y-2">
                      <div className="h-5 w-48 rounded bg-base-300" />
                      <div className="h-3.5 w-32 rounded bg-base-200" />
                    </div>
                  </div>
                  <div className="h-6 w-24 rounded-full bg-base-200" />
                  <div className="h-5 w-16 rounded bg-base-300" />
                  <div className="h-5 w-16 rounded bg-base-300" />
                  <div className="flex gap-2">
                    <div className="h-9 w-18 rounded-xl bg-base-200" />
                    <div className="h-9 w-18 rounded-xl bg-base-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-base-300 bg-base-100 p-5 space-y-4"
              >
                <div className="aspect-[16/10] w-full rounded-2xl bg-base-300" />
                <div className="h-5 w-3/4 rounded-md bg-base-300" />
                <div className="h-3.5 w-1/2 rounded-md bg-base-200" />
                <div className="h-10 w-full rounded-xl bg-base-200" />
                <div className="flex justify-end gap-2 pt-2">
                  <div className="h-9 w-20 rounded-xl bg-base-200" />
                  <div className="h-9 w-20 rounded-xl bg-base-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

