export function StudioDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 rounded-md bg-base-300" />
        <span className="text-base-content/30">/</span>
        <div className="h-4 w-28 rounded-md bg-base-300" />
        <span className="text-base-content/30">/</span>
        <div className="h-4 w-44 rounded-md bg-base-300" />
      </div>

      {/* Title & Badges skeleton */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-28 rounded-full bg-base-300" />
          <div className="h-6 w-20 rounded-full bg-base-300" />
        </div>
        <div className="h-10 w-3/4 max-w-xl rounded-xl bg-base-300" />
        <div className="h-4 w-64 rounded-md bg-base-300" />
      </div>

      {/* Main Grid: Gallery + Info on Left, Sticky Booking on Right */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery carousel skeleton */}
          <div className="aspect-[16/10] w-full rounded-3xl bg-base-300 sm:aspect-[16/9]" />

          {/* Quick Specs skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-base-200 border border-base-300">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 rounded bg-base-300" />
                <div className="h-6 w-24 rounded bg-base-300" />
              </div>
            ))}
          </div>

          {/* Overview skeleton */}
          <div className="space-y-3 pt-4 border-t border-base-300">
            <div className="h-7 w-48 rounded-lg bg-base-300" />
            <div className="h-4 w-full rounded bg-base-300" />
            <div className="h-4 w-full rounded bg-base-300" />
            <div className="h-4 w-4/5 rounded bg-base-300" />
          </div>

          {/* Amenities skeleton */}
          <div className="space-y-4 pt-6 border-t border-base-300">
            <div className="h-7 w-56 rounded-lg bg-base-300" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-base-200 border border-base-300"
                />
              ))}
            </div>
          </div>

          {/* Host Card skeleton */}
          <div className="pt-6 border-t border-base-300">
            <div className="h-36 rounded-2xl bg-base-200 border border-base-300" />
          </div>

          {/* Reviews skeleton */}
          <div className="space-y-4 pt-6 border-t border-base-300">
            <div className="h-7 w-48 rounded-lg bg-base-300" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-base-200 border border-base-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column (4 cols): Sticky Panel */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-base-300" />
              <div className="h-9 w-36 rounded-lg bg-base-300" />
              <div className="h-4 w-32 rounded bg-base-300" />
            </div>

            <div className="h-28 rounded-2xl bg-base-200 border border-base-300" />

            <div className="h-12 rounded-full bg-base-300" />

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-base-300" />
              <div className="h-4 w-5/6 rounded bg-base-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
