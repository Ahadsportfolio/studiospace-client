export function StudioCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="relative aspect-[16/10] w-full animate-pulse bg-base-200">
        <div className="absolute left-3.5 top-3.5 h-6 w-24 rounded-full bg-base-300/80" />
        <div className="absolute right-3.5 top-3.5 h-6 w-16 rounded-full bg-base-300/80" />
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded-full bg-base-200" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-base-200" />
        </div>
        <div className="h-6 w-5/6 animate-pulse rounded-lg bg-base-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-base-200" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full animate-pulse rounded bg-base-200" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-base-200" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-base-300/60 pt-5">
          <div className="space-y-1.5">
            <div className="h-3 w-12 animate-pulse rounded bg-base-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-base-200" />
          </div>
          <div className="h-10 w-28 animate-pulse rounded-full bg-base-200" />
        </div>
      </div>
    </div>
  );
}

