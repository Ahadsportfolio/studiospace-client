import { Suspense } from "react";
import { ExploreStudiosContent } from "./explore-studios-content";
import { StudiosLoadingFallback } from "./studios-loading-fallback";

export const metadata = {
  title: "Explore Studios | StudioSpace",
  description:
    "Discover and book photo studios, film stages, podcast lounges, music suites, and creative workshops.",
};

export default function StudiosPage() {
  return (
    <main className="min-h-screen w-full">
      <Suspense fallback={<StudiosLoadingFallback />}>
        <ExploreStudiosContent />
      </Suspense>
    </main>
  );
}

