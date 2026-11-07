export default function MyBookingsLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-32 rounded-full bg-base-300" />
          <div className="h-9 w-60 rounded-xl bg-base-300 sm:w-72" />
          <div className="h-4 w-80 max-w-full rounded bg-base-200" />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-base-300 bg-base-200/40">
          <div className="h-10 w-full sm:w-72 rounded-xl bg-base-200" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-base-200" />
            ))}
          </div>
        </div>

        {/* Bookings Card List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="card bg-base-100 border border-base-300 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6"
            >
              <div className="h-44 md:h-40 md:w-64 rounded-2xl bg-base-300 shrink-0" />
              <div className="flex-1 space-y-4 py-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 bg-base-300 rounded-md" />
                    <div className="h-6 w-3/4 bg-base-300 rounded-lg" />
                  </div>
                  <div className="h-7 w-24 bg-base-300 rounded-full" />
                </div>
                <div className="h-14 w-full bg-base-200 rounded-xl" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 w-32 bg-base-300 rounded-md" />
                  <div className="h-8 w-28 bg-base-300 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
