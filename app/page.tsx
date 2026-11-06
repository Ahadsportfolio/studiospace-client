import { HomeHero } from "@/components/home-hero";
import { FeaturedStudios } from "@/components/featured-studios";
import { StudioCategories } from "@/components/studio-categories";

export default function Home() {
  return (
    <main className="w-full">
      <HomeHero />
      <FeaturedStudios />
      <StudioCategories />
    </main>
  );
}
