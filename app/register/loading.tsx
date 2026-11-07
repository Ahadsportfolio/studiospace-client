export default function RegisterLoading() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-pulse">
      <div className="w-full max-w-lg space-y-6">
        {/* Card Container */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-base-300" />
            <div className="mx-auto h-7 w-56 rounded-lg bg-base-300" />
            <div className="mx-auto h-4 w-72 rounded bg-base-200" />
          </div>

          {/* Google OAuth Button Skeleton */}
          <div className="h-12 w-full rounded-2xl bg-base-200" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-base-300" />
            <div className="h-3 w-32 rounded bg-base-200" />
            <div className="h-px flex-1 bg-base-300" />
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-base-300" />
              <div className="h-12 w-full rounded-2xl bg-base-200" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-base-300" />
              <div className="h-12 w-full rounded-2xl bg-base-200" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-base-300" />
              <div className="h-12 w-full rounded-2xl bg-base-200" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-base-300" />
              <div className="h-12 w-full rounded-2xl bg-base-200" />
              <div className="h-2 w-full rounded-full bg-base-200" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-12 w-full rounded-2xl bg-base-300" />

          {/* Footer Link */}
          <div className="mx-auto h-4 w-56 rounded bg-base-200 pt-2" />
        </div>
      </div>
    </main>
  );
}

