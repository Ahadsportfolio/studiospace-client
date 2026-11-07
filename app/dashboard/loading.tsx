export default function DashboardLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 rounded-full bg-base-300" />
            <div className="h-9 w-64 rounded-xl bg-base-300 sm:w-80" />
            <div className="h-4 w-80 max-w-full rounded bg-base-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-36 rounded-xl bg-base-200" />
            <div className="h-10 w-36 rounded-xl bg-base-300" />
          </div>
        </div>

        {/* 4 Stats Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-base-300" />
                <div className="h-10 w-10 rounded-2xl bg-base-200" />
              </div>
              <div className="h-9 w-20 rounded-lg bg-base-300" />
              <div className="h-3.5 w-36 rounded bg-base-200" />
            </div>
          ))}
        </div>

        {/* Incoming Bookings Table Skeleton */}
        <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
          {/* Table Header / Filter Bar */}
          <div className="p-6 border-b border-base-300/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="h-6 w-52 rounded-lg bg-base-300" />
                <div className="h-4 w-72 rounded bg-base-200" />
              </div>
              <div className="h-10 w-64 rounded-xl bg-base-200" />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-base-200" />
              ))}
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-base-200/50 border border-base-300/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-base-300 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-base-300" />
                    <div className="h-3.5 w-56 rounded bg-base-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded bg-base-300" />
                  <div className="h-3 w-24 rounded bg-base-200" />
                </div>

                <div className="h-6 w-24 rounded-full bg-base-300" />

                <div className="flex gap-2">
                  <div className="h-9 w-20 rounded-xl bg-base-300" />
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

