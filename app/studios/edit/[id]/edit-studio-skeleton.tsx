export function EditStudioSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Back button & page header skeleton */}
      <div className="mb-6 space-y-3">
        <div className="h-4 w-32 rounded bg-base-300" />
        <div className="h-6 w-36 rounded-full bg-base-300" />
        <div className="h-9 w-72 rounded-xl bg-base-300" />
        <div className="h-4 w-96 max-w-full rounded bg-base-300" />
      </div>

      {/* Host identity card skeleton */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-base-300/60 pb-3">
          <div className="h-4 w-48 rounded bg-base-300" />
          <div className="h-5 w-28 rounded-full bg-base-300" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded bg-base-300" />
            <div className="h-10 w-full rounded-xl bg-base-300" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded bg-base-300" />
            <div className="h-10 w-full rounded-xl bg-base-300" />
          </div>
        </div>
      </div>

      {/* Form sections skeleton */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-7 space-y-5">
          <div className="h-6 w-44 rounded-lg bg-base-300" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-base-300" />
            <div className="h-10 w-full rounded-xl bg-base-300" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-base-300" />
            <div className="h-10 w-full rounded-xl bg-base-300" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-2">
              <div className="h-4 w-32 rounded bg-base-300" />
              <div className="h-10 w-full rounded-xl bg-base-300" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-base-300" />
              <div className="h-10 w-full rounded-xl bg-base-300" />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-7 space-y-5">
          <div className="h-6 w-48 rounded-lg bg-base-300" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-16 rounded-xl bg-base-200" />
            <div className="h-16 rounded-xl bg-base-200" />
            <div className="h-16 rounded-xl bg-base-200" />
          </div>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-7 space-y-5">
          <div className="h-6 w-40 rounded-lg bg-base-300" />
          <div className="h-40 rounded-xl bg-base-200" />
        </div>
      </div>
    </div>
  );
}
