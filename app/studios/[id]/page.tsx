import { Suspense } from "react";
import type { Metadata } from "next";
import { StudioDetailContent } from "./studio-detail-content";
import { StudioDetailSkeleton } from "./studio-detail-skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Studio Details | StudioSpace",
  description:
    "Inspect equipment, gallery, capacity, and book creative workspaces on StudioSpace.",
};

export default function StudioDetailPage({ params }: PageProps) {
  return (
    <main className="min-h-screen w-full pb-16">
      <Suspense fallback={<StudioDetailSkeleton />}>
        <StudioDetailContent params={params} />
      </Suspense>
    </main>
  );
}
