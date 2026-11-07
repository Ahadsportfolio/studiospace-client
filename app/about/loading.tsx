export default function AboutLoading() {
  return (
    <main className="min-h-screen w-full bg-base-100 py-12 sm:py-16 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section Skeleton */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="mx-auto h-6 w-36 rounded-full bg-base-300" />
          <div className="mx-auto h-12 w-4/5 rounded-2xl bg-base-300" />
          <div className="mx-auto h-5 w-3/4 rounded bg-base-200" />
          <div className="mx-auto h-5 w-2/3 rounded bg-base-200" />
          <div className="pt-4 flex justify-center gap-3">
            <div className="h-11 w-36 rounded-xl bg-base-300" />
            <div className="h-11 w-36 rounded-xl bg-base-200" />
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-2 text-center shadow-xs"
            >
              <div className="mx-auto h-8 w-24 rounded-lg bg-base-300" />
              <div className="mx-auto h-4 w-32 rounded bg-base-200" />
              <div className="mx-auto h-3 w-40 rounded bg-base-200/60" />
            </div>
          ))}
        </div>

        {/* Mission 2-column Skeleton */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <div className="h-6 w-28 rounded-full bg-base-300" />
            <div className="h-10 w-4/5 rounded-xl bg-base-300" />
            <div className="h-4 w-full rounded bg-base-200" />
            <div className="h-4 w-5/6 rounded bg-base-200" />
            <div className="h-4 w-4/5 rounded bg-base-200" />
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="h-16 rounded-2xl bg-base-200" />
              <div className="h-16 rounded-2xl bg-base-200" />
            </div>
          </div>
          <div className="aspect-[4/3] w-full rounded-3xl bg-base-300" />
        </div>

        {/* Core Values 3-column Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto h-5 w-32 rounded-full bg-base-300" />
            <div className="mx-auto h-8 w-64 rounded-xl bg-base-300" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-base-300 bg-base-100 p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded-2xl bg-base-300" />
                <div className="h-5 w-36 rounded bg-base-300" />
                <div className="h-3.5 w-full rounded bg-base-200" />
                <div className="h-3.5 w-4/5 rounded bg-base-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

