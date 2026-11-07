export default function AddStudioLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-10 sm:py-14 animate-pulse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-6 w-36 rounded-full bg-base-300" />
          <div className="h-10 w-72 rounded-xl bg-base-300" />
          <div className="h-4 w-96 max-w-full rounded bg-base-200" />
        </div>

        {/* Section 1: Basic Specifications */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-base-200 pb-4">
            <div className="h-9 w-9 rounded-xl bg-base-300" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 w-44 rounded bg-base-300" />
              <div className="h-3.5 w-64 rounded bg-base-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <div className="h-4 w-28 rounded bg-base-300" />
              <div className="h-11 w-full rounded-xl bg-base-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-base-300" />
              <div className="h-11 w-full rounded-xl bg-base-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-base-300" />
              <div className="h-11 w-full rounded-xl bg-base-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-base-300" />
              <div className="h-11 w-full rounded-xl bg-base-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-base-300" />
              <div className="h-11 w-full rounded-xl bg-base-200" />
            </div>
          </div>
        </div>

        {/* Section 2: Amenities & Features */}
        <div className="mt-8 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-base-200 pb-4">
            <div className="h-9 w-9 rounded-xl bg-base-300" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 w-52 rounded bg-base-300" />
              <div className="h-3.5 w-72 rounded bg-base-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-base-200/70 border border-base-300/60"
              />
            ))}
          </div>
        </div>

        {/* Section 3: Media & Photos Upload */}
        <div className="mt-8 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-base-200 pb-4">
            <div className="h-9 w-9 rounded-xl bg-base-300" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 w-48 rounded bg-base-300" />
              <div className="h-3.5 w-80 rounded bg-base-200" />
            </div>
          </div>

          <div className="h-40 w-full rounded-2xl border-2 border-dashed border-base-300 bg-base-200/40" />
        </div>

        {/* Section 4: Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 pt-4">
          <div className="h-11 w-28 rounded-xl bg-base-200" />
          <div className="h-11 w-44 rounded-xl bg-base-300" />
        </div>
      </div>
    </main>
  );
}
