import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us — StudioSpace | Peer-to-Peer Creative Workspaces",
  description:
    "Learn about the mission, values, and creative team behind StudioSpace — connecting filmmakers, photographers, musicians, and makers with vetted production spaces.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-base-100">
      <AboutContent />
    </main>
  );
}

