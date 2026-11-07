import type { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";

export const metadata: Metadata = {
  title: "How It Works — StudioSpace | Rent & Host Creative Workspaces",
  description:
    "Learn how creators discover and book vetted production spaces, and how studio owners list, manage, and monetize creative facilities conflict-free.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen w-full bg-base-100">
      <HowItWorksContent />
    </main>
  );
}

