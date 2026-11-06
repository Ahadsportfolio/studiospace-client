import { StudioCardSkeleton } from "@/components/studio-card-skeleton";

export function StudiosLoadingFallback() {
  return (
    <div className="w-full bg-base-100 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header skeleton */}
        <div className="max-w-3xl space-y-3">
          <div className="h-6 w-32 animate-pulse rounded-full bg-base-200" />
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-base-200" />
          <div className="h-5 w-5/6 animate-pulse rounded bg-base-200" />
        </div>

        {/* Filter bar skeleton */}
        <div className="mt-8 space-y-4 rounded-2xl border border-base-300 bg-base-200/40 p-6">
          <div className="h-12 w-full animate-pulse rounded-xl bg-base-200" />
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-28 animate-pulse rounded-full bg-base-200"
              />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

