import Link from "next/link";
import { Camera, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
          <Camera className="h-12 w-12 stroke-[1.5]" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70">
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl md:text-5xl">
          Creative Space Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-base-content/75">
          The page or creative studio you are looking for does not exist, has been removed, or has moved to a new set.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/studios"
            className="button-primary inline-flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Studios</span>
          </Link>
          <Link
            href="/"
            className="button-secondary inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
