export default function HowItWorksLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-12 sm:py-16 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="mx-auto h-6 w-36 rounded-full bg-base-300" />
          <div className="mx-auto h-12 w-4/5 rounded-2xl bg-base-300" />
          <div className="mx-auto h-5 w-3/4 rounded bg-base-200" />

          {/* Role Toggle Switcher Skeleton */}
          <div className="pt-6 flex justify-center">
            <div className="h-12 w-72 rounded-full bg-base-200 p-1 flex gap-2">
              <div className="h-full flex-1 rounded-full bg-base-300" />
              <div className="h-full flex-1 rounded-full bg-base-100" />
            </div>
          </div>
        </div>

        {/* 4 Steps Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-7 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-base-300" />
                <div className="h-6 w-10 rounded bg-base-200" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-base-300" />
                <div className="h-3.5 w-48 rounded bg-base-200" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-base-200" />
                <div className="h-3 w-5/6 rounded bg-base-200" />
                <div className="h-3 w-4/5 rounded bg-base-200" />
              </div>
              <div className="pt-4 border-t border-base-200 space-y-2">
                <div className="h-2.5 w-full rounded bg-base-200" />
                <div className="h-2.5 w-4/5 rounded bg-base-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Categories Strip Skeleton */}
        <div className="rounded-3xl border border-base-300 bg-base-200/40 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-5 w-44 rounded-full bg-base-300" />
            <div className="mx-auto h-7 w-60 rounded bg-base-300" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-base-100 border border-base-300" />
            ))}
          </div>
        </div>

        {/* Guarantee Banner Skeleton */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 space-y-4">
          <div className="h-8 w-64 rounded-xl bg-base-300" />
          <div className="h-4 w-full rounded bg-base-200" />
          <div className="h-4 w-3/4 rounded bg-base-200" />
        </div>
      </div>
    </main>
  );
}
